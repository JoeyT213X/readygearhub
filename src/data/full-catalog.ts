/**
 * Unified Full Source Directory catalog: partner shop cards, /gear/
 * listings, brand/service/resource entries, Payhip downloads, and free
 * tools and apps. Links and images are reused exactly as each source
 * already resolves them. No invented tracking URLs or prices.
 */
import { isNoPpcProgram, resolveItemOutbound, resolveOutbound } from './affiliates';
import { entries, resolveEntry, categoryForItem, type CategoryId } from './directory';
import { CALCULATORS, OFFLINE_APPS } from '../lib/app-config';
import { catalogExtraById, type CatalogExtra } from './catalog-extras';
import { newPrepperOnlyPicks, prepperPickToCatalogItem } from './prepper-picks';
import {
  sourceGroups,
  resolvedSourceItems,
  itemMatchesGroup,
  type SourceGroupId,
  type ResolvedSourceItem,
} from './source-directory';

export type CatalogKind = 'partner' | 'gear' | 'brand' | 'resource' | 'tool' | 'own';

export type CatalogItem = {
  id: string;
  title: string;
  blurb: string;
  sourceName: string;
  href: string;
  detailHref?: string;
  rel: string;
  affiliate: boolean;
  hideOnPaid: boolean;
  programId: string;
  category: string;
  alsoIn?: string[];
  image?: string;
  imageKind?: 'photo' | 'banner' | 'logo';
  priceLabel: string;
  offerLabel?: string;
  ctaLabel: string;
  trending?: boolean;
  trendingRank?: number;
  groups: SourceGroupId[];
  kind: CatalogKind;
  origin: 'source-directory' | 'gear' | 'directory' | 'tools' | 'apps' | 'payhip' | 'prepper';
};

export type GearInput = {
  id: string;
  data: {
    name: string;
    brand: string;
    description: string;
    officialUrl: string;
    affiliateUrl?: string;
    lane: string;
    alsoIn: string[];
    rank: number;
  };
};

/** Directory / gear entries already represented by a richer partner card. */
const SKIP_IDS = new Set([
  'bluetti-ac180',
  'bluetti-ac70',
  'bluetti-200w-solar-panel',
  'bluetti-sp200l',
  'bluetti',
  'allpowers',
  'aquasana',
  'aquasana-home',
  'aquasana-whole-house',
  'aquasana-under-sink',
  'waterdrop',
  'berkey',
  'nordvpn',
  'nordpass',
  'surfshark',
  'redi',
  'choice-home-warranty',
  'bluetti-apex-300',
]);

const GEAR_ALIAS: Record<string, string> = {
  'bluetti-200w-solar-panel': 'bluetti-sp200l',
};


function seoAlsoIn(group: SourceGroupId, originCat: string): string[] | undefined {
  const extra: string[] = [];
  if (group === 'safety-prep' && originCat !== 'safety') extra.push('safety');
  if (group === 'home-water' && originCat !== 'water' && originCat !== 'home') extra.push('home', 'water');
  if (group === 'power-tech' && originCat !== 'power' && originCat !== 'tech') extra.push('tech');
  if (group === 'outdoor-auto' && originCat !== 'outdoor') extra.push('outdoor');
  return extra.length ? extra : undefined;
}

function catToGroup(cat: CategoryId): SourceGroupId {
  switch (cat) {
    case 'power':
    case 'digital-safety':
    case 'comms':
    case 'lighting':
    case 'offline-entertainment':
      return 'power-tech';
    case 'water':
    case 'home-protection':
    case 'insurance':
      return 'home-water';
    case 'first-aid':
    case 'kits':
    case 'food':
      return 'safety-prep';
    case 'more':
    default:
      return 'outdoor-auto';
  }
}

function groupsFor(ids: SourceGroupId[]): SourceGroupId[] {
  return sourceGroups.map((g) => g.id).filter((id) => ids.includes(id));
}

function partnerGroups(item: ResolvedSourceItem): SourceGroupId[] {
  return sourceGroups.filter((g) => itemMatchesGroup(item, g)).map((g) => g.id);
}

function applyExtra(item: CatalogItem, extra?: CatalogExtra): CatalogItem {
  if (!extra) return item;
  if (extra.image) {
    item = { ...item, image: extra.image, imageKind: extra.imageKind ?? item.imageKind ?? 'photo' };
  }
  if (extra.officialUrl && item.programId) {
    const out = resolveOutbound(item.programId, extra.officialUrl, item.id);
    if (out.affiliate && out.href) {
      item = {
        ...item,
        href: item.detailHref ? item.href === item.detailHref ? out.href : item.href : out.href,
        affiliate: true,
        rel: 'sponsored nofollow noopener',
      };
      // If the card used a plain official outbound, swap it for the tracked wrap.
      if (!item.detailHref) item = { ...item, href: out.href };
      else item = { ...item, href: out.href };
    }
  }
  return item;
}

