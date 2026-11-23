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
import { stockCoverFor } from './stock-covers';
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

const TOOLS_GEAR_IDS = new Set([
  'leatherman-wave-plus', 'leatherman-signal', 'leatherman-rebar', 'leatherman-wingman', 'leatherman-skeletool-cx', 'leatherman-raptor-rescue', 'leatherman-arc', 'leatherman-micra',
  'leatherman-surge', 'leatherman-free-p4', 'leatherman-bond', 'leatherman-super-tool-300', 'leatherman-crunch',
  'gerber-multi-plier-600-basic', 'snow-joe-shovelution-18',
  'nitecore-edc29', 'nitecore-edc37', 'nitecore-hc65-uhe',
]);
const AUDIO_GEAR_IDS = new Set([
  'eton-elite-executive-radio', 'eton-elite-traveler-radio', 'eton-elite-field-radio', 'eton-red-cross-journey-radio', 'midland-t71vp3-xtalker',
  'midland-gxt1000x3vp4', 'midland-gxt67-pro', 'midland-mxt115p', 'midland-cliptalk', 'midland-er310pro',
  'cobra-75-allroad', 'cobra-29lx', 'cobra-29ltd', 'cobra-25ltd', 'btech-uv-5x3',
]);
const FUN_GEAR_IDS = new Set([
  'midland-t71vp3-xtalker', 'midland-gxt1000x3vp4', 'midland-gxt67-pro', 'midland-cliptalk',
]);
const VEHICLES_GEAR_IDS = new Set([
  'midland-mxt115p', 'cobra-75-allroad', 'cobra-29lx', 'cobra-29ltd',
]);

function extraDirectoryTabs(item: GearInput): string[] {
  const extra: string[] = [];
  if (item.data.lane === 'vehicle-emergency-kits' || item.data.alsoIn.includes('vehicle-emergency-kits')) extra.push('auto');
  if (TOOLS_GEAR_IDS.has(item.id)) extra.push('tools');
  if (AUDIO_GEAR_IDS.has(item.id)) extra.push('audio');
  if (FUN_GEAR_IDS.has(item.id)) extra.push('fun');
  if (VEHICLES_GEAR_IDS.has(item.id)) extra.push('vehicles');
  return extra;
}

