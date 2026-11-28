// Post-build catalog integrity checks. Runs inside `npm run build` (after `astro build`) and reads dist/.
// Fails the build with a printed report when:
//   (a) two directory cards share a normalized title or a normalized destination URL;
//   (b) a guide links a product on a plain link while a tracked (affiliate) twin card exists;
//   (c) a dropped program still has visible cards;
//   (e) button wording: "View deal" only on a verified marked-down pair, "Buy with discount code" only with a code shown, and
//       no single button phrase on more than 50% of priced cards;
//   (d) a visible dollar amount has no parseable "checked"/"as of" date (prices older than 30 days only warn).
// Known, owner-assigned exceptions live in scripts/check-directory.allow.json (each needs a reason).
// Also refuses a production build that has the PUBLIC_PREVIEW_LEADS preview flag switched on.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { rolldown } from 'rolldown'; // already installed (Astro/Vite bundler); lets us read the TypeScript program list

const dist = new URL('../dist/', import.meta.url).pathname;
const allow = existsSync(new URL('./check-directory.allow.json', import.meta.url))
  ? JSON.parse(readFileSync(new URL('./check-directory.allow.json', import.meta.url), 'utf8')) : {};
const usedAllow = new Set();
const allowed = (kind, key) => { const hit = (allow[kind] ?? []).some((a) => a.key === key); if (hit) usedAllow.add(`${kind}|${key}`); return hit; };

