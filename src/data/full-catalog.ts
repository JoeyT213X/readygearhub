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

export type HeroPos = {
  w: string;
  ar?: string;
  t?: string;
  l?: string;
  r?: string;
  b?: string;
  rot: number;
  z?: number;
};

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
  kind?: 'photo' | 'sticker';
  tone?: 'ink' | 'cream' | 'ember' | 'sky';
  show: 'always' | 'md' | 'lg';
  mobile?: HeroPos;
  desk: HeroPos;
};

export function heroCutoutStyle(cut: HeroCutout): string {
  const parts: string[] = [];
  const add = (pos: HeroPos, pre: 'm' | 'd') => {
    parts.push(`--${pre}w:${pos.w}`);
    if (pos.ar) parts.push(`--${pre}ar:${pos.ar}`);
    if (pos.t) parts.push(`--${pre}t:${pos.t}`);
    if (pos.l) parts.push(`--${pre}l:${pos.l}`);
    if (pos.r) parts.push(`--${pre}r:${pos.r}`);
    if (pos.b) parts.push(`--${pre}b:${pos.b}`);
    parts.push(`--${pre}rot:${pos.rot}deg`);
    if (pos.z) parts.push(`--${pre}z:${pos.z}`);
  };
  if (cut.mobile) add(cut.mobile, 'm');
  add(cut.desk, 'd');
  return parts.join(';');
}

export const HERO_STICKERS = [
  { id: 'tag-ready-life', label: 'Everything for the ready life.', tone: 'cream' as const, show: 'lg' as const, desk: { w: '15%', ar: '2.4 / 1', l: '10%', t: '19%', rot: -4, z: 4 } },
  { id: 'tag-whats-next', label: "Built for whatever's next.", tone: 'ink' as const, show: 'lg' as const, desk: { w: '14%', ar: '2.3 / 1', l: '37%', t: '37%', rot: 6, z: 4 } },
  { id: 'tag-ultimate', label: 'The ultimate gear hub.', tone: 'ember' as const, show: 'always' as const, mobile: { w: '42%', ar: '2.4 / 1', l: '52%', t: '36%', rot: 5, z: 5 }, desk: { w: '13%', ar: '2.2 / 1', l: '35%', t: '2%', rot: 5, z: 4 } },
  { id: 'tag-off-grid', label: 'Off-grid, on point.', tone: 'sky' as const, show: 'always' as const, mobile: { w: '40%', ar: '2.2 / 1', r: '2%', t: '46%', rot: -6, z: 5 }, desk: { w: '12%', ar: '2.1 / 1', l: '73%', t: '21%', rot: -7, z: 5 } },
  { id: 'tag-hq', label: 'Your all-in-one prep & gear HQ.', tone: 'cream' as const, show: 'lg' as const, desk: { w: '16%', ar: '2.5 / 1', l: '83%', t: '84%', rot: 4, z: 4 } },
  { id: 'tag-gobags', label: 'From go-bags to drones.', tone: 'ink' as const, show: 'always' as const, mobile: { w: '44%', ar: '2.3 / 1', l: '2%', t: '47%', rot: -5, z: 5 }, desk: { w: '13%', ar: '2.2 / 1', l: '72%', t: '38%', rot: 4, z: 4 } },
  { id: 'tag-stock-up', label: 'Stock up. Power up. Head out.', tone: 'ember' as const, show: 'lg' as const, desk: { w: '16%', ar: '2.4 / 1', l: '44%', t: '67%', rot: 3, z: 4 } },
  { id: 'tag-distance', label: 'Gear that goes the distance.', tone: 'sky' as const, show: 'md' as const, desk: { w: '15%', ar: '2.4 / 1', l: '67%', t: '83%', rot: -5, z: 4 } },
  { id: 'tag-zero', label: 'Zero guesswork.', tone: 'ember' as const, show: 'always' as const, mobile: { w: '38%', ar: '2.1 / 1', l: '3%', t: '8%', rot: 7, z: 5 }, desk: { w: '11%', ar: '2 / 1', l: '59%', t: '3%', rot: -6, z: 5 } },
];

