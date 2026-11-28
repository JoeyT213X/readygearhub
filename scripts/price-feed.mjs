#!/usr/bin/env node
/**
 * ReadyGearHub price refresh.  npm run prices:update [-- --tier hot|warm|all] [--dry] [--max-age 35] [--only id,id]
 *
 * For every priced item (gear frontmatter, directory/brand/robotics cards, winter deals):
 *   1. network feed first (Awin product feeds for the Awin advertisers we are joined to; needs the feed key, see below)
 *   2. otherwise the product page: Shopify /products/<handle>.js, then JSON-LD Offer, then price meta tags
 * and writes src/data/prices.json plus the price/date fields in the source files. Honest-price rules (BOTS.md):
 *   - the shown price is the retailer's current price; "checked" is today's date; a price is never invented
 *   - out of stock / no price on a page that loaded fine  -> price removed ("Price on the store page")
 *   - fetch blocked or failed -> the old dated price stays until it is older than --max-age days, then it is removed
 *   - a move of more than 60% is NOT applied (probably the wrong variant); it is listed for a human to look at
 *   - a marked-down pair (winter deals) is kept only when the page itself shows both a list and a sale price
 * Secrets: the Awin feed key is read from $AWIN_FEED_BASE or the file named by $AWIN_FEED_BASE_FILE
 * (default /workspace/catalog-feeds/.awin_base). It is never printed or written to the repo.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { ROOT, loadItems, normUrl, parseMoney, fmtMoney, isoToLabel, hasPrice } from './lib/price-sources.mjs';

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const DRY = flag('dry');
const TIER = opt('tier', 'all');
const MAX_AGE = Number(opt('max-age', 35));
const ONLY = opt('only') ? new Set(opt('only').split(',')) : undefined;
const MAX_JUMP = 0.6;
const UA = 'Mozilla/5.0 (compatible; ReadyGearHubPriceBot/1.0; +https://readygearhub.com/how-we-price/)';
const HOST_DELAY_MS = 1500;
const todayIso = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })();
const ageDays = (iso) => iso ? Math.round((Date.parse(todayIso) - Date.parse(iso)) / 86400000) : Infinity;

// ---- network inventory: which hosts a feed covers ----
// Awin: joined US advertisers with a product feed (feed ids from the Awin feed list, verified Nov 25, 2026).
const AWIN_FEEDS = { 'tidewe.com': 'F1386', 'litime.com': 'F1388', 'nilight.com': 'F808', 'imalentstore.com': 'F2395', 'wubenlight.com': 'F3678', 'watertogousa.com': 'F5339' };

const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, '').toLowerCase(); } catch { return ''; } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const lastHit = new Map();
async function politeFetch(url, init = {}) {
  const h = hostOf(url); const wait = (lastHit.get(h) ?? 0) + HOST_DELAY_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastHit.set(h, Date.now());
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 25000);
  try { return await fetch(url, { redirect: 'follow', ...init, signal: ctl.signal, headers: { 'user-agent': UA, accept: 'text/html,application/json;q=0.9,*/*;q=0.8', ...(init.headers ?? {}) } }); }
  finally { clearTimeout(t); }
}

// ---- CSV ----
function parseCsv(text) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur.replace(/\r$/, '')); rows.push(row); row = []; cur = ''; }
    else cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

