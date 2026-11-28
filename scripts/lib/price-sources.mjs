// Shared by scripts/price-feed.mjs and scripts/price-priority.mjs.
// Finds every priced item in the repo (gear frontmatter, directory/brand/robotics cards, winter deals) and its product URL.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const GEAR_DIR = join(ROOT, 'src/content/items');
export const CARD_FILES = ['source-directory', 'high-ticket', 'robotics-drones', 'doomsday-prepper'].map((n) => join(ROOT, `src/data/${n}.ts`));
export const DEALS_FILE = join(ROOT, 'src/data/winter-deals.ts');
export const SPEC_FILE = join(ROOT, 'src/data/indestructible-shoes.ts');

const URL_KEY = /\b(destination|fallbackUrl|officialUrl|url)\s*:\s*(['"])(https?:\/\/[^'"]+)\2/;
const ID_KEY = /\bid\s*:\s*(['"])([^'"]+)\1/;
const CAT_KEY = /\bcategory\s*:\s*(['"])([^'"]+)\1/;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const hasPrice = (s) => /\$\s?\d/.test(s ?? '');
export const parseMoney = (s) => { const m = /\$\s?([\d,]+(?:\.\d+)?)/.exec(s ?? ''); return m ? Number(m[1].replace(/,/g, '')) : undefined; };
export const fmtMoney = (n, like = '') => {
  const decimals = /\$[\d,]+\.\d\d/.test(like) || !Number.isInteger(n) ? 2 : 0;
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};
export const isoToLabel = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${MONTHS[m - 1]} ${d}, ${y}`; };
export const labelToIso = (lab) => { const m = /(\w{3}) (\d{1,2}), (\d{4})/.exec(lab ?? ''); const mo = m ? MONTHS.indexOf(m[1]) + 1 : 0; return mo ? `${m[3]}-${String(mo).padStart(2, '0')}-${m[2].padStart(2, '0')}` : undefined; };

/** host + path, lowercase, no trailing slash, tracking params dropped (variant kept). */
export function normUrl(u) {
  try {
    const x = new URL(u);
    const v = x.searchParams.get('variant');
    return x.hostname.replace(/^www\./, '').toLowerCase() + x.pathname.replace(/\/+$/, '').toLowerCase() + (v ? `?variant=${v}` : '');
  } catch { return undefined; }
}

/** Items: { id, sites: [{kind, file, ...}], url, category, label (current price text), checked (iso), listLike } */
export function loadItems() {
  const byId = new Map();
  const get = (id) => { if (!byId.has(id)) byId.set(id, { id, sites: [], url: undefined, category: undefined }); return byId.get(id); };

  // 1. gear pages
  for (const f of readdirSync(GEAR_DIR).filter((n) => n.endsWith('.md'))) {
    const file = join(GEAR_DIR, f); const text = readFileSync(file, 'utf8');
    const fm = /^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? '';
    const price = /^price:\s*"([^"]*)"/m.exec(fm)?.[1];
    if (!price) continue;
    const it = get(f.replace(/\.md$/, ''));
    it.url ??= /^officialUrl:\s*"([^"]+)"/m.exec(fm)?.[1];
    it.sites.push({ kind: 'gear', file, label: price, checked: /^priceDate:\s*"([^"]*)"/m.exec(fm)?.[1], note: /^priceNote:\s*"([^"]*)"/m.exec(fm)?.[1] });
  }

  // 2. cards
  const cardUrl = new Map(); const cardCat = new Map();
  for (const file of CARD_FILES) {
    const lines = readFileSync(file, 'utf8').split('\n');
    let curId, curUrl, curCat;
    lines.forEach((ln, i) => {
      for (const m of ln.matchAll(new RegExp(ID_KEY.source, 'g'))) { if (/^\s*(\{|id:)|mk\(\{|^\s*\{ *id/.test(ln) || true) { curId = m[2]; curUrl = undefined; curCat = undefined; } }
      const u = URL_KEY.exec(ln); if (u) curUrl = u[3];
      const c = CAT_KEY.exec(ln) ?? /\bsection\s*:\s*(['"])([^'"]+)\1/.exec(ln); if (c) curCat = c[2];
      const pm = /\bprice\s*:\s*(['"])(.*?)\1/.exec(ln);
      if (curId && curUrl) cardUrl.set(curId, curUrl);
      if (curId && curCat) cardCat.set(curId, curCat);
      if (!pm || !hasPrice(pm[2])) return;
      // URL/category may come after price within the same object: look ahead until the next id.
      let url = curUrl, cat = curCat;
      for (let j = i + 1; j < Math.min(lines.length, i + 12) && (!url || !cat); j++) {
        if (ID_KEY.test(lines[j]) && j > i) break;
        url ??= URL_KEY.exec(lines[j])?.[3]; cat ??= CAT_KEY.exec(lines[j])?.[2];
      }
      if (!curId) return;
      const it = get(curId); it.url ??= url; it.category ??= cat;
      it.sites.push({ kind: 'card', file, line: i, label: pm[2], checked: labelToIso(/as of (\w{3} \d{1,2}, \d{4})/.exec(pm[2])?.[0].replace('as of ', '') ?? '') });
    });
  }

  // 3. winter deals (itemId points at a card id)
  const dl = readFileSync(DEALS_FILE, 'utf8').split('\n');
  dl.forEach((ln, i) => {
    const m = /^\s*itemId:\s*'([^']+)'/.exec(ln); if (!m) return;
    let label, labelLine, checkedLine, checked;
    for (let j = i + 1; j < i + 12 && !/^\s*itemId:/.test(dl[j] ?? ''); j++) {
      const p = /^\s*priceLabel:\s*'([^']*)'/.exec(dl[j] ?? ''); if (p) { label = p[1]; labelLine = j; }
      const c = /^\s*checked:\s*'([^']*)'/.exec(dl[j] ?? ''); if (c) { checked = c[1]; checkedLine = j; }
    }
    if (!hasPrice(label)) return;
    const it = get(m[1]);
    it.sites.push({ kind: 'deal', file: DEALS_FILE, line: i, label, labelLine, checked, checkedLine });
  });

  // 4. Indestructible Shoes specs: one object per line, price '$89' (date = per-spec `checked` or PRICE_CHECKED)
  {
    const text = readFileSync(SPEC_FILE, 'utf8'); const lines = text.split('\n');
    const store = /const STORE = '([^']+)'/.exec(text)?.[1];
    const dflt = /export const PRICE_CHECKED = '([^']+)'/.exec(text)?.[1];
    lines.forEach((ln, i) => {
      const m = /\{ id: '([^']+)'.*?\bhandle: '([^']+)', price: '([^']*)'(?:, checked: '([^']*)')?/.exec(ln);
      if (!m || !hasPrice(m[3])) return;
      const it = get(m[1]); it.url ??= store + m[2]; it.category ??= 'footwear';
      it.sites.push({ kind: 'spec', file: SPEC_FILE, line: i, label: m[3], checked: labelToIso(m[4] ?? dflt) });
    });
  }

  for (const it of byId.values()) { it.url ??= cardUrl.get(it.id); it.category ??= cardCat.get(it.id); }
  return [...byId.values()].filter((x) => x.sites.length).sort((a, b) => a.id.localeCompare(b.id));
}