export function heroCutouts(items: CatalogItem[]): HeroCutout[] {
  const byId = new Map(items.map((i) => [i.id, i]));
  const product = (
    id: string,
    slot: string,
    depth: number,
    show: HeroCutout['show'],
    desk: HeroPos,
    mobile?: HeroPos,
    eager = false,
  ): HeroCutout | null => {
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
      kind: 'photo',
      show,
      mobile,
      desk,
    };
  };

  const scene = (
    id: string,
    href: string,
    label: string,
    photoKey: string,
    depth: number,
    show: HeroCutout['show'],
    desk: HeroPos,
    mobile?: HeroPos,
    eager = false,
    extra?: Partial<HeroCutout>,
  ): HeroCutout => ({
    id,
    href,
    label,
    photoKey,
    fit: 'cover',
    hideOnPaid: extra?.hideOnPaid ?? false,
    rel: extra?.rel ?? '',
    affiliate: extra?.affiliate ?? false,
    slot: id.replace(/^cut-/, ''),
    depth,
    eager,
    kind: 'photo',
    show,
    mobile,
    desk,
  });

  const ghost = byId.get('ghost-robotics-official');
  const midland = byId.get('midland-wr400') || byId.get('midland-er310-crank-radio');
  const lantern = byId.get('goal-zero-lighthouse-600');

  const cuts: Array<HeroCutout | null> = [
    // ---- Mobile + desktop hero staples ----
    scene('cut-utv', '/directory/vehicles/', 'Off-road UTVs', 'hero-utv-dunes', 0.06, 'always',
      { w: '20%', ar: '16 / 10', l: '68%', t: '1%', rot: 5, z: 3 },
      { w: '48%', ar: '16 / 10', l: '2%', t: '3%', rot: 6, z: 3 }, true),
    scene('cut-drone', '/directory/drones/', 'Drones', 'hero-drone', 0.08, 'always',
      { w: '13%', ar: '1', l: '47%', t: '2%', rot: -7, z: 3 },
      { w: '30%', ar: '1', r: '2%', t: '2%', rot: -8, z: 3 }, true),
    product('bluetti-apex-300', 'power-a', 0.05, 'always',
      { w: '11%', ar: '1', l: '36%', t: '16%', rot: -3, z: 3 },
      { w: '30%', ar: '1', l: '42%', t: '2%', rot: -4, z: 4 }, true),
    scene('cut-bunker', '/directory/security/', 'Shelters', 'hero-bunker-hatch', 0.04, 'always',
      { w: '10%', ar: '3 / 4', l: '26%', t: '1%', rot: -10, z: 3 },
      { w: '36%', ar: '3 / 4', l: '2%', t: '22%', rot: -10, z: 3 }, true),
    scene('cut-truck', '/directory/vehicles/', 'Overland trucks', 'hero-overland-truck', 0.05, 'always',
      { w: '20%', ar: '4 / 3', l: '70%', t: '56%', rot: -4, z: 3 },
      { w: '50%', ar: '4 / 3', r: '2%', t: '20%', rot: -4, z: 3 }, true),
    scene('cut-robot', ghost ? listingHref(ghost) : '/directory/security/', 'Security robots', 'hero-security-robot', 0.06, 'always',
      { w: '14%', ar: '1', l: '58%', t: '21%', rot: 4, z: 3 },
      { w: '40%', ar: '1', l: '28%', t: '40%', rot: 5, z: 3 },
      false, { rel: ghost?.rel || 'noopener', affiliate: ghost?.affiliate || false }),

    // ---- Desktop/tablet fill (and some mid-size) ----
    scene('cut-radios', midland ? listingHref(midland) : '/directory/tech/', 'Radios', 'hero-radios', 0.05, 'md',
      { w: '14%', ar: '16 / 9', l: '0.5%', t: '1.5%', rot: -8, z: 3 },
      undefined, false, { hideOnPaid: midland ? midland.hideOnPaid : false, rel: midland?.rel || '', affiliate: midland?.affiliate || false }),
    scene('cut-cruiser', '/directory/vehicles/', 'Overland SUVs', 'hero-overland-cruiser', 0.07, 'lg',
      { w: '16%', ar: '16 / 10', l: '12%', t: '0.5%', rot: 6, z: 3 }),
    scene('cut-lantern', lantern ? listingHref(lantern) : '/directory/outdoor/', 'Lanterns', 'lantern-dusk', 0.05, 'md',
      { w: '10%', ar: '1', l: '0.5%', t: '18%', rot: 9, z: 3 },
      undefined, false, { hideOnPaid: lantern ? lantern.hideOnPaid : false, rel: lantern?.rel || '', affiliate: lantern?.affiliate || false }),
    scene('cut-solar', '/directory/power/', 'Solar', 'solar-rooftops', 0.02, 'md',
      { w: '12%', ar: '16 / 10', l: '87%', t: '0.5%', rot: 3, z: 3 }),
    scene('cut-banks', '/directory/power/', 'Power banks', 'power-banks', 0.05, 'lg',
      { w: '9%', ar: '1', l: '48%', t: '18%', rot: 11, z: 3 }),
    scene('cut-generator', '/directory/power/', 'Generators', 'portable-generator', 0.04, 'md',
      { w: '14%', ar: '4 / 3', l: '84%', t: '17%', rot: 3, z: 3 }),
    scene('cut-food', '/directory/food/', 'Food kits', 'hero-pantry-cans', 0.04, 'md',
      { w: '11%', ar: '1', l: '1%', t: '28%', rot: 8, z: 3 }),
    scene('cut-water', '/directory/water/', 'Water stores', 'water-bottles', 0.03, 'md',
      { w: '12%', ar: '1', l: '56%', t: '62%', rot: -6, z: 3 }),
    scene('cut-flatlay', '/directory/outdoor/', 'Outdoor kits', 'gear-flatlay', 0.03, 'lg',
      { w: '11%', ar: '1', l: '86%', t: '35%', rot: -5, z: 3 }),
    scene('cut-aid', '/directory/safety/', 'First aid', 'first-aid-kit-open', 0.03, 'lg',
      { w: '10%', ar: '1', l: '43%', t: '88%', rot: -9, z: 3 }),
    scene('cut-snowy', '/guides/winter-power-outage-checklist/', 'Winter prep', 'hero-snowy-home', 0.03, 'lg',
      { w: '10%', ar: '16 / 10', l: '23%', t: '22%', rot: 7, z: 2 }),
    scene('cut-tools', '/directory/outdoor/', 'Tools', 'multitools', 0.03, 'lg',
      { w: '9%', ar: '1', l: '22%', t: '32%', rot: -9, z: 2 }),
    scene('cut-car', '/directory/vehicles/', 'Vehicle kits', 'car-in-snow', 0.03, 'lg',
      { w: '11%', ar: '16 / 10', l: '31%', t: '29%', rot: 5, z: 2 }),
    scene('cut-candle', '/directory/power/', 'Lighting', 'outage-candle', 0.03, 'lg',
      { w: '8%', ar: '1', l: '12%', t: '31%', rot: 8, z: 2 }),
    scene('cut-storm', '/alerts/', 'Live alerts', 'lightning-road', 0.02, 'lg',
      { w: '10%', ar: '16 / 10', l: '63%', t: '51%', rot: 3, z: 2 }),
    scene('cut-hearth', '/directory/home/', 'Home backup', 'fireplace-living-room', 0.02, 'lg',
      { w: '10%', ar: '16 / 10', l: '88%', t: '68%', rot: 6, z: 2 }),
    scene('cut-cook', '/directory/food/', 'Cooking', 'cast-iron-fire', 0.02, 'lg',
      { w: '9%', ar: '1', l: '78%', t: '71%', rot: -7, z: 2 }),
    scene('cut-socks', '/directory/outdoor/', 'Cold-weather gear', 'wool-socks-snow', 0.02, 'lg',
      { w: '8%', ar: '1', l: '48%', t: '86%', rot: 8, z: 2 }),
    scene('cut-checklist', '/guides/', 'Guides', 'checklist-writing', 0.02, 'lg',
      { w: '9%', ar: '16 / 10', l: '58%', t: '86%', rot: -3, z: 2 }),

    product('bluetti-ac180', 'power-b', 0.04, 'md', { w: '10%', ar: '1', l: '50%', t: '36%', rot: 5, z: 3 }),
    product('bluetti-350w-solar', 'panel', 0.03, 'lg', { w: '10%', ar: '1', l: '61%', t: '39%', rot: -8, z: 3 }),
    product('aquasana-under-sink', 'filter-a', 0.04, 'md', { w: '10%', ar: '1', l: '39%', t: '58%', rot: -2, z: 3 }),
    product('waterdrop-shop', 'filter-b', 0.03, 'lg', { w: '9%', ar: '1', l: '58%', t: '78%', rot: 5, z: 3 }),
    product('bluetti-premium-200-v2', 'power-c', 0.03, 'lg', { w: '9%', ar: '1', l: '52%', t: '51%', rot: 4, z: 3 }),
    product('bluetti-ac50b', 'power-d', 0.03, 'lg', { w: '9%', ar: '1', l: '80%', t: '49%', rot: -6, z: 3 }),
    product('aquasana-whole-house', 'filter-c', 0.03, 'lg', { w: '9%', ar: '1', l: '52%', t: '73%', rot: 2, z: 3 }),
    product('bluetti-ac180p', 'power-e', 0.03, 'md', { w: '9%', ar: '1', l: '40%', t: '48%', rot: -4, z: 3 }),
    product('bluetti-sora-60', 'power-f', 0.02, 'lg', { w: '8%', ar: '1', l: '89%', t: '54%', rot: 7, z: 2 }),
    product('aquasana-shower-chrome', 'filter-d', 0.02, 'lg', { w: '8%', ar: '1', l: '48%', t: '64%', rot: 6, z: 2 }),
    product('bluetti-elite-30-mini', 'power-g', 0.02, 'lg', { w: '8%', ar: '1', l: '85%', t: '78%', rot: -4, z: 2 }),

    // ---- Sticker lines among the photos ----
    ...HERO_STICKERS.map((s) => ({
      id: s.id,
      href: '/directory/',
      label: s.label,
      fit: 'cover' as const,
      hideOnPaid: false,
      rel: '',
      affiliate: false,
      slot: s.id,
      depth: 0.04,
      kind: 'sticker' as const,
      tone: s.tone,
      show: s.show,
      mobile: s.mobile,
      desk: s.desk,
    })),
  ];
  return cuts.filter((c): c is HeroCutout => Boolean(c));
}