// ---- Awin feed ----
const feedCache = new Map();
function awinBase() {
  if (process.env.AWIN_FEED_BASE) return process.env.AWIN_FEED_BASE.trim();
  const f = process.env.AWIN_FEED_BASE_FILE ?? '/workspace/catalog-feeds/.awin_base';
  return existsSync(f) ? readFileSync(f, 'utf8').trim() : undefined;
}
async function loadAwinFeed(feedId) {
  if (feedCache.has(feedId)) return feedCache.get(feedId);
  const base = awinBase(); let index = null;
  if (base) {
    try {
      const res = await politeFetch(`${base}/feed/${feedId}.csv.gz`, { headers: { accept: '*/*' } });
      if (res.ok) {
        const rows = parseCsv(gunzipSync(Buffer.from(await res.arrayBuffer())).toString('utf8'));
        const head = rows[0]; const col = (n) => head.indexOf(n);
        const [iLink, iPrice, iSale, iAvail] = ['link', 'price', 'sale_price', 'availability'].map(col);
        index = new Map();
        for (const r of rows.slice(1)) {
          const key = normUrl(r[iLink]); if (!key) continue;
          const base0 = key.split('?')[0];
          const rec = { price: parseFloat(r[iPrice]), sale: parseFloat(r[iSale]), cur: (r[iPrice].match(/[A-Z]{3}$/) ?? [''])[0], avail: /in.?stock/i.test(r[iAvail]), variantKey: key };
          if (!index.has(base0)) index.set(base0, []);
          index.get(base0).push(rec);
        }
      } else console.warn(`  feed ${feedId}: HTTP ${res.status}`);
    } catch (e) { console.warn(`  feed ${feedId}: ${e.message}`); }
  }
  feedCache.set(feedId, index); return index;
}

/** Pick the offer that matches what the old label described. Returns { price, list, avail } or undefined. */
function pickOffer(variants, oldNum, from, wantList, wantVariant) {
  // variants: [{ price, list?, avail, id? }]
  let pool = variants;
  if (wantVariant) { const v = variants.filter((x) => String(x.id) === String(wantVariant)); if (v.length) pool = v; }
  const avail = pool.filter((x) => x.avail);
  if (!avail.length) return { avail: false };
  const eff = (x) => (wantList && x.list ? x.list : x.price);
  let pick;
  if (from) pick = avail.reduce((a, b) => (eff(b) < eff(a) ? b : a));
  else pick = avail.find((x) => Math.abs(eff(x) - oldNum) < 0.005) ?? (wantVariant ? avail[0] : avail.reduce((a, b) => (Math.abs(eff(b) - oldNum) < Math.abs(eff(a) - oldNum) ? b : a)));
  return { avail: true, price: eff(pick), list: pick.list && pick.list > pick.price ? pick.list : undefined, sale: pick.price };
}

async function fromFeed(url, ctx) {
  const host = hostOf(url); const feedId = AWIN_FEEDS[Object.keys(AWIN_FEEDS).find((h) => host === h || host.endsWith('.' + h))];
  if (!feedId) return undefined;
  const index = await loadAwinFeed(feedId); if (!index) return undefined;
  const key = normUrl(url); const rows = index.get(key.split('?')[0]);
  if (!rows) return undefined;
  const variants = rows.map((r) => ({ price: Number.isFinite(r.sale) ? r.sale : r.price, list: Number.isFinite(r.sale) ? r.price : undefined, avail: r.avail, id: /variant=(\d+)/.exec(r.variantKey)?.[1] }));
  const want = new URL(url).searchParams.get('variant');
  const o = pickOffer(variants, ctx.oldNum, ctx.from, ctx.wantList, want);
  return { ...o, source: 'feed:awin' };
}