const pages = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? pages(p) : f === 'index.html' ? [p] : [];
});
const unesc = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const strip = (s) => unesc(s.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();

/** Real destination of a link: unwrap network wrappers (url=, murl=, ulp=, CJ /type/dlg/<url>), then drop scheme, www, query, hash, trailing slash. */
function destination(href) {
  let h = unesc(href);
  try {
    const u = new URL(h, 'https://readygearhub.com');
    for (const k of ['url', 'murl', 'ued', 'u', 'ulp', 'destination']) {
      const v = u.searchParams.get(k);
      if (v && /^https?:/i.test(decodeURIComponent(v))) { h = decodeURIComponent(v); break; }
    }
    const dlg = u.pathname.match(/\/type\/dlg\/(https?:.*)$/);
    if (dlg) h = dlg[1] + u.search;
  } catch { /* keep raw */ }
  return h.toLowerCase().replace(/^https?:\/\/(www\.)?/, '').replace(/[?#].*$/, '').replace(/\/+$/, '');
}
const STOP = new Set(['the', 'and', 'for', 'with', 'official', 'site', 'page', 'by', 'of', 'a', 'an', 'to', 'in']);
const tokens = (t) => t.toLowerCase().normalize('NFKD').replace(/[^a-z0-9+ ]+/g, ' ').split(/\s+/).filter((w) => w && !STOP.has(w));
const normTitle = (t) => tokens(t).sort().join(' ');
const jaccard = (a, b) => { const A = new Set(tokens(a)), B = new Set(tokens(b)); let n = 0; for (const x of A) if (B.has(x)) n++; return n / (A.size + B.size - n || 1); };

// ---- read cards (every directory page; a card in several categories counts once, by id) ----
const cards = new Map();
for (const file of pages(join(dist, 'directory'))) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/<article id="([^"]+)" class="[^"]*\bsource-card\b[^"]*"([^>]*)>([\s\S]*?)<\/article>/g)) {
    const [, id, attrs, body] = m;
    if (cards.has(id)) continue;
    const h3 = body.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
    const btn = body.match(/<a class="btn small"[^>]*href="([^"]+)"[^>]*>/);
    const href = btn ? unesc(btn[1]) : '';
    const title = h3 ? strip(h3[1]) : id;
    const program = (attrs.match(/data-program="([^"]*)"/) ?? [])[1] ?? '';
    const tracked = /rel="[^"]*sponsored/.test(btn?.[0] ?? '');
    const price = (body.match(/<p class="product-price"[^>]*>([^<]*)<\/p>/) ?? [])[1] ?? '';
    const cta = strip((body.match(/<a class="btn small[^"]*"[^>]*>([\s\S]*?)<\/a>/) ?? [])[1] ?? '').replace(/\s*↗$/, '');
    cards.set(id, { id, title, href, tracked, program, price, cta, hasCode: /class="listing-code"/.test(body), dest: href.startsWith('/') ? '' : destination(href), norm: normTitle(title), cat: (attrs.match(/data-category="([^"]*)"/) ?? [])[1] ?? '' });
  }
}
const list = [...cards.values()];
const problems = [];
const add = (check, key, msg) => { if (!allowed(check, key)) problems.push({ check, key, msg }); };

// ---- (a) duplicate cards ----
const group = (keyFn) => { const m = new Map(); for (const c of list) { const k = keyFn(c); if (k) (m.get(k) ?? m.set(k, []).get(k)).push(c); } return [...m].filter(([, v]) => v.length > 1); };
const describe = (v) => v.map((c) => `${c.id} [${c.cat}${c.tracked ? ', tracked' : ''}]`).join(' | ');
for (const [k, v] of group((c) => c.norm)) add('a-title', k, `same normalized title "${k}": ${describe(v)}`);
for (const [k, v] of group((c) => c.dest)) add('a-url', k, `same destination ${k}: ${describe(v)}`);

// ---- (b) guide links a plain product while a tracked twin exists ----
const trackedCards = list.filter((c) => c.tracked);
const twinOf = (c) => trackedCards.find((t) => t.id !== c.id && (t.norm === c.norm || (c.dest && t.dest === c.dest) || jaccard(t.title, c.title) >= 0.8));
const guidesDir = join(dist, 'guides');
for (const file of pages(guidesDir)) {
  const slug = file.split('/guides/')[1].replace(/\/index\.html$/, '');
  if (!slug || slug.includes('/')) continue;
  const html = readFileSync(file, 'utf8');
  const body = (html.match(/<div class="prose guide">([\s\S]*?)<\/article>/) ?? [])[1] ?? '';
  const gear = (html.match(/<section class="wrap section" id="gear">([\s\S]*?)<\/section>/) ?? [])[1] ?? '';
  const seen = new Set();
  for (const m of (body + gear).matchAll(/<a\b([^>]*)>/g)) {
    const href = (m[1].match(/href="([^"]+)"/) ?? [])[1];
    if (!href) continue;
    const sponsored = /rel="[^"]*sponsored/.test(m[1]);
    const gearId = href.match(/^\/gear\/([^/]+)\/$/)?.[1];
    let c;
    if (gearId) { c = cards.get(gearId); if (!c || c.tracked) continue; }
    else if (/^https?:/.test(unesc(href)) && !sponsored && !/readygearhub\.com/.test(href)) {
      const d = destination(href); c = list.find((x) => x.dest === d && !x.tracked); if (!c) continue;
    } else continue;
    const twin = twinOf(c);
    const key = `${slug}:${c.id}`;
    if (twin && !seen.has(key)) { seen.add(key); add('b-plain-link', key, `guide /guides/${slug}/ links "${c.title}" (${c.id}) on a plain link; tracked twin exists: ${twin.id} "${twin.title}" [${twin.program || 'tracked'}]`); }
  }
}

// ---- (c) dropped program with visible cards ----
const bundle = await (await rolldown({ input: new URL('../packages/catalog/index.ts', import.meta.url).pathname, logLevel: 'silent' })).generate({ format: 'esm' });
const { programs } = await import('data:text/javascript;base64,' + Buffer.from(bundle.output[0].code).toString('base64'));
for (const p of programs.filter((x) => x.status === 'dropped')) {
  const host = p.officialUrl ? destination(p.officialUrl).split('/')[0] : '';
  const hits = list.filter((c) => c.program === p.id || (p.items ?? []).includes(c.id) || (host && c.dest.split('/')[0] === host));
  if (hits.length) add('c-dropped', p.id, `dropped program "${p.id}" still has ${hits.length} visible card(s): ${hits.map((c) => c.id).join(', ')}`);
  // Cards outside /directory/ (e.g. the /gear/ retailer list) and plain links: any indexable page linking the dropped program's site.
  const pagesLinking = host ? pages(dist).filter((f) => {
    const html = readFileSync(f, 'utf8');
    return !/<meta name="robots" content="[^"]*noindex/.test(html) && [...html.matchAll(/<a\b[^>]*\bhref="(https?:[^"]+)"/g)].some((m) => destination(m[1]).split('/')[0] === host);
  }).map((f) => f.replace(dist, '/').replace(/index\.html$/, '')) : [];
  if (pagesLinking.length) add('c-dropped-link', p.id, `dropped program "${p.id}" (${host}) is still linked from: ${pagesLinking.join(', ')}`);
}

