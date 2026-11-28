#!/usr/bin/env node
/**
 * Ranks priced items hot / warm / cold from Google Analytics so the weekly refresh only re-checks what people look at.
 * Input:  src/data/ga-snapshot.json  (last 30 days of GA4 `affiliate_click` events by page + link URL, and page views by path;
 *         pulled with the Google Analytics connector, aggregate counts only)
 * Output: src/data/price-priority.json  { generated, event, window, counts, items: { <id>: { tier, clicks, views, categoryViews, score } } }
 *
 *   hot  = at least one affiliate_click on the item (its link, or its /gear/<id>/ page), or its own /gear/<id>/ page viewed;
 *          while traffic is this small the list is topped up to MIN_HOT by score (clicks, own views, category views, then higher price)
 *   warm = its directory category page had 2+ views in the window
 *   cold = everything else (still refreshed in the monthly full run)
 * npm run prices:priority
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadItems, normUrl, parseMoney } from './lib/price-sources.mjs';

const snap = JSON.parse(readFileSync(join(ROOT, 'src/data/ga-snapshot.json'), 'utf8'));
const views = new Map(snap.pageViews.map((p) => [p.pagePath, p.views]));
const safeDecode = (x) => { try { return decodeURIComponent(x); } catch { return decodeURIComponent(x.replace(/%[0-9a-f]?$/i, '')); } };
const strip = (u) => u.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/+$/, '').toLowerCase();
// The product URL a click went to: the link itself, or the ?url= target inside an affiliate-network link.
const clickRows = snap.clicks.map((c) => { const w = /[?&]url=([^&]*)/.exec(c.linkUrl); return { ...c, target: strip(safeDecode(w ? w[1] : c.linkUrl)) }; });
// GA cuts linkUrl at 100 chars, so a click matches when one side is a prefix of the other (at least 12 chars shared).
const matches = (target, path) => target.length >= 12 && (path.startsWith(target) || target.startsWith(path));

const MIN_HOT = 12;
const out = {}; const counts = { hot: 0, warm: 0, cold: 0 };
const money = {};
for (const it of loadItems()) {
  const key = normUrl(it.url) ?? '';
  const path = key.split('?')[0];
  let clicks = 0;
  for (const c of clickRows) if (matches(c.target, path) || c.pagePath === `/gear/${it.id}/`) clicks += c.count;
  const own = views.get(`/gear/${it.id}/`) ?? 0;
  const cat = it.category ? views.get(`/directory/${it.category}/`) ?? 0 : 0;
  const score = clicks * 10 + own * 2 + cat * 0.1;
  const tier = clicks > 0 || own > 0 ? 'hot' : cat >= 2 ? 'warm' : 'cold';
  money[it.id] = parseMoney(it.sites[0].label) ?? 0;
  out[it.id] = { tier, clicks, views: own, categoryViews: cat, score: Math.round(score * 10) / 10 };
}
const rank = (a, b) => b[1].score - a[1].score || money[b[0]] - money[a[0]] || a[0].localeCompare(b[0]);
for (const [id, v] of Object.entries(out).sort(rank)) { if (v.tier !== 'hot' && v.score > 0 && Object.values(out).filter((x) => x.tier === 'hot').length < MIN_HOT) { v.tier = 'hot'; v.reason = 'top-up by category views'; } }
for (const v of Object.values(out)) counts[v.tier]++;
const sorted = Object.fromEntries(Object.entries(out).sort(rank));
writeFileSync(join(ROOT, 'src/data/price-priority.json'), JSON.stringify({ generated: snap.pulledAt, event: snap.event, property: snap.property, window: snap.window, counts, items: sorted }, null, 2) + '\n');
console.log(`price-priority: ${JSON.stringify(counts)} from GA ${snap.window.start}..${snap.window.end} (${snap.event})`);
for (const [id, v] of Object.entries(sorted)) if (v.tier === 'hot') console.log(`  hot ${id}: clicks=${v.clicks} views=${v.views} catViews=${v.categoryViews}${v.reason ? ' (' + v.reason + ')' : ''}`);
