// Post-build catalog integrity checks. Runs inside `npm run build` (after `astro build`) and reads dist/.
// Fails the build with a printed report when:
//   (a) two directory cards share a normalized title or a normalized destination URL;
//   (b) a guide links a product on a plain link while a tracked (affiliate) twin card exists;
//   (c) a dropped program still has visible cards.
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
    cards.set(id, { id, title, href, tracked, program, dest: href.startsWith('/') ? '' : destination(href), norm: normTitle(title), cat: (attrs.match(/data-category="([^"]*)"/) ?? [])[1] ?? '' });
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
}

// ---- preview flag must never reach production ----
if (process.env.PUBLIC_PREVIEW_LEADS === '1' && process.env.CONTEXT === 'production') add('preview-flag', 'PUBLIC_PREVIEW_LEADS', 'PUBLIC_PREVIEW_LEADS=1 is set on a production build. It shows pending lead boxes and must stay off in production.');

// ---- report ----
const stale = Object.entries(allow).flatMap(([kind, rows]) => rows.filter((a) => !usedAllow.has(`${kind}|${a.key}`)).map((a) => `${kind}: ${a.key}`));
console.log(`check-directory: ${list.length} directory cards, ${programs.filter((x) => x.status === 'dropped').length} dropped programs, ${problems.length} problem(s)`);
for (const p of problems) console.log(`  FAIL [${p.check}] ${p.msg}`);
for (const k of stale) console.log(`  note: allowlist entry no longer needed, remove it: ${k}`);
if (problems.length) { console.log('\nFix the data, or (with an owner and reason) add the key to scripts/check-directory.allow.json.'); process.exit(1); }
console.log('check-directory: OK');
