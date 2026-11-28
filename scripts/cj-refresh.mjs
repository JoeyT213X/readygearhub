#!/usr/bin/env node
/**
 * Refresh BLUETTI / ALLPOWERS tracked links and prices from the CJ product catalog.
 *
 *   node scripts/cj-refresh.mjs [--dry] [--env /path/to/cj.env]
 *
 * Reads CJ_TOKEN, CJ_CID, CJ_PID from /workspace/secrets/cj.env (or --env / $CJ_ENV_FILE).
 * The token is never printed or written into the repo.
 *
 * - US/USD bluettipower.com products only (never .ca / CAD / NZD)
 * - Matches existing cards by official product-page path
 * - Writes program.itemLinks to the CJ clickUrl for the exact product page
 * - Sets source-directory `price` to "$X as of Mon D, YYYY" only when a USD price matched
 * - Updates src/data/prices.json and winter-deals prices for matched ids
 * - ALLPOWERS currently has no CJ product feed; those cards are left unmatched
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = existsSync(join(here, '../packages/catalog/affiliates.ts'))
  ? resolve(here, '..')
  : process.cwd();

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const envIdx = args.indexOf('--env');
const ENV_PATH = envIdx >= 0 ? args[envIdx + 1] : (process.env.CJ_ENV_FILE || '/workspace/secrets/cj.env');

const PARTNERS = {
  '6191107': 'Bluetti Global',
  '7797916': 'ALLPOWERS',
};

function loadEnv(path) {
  if (!existsSync(path)) throw new Error(`CJ env file not found: ${path}`);
  const env = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const i = line.indexOf('=');
    env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
  }
  if (!env.CJ_TOKEN) throw new Error('CJ_TOKEN missing in env file');
  return env;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function todayParts() {
  const d = new Date();
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'numeric', day: 'numeric' });
  const parts = Object.fromEntries([...fmt.formatToParts(d)].map((p) => [p.type, p.value]));
  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);
  return {
    iso: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    label: `${MONTHS[month - 1]} ${day}, ${year}`,
  };
}

function parseMoney(amount) {
  const n = Number(String(amount).replace(/,/g, ''));
  return Number.isFinite(n) ? n : undefined;
}

function fmtMoney(n) {
  if (!Number.isFinite(n)) return undefined;
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? `$${rounded.toFixed(2)}` : `$${rounded.toFixed(2)}`;
}

function normUrl(url) {
  if (!url) return '';
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./i, '').toLowerCase();
    const path = u.pathname.replace(/\/+$/, '').toLowerCase();
    return host + path;
  } catch {
    return '';
  }
}

function isUsUsdBluetti(p) {
  const link = p.link || '';
  const currency = p.price?.currency;
  try {
    const host = new URL(link).hostname.toLowerCase();
    if (!host.endsWith('bluettipower.com') || host.endsWith('.ca') || host.includes('bluettipower.ca')) return false;
    return currency === 'USD';
  } catch {
    return false;
  }
}

const kitRe = /(×|\bx\s*\d+|\+\s*\d|\bkit\b|\bset of\b|\d\s*\*|\*\s*\d|\bpk\b|\bpack of\b)/i;
function pickVariant(list) {
  return [...list].sort((a, b) => {
    const ka = kitRe.test(a.title || '') ? 1 : 0;
    const kb = kitRe.test(b.title || '') ? 1 : 0;
    if (ka !== kb) return ka - kb;
    return (parseMoney(a.price?.amount) ?? 1e12) - (parseMoney(b.price?.amount) ?? 1e12);
  })[0];
}

async function fetchProducts(env) {
  const { CJ_TOKEN: TOKEN, CJ_CID: CID, CJ_PID: PID } = env;
  const all = [];
  for (const [partnerId, name] of Object.entries(PARTNERS)) {
    const limit = 100;
    let pageToken = null;
    let total = null;
    let pages = 0;
    process.stderr.write(`CJ fetch ${name} (${partnerId})\n`);
    while (true) {
      const pageArg = pageToken ? `, page: "${pageToken.replace(/"/g, '\\"')}"` : '';
      const query = `query { products(companyId: "${CID}", partnerIds: ["${partnerId}"], limit: ${limit}${pageArg}) { totalCount count nextPage resultList { id title advertiserId advertiserName price { amount currency } link linkCode(pid: "${PID}") { clickUrl } } } }`;
      const res = await fetch('https://ads.api.cj.com/query', {
        method: 'POST',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ query }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); }
      catch { throw new Error(`CJ non-JSON HTTP ${res.status}`); }
      if (!res.ok) throw new Error(`CJ HTTP ${res.status}`);
      if (data.errors) throw new Error(`CJ GraphQL error (${data.errors.length} error(s))`);
      const page = data.data.products;
      if (total == null) {
        total = page.totalCount;
        process.stderr.write(`  totalCount=${total}\n`);
      }
      const list = page.resultList || [];
      for (const p of list) all.push({ ...p, partnerId, partnerName: name });
      pages++;
      process.stderr.write(`  page ${pages}: ${list.length} (running ${all.length})\n`);
      if (!list.length || !page.nextPage) break;
      pageToken = page.nextPage;
      if (pages > 50) throw new Error('CJ pagination exceeded 50 pages');
    }
  }
  // Deduplicate by catalog id, then link+price
  const seen = new Set();
  const unique = [];
  for (const p of all) {
    const key = p.id || `${p.link}|${p.price?.amount}|${p.price?.currency}|${p.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(p);
  }
  process.stderr.write(`Fetched ${all.length} rows, ${unique.length} unique\n`);
  return unique;
}

function extractCards(root) {
  const cards = [];
  const seen = new Set();
  const add = (id, dest, file) => {
    if (!id || !dest) return;
    const key = `${id}|${dest}`;
    if (seen.has(key)) return;
    seen.add(key);
    cards.push({ id, dest, file });
  };
  // Walk top-level object literals by brace depth so earlier types/arrays cannot swallow a card.
  const parseObjects = (text, file) => {
    const n = text.length;
    let i = 0;
    while (i < n) {
      if (text[i] !== '{') { i++; continue; }
      let depth = 0, j = i, inStr = false, quote = '', esc = false;
      for (; j < n; j++) {
        const ch = text[j];
        if (inStr) {
          if (esc) { esc = false; continue; }
          if (ch === '\\') { esc = true; continue; }
          if (ch === quote) inStr = false;
          continue;
        }
        if (ch === "'" || ch === '"' || ch === '`') { inStr = true; quote = ch; continue; }
        if (ch === '{') depth++;
        else if (ch === '}') {
          depth--;
          if (depth === 0) { j++; break; }
        }
      }
      const block = text.slice(i, j);
      const id = /(?:^|\n)\s*id:\s*'([^']+)'/.exec(block)?.[1];
      if (id && /^(bluetti|allpowers)(-|$)/.test(id)) {
        const dest = /(?:destination|url):\s*'([^']+)'/.exec(block)?.[1];
        if (dest) add(id, dest, file);
      }
      i = Math.max(j, i + 1);
    }
  };
  for (const rel of ['src/data/source-directory.ts', 'src/data/directory.ts', 'src/data/backup-power.ts']) {
    const p = join(root, rel);
    if (existsSync(p)) parseObjects(readFileSync(p, 'utf8'), rel);
  }
  return cards;
}

function extractContentItems(root) {
  const dir = join(root, 'src/content/items');
  const cards = [];
  if (!existsSync(dir)) return cards;
  for (const f of readdirSync(dir)) {
    if (!/^(bluetti|allpowers).*\.md$/i.test(f)) continue;
    const text = readFileSync(join(dir, f), 'utf8');
    const id = f.replace(/\.md$/, '');
    const dest = /officialUrl:\s*"([^"]+)"/.exec(text)?.[1];
    if (dest) cards.push({ id, dest, file: `src/content/items/${f}` });
  }
  return cards;
}

function isStoreUrl(url) {
  try {
    const path = new URL(url).pathname.replace(/\/+$/, '').toLowerCase();
    return !path || path === '' || path.startsWith('/collections');
  } catch {
    return false;
  }
}

function matchCards(cards, products) {
  const byPath = new Map();
  for (const p of products.filter(isUsUsdBluetti)) {
    const key = normUrl(p.link);
    if (!byPath.has(key)) byPath.set(key, []);
    byPath.get(key).push(p);
  }
  const matched = [];
  const unmatched = [];
  for (const c of cards) {
    if (isStoreUrl(c.dest) || /iallpowers\.com|allpowers/i.test(c.id + c.dest)) {
      unmatched.push({ ...c, reason: isStoreUrl(c.dest) ? 'store-or-collection' : 'no CJ US/USD product (ALLPOWERS has no product feed)' });
      continue;
    }
    const hits = byPath.get(normUrl(c.dest));
    if (!hits) {
      unmatched.push({ ...c, reason: 'no CJ US/USD product for this URL' });
      continue;
    }
    const p = pickVariant(hits);
    const clickUrl = p.linkCode?.clickUrl;
    const price = parseMoney(p.price?.amount);
    if (!clickUrl || p.price?.currency !== 'USD' || price == null) {
      unmatched.push({ ...c, reason: 'matched row missing USD price or clickUrl' });
      continue;
    }
    matched.push({ ...c, clickUrl, price, currency: 'USD', cjLink: p.link, cjTitle: p.title });
  }
  // unique ids; prefer source-directory
  const byId = new Map();
  for (const m of matched) {
    const prev = byId.get(m.id);
    if (!prev || (m.file.includes('source-directory') && !prev.file.includes('source-directory'))) byId.set(m.id, m);
  }
  return { matched: [...byId.values()], unmatched, usUsd: products.filter(isUsUsdBluetti).length };
}

function findObjectAt(text, startIdx) {
  let depth = 0, inStr = false, quote = '', esc = false;
  for (let j = startIdx; j < text.length; j++) {
    const ch = text[j];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (ch === '\\') { esc = true; continue; }
      if (ch === quote) inStr = false;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = true; quote = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return { start: startIdx, end: j + 1, block: text.slice(startIdx, j + 1) };
    }
  }
  return undefined;
}

function findObjectByProp(text, prop, id) {
  const needle = `${prop}: '${id}'`;
  let from = 0;
  while (from < text.length) {
    const at = text.indexOf(needle, from);
    if (at < 0) return undefined;
    const start = text.lastIndexOf('{', at);
    if (start >= 0) {
      const obj = findObjectAt(text, start);
      if (obj && obj.block.includes(needle)) return obj;
    }
    from = at + needle.length;
  }
  return undefined;
}

function upsertItemLinks(affiliatesText, programId, links) {
  const found = findObjectByProp(affiliatesText, 'id', programId);
  if (!found) throw new Error(`program ${programId} not found in affiliates.ts`);
  let block = found.block;
  const entries = Object.entries(links).sort(([a], [b]) => a.localeCompare(b));
  const body = entries.map(([id, url]) => `      '${id}': '${url.replace(/'/g, "\\'")}',`).join('\n');
  if (/itemLinks:\s*\{/.test(block)) {
    const innerStart = block.indexOf('itemLinks:');
    const brace = block.indexOf('{', innerStart);
    const inner = findObjectAt(block, brace);
    if (!inner) throw new Error(`itemLinks object for ${programId} could not be parsed`);
    block = block.slice(0, inner.start) + `{\n${body}\n    }` + block.slice(inner.end);
  } else if (/officialUrl:/.test(block)) {
    block = block.replace(/officialUrl:/, `itemLinks: {\n${body}\n    },\n    officialUrl:`);
  } else if (/note:/.test(block)) {
    block = block.replace(/note:/, `itemLinks: {\n${body}\n    },\n    note:`);
  } else {
    block = block.replace(/\}\s*$/, `,\n    itemLinks: {\n${body}\n    },\n  }`);
  }
  return affiliatesText.slice(0, found.start) + block + affiliatesText.slice(found.end);
}

function setSourcePricesAndFlags(text, matched, dateLabel) {
  let out = text;
  for (const m of matched) {
    const found = findObjectByProp(out, 'id', m.id);
    if (!found) continue;
    let block = found.block;
    const price = `${fmtMoney(m.price)} as of ${dateLabel}`;
    if (/\n    price:/.test(block)) {
      block = block.replace(/\n    price: '[^']*'/, `\n    price: '${price}'`);
    } else {
      block = block.replace(/\n  (\},?)$/, `\n    price: '${price}',\n  $1`);
    }
    if (!/\n    useItemLink:/.test(block)) {
      block = block.replace(/\n  (\},?)$/, `\n    useItemLink: true,\n  $1`);
    } else {
      block = block.replace(/\n    useItemLink:\s*[^,\n]+/, `\n    useItemLink: true`);
    }
    out = out.slice(0, found.start) + block + out.slice(found.end);
  }
  return out;
}

function updatePricesJson(text, matched, iso) {
  const data = JSON.parse(text);
  const byId = new Map((data.items || []).map((it) => [it.id, it]));
  for (const m of matched) {
    byId.set(m.id, {
      id: m.id,
      price: m.price,
      currency: 'USD',
      source: 'cj',
      checked: iso,
      url: m.dest,
    });
  }
  data.updated = iso;
  data.items = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
  return JSON.stringify(data, null, 2) + '\n';
}

function updateWinterDeals(text, matched, iso) {
  const byId = new Map(matched.map((m) => [m.id, m]));
  let out = text;
  for (const [id, m] of byId) {
    const found = findObjectByProp(out, 'itemId', id);
    if (!found) continue;
    let next = found.block;
    if (/priceLabel:/.test(next)) next = next.replace(/priceLabel: '[^']*'/, `priceLabel: '${fmtMoney(m.price)}'`);
    if (/checked:/.test(next)) next = next.replace(/checked: '[^']*'/, `checked: '${iso}'`);
    else if (/priceLabel:/.test(next)) next = next.replace(/priceLabel: '[^']*',/, (s) => `${s}\n    checked: '${iso}',`);
    out = out.slice(0, found.start) + next + out.slice(found.end);
  }
  return out;
}

async function main() {
  const env = loadEnv(ENV_PATH);
  const { iso, label } = todayParts();
  const products = await fetchProducts(env);
  const cards = [
    ...extractCards(ROOT),
    ...extractContentItems(ROOT),
  ];
  const { matched, unmatched, usUsd } = matchCards(cards, products);
  process.stderr.write(`US/USD BLUETTI products: ${usUsd}; matched cards: ${matched.length}; unmatched rows: ${unmatched.length}\n`);
  const uniqueUnmatched = [];
  const seenU = new Set();
  for (const u of unmatched) {
    const k = `${u.id}|${u.reason}`;
    if (seenU.has(k)) continue;
    seenU.add(k);
    uniqueUnmatched.push(u);
    process.stderr.write(`  unmatched ${u.id} (${u.file}): ${u.reason}\n`);
  }

  const affiliatesPath = join(ROOT, 'packages/catalog/affiliates.ts');
  const sourcePath = join(ROOT, 'src/data/source-directory.ts');
  const pricesPath = join(ROOT, 'src/data/prices.json');
  const winterPath = join(ROOT, 'src/data/winter-deals.ts');

  const links = Object.fromEntries(matched.map((m) => [m.id, m.clickUrl]));
  let affiliates = readFileSync(affiliatesPath, 'utf8');
  affiliates = upsertItemLinks(affiliates, 'bluetti', links);

  let source = readFileSync(sourcePath, 'utf8');
  source = setSourcePricesAndFlags(source, matched, label);

  let prices = readFileSync(pricesPath, 'utf8');
  prices = updatePricesJson(prices, matched, iso);

  let winter = readFileSync(winterPath, 'utf8');
  winter = updateWinterDeals(winter, matched, iso);

  if (DRY) {
    process.stderr.write('Dry run: no files written\n');
    console.log(JSON.stringify({ iso, label, matched: matched.map((m) => ({ id: m.id, price: m.price, dest: m.dest })), unmatched: uniqueUnmatched.map((u) => ({ id: u.id, reason: u.reason, dest: u.dest })) }, null, 2));
    return;
  }
  writeFileSync(affiliatesPath, affiliates);
  writeFileSync(sourcePath, source);
  writeFileSync(pricesPath, prices);
  writeFileSync(winterPath, winter);
  process.stderr.write(`Wrote itemLinks/prices for ${matched.length} cards; date ${label}\n`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
