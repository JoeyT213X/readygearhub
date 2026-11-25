// Builds docs/image-manifest.json: every self-hosted card/hero image with its source and license,
// read from IMAGE_CREDITS.md (the human-readable credit list). Run: node scripts/image-manifest.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const credits = fs.readFileSync(path.join(root, 'IMAGE_CREDITS.md'), 'utf8');
const rows = new Map();
let section = '';
for (const line of credits.split('\n')) {
  if (line.startsWith('#')) section = line.replace(/^#+\s*/, '');
  if (!line.startsWith('| `')) continue;
  const cells = line.split('|').slice(1, -1).map((c) => c.trim());
  const keys = [...cells[0].matchAll(/`([^`]+)`/g)].map((m) => m[1].replace(/(-\d+)?\.(webp|jpg|png|svg)$/, ''));
  for (const k of keys) if (!rows.has(k)) rows.set(k, { section, cells });
}
const license = (text) => {
  if (/pexels/i.test(text)) return 'Pexels License (free to use, self-hosted)';
  if (/unsplash/i.test(text)) return 'Unsplash License (free to use, self-hosted)';
  if (/wikimedia|creative commons|cc[- ]by/i.test(text)) return 'Wikimedia Commons (see credit row for the exact license)';
  if (/rakuten|cj affiliate|awin|shareasale|impact|goaffpro|pmx|flexoffers|affiliate|official|provided by|catalog|feed/i.test(text)) return 'Brand or affiliate-program creative (used under the program’s publisher terms)';
  return 'See IMAGE_CREDITS.md';
};
const dirs = [
  { dir: 'public/images/photos', kind: 'photo' },
  { dir: 'public/directory/photos', kind: 'official-product-photo' },
];
const out = [];
const missing = [];
for (const { dir, kind } of dirs) {
  const files = fs.readdirSync(path.join(root, dir)).filter((f) => /\.(webp|jpg|png)$/.test(f));
  const byKey = new Map();
  for (const f of files) {
    const key = f.replace(/(-\d+)?\.(webp|jpg|png)$/, '');
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(`/${dir.replace(/^public\//, '')}/${f}`);
  }
  for (const [key, list] of [...byKey].sort()) {
    const row = rows.get(key);
    const text = row ? row.cells.join(' ') : '';
    if (!row) missing.push(key);
    out.push({
      key,
      kind: key.startsWith('stock-') || (kind === 'photo' && !/^hero-(anker|litime|bluetti)/.test(key)) ? (key.startsWith('stock-') ? 'representative-stock' : 'editorial-stock') : 'official-product-or-brand',
      files: list.sort(),
      source: row ? row.cells.slice(1).join(' | ') : 'NOT FOUND IN IMAGE_CREDITS.md',
      license: row ? license(text) : 'unknown',
      creditSection: row?.section ?? null,
    });
  }
}
const manifest = {
  generated: new Date().toISOString(),
  note: 'Self-hosted images only; nothing is hotlinked. Representative stock photos are labeled "Representative photo" on cards. Human-readable credits: IMAGE_CREDITS.md.',
  counts: {
    keys: out.length,
    officialProductOrBrand: out.filter((o) => o.kind === 'official-product-or-brand').length,
    representativeStock: out.filter((o) => o.kind === 'representative-stock').length,
    editorialStock: out.filter((o) => o.kind === 'editorial-stock').length,
    missingCredit: missing.length,
  },
  missingCredit: missing,
  images: out,
};
fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/image-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(manifest.counts, missing.slice(0, 40));