// ---- page readers ----
function walkLd(node, out) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) return node.forEach((n) => walkLd(n, out));
  const t = [].concat(node['@type'] ?? []);
  if (t.includes('Offer') || t.includes('AggregateOffer')) out.push(node);
  for (const k of Object.keys(node)) walkLd(node[k], out);
}
function fromHtml(html) {
  const offers = [];
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { walkLd(JSON.parse(m[1].trim()), offers); } catch { /* ignore bad JSON-LD */ }
  }
  const variants = [];
  for (const o of offers) {
    const price = parseFloat(o.price ?? o.lowPrice ?? o.priceSpecification?.price); const cur = o.priceCurrency ?? o.priceSpecification?.priceCurrency ?? 'USD';
    if (!Number.isFinite(price) || cur !== 'USD') continue;
    variants.push({ price, avail: !/OutOfStock|SoldOut|Discontinued/i.test(String(o.availability ?? '')) });
  }
  if (variants.length) return variants;
  const meta = (names) => { for (const n of names) { const m = new RegExp(`<meta[^>]+(?:property|name|itemprop)=["']${n}["'][^>]*content=["']([^"']+)["']`, 'i').exec(html) ?? new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name|itemprop)=["']${n}["']`, 'i').exec(html); if (m) return m[1]; } };
  const amt = parseFloat((meta(['product:price:amount', 'og:price:amount']) ?? '').replace(/[^\d.]/g, ''));
  const cur = meta(['product:price:currency', 'og:price:currency']) ?? 'USD';
  if (Number.isFinite(amt) && cur === 'USD') {
    const av = meta(['product:availability', 'og:availability']) ?? '';
    return [{ price: amt, avail: !/out.?of.?stock|oos/i.test(av) }];
  }
  return [];
}

async function fromPage(url, ctx) {
  const u = new URL(url); const want = u.searchParams.get('variant');
  const m = /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?products\/([^/?#]+)/i.exec(u.pathname);
  if (m) { // Shopify product JSON
    try {
      const res = await politeFetch(`${u.origin}${u.pathname.replace(/\/$/, '')}.js`, { headers: { accept: 'application/json' } });
      if (res.ok && /json/.test(res.headers.get('content-type') ?? '')) {
        const p = await res.json();
        if (Array.isArray(p.variants) && p.variants.length) {
          const variants = p.variants.map((v) => ({ id: v.id, price: v.price / 100, list: v.compare_at_price ? v.compare_at_price / 100 : undefined, avail: !!v.available }));
          const o = pickOffer(variants, ctx.oldNum, ctx.from, ctx.wantList, want);
          return { ...o, source: 'page', how: 'shopify-js' };
        }
      }
    } catch { /* fall through to HTML */ }
  }
  const res = await politeFetch(url);
  if (!res.ok) return { error: `HTTP ${res.status}` };
  const html = await res.text();
  if (/Verifying your connection|Just a moment\.\.\.|cf-chl-|Access Denied|px-captcha/i.test(html.slice(0, 6000))) return { error: 'bot challenge page' };
  const variants = fromHtml(html);
  if (!variants.length) return { error: 'no price data on page', loaded: true };
  const o = pickOffer(variants, ctx.oldNum, ctx.from, false, undefined);
  return { ...o, source: 'page', how: 'json-ld/meta', listUnknown: true };
}

// ---- file edits ----
const pendingEdits = new Map(); // file -> { text }
const textOf = (file) => { if (!pendingEdits.has(file)) pendingEdits.set(file, readFileSync(file, 'utf8')); return pendingEdits.get(file); };
const setText = (file, t) => pendingEdits.set(file, t);

function newLabel(old, num, iso) {
  let s = old.replace(/\$[\d,]+(?:\.\d+)?/, fmtMoney(num, old));
  s = s.replace(/as of \w{3} \d{1,2}, \d{4}/, `as of ${isoToLabel(iso)}`);
  return s;
}
function applyGear(site, result) {
  let t = textOf(site.file);
  if (result.remove) { t = t.replace(/^price:.*\n/m, '').replace(/^priceDate:.*\n/m, '').replace(/^priceNote:.*\n/m, ''); }
  else {
    t = t.replace(/^price:\s*"[^"]*"/m, (m) => `price: "${newLabel(site.label, result.price, todayIso)}"`);
    t = t.replace(/^priceDate:\s*"[^"]*"/m, `priceDate: "${todayIso}"`);
  }
  setText(site.file, t);
}
function applyCard(site, result, lineShift) {
  const lines = textOf(site.file).split('\n'); const i = site.line;
  lines[i] = lines[i].replace(/(\bprice\s*:\s*)(['"])(.*?)\2/, (m, k, q, v) => `${k}${q}${result.remove ? 'See price' : newLabel(v, result.price, todayIso)}${q}`);
  setText(site.file, lines.join('\n'));
}
function applySpec(site, result) {
  const lines = textOf(site.file).split('\n'); const i = site.line;
  lines[i] = lines[i].replace(/, checked: '[^']*'/, '').replace(/(\bprice: ')([^']*)(')/, (m, a, v, c) => result.remove ? `${a}See price${c}` : `${a}${v.replace(/\$[\d,]+(?:\.\d+)?/, fmtMoney(result.price, v))}${c}, checked: '${isoToLabel(todayIso)}'`);
  setText(site.file, lines.join('\n'));
}
function applyDeal(site, result) {
  const lines = textOf(site.file).split('\n');
  const edit = (idx, fn) => { lines[idx] = fn(lines[idx]); };
  if (result.remove) {
    edit(site.labelLine, (l) => l.replace(/priceLabel:\s*'[^']*'/, "priceLabel: 'See price'"));
    const kill = [];
    for (let j = site.line + 1; j < site.line + 14 && !/^\s*itemId:/.test(lines[j] ?? ''); j++) if (/^\s*(checked|compareAt|compareSource):/.test(lines[j])) kill.push(j);
    for (const j of kill.reverse()) lines.splice(j, 1);
  } else {
    edit(site.labelLine, (l) => l.replace(/priceLabel:\s*'[^']*'/, `priceLabel: '${fmtMoney(result.price, site.label)}'`));
    edit(site.checkedLine, (l) => l.replace(/checked:\s*'[^']*'/, `checked: '${todayIso}'`));
    // marked-down pair: keep only if the retailer's own data shows list > price right now
    let ca = -1, cs = -1;
    for (let j = site.line + 1; j < site.line + 14 && !/^\s*itemId:/.test(lines[j] ?? ''); j++) { if (/^\s*compareAt:/.test(lines[j])) ca = j; if (/^\s*compareSource:/.test(lines[j])) cs = j; }
    if (ca >= 0) {
      if (result.list && result.list > result.price) lines[ca] = lines[ca].replace(/compareAt:\s*'[^']*'/, `compareAt: '${fmtMoney(result.list, site.label)}'`);
      else { const rm = [ca, cs].filter((x) => x >= 0).sort((a, b) => b - a); for (const j of rm) lines.splice(j, 1); result.droppedMarkdown = true; }
    }
  }
  setText(site.file, lines.join('\n'));
}
// deals edit by line numbers; apply card/gear first, deals last and bottom-up so earlier line numbers stay valid.

// ---- main ----
const priority = existsSync(join(ROOT, 'src/data/price-priority.json')) ? JSON.parse(readFileSync(join(ROOT, 'src/data/price-priority.json'), 'utf8')) : { items: {} };
const tierOf = (id) => priority.items?.[id]?.tier ?? 'cold';
const wanted = (id) => TIER === 'all' ? true : TIER === 'hot' ? tierOf(id) === 'hot' : TIER === 'warm' ? tierOf(id) !== 'cold' : tierOf(id) === TIER;

const items = loadItems().filter((it) => (!ONLY || ONLY.has(it.id)) && wanted(it.id));
console.log(`price-feed: ${items.length} priced item(s) in scope (tier=${TIER}${DRY ? ', dry run' : ''}), checked date ${todayIso}`);

// previous run's file, so items outside this run's tier keep their record
const outFile = join(ROOT, 'src/data/prices.json');
const prev = existsSync(outFile) ? JSON.parse(readFileSync(outFile, 'utf8')) : { items: [] };
const records = new Map((prev.items ?? []).map((r) => [r.id, r]));
const byUrl = new Map(); // normalized url -> fetch result (one fetch per product page)
const stats = { 'feed:awin': 0, page: 0, kept: 0, removed: 0, changed: 0, same: 0, review: 0 };
const moves = []; const removals = []; const keeps = []; const reviews = [];

for (const it of items) {
  const first = it.sites[0];
  const oldNum = parseMoney(first.label);
  const from = /^From\b/i.test(first.label.replace(/^[^$]*?(From)/i, '$1')) || /\bFrom \$/.test(first.label);
  const wantList = /regular list price/i.test(first.label) || /regular list price/i.test(first.note ?? '');
  const ctx = { oldNum, from, wantList };
  const key = `${normUrl(it.url)}|${from}|${wantList}|${oldNum}`;
  let r = byUrl.get(key);
  if (!r) {
    try { r = (await fromFeed(it.url, ctx)) ?? (await fromPage(it.url, ctx)); } catch (e) { r = { error: e.message }; }
    byUrl.set(key, r);
  }
  const oldChecked = it.sites.map((s) => s.checked).filter(Boolean).sort()[0];
  const rec = { id: it.id, price: null, currency: 'USD', source: null, checked: null, url: it.url };
  let result;
  if (r.error || r.price === undefined && r.avail !== false) {
    // could not confirm
    if (ageDays(oldChecked) > MAX_AGE) { result = { remove: true }; removals.push(`${it.id}: could not confirm (${r.error ?? 'no price'}) and last check ${oldChecked} is over ${MAX_AGE} days old`); }
    else { stats.kept++; keeps.push(`${it.id}: could not confirm (${r.error ?? 'no price'}); keeping the ${oldChecked} price`); Object.assign(rec, { price: oldNum, source: 'unconfirmed', checked: oldChecked }); records.set(it.id, rec); continue; }
  } else if (r.avail === false) { result = { remove: true }; removals.push(`${it.id}: out of stock or unlisted at ${hostOf(it.url)}`); }
  else if (wantList && r.listUnknown && r.price < oldNum - 0.004) {
    stats.review++; reviews.push(`${it.id}: ${fmtMoney(oldNum)} -> ${fmtMoney(r.price)} (${r.source}); old label is a regular list price and the page does not say whether this is a sale price; not applied`);
    Object.assign(rec, { price: oldNum, source: 'unconfirmed', checked: oldChecked }); records.set(it.id, rec); continue;
  }
  else if (Math.abs(r.price - oldNum) / oldNum > MAX_JUMP) {
    stats.review++; reviews.push(`${it.id}: ${fmtMoney(oldNum)} -> ${fmtMoney(r.price)} (${r.source}) is a >${MAX_JUMP * 100}% move; not applied`);
    Object.assign(rec, { price: oldNum, source: 'unconfirmed', checked: oldChecked }); records.set(it.id, rec); continue;
  } else { result = { price: r.price, list: r.list }; }

  if (result.remove) { stats.removed++; Object.assign(rec, { price: null, source: r.source ?? null, checked: todayIso, status: 'removed' }); }
  else {
    stats[r.source]++; Object.assign(rec, { price: result.price, source: r.source, checked: todayIso });
    if (Math.abs(result.price - oldNum) > 0.004) { stats.changed++; moves.push({ id: it.id, from: oldNum, to: result.price, source: r.source }); } else stats.same++;
  }
  records.set(it.id, rec);
  if (!DRY) {
    // apply: gear + cards now, deals queued (bottom-up)
    const deals = [];
    for (const s of it.sites) {
      if (s.kind === 'gear') applyGear(s, result);
      else if (s.kind === 'card') applyCard(s, result);
      else if (s.kind === 'spec') applySpec(s, result);
      else deals.push(s);
    }
    for (const s of deals) { s._result = result; }
  }
}

if (!DRY) {
  // winter deals: apply bottom-up (removals delete lines)
  const dealSites = items.flatMap((it) => it.sites.filter((s) => s.kind === 'deal' && s._result));
  dealSites.sort((a, b) => b.line - a.line);
  for (const s of dealSites) applyDeal(s, s._result);
  for (const [file, text] of pendingEdits) writeFileSync(file, text);
  const out = {
    updated: todayIso,
    cadence: 'monthly',
    about: 'Product prices shown on ReadyGearHub, read from retailer product data feeds and product pages. Written by scripts/price-feed.mjs.',
    items: [...records.values()].sort((a, b) => a.id.localeCompare(b.id)),
  };
  mkdirSync(join(ROOT, 'src/data'), { recursive: true });
  writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n');
}

console.log(`\nby source: feed:awin=${stats['feed:awin']}  page=${stats.page}  unconfirmed-kept=${stats.kept}  needs-review=${stats.review}`);
console.log(`results: unchanged=${stats.same}  changed=${stats.changed}  removed=${stats.removed}`);
if (moves.length) { console.log('\nprice moves:'); for (const m of moves) console.log(`  ${m.id}: ${fmtMoney(m.from)} -> ${fmtMoney(m.to)} (${m.source})`); }
if (removals.length) { console.log('\nremoved:'); removals.forEach((x) => console.log('  ' + x)); }
if (keeps.length) { console.log('\nkept (unconfirmed):'); keeps.forEach((x) => console.log('  ' + x)); }
if (reviews.length) { console.log('\nneeds review:'); reviews.forEach((x) => console.log('  ' + x)); }
