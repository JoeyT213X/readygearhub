import { getCollection, type CollectionEntry } from 'astro:content';
import lanesRaw from '../data/lanes.json';
import site from '../data/site.json';
import { trackedItemLink, programIdForItem } from '../data/affiliates';

export type Lane = (typeof lanesRaw)[number];
export type Item = CollectionEntry<'items'>;

export const lanes: Lane[] = [...lanesRaw].filter((l) => l.active !== false).sort((a, b) => a.order - b.order);
export const laneBySlug = (slug: string) => lanes.find((l) => l.slug === slug);

// Sort: trending rank first (1 is top, 0 = unranked goes last), then featured, then name.
export function sortItems(list: Item[]) {
  return [...list].sort((a, b) => {
    const ra = a.data.rank || 9999, rb = b.data.rank || 9999;
    if (ra !== rb) return ra - rb;
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return a.data.name.localeCompare(b.data.name);
  });
}

export async function getItems() {
  const all = await getCollection('items', (e) => !e.data.draft);
  for (const e of all) {
    if (!laneBySlug(e.data.lane)) throw new Error(`Item ${e.id} has unknown lane "${e.data.lane}". Add it to src/data/lanes.json.`);
  }
  return sortItems(all);
}

export async function getItemsForLane(slug: string) {
  const all = await getItems();
  return sortItems(all.filter((e) => e.data.lane === slug || e.data.alsoIn.includes(slug)));
}

// Trending: ranked items, current-season items first.
export async function getTrending(limit = 8) {
  const all = await getItems();
  const season = site.currentSeason;
  return [...all.filter((e) => e.data.rank > 0)]
    .sort((a, b) => {
      const sa = a.data.season.includes(season as any) ? 0 : 1;
      const sb = b.data.season.includes(season as any) ? 0 : 1;
      if (sa !== sb) return sa - sb;
      return a.data.rank - b.data.rank || a.data.name.localeCompare(b.data.name);
    })
    .slice(0, limit);
}

export async function getGuides() {
  const g = await getCollection('guides', (e) => !e.data.draft);
  return g.sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
}

// Outbound buy link: manual affiliateUrl in the listing > approved program in src/data/affiliates.ts > official URL.
const tracked = (item: Item) => item.data.affiliateUrl || trackedItemLink(item.id, item.data.officialUrl);
export const outUrl = (item: Item) => tracked(item) || item.data.officialUrl;
export const isAffiliate = (item: Item) => Boolean(tracked(item));
export { site, programIdForItem };