function fromPartner(item: ResolvedSourceItem): CatalogItem {
  const origin: CatalogItem['origin'] = item.programId === 'payhip' ? 'payhip' : 'source-directory';
  const kind: CatalogKind = item.programId === 'payhip' ? 'own' : 'partner';
  return {
    id: item.id,
    title: item.title,
    blurb: item.blurb,
    sourceName: item.sourceName,
    href: item.href,
    rel: item.rel || '',
    affiliate: item.affiliate,
    hideOnPaid: item.hideOnPaid,
    programId: item.programId,
    category: item.category,
    alsoIn: item.alsoIn,
    image: item.image,
    imageKind: item.imageKind,
    priceLabel: item.priceLabel,
    offerLabel: item.offerLabel,
    ctaLabel: item.ctaLabel,
    trending: item.trending,
    trendingRank: item.trendingRank,
    groups: partnerGroups(item),
    kind,
    origin,
  };
}

function fromGear(item: GearInput): CatalogItem {
  const out = resolveItemOutbound(item.id, item.data.officialUrl, item.data.affiliateUrl);
  const programId = out.programId || '';
  const gearCat = categoryForItem(item.id);
  const group = catToGroup(gearCat);
  const detailHref = `/gear/${item.id}/`;
  const alsoIn = seoAlsoIn(group, gearCat);
  return {
    id: item.id,
    title: item.data.name,
    blurb: item.data.description,
    sourceName: item.data.brand,
    href: out.href,
    detailHref,
    rel: out.affiliate ? 'sponsored nofollow noopener' : 'noopener',
    affiliate: out.affiliate,
    hideOnPaid: isNoPpcProgram(programId),
    programId,
    category: gearCat,
    alsoIn,
    image: undefined,
    priceLabel: 'See price',
    offerLabel: 'Gear listing',
    ctaLabel: 'Check current price',
    trending: item.data.rank > 0,
    trendingRank: item.data.rank > 0 ? item.data.rank : undefined,
    groups: groupsFor([group]),
    kind: 'gear',
    origin: 'gear',
  };
}

function fromDirectoryEntry(idKnown: Set<string>): CatalogItem[] {
  const out: CatalogItem[] = [];
  for (const raw of entries) {
    if (SKIP_IDS.has(raw.id) || idKnown.has(raw.id)) continue;
    const e = resolveEntry(raw);
    const isResource = e.type === 'Free resource' || !e.program;
    const group = catToGroup(e.category);
    out.push({
      id: e.id,
      title: e.name,
      blurb: e.desc,
      sourceName: e.type === 'Free resource' ? 'Official resource' : e.name,
      href: e.href,
      rel: e.affiliate ? 'sponsored nofollow noopener' : 'noopener',
      affiliate: e.affiliate,
      hideOnPaid: isNoPpcProgram(e.programId) || isNoPpcProgram(e.program) || isNoPpcProgram(e.id),
      programId: e.programId || e.program || '',
      category: e.category,
      alsoIn: seoAlsoIn(group, e.category),
      image: undefined,
      priceLabel: isResource ? 'Free' : 'See official site',
      offerLabel: e.offer || e.type,
      ctaLabel: e.cta ?? (isResource ? 'Visit official site' : 'Visit site'),
      groups: groupsFor([group]),
      kind: isResource ? 'resource' : 'brand',
      origin: 'directory',
    });
  }
  return out;
}