// ---- (d) visible prices ----
// PRICE RULES (honest prices only; wording comes from src/lib/price.ts: "About $X · checked Mon D, YYYY · may change").
//  * Every dollar amount in the visible text of a checked page must sit in the same text block as a parseable date
//    label: "checked <Mon D, YYYY>" or "as of <Mon D, YYYY>". An undated $ fails the build, and so does a date in the future.
//  * Excluded on purpose (their own, intentional prices): /shop/ and /thank-you/ (RGH's Payhip product prices),
//    /apps/ and /storm-tracker/ (the $5 supporter unlock), /doomsday-prepper/projects/ (cost ranges, each with its cited
//    source), /winter-deals/ (dated deal copy). noindex pages (previews) are skipped.
//  * Staleness is a WARNING only: any price date more than STALE_DAYS before the build date is listed in a summary.
const PRICE_EXCLUDED = ['/shop/', '/thank-you/', '/apps/', '/storm-tracker/', '/doomsday-prepper/projects/'];
const STALE_DAYS = 30;
const MON = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const DATE_LABEL = /\b(?:checked|as of)\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2}),\s+(\d{4})/gi;
const today = new Date(); today.setHours(0, 0, 0, 0);
const priceDates = new Map(); // "Mon D, YYYY|snippet" -> { time, page }
let priceLines = 0;
for (const file of pages(dist)) {
  const page = '/' + file.slice(dist.length).replace(/index\.html$/, '');
  if (PRICE_EXCLUDED.some((x) => page.startsWith(x))) continue;
  const html = readFileSync(file, 'utf8');
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
  // One block of text per line, so a date can only vouch for a price in the same paragraph/list item/card line.
  const body = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<\/?(?:p|li|div|h[1-6]|section|article|tr|td|th|ul|ol|br|figcaption|summary|details|dt|dd|header|footer|nav|main|aside|table|label|button|option)\b[^>]*>/gi, '\n');
  for (const raw of body.split('\n')) {
    const line = strip(raw);
    if (!/\$\s?\d/.test(line)) continue;
    priceLines++;
    const snippet = (line.match(/.{0,40}\$\s?\d[\d,.]*.{0,60}/) ?? [line])[0].trim();
    const dates = [...line.matchAll(DATE_LABEL)].map((m) => ({ t: Date.UTC(+m[3], MON.indexOf(m[1].toLowerCase()), +m[2]), text: `${m[1]} ${m[2]}, ${m[3]}`, y: +m[3], mo: MON.indexOf(m[1].toLowerCase()), d: +m[2] }))
      .filter((x) => { const c = new Date(x.t); return c.getUTCFullYear() === x.y && c.getUTCMonth() === x.mo && c.getUTCDate() === x.d; });
    if (!dates.length) { add('d-price', `${page}|${snippet}`, `undated price on ${page}: "${snippet}" (needs "checked <Mon D, YYYY>" or "as of <Mon D, YYYY>" in the same line)`); continue; }
    for (const x of dates) {
      if (x.t > today.getTime() + 86400000) add('d-price-future', `${page}|${snippet}`, `price date ${x.text} is in the future on ${page}: "${snippet}"`);
      else priceDates.set(`${x.text}|${snippet}`, { t: x.t, text: x.text, page, snippet });
    }
  }
}
const stalePrices = [...priceDates.values()].filter((x) => (today.getTime() - x.t) / 86400000 > STALE_DAYS).sort((a, b) => a.t - b.t);
const oldest = [...priceDates.values()].sort((a, b) => a.t - b.t).slice(0, 3);
console.log(`check-directory: ${priceLines} price line(s) on checked pages, ${priceDates.size} unique dated; oldest: ${oldest.map((x) => x.text).join(' / ') || 'none'}`);
if (stalePrices.length) {
  console.warn(`check-directory: WARNING ${stalePrices.length} price(s) older than ${STALE_DAYS} days (warning only, build continues):`);
  for (const x of stalePrices.slice(0, 25)) console.warn(`  stale ${x.text} on ${x.page}: "${x.snippet}"`);
  if (stalePrices.length > 25) console.warn(`  ... and ${stalePrices.length - 25} more`);
}