function fromGear(item: GearInput): CatalogItem {
  const out = resolveItemOutbound(item.id, item.data.officialUrl, item.data.affiliateUrl);
  const programId = out.programId || '';
  const gearCat = categoryForItem(item.id);
  const group = catToGroup(gearCat);
  const detailHref = `/gear/${item.id}/`;
  const alsoIn = [...new Set([...(seoAlsoIn(group, gearCat) ?? []), ...extraDirectoryTabs(item)])];
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
      alsoIn: [...new Set([...(seoAlsoIn(group, e.category) ?? []), ...((e as { alsoIn?: string[] }).alsoIn ?? [])])],
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

/**
 * Portable power stations (BLUETTI Apex/AC180/Elite, Jackery, EcoFlow, etc.)
 * must not be featured on the home page. Solar panels and PV kits are allowed.
 * See docs/home-design-notes.md.
 */
export function isPortablePowerStation(item: { id?: string; title?: string; image?: string; label?: string }): boolean {
  const id = (item.id || '').toLowerCase();
  const title = (item.title || item.label || '').toLowerCase();
  const image = (item.image || '').toLowerCase();
  const hay = `${id} ${title} ${image}`;
  const isSolar =
    /\b(solar|solarsaga|nomad|renogy|pv\b|sp200|sp100|sp120|350w-solar|solar-kit|solar-panel)\b/.test(hay) ||
    /panel/.test(id);
  if (isSolar && !/power[\s-]?station/.test(title)) return false;
  if (/power[\s-]?station/.test(title) || /power[\s-]?station/.test(id)) return true;
  if (/\b(jackery|ecoflow|anker-solix|goal-zero-yeti)\b/.test(hay)) return true;
  if (/bluetti/.test(hay) && !isSolar) return true;
  return false;
}

/** Home shop section: prefer cards with real photos, then trending text cards. Cap per brand so one filter line does not fill the grid. */
/** Keep these off the home shop grid so new partner products do not reshuffle the 16-card layout. They stay in the directory and on gear pages. */
const HOME_SHOP_EXCLUDED_IDS = new Set([
  'anker-solix',
  'anker-solix-ps400',
  'anker-solix-ps100',
  'anker-solix-c2000-gen2-400w-kit',
  'anker-solix-f3800-plus',
  'litime',
  'litime-12v-100ah-group24',
  'litime-24v-230ah',
  'litime-12v-100ah-trolling',
  'litime-diy-solar-generator-kit',
]);

export function homeShopPicks(items: CatalogItem[], limit = 16): CatalogItem[] {
  const eligible = items.filter((i) => {
    if (isPortablePowerStation(i) || HOME_SHOP_EXCLUDED_IDS.has(i.id)) return false;
    // Keep power-station style stock photos off the home page.
    const k = stockCoverFor(i)?.key;
    return k !== 'stock-power-station' && k !== 'stock-battery-bank';
  });
  const photoTrending = eligible.filter((i) => i.trending && hasProductPhoto(i));
  const photoRest = eligible.filter((i) => !i.trending && hasProductPhoto(i));
  const textTrending = eligible.filter((i) => i.trending && !hasProductPhoto(i));
  const rest = eligible.filter((i) => !i.trending && !hasProductPhoto(i));
  const picked: CatalogItem[] = [];
  const seen = new Set<string>();
  const brandCounts = new Map<string, number>();
  const brandKey = (item: CatalogItem) => (item.sourceName || item.title.split(/\s+/)[0] || item.id).toLowerCase();
  const tryAdd = (item: CatalogItem, maxPerBrand: number) => {
    if (seen.has(item.id)) return false;
    const key = brandKey(item);
    if ((brandCounts.get(key) || 0) >= maxPerBrand) return false;
    seen.add(item.id);
    brandCounts.set(key, (brandCounts.get(key) || 0) + 1);
    picked.push(item);
    return true;
  };
  const ranked = [...photoTrending, ...photoRest, ...textTrending, ...rest];
  for (const item of ranked) {
    tryAdd(item, 2);
    if (picked.length >= limit) break;
  }
  if (picked.length < limit) {
    for (const item of ranked) {
      tryAdd(item, 99);
      if (picked.length >= limit) break;
    }
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
  variant?: 'photo' | 'count';
};

/** Prefer an on-site listing page when we have one; otherwise the partner or official link. */
function listingHref(item: CatalogItem): string {
  return item.detailHref || item.href;
}

/** Official product shots allowed on the home Explore board. Water filters stay in the directory only. */
const SHOP_BOARD_PRODUCT_IDS = [
  'bluetti-350w-solar',
];

function isHomeBoardWaterFilter(item: { id?: string; title?: string }): boolean {
  const hay = `${item.id || ''} ${item.title || ''}`.toLowerCase();
  return /\b(aquasana|waterdrop|healthshield)\b/.test(hay);
}

function sceneTile(
  id: string,
  label: string,
  href: string,
  photoKey: string,
  extra: Partial<ShopBoardTile> = {},
): ShopBoardTile {
  return {
    id,
    label,
    href,
    image: '',
    photoKey,
    fit: 'cover',
    hideOnPaid: false,
    rel: '',
    affiliate: false,
    ...extra,
  };
}

/** Home Explore board count: exact catalog size, rounded down to the nearest 50. 419 → "400+", 450–499 → "450+", 500 → "500+". */
export function shopBoardCountLabel(count: number): string {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  const rounded = Math.floor(n / 50) * 50;
  return rounded > 0 ? `${rounded}+` : String(n);
}

export function shopBoardTiles(items: CatalogItem[]): ShopBoardTile[] {
  const byId = new Map(items.map((i) => [i.id, i]));
  const tiles: ShopBoardTile[] = [];
  const usedHrefs = new Set<string>();

  const push = (tile: ShopBoardTile) => {
    if (!tile.href || usedHrefs.has(tile.href)) return;
    usedHrefs.add(tile.href);
    tiles.push(tile);
  };

  const pushProduct = (item: CatalogItem) => {
    if (isPortablePowerStation(item)) return;
    if (isHomeBoardWaterFilter(item)) return;
    if (!item.image) return;
    push({
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

  const lantern = byId.get('goal-zero-lighthouse-600');
  const lanternHref = lantern ? listingHref(lantern) : '';

  const scenes: ShopBoardTile[] = [
    sceneTile('scene-power', 'Power', '/directory/power/', 'solar-rooftops'),
    sceneTile('scene-drone', 'Drones', '/directory/drones/', 'hero-drone'),
    sceneTile('scene-utv', 'Off-road vehicles', '/directory/vehicles/', 'hero-utv-dunes'),
    sceneTile('scene-bunker', 'Shelters', '/directory/security/', 'hero-bunker-hatch'),
    sceneTile(
      'scene-radios-tents-water',
      'Radios, tents & water',
      '/directory/?cats=tech,outdoor,water#listings',
      'hero-radios',
    ),
    sceneTile('scene-food', 'Food & pantry', '/directory/food/', 'prep-food-storage'),
    sceneTile('scene-outdoor', 'Outdoor', '/directory/outdoor/', 'hero-tent-stars'),
    sceneTile('scene-aid', 'First aid', '/directory/safety/', 'first-aid-kit-open'),
  ];

  if (lantern && lanternHref && lanternHref !== '/directory/outdoor/' && !isPortablePowerStation(lantern)) {
    scenes.push(
      sceneTile('scene-lantern', 'Lanterns', lanternHref, 'lantern-dusk', {
        hideOnPaid: lantern.hideOnPaid,
        rel: lantern.rel || '',
        affiliate: lantern.affiliate || false,
      }),
    );
  }

  for (const scene of scenes) push(scene);

  // Destinations from the former home collage cards, folded into this grid and deduped by href.
  const hubTiles: ShopBoardTile[] = [
    sceneTile('hub-guides', 'Guides', '/guides/', 'checklist-writing'),
    sceneTile('hub-tools', 'Free tools', '/tools/', 'multitools'),
    sceneTile('hub-downloads', 'Our Downloads', '/shop/', 'gear-flatlay'),
    sceneTile('hub-local', 'Local & county', '/local/', 'lightning-road'),
  ];
  for (const tile of hubTiles) push(tile);

  return tiles;
}

export type HeroBentoId =
  | 'winter'
  | 'water'
  | 'food'
  | 'vehicle'
  | 'camping'
  | 'first-aid'
  | 'radios'
  | 'drones'
  | 'overland'
  | 'security'
  | 'prepper'
  | 'alerts';

export type HeroBentoTile = {
  id: HeroBentoId;
  href: string;
  label: string;
  photoKey: string;
  eager?: boolean;
};

/** Specialty-category tiles for the home hero bento. One tile per lane we specialize in. */
export function heroBentoTiles(): HeroBentoTile[] {
  return [
    { id: 'winter', href: '/guides/winter-storm-power-outage-prep-guide-south/', label: 'Winter storm & outages', photoKey: 'winter-storm-street', eager: true },
    { id: 'water', href: '/directory/water/', label: 'Water storage & filters', photoKey: 'hero-water-pour', eager: true },
    { id: 'food', href: '/directory/food/', label: 'Food & prepper supplies', photoKey: 'hero-food-and-gear', eager: true },
    { id: 'vehicle', href: '/vehicle-emergency-kits/', label: 'Vehicle emergency kits', photoKey: 'car-in-snow' },
    { id: 'camping', href: '/directory/outdoor/', label: 'Off-grid & camping', photoKey: 'hero-tent-stars', eager: true },
    { id: 'first-aid', href: '/first-aid-medical-prep/', label: 'First aid & safety', photoKey: 'hero-first-aid-crisp' },
    { id: 'radios', href: '/directory/tech/', label: 'Radios, lights & comms', photoKey: 'hero-radios' },
    { id: 'drones', href: '/directory/drones/', label: 'Drones', photoKey: 'hero-drones-air', eager: true },
    { id: 'overland', href: '/directory/vehicles/', label: 'Overland & off-road', photoKey: 'hero-offroad-close', eager: true },
    { id: 'security', href: '/directory/security/', label: 'Security', photoKey: 'hero-security-mix' },
    { id: 'prepper', href: '/prepper-picks/', label: "Prepper's Picks", photoKey: 'hero-prepper-collage' },
    { id: 'alerts', href: '/alerts/', label: 'Live alerts', photoKey: 'lightning-road' },
  ];
}