function fromTools(): CatalogItem[] {
  const tools: CatalogItem[] = CALCULATORS.map((t) => ({
    id: `tool-${t.href.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
    title: t.name,
    blurb: t.blurb,
    sourceName: 'ReadyGearHub',
    href: t.href,
    rel: '',
    affiliate: false,
    hideOnPaid: false,
    programId: 'rgh-tools',
    category: 'safety',
    image: undefined,
    priceLabel: 'Free',
    offerLabel: 'Free tool',
    ctaLabel: 'Open tool',
    groups: groupsFor(['safety-prep', 'power-tech']),
    kind: 'tool' as const,
    origin: 'tools' as const,
  }));
  const apps: CatalogItem[] = OFFLINE_APPS.map((t) => ({
    id: `app-${t.href.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
    title: t.name,
    blurb: t.blurb,
    sourceName: 'ReadyGearHub',
    href: t.href,
    rel: '',
    affiliate: false,
    hideOnPaid: false,
    programId: 'rgh-tools',
    category: 'safety',
    image: undefined,
    priceLabel: 'Free',
    offerLabel: 'Free app',
    ctaLabel: 'Open app',
    groups: groupsFor(['safety-prep']),
    kind: 'tool' as const,
    origin: 'apps' as const,
  }));
  // Power sizer / solar sizer also belong in Power & Tech (already on calculators via groups).
  return [...tools, ...apps];
}

export function sortFullCatalog(items: CatalogItem[]): CatalogItem[] {
  return [...items].sort((a, b) => {
    const ar = a.trending ? (a.trendingRank ?? 50) : a.image ? 200 : 800;
    const br = b.trending ? (b.trendingRank ?? 50) : b.image ? 200 : 800;
    if (ar !== br) return ar - br;
    if (!!a.image !== !!b.image) return a.image ? -1 : 1;
    return a.title.localeCompare(b.title);
  });
}

export function buildFullCatalog(gearItems: GearInput[]): CatalogItem[] {
  const used = new Set<string>();
  const items: CatalogItem[] = [];

  for (const partner of resolvedSourceItems()) {
    items.push(applyExtra(fromPartner(partner), catalogExtraById[partner.id]));
    used.add(partner.id);
  }

  for (const gear of gearItems) {
    const alias = GEAR_ALIAS[gear.id] || gear.id;
    if (SKIP_IDS.has(gear.id) || used.has(alias) || used.has(gear.id)) continue;
    items.push(applyExtra(fromGear(gear), catalogExtraById[gear.id] || catalogExtraById[alias]));
    used.add(gear.id);
    used.add(alias);
  }

  for (const entry of fromDirectoryEntry(used)) {
    items.push(applyExtra(entry, catalogExtraById[entry.id]));
    used.add(entry.id);
  }

  for (const tool of fromTools()) {
    if (used.has(tool.id)) continue;
    items.push(applyExtra(tool, catalogExtraById[tool.id]));
    used.add(tool.id);
  }

  for (const pick of newPrepperOnlyPicks()) {
    if (used.has(pick.id) || (pick.catalogId && used.has(pick.catalogId))) continue;
    items.push(applyExtra(prepperPickToCatalogItem(pick), catalogExtraById[pick.id]));
    used.add(pick.id);
  }

  return sortFullCatalog(items);
}

export function countsByCatalogGroup(items: CatalogItem[]): Record<SourceGroupId, number> {
  const counts = Object.fromEntries(sourceGroups.map((g) => [g.id, 0])) as Record<SourceGroupId, number>;
  for (const item of items) {
    for (const g of item.groups) counts[g] += 1;
  }
  return counts;
}

export function countsByOrigin(items: CatalogItem[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.origin] = (counts[item.origin] || 0) + 1;
  }
  return counts;
}

function hasProductPhoto(item: CatalogItem): boolean {
  return Boolean(item.image && !item.image.endsWith('.svg'));
}

/** Home shop section: prefer cards with real photos, then trending text cards. */
export function homeShopPicks(items: CatalogItem[], limit = 16): CatalogItem[] {
  const photoTrending = items.filter((i) => i.trending && hasProductPhoto(i));
  const photoRest = items.filter((i) => !i.trending && hasProductPhoto(i));
  const textTrending = items.filter((i) => i.trending && !hasProductPhoto(i));
  const rest = items.filter((i) => !i.trending && !hasProductPhoto(i));
  const picked: CatalogItem[] = [];
  const seen = new Set<string>();
  for (const item of [...photoTrending, ...photoRest, ...textTrending, ...rest]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    picked.push(item);
    if (picked.length >= limit) break;
  }
  return picked;
}

export function catalogPhotoUrls(items: CatalogItem[], limit = 6): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();
  const isPayhipCover = (src: string) => src.startsWith('/shop/');
  const isSvg = (src: string) => src.endsWith('.svg');
  const officialPhoto = (item: CatalogItem) =>
    Boolean(item.image && item.imageKind === 'photo' && !isPayhipCover(item.image) && !isSvg(item.image));
  const ranked = [
    ...items.filter(officialPhoto),
    ...items.filter((i) => i.image && !officialPhoto(i) && !isSvg(i.image) && !isPayhipCover(i.image)),
  ];
  for (const item of ranked) {
    if (!item.image || seen.has(item.image)) continue;
    seen.add(item.image);
    urls.push(item.image);
    if (urls.length >= limit) break;
  }
  return urls;
}
