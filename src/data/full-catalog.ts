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
import { highTicketCatalogItems } from './high-ticket';
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

  for (const item of highTicketCatalogItems()) {
    if (used.has(item.id)) continue;
    items.push(applyExtra(item, catalogExtraById[item.id]));
    used.add(item.id);
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

export type ShopBoardTile = {
  id: string;
  label: string;
  href: string;
  image: string;
  photoKey?: string;
  fit: 'contain' | 'cover';
  hideOnPaid: boolean;
  rel: string;
  affiliate: boolean;
};

/** Prefer an on-site listing page when we have one; otherwise the partner or official link. */
function listingHref(item: CatalogItem): string {
  return item.detailHref || item.href;
}

const SHOP_BOARD_PRODUCT_IDS = [
  'bluetti-apex-300',
  'bluetti-ac180',
  'bluetti-premium-200-v2',
  'bluetti-350w-solar',
  'aquasana-under-sink',
  'aquasana-whole-house',
  'waterdrop-shop',
];

export function shopBoardTiles(items: CatalogItem[]): ShopBoardTile[] {
  const byId = new Map(items.map((i) => [i.id, i]));
  const tiles: ShopBoardTile[] = [];
  const usedImages = new Set<string>();

  const pushProduct = (item: CatalogItem) => {
    if (!item.image) return;
    if (usedImages.has(item.image)) return;
    usedImages.add(item.image);
    tiles.push({
      id: item.id,
      label: item.title.replace(/\s+official.*$/i, ''),
      href: listingHref(item),
      image: item.image,
      fit: item.imageKind === 'photo' ? 'contain' : 'cover',
      hideOnPaid: item.hideOnPaid,
      rel: item.rel,
      affiliate: item.affiliate,
    });
  };

  for (const id of SHOP_BOARD_PRODUCT_IDS) {
    const item = byId.get(id);
    if (item) pushProduct(item);
  }
  if (tiles.length < 7) {
    for (const item of items) {
      if (item.imageKind === 'photo' && item.image && !item.image.endsWith('.svg')) {
        pushProduct(item);
      }
      if (tiles.length >= 7) break;
    }
  }

  const midland = byId.get('midland-wr400') || byId.get('midland-er310-crank-radio');
  const scenes: ShopBoardTile[] = [
    { id: 'scene-drone', label: 'Drones', href: '/directory/drones/', image: '', photoKey: 'hero-drone', fit: 'cover', hideOnPaid: false, rel: '', affiliate: false },
    { id: 'scene-utv', label: 'Off-road vehicles', href: '/directory/vehicles/', image: '', photoKey: 'hero-utv-dunes', fit: 'cover', hideOnPaid: false, rel: '', affiliate: false },
    { id: 'scene-bunker', label: 'Shelters', href: '/directory/security/', image: '', photoKey: 'hero-bunker-hatch', fit: 'cover', hideOnPaid: false, rel: '', affiliate: false },
    {
      id: 'scene-radios',
      label: 'Radios',
      href: midland ? listingHref(midland) : '/directory/tech/',
      image: '',
      photoKey: 'hero-radios',
      fit: 'cover',
      hideOnPaid: midland ? midland.hideOnPaid : false,
      rel: midland?.rel || '',
      affiliate: midland?.affiliate || false,
    },
    { id: 'scene-food', label: 'Food & pantry', href: '/directory/food/', image: '', photoKey: 'hero-pantry-cans', fit: 'cover', hideOnPaid: false, rel: '', affiliate: false },
  ];

  // 12 tiles: keep as many official product shots as we have, then fill with scenes.
  tiles.push(...scenes.slice(0, Math.max(0, 12 - tiles.length)));
  return tiles.slice(0, 12);
}

export const shopCategoryChips: { label: string; href: string }[] = [
  { label: 'Power', href: '/directory/power/' },
  { label: 'Water', href: '/directory/water/' },
  { label: 'Drones', href: '/directory/drones/' },
  { label: 'Vehicles', href: '/directory/vehicles/' },
  { label: 'Security', href: '/directory/security/' },
  { label: 'Food', href: '/directory/food/' },
  { label: 'Outdoor', href: '/directory/outdoor/' },
];

export type HeroCutout = {
  id: string;
  href: string;
  label: string;
  photoKey?: string;
  image?: string;
  fit: 'cover' | 'contain';
  hideOnPaid: boolean;
  rel: string;
  affiliate: boolean;
  slot: string;
  depth: number;
  eager?: boolean;
  shape?: 'round' | 'tile';
};

export function heroCutouts(items: CatalogItem[]): HeroCutout[] {
  const byId = new Map(items.map((i) => [i.id, i]));
  const product = (id: string, slot: string, depth: number, eager = false): HeroCutout | null => {
    const item = byId.get(id);
    if (!item?.image) return null;
    return {
      id: `cut-${id}`,
      href: listingHref(item),
      label: item.title.replace(/\s+official.*$/i, ''),
      image: item.image,
      fit: 'contain',
      hideOnPaid: item.hideOnPaid,
      rel: item.rel,
      affiliate: item.affiliate,
      slot,
      depth,
      eager,
    };
  };

  const ghost = byId.get('ghost-robotics-official');
  const midland = byId.get('midland-wr400') || byId.get('midland-er310-crank-radio');
  const lantern = byId.get('goal-zero-lighthouse-600');

  const cuts: Array<HeroCutout | null> = [
    { id: 'cut-drone', href: '/directory/drones/', label: 'Drones', photoKey: 'hero-drone', fit: 'cover', hideOnPaid: false, rel: '', affiliate: false, slot: 'drone', depth: 0.08, eager: true },
    { id: 'cut-utv', href: '/directory/vehicles/', label: 'Off-road UTVs', photoKey: 'hero-utv-dunes', fit: 'cover', hideOnPaid: false, rel: '', affiliate: false, slot: 'utv', depth: 0.06, eager: true },
    { id: 'cut-truck', href: '/directory/vehicles/', label: 'Overland trucks', photoKey: 'hero-overland-truck', fit: 'cover', hideOnPaid: false, rel: '', affiliate: false, slot: 'truck', depth: 0.05, eager: true },
    { id: 'cut-cruiser', href: '/directory/vehicles/', label: 'Overland SUVs', photoKey: 'hero-overland-cruiser', fit: 'cover', hideOnPaid: false, rel: '', affiliate: false, slot: 'cruiser', depth: 0.07, eager: false },
    { id: 'cut-bunker', href: '/directory/security/', label: 'Shelters', photoKey: 'hero-bunker-hatch', fit: 'cover', hideOnPaid: false, rel: '', affiliate: false, slot: 'bunker', depth: 0.04, eager: true },
    {
      id: 'cut-robot',
      href: ghost ? listingHref(ghost) : '/directory/security/',
      label: 'Security robots',
      photoKey: 'hero-security-robot',
      fit: 'cover',
      hideOnPaid: false,
      rel: ghost?.rel || 'noopener',
      affiliate: ghost?.affiliate || false,
      slot: 'robot',
      depth: 0.06,
      eager: false,
    },
    {
      id: 'cut-radios',
      href: midland ? listingHref(midland) : '/directory/tech/',
      label: 'Radios',
      photoKey: 'hero-radios',
      fit: 'cover',
      hideOnPaid: midland ? midland.hideOnPaid : false,
      rel: midland?.rel || '',
      affiliate: midland?.affiliate || false,
      slot: 'radios',
      depth: 0.05,
      eager: false,
    },
    { id: 'cut-food', href: '/directory/food/', label: 'Food kits', photoKey: 'hero-pantry-cans', fit: 'cover', hideOnPaid: false, rel: '', affiliate: false, slot: 'food', depth: 0.04, eager: false },
    { id: 'cut-lantern', href: lantern ? listingHref(lantern) : '/directory/outdoor/', label: 'Lanterns', photoKey: 'lantern-dusk', fit: 'cover', hideOnPaid: lantern ? lantern.hideOnPaid : false, rel: lantern?.rel || '', affiliate: lantern?.affiliate || false, slot: 'lantern', depth: 0.05, eager: false },
    { id: 'cut-water', href: '/directory/water/', label: 'Water stores', photoKey: 'water-bottles', fit: 'cover', hideOnPaid: false, rel: '', affiliate: false, slot: 'water', depth: 0.03, eager: false },
    { id: 'cut-generator', href: '/directory/power/', label: 'Generators', photoKey: 'portable-generator', fit: 'cover', hideOnPaid: false, rel: '', affiliate: false, slot: 'generator', depth: 0.04, eager: false },
    { id: 'cut-aid', href: '/directory/safety/', label: 'First aid', photoKey: 'first-aid-kit-open', fit: 'cover', hideOnPaid: false, rel: '', affiliate: false, slot: 'aid', depth: 0.03, eager: false },
    { id: 'cut-banks', href: '/directory/power/', label: 'Power banks', photoKey: 'power-banks', fit: 'cover', hideOnPaid: false, rel: '', affiliate: false, slot: 'banks', depth: 0.05, eager: false },
    { id: 'cut-flatlay', href: '/directory/outdoor/', label: 'Outdoor kits', photoKey: 'gear-flatlay', fit: 'cover', hideOnPaid: false, rel: '', affiliate: false, slot: 'flatlay', depth: 0.03, eager: false },
    { id: 'cut-solar', href: '/directory/power/', label: 'Solar', photoKey: 'solar-rooftops', fit: 'cover', hideOnPaid: false, rel: '', affiliate: false, slot: 'solar', depth: 0.02, eager: false },
    product('bluetti-apex-300', 'power-a', 0.05, true),
    product('bluetti-ac180', 'power-b', 0.04),
    product('aquasana-under-sink', 'filter-a', 0.04),
    product('waterdrop-shop', 'filter-b', 0.03),
    product('bluetti-350w-solar', 'panel', 0.03),
  ];
  return cuts.filter((c): c is HeroCutout => Boolean(c));
}