// ---- (e) button wording ----
// "View deal" promises a sale: allowed only inside a card that shows the verified list/sale pair ("Marked down on ...").
// "Buy with discount code" needs a code on the card. One phrase may not cover more than 50% of priced cards.
for (const file of pages(dist)) {
  const page = '/' + file.slice(dist.length).replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8');
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
  const inArticles = [...html.matchAll(/<article\b[\s\S]*?<\/article>/g)].map((m) => m[0]);
  const total = (html.match(/>\s*View deal\b/g) ?? []).length;
  const ok = inArticles.filter((a) => /Marked down on/.test(a)).reduce((n, a) => n + (a.match(/>\s*View deal\b/g) ?? []).length, 0);
  if (total > ok) add('e-view-deal', page, `"View deal" without a verified sale on ${page} (${total - ok} button(s)); it needs the "Marked down on" list/sale pair`);
}
for (const c of list) if (c.cta === 'Buy with discount code' && !c.hasCode) add('e-code', c.id, `card ${c.id} says "Buy with discount code" but shows no code`);
const priced = list.filter((c) => c.price.includes('$'));
const byCta = new Map();
for (const c of priced) byCta.set(c.cta, (byCta.get(c.cta) ?? 0) + 1);
console.log(`check-directory: priced-card buttons (${priced.length}): ${[...byCta].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', ')}`);
if (priced.length >= 20) for (const [k, v] of byCta) if (v / priced.length > 0.5) add('e-cta-share', k, `button phrase "${k}" is on ${v} of ${priced.length} priced cards (${Math.round((100 * v) / priced.length)}%, limit 50%)`);

// ---- preview flag must never reach production ----
if (process.env.PUBLIC_PREVIEW_LEADS === '1' && process.env.CONTEXT === 'production') add('preview-flag', 'PUBLIC_PREVIEW_LEADS', 'PUBLIC_PREVIEW_LEADS=1 is set on a production build. It shows pending lead boxes and must stay off in production.');

// ---- report ----
const stale = Object.entries(allow).filter(([k]) => !k.startsWith('_')).flatMap(([kind, rows]) => rows.filter((a) => !usedAllow.has(`${kind}|${a.key}`)).map((a) => `${kind}: ${a.key}`));
console.log(`check-directory: ${list.length} directory cards, ${programs.filter((x) => x.status === 'dropped').length} dropped programs, ${problems.length} problem(s)`);
for (const p of problems) console.log(`  FAIL [${p.check}] ${p.msg}`);
for (const k of stale) console.log(`  note: allowlist entry no longer needed, remove it: ${k}`);
if (problems.length) { console.log('\nFix the data, or (with an owner and reason) add the key to scripts/check-directory.allow.json.'); process.exit(1); }
console.log('check-directory: OK');
