/**
 * Unified Full Source Directory catalog: partner shop cards, /gear/
 * listings, brand/service/resource entries, Payhip downloads, and free
 * tools and apps. Links and images are reused exactly as each source
 * already resolves them. No invented tracking URLs or prices.
 */
import { isNoPpcProgram, resolveItemOutbound, resolveOutbound, programs } from './affiliates';
import { compareByQualityAndPayout } from './catalog-rank';
import { entries, resolveEntry, categoryForItem, type CategoryId } from './directory';
import { CALCULATORS, OFFLINE_APPS } from '../lib/app-config';
import { catalogExtraById, type CatalogExtra } from './catalog-extras';
import { newPrepperOnlyPicks, prepperPickToCatalogItem } from './prepper-picks';
import { doomsdayCrossList, doomsdayUsCrossIds } from './doomsday-prepper';
import { highTicketCatalogItems } from './high-ticket';
import { amazonCatalogItems } from './amazon-picks';
import { stockCoverFor } from './stock-covers';
import { sourceCategories } from './source-directory';
import { backupPowerCatalogItems, BACKUP_POWER_ALSO_IN } from './backup-power';

const DIRECTORY_PAGE_SLUGS = new Set(sourceCategories.map((c) => c.slug));
import { isStoreFront } from './listing-actions';
import { productPhotoFor } from './product-photos';
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
  /** Directional CTA kind. SourceCard maps this; do not put a seller name in the button. */
  ctaKind?: 'listing' | 'inquire' | 'discount' | 'details';
  /** Optional override of the program coupon shown next to a discount CTA. */
  couponCode?: string;
  trending?: boolean;
  trendingRank?: number;
  groups: SourceGroupId[];
  kind: CatalogKind;
  origin: 'source-directory' | 'gear' | 'directory' | 'tools' | 'apps' | 'payhip' | 'prepper';
  /** Low-key filler cards: always last (not featured, not on the home page). */
  filler?: boolean;
  /** Official showpiece with no paying program: keep visible, sort just above fillers. */
  showpiece?: boolean;
  /** Subsection on a category page that is split into named groups (Backup Power & Propane). */
  section?: string;
  /** The link opens a store or brand front page (or a whole collection), not one product page. The button says so. */
  storeLevel?: boolean;
  /** Small U.S. chip on the card (U.S.-based maker). */
  usBadge?: boolean;
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
  'anker-solix-f3800',
]);

const GEAR_ALIAS: Record<string, string> = {
  'bluetti-200w-solar-panel': 'bluetti-sp200l',
};


function seoAlsoIn(group: SourceGroupId, originCat: string): string[] | undefined {
  const extra: string[] = [];
  if (group === 'safety-prep' && originCat !== 'safety') extra.push('safety');
  if (group === 'home-water') {
    if (originCat === 'home-protection' || originCat === 'insurance') extra.push('home');
    else if (originCat !== 'water' && originCat !== 'home') extra.push('home', 'water');
  }
  if (group === 'power-tech' && originCat !== 'power' && originCat !== 'tech' && originCat !== 'backup-power') extra.push('tech');
  if (group === 'outdoor-auto' && originCat !== 'outdoor') extra.push('outdoor');
  return extra.length ? extra : undefined;
}

function catToGroup(cat: CategoryId): SourceGroupId {
  switch (cat) {
    case 'power':
    case 'tech':
    case 'audio':
    case 'drones':
    case 'backup-power':
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
    storeLevel: item.linkLevel === 'merchant' || undefined,
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
      storeLevel: (!isResource && isStoreFront(e.url)) || undefined,
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
  return [...items].sort(compareByQualityAndPayout);
}


/**
 * Cards removed from the directory (Nov 27, 2026 weak-points pass), with the reason.
 * rejected = the program declined us; duplicate = another card already covers the same product or page;
 * no-profit-path = no affiliate, referral or lead program exists or is likely (enterprise or dealer-only).
 * Remove an id here to bring a card back.
 */
export const REMOVED_CARDS: Record<string, 'rejected' | 'duplicate' | 'no-profit-path'> = {
  // Rejected programs
  'byrna-banshee-alarm': 'rejected', 'byrna-clxl-launcher': 'rejected', 'byrna-compact-launcher': 'rejected', 'byrna-duo': 'rejected',
  'byrna-le-launcher': 'rejected', 'byrna-mission-4-kit': 'rejected', 'byrna-sd-launcher': 'rejected', 'byrna-tcr': 'rejected',
  'survival-frog': 'rejected', 'survival-frog-beef-canned-meat': 'rejected',
  // Duplicates (the kept card is cross-listed with alsoIn)
  'ring': 'duplicate', // kept: ring-official
  '1password': 'duplicate', // kept: 1password-password-manager
  'aquasana-under-sink': 'duplicate', // covered by the Claryum under-sink cards
  'aquasana-whole-house': 'duplicate', // covered by the HealthShield whole-house and salt-free conditioner cards
  'ri-fx-aegis-ultra': 'duplicate', // kept: ri-fx-aegis-ultra-plus
  'ri-fx-aegis-ultra-w-wheel-legged-robot-dog': 'duplicate', // kept: ri-fx-aegis-ultra-w-plus
  'can-am-official': 'duplicate', // kept: can-am-off-road
  // No realistic path to paying (mass-market car makers and enterprise-only robots or drones; no consumer affiliate program)
  'jeep-gladiator': 'no-profit-path', 'jeep-wrangler': 'no-profit-path',
  'toyota-4runner': 'no-profit-path', 'toyota-tacoma': 'no-profit-path',
  'toyota-rav4-2027': 'no-profit-path', 'toyota-tundra-2027': 'no-profit-path',
  'ghost-robotics-official': 'no-profit-path',
  'skydio-x10': 'no-profit-path',
};

/** Official showpiece cards kept after the Nov 27 cleanup, sorted to the bottom of their sections (not the robot-dog filler block). */
export const SHOWPIECE_IDS = new Set([
  'land-rover-defender',
  'toyota-land-cruiser',
  'rivian-r1s',
  'rivian-r1t',
  'boston-dynamics-official',
  'knightscope-official',
]);

/** Extra cross-listing for the card kept after a duplicate was removed. */
const KEPT_ALSO_IN: Record<string, string[]> = {
  'ring-official': ['home-protection'],
  '1password-password-manager': ['digital-safety'],
};

/**
 * The old 'More' catch-all is retired: every card gets a real home. Cooking and heating go to Home & Kitchen,
 * vehicle gear to Auto, multi-tools and hardware to Tools, camping and cold-weather gear and outdoor retailers to Outdoor.
 */
const MORE_REHOME: Record<string, { category: string; alsoIn?: string[] }> = {
  'coleman': { category: 'outdoor' },
  'coleman-classic-propane-stove-2-burner': { category: 'home', alsoIn: ['outdoor'] },
  'lodge-classic-cast-iron-skillet': { category: 'home', alsoIn: ['outdoor'] },
  'mr-heater-buddy-flex-cooker': { category: 'home', alsoIn: ['outdoor'] },
  'ecoflow-glacier-classic': { category: 'power', alsoIn: ['outdoor'] },
  'mr-heater-portable-buddy': { category: 'home', alsoIn: ['outdoor', 'safety'] },
  'mr-heater-buddy-flex': { category: 'home', alsoIn: ['outdoor'] },
  'vornado-avh10': { category: 'home' },
  '3m-indoor-window-insulator-kit': { category: 'home' },
  'hothands-hand-warmers': { category: 'outdoor' },
  'zippo-heatbank-9s': { category: 'outdoor' },
  'darn-tough-hiker-boot-full-cushion': { category: 'outdoor' },
  'kahtoola-microspikes': { category: 'outdoor' },
  'yaktrax-pro': { category: 'outdoor' },
  'sol-emergency-bivvy': { category: 'outdoor', alsoIn: ['safety'] },
  'sol-emergency-blanket': { category: 'outdoor', alsoIn: ['safety'] },
  'teton-sports-celsius-regular-0': { category: 'outdoor' },
  'therm-a-rest-z-lite-sol': { category: 'outdoor' },
  'uco-stormproof-match-kit': { category: 'outdoor' },
  'eton-roadguard-jump-starter': { category: 'auto', alsoIn: ['power'] },
  'noco-boost-gb40': { category: 'auto', alsoIn: ['power'] },
  'snow-joe-telescoping-snow-broom': { category: 'auto' },
  'snow-joe-shovelution-18': { category: 'tools' },
  'gerber-multi-plier-600-basic': { category: 'tools' },
  'yeti': { category: 'outdoor' },
  'carhartt': { category: 'outdoor' },
  'hunter-boots': { category: 'outdoor' },
  'magid': { category: 'tools' },
  'mro-supreme': { category: 'tools' },
  'home-depot': { category: 'tools' },
  'ace-hardware': { category: 'tools' },
  'bass-pro': { category: 'outdoor' },
  'cabelas': { category: 'outdoor' },
  'academy': { category: 'outdoor' },
  'sportsmans': { category: 'outdoor' },
  'sportsmans-guide': { category: 'outdoor' },
  'dicks': { category: 'outdoor' },
  'walmart': { category: 'home' },
  'amazon': { category: 'home' },
};

function rehome(item: CatalogItem): CatalogItem {
  const extra = KEPT_ALSO_IN[item.id];
  if (extra) item = { ...item, alsoIn: [...new Set([...(item.alsoIn ?? []), ...extra])] };
  if (SHOWPIECE_IDS.has(item.id)) item = { ...item, showpiece: true };
  const bp = BACKUP_POWER_ALSO_IN[item.id];
  if (bp) {
    const alsoIn = [...new Set([...(item.alsoIn ?? []), 'backup-power'])].filter((c) => c !== item.category);
    item = { ...item, alsoIn, section: item.section ?? bp };
  }
  if (item.category !== 'more') return item;
  const r = MORE_REHOME[item.id] ?? { category: /^leatherman-/.test(item.id) ? 'tools' : 'outdoor' };
  const alsoIn = [...new Set([...(item.alsoIn ?? []), ...(r.alsoIn ?? [])])].filter((c) => c !== r.category && c !== 'more');
  return { ...item, category: r.category, alsoIn };
}

/** Gear listing id -> ASIN for listings that carry a verified Amazon link (amazon program retailerUrls). */
function gearAsins(): Map<string, string> {
  const m = new Map<string, string>();
  const amz = programs.find((p) => p.id === 'amazon');
  for (const [id, url] of Object.entries(amz?.retailerUrls ?? {})) {
    const a = url.match(/\/dp\/([A-Z0-9]{10})/);
    if (a) m.set(id, a[1]);
  }
  return m;
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

  for (const item of backupPowerCatalogItems()) {
    if (used.has(item.id)) {
      const idx = items.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const cur = items[idx];
        const alsoIn = [...new Set([...(item.alsoIn ?? []), ...(cur.alsoIn ?? []), cur.category])].filter((c) => c && c !== item.category);
        items[idx] = { ...item, detailHref: cur.detailHref ?? item.detailHref, alsoIn };
      }
      continue;
    }
    items.push(applyExtra(item, catalogExtraById[item.id]));
    used.add(item.id);
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

  // Amazon picks come last: any product already linked through another partner keeps its partner card.
  // A pick whose ASIN is already on a gear listing (its Amazon twin) folds into that listing: one card per product.
  const twinOf = new Map<string, string>();
  for (const [gearId, asin] of gearAsins()) if (used.has(gearId)) twinOf.set(`amz-${asin.toLowerCase()}`, gearId);
  for (const item of amazonCatalogItems()) {
    if (used.has(item.id)) continue;
    const twin = twinOf.get(item.id);
    if (twin) {
      const idx = items.findIndex((i) => i.id === twin);
      if (idx >= 0) {
        const g = items[idx];
        const extra = [item.category, ...(item.alsoIn ?? [])].filter((c) => c !== g.category);
        items[idx] = { ...g, alsoIn: [...new Set([...(g.alsoIn ?? []), ...extra])], image: g.image ?? item.image, imageKind: g.image ? g.imageKind : item.imageKind };
      }
      used.add(item.id);
      continue;
    }
    items.push(applyExtra(item, catalogExtraById[item.id]));
    used.add(item.id);
  }

  return sortFullCatalog(applyDoomsdayCrossList(items.filter((i) => !REMOVED_CARDS[i.id]).map(rehome)));
}

/**
 * Cross-list: tag existing items with the Doomsday Prepper category via `alsoIn`. Never changes `category`,
 * never removes an item, so every other category keeps its full count.
 */
function applyDoomsdayCrossList(items: CatalogItem[]): CatalogItem[] {
  const ids = new Set<string>();
  for (const list of Object.values(doomsdayCrossList)) for (const id of list) ids.add(id);
  return items.map((item) => {
    if (item.category === 'doomsday-prepper') return item;
    if (!ids.has(item.id)) return item;
    return {
      ...item,
      alsoIn: [...new Set([...(item.alsoIn ?? []), 'doomsday-prepper'])],
      usBadge: item.usBadge || doomsdayUsCrossIds.has(item.id) || undefined,
    };
  });
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
 * Energy reserves (BLUETTI Apex/AC180/Elite, Jackery, EcoFlow, etc.)
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
  if (isSolar && !/(?:power[\s-]?station|energy[\s-]?reserve)/.test(title)) return false;
  if (/(?:power[\s-]?station|energy[\s-]?reserve)/.test(title) || /(?:power[\s-]?station|energy[\s-]?reserve)/.test(id)) return true;
  if (/\b(jackery|ecoflow|anker-solix|goal-zero-yeti)\b/.test(hay)) return true;
  if (/bluetti/.test(hay) && !isSolar) return true;
  return false;
}

/** Home shop section: prefer cards with real photos, then trending text cards. Cap per brand so one filter line does not fill the grid. */
/** Keep these off the home shop grid so new partner products do not reshuffle the 16-card layout. They stay in the directory and on gear pages. */
const HOME_SHOP_EXCLUDED_IDS = new Set([
  'anker-solix',
  'anker-solix-f3800-plus',
  'litime',
  'litime-12v-100ah-group24',
  'litime-24v-230ah',
  'litime-12v-100ah-trolling',
  'litime-diy-solar-generator-kit',
  'wuben-official',
  'wuben-a1',
  'wuben-lightok-x1',
  'wuben-a22',
  'wuben-h1',
  'wuben-e7',
  'wuben-lightok-x2',
  'wuben-c2',
  'anker-solix-c1000x-gen2',
  'anker-solix-c2000-gen2',
  'anker-solix-bp2000-gen2',
  'anker-solix-c300-dc-60w-kit',
  'litime-12v-50ah',
  'litime-12v-200ah-bluetooth',
  'litime-1000w-12v-inverter',
  'litime-2000w-12v-inverter-ats',
  'litime-30a-mppt',
  'litime-12v-10a-charger',
  'litime-12v-40a-dc-dc',
  'wuben-c3',
  'wuben-e12r',
  'wuben-f5',
  'wuben-g5',
  'wuben-x1-pro',
  'wuben-x2-pro',
  'wuben-h4',
  'wuben-lightok-x0',
  'ispring-home',
  'ispring-rcc7',
  'ispring-rcc7ak',
  'ispring-ro500',
  'ispring-rcd100',
  'ispring-wgb21b',
  'ispring-wgb32b',
  'ispring-sf2s',
  'ispring-df1',
  'ispring',
  'redi-the-roadie',
  'redi-roadie-plus',
  'redi-roadie-pro',
  'redi-trauma-pack',
  'berkey-big-berkey',
  'berkey-travel-berkey',
  'aquatru-carafe',
  'clearly-filtered-pitcher',
  'jackery-explorer-2000-v2',
  'ecoflow-delta-2-max',
  'goal-zero-yeti-500',
  'goal-zero-yeti-700',
  'instant-pot-duo-6qt',
  'instant-pot-vortex-plus-6qt',
  'instant-pot-duo-plus-6qt',
  'owala-freesip-24',
  'hydro-flask-32-wide',
  'hydro-flask-40-wide',
  'yeti-rambler-16-travel',
  'peak-refuel-homestyle-chicken-rice',
  'peak-refuel-biscuits-sausage-gravy',
  'peak-refuel-entree-essentials-bucket-2',
  'mountain-house-best-sellers-kit',
  'sony-wh-1000xm6',
  'apple-airpods-pro-3',
  'apple-airpods-5',
  'apple-airpods-max-2',
  '1password-password-manager',
  'apple-airtag',
  'milwaukee-2904-20',
  'milwaukee-2853-20',
  'milwaukee-2960-20',
  'noco-gb70',
  'noco-boost-air',
  'garmin-dash-cam-mini-3',
  'noco-air20',
  'catan-base-game',
  'wingspan-board-game',
  'nintendo-switch-2',
  'mario-kart-world',
  'skydio-x10',
  'rivian-r1s',
  'rivian-r1t',
  'ring-battery-doorbell-4k-pro',
  'eufy-solocam-s340',
  'google-nest-cam-indoor-wired-3rd-gen',
  'reolink-trackmix-wifi',
  'harvest-right-countertop-360',
  'milwaukee-2719-20',
  'toyota-rav4-2027',
  'toyota-tundra-2027',
  'epic-pure-xp-pitcher',
  'epic-nano-xp-pitcher',
  'epic-smart-shield',
  'epic-smart-shield-max',
  'epic-og-ultimate-travel-bottle',
  'tidewe-inferno-heated-jacket',
  'tidewe-silentrace-heated-jacket',
  'tidewe-thermcore-heated-vest',
  'tidewe-thermshift-heated-vest',
  'tidewe-torridseeker-heated-waders',
  'tidewe-aquawade-pro-waders',
  'bogs-bozeman-ii-tall',
  'bogs-bozeman-ii-vibram-arctic-grip',
  'bogs-arcata-ii-lace',
  'bogs-arcata-ii-plaid',
  'bogs-arcata-urban-ii-leather',
  'bogs-arcata-ii-dash-kids',
  'bogs-snow-shell-cosmic-forest',
]);

export function homeShopPicks(items: CatalogItem[], limit = 16): CatalogItem[] {
  const eligible = items.filter((i) => {
    if (isPortablePowerStation(i) || HOME_SHOP_EXCLUDED_IDS.has(i.id) || i.category === 'drones-robotics' || i.showpiece) return false;
    // Keep energy-reserve style stock photos off the home page.
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

const HEADING_PRODUCT_LIMIT = 24;
const HEADING_MAX_PER_BRAND = 2;
const HEADING_MAX_PER_CATEGORY = 3;

/** On-site product card or gear page, never a raw seller URL. */
export function headingProductHref(item: CatalogItem): string {
  if (item.detailHref && item.detailHref.startsWith('/')) return item.detailHref;
  // Some legacy categories (insurance, digital-safety, more, ...) have no page of their own; the full directory lists every card.
  if (!DIRECTORY_PAGE_SLUGS.has(String(item.category))) return `/directory/#${item.id}`;
  return `/directory/${item.category}/#${item.id}`;
}

export function shortProductName(title: string): string {
  const cleaned = title.replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
  let out = cleaned;
  if (out.length > 36) {
    const cut = out.slice(0, 36);
    const sp = cut.lastIndexOf(' ');
    out = (sp > 18 ? cut.slice(0, sp) : cut).trim();
  }
  return out.replace(/-/g, '\u2011');
}

/**
 * Products for the desktop heading-row preview windows: official self-hosted
 * photos only, no portable energy reserves, no robot-dog fillers, and the
 * Drones & Robotics category stays off the home page. Brand and category
 * caps keep the rotation mixed across the catalog.
 */
function isHeadingPowerGear(item: CatalogItem): boolean {
  if (isPortablePowerStation(item)) return true;
  const hay = `${item.id} ${item.title}`.toLowerCase();
  if (/\b(?:power[\s-]?station|energy[\s-]?reserve)\b/.test(hay) || /\bsolar generator\b/.test(hay)) return true;
  // Anker SOLIX C/F units and expansion batteries; PS series panels may stay.
  if (/anker-solix-[cf]\d|anker-solix-bp/.test(item.id)) return true;
  return false;
}

export function homeHeadingProducts(items: CatalogItem[], limit = HEADING_PRODUCT_LIMIT): CatalogItem[] {
  const eligible = items.filter((i) => {
    if (i.filler) return false;
    if (i.category === 'drones-robotics') return false;
    if (i.kind === 'tool' || i.kind === 'resource') return false;
    if (isHeadingPowerGear(i)) return false;
    if (/^1password/.test(i.id) || /password manager/i.test(i.title)) return false;
    return Boolean(productPhotoFor(i));
  });

  const brandKey = (item: CatalogItem) => (item.sourceName || item.title.split(/\s+/)[0] || item.id).toLowerCase();
  const brandCounts = new Map<string, number>();
  const byCategory = new Map<string, CatalogItem[]>();

  for (const item of eligible) {
    const brand = brandKey(item);
    if ((brandCounts.get(brand) || 0) >= HEADING_MAX_PER_BRAND) continue;
    const cat = item.category || 'other';
    const list = byCategory.get(cat) ?? [];
    if (list.length >= HEADING_MAX_PER_CATEGORY) continue;
    list.push(item);
    byCategory.set(cat, list);
    brandCounts.set(brand, (brandCounts.get(brand) || 0) + 1);
  }

  const buckets = [...byCategory.values()];
  const picked: CatalogItem[] = [];
  let index = 0;
  while (picked.length < limit) {
    let added = false;
    for (const bucket of buckets) {
      if (index < bucket.length) {
        picked.push(bucket[index]);
        added = true;
        if (picked.length >= limit) break;
      }
    }
    if (!added) break;
    index += 1;
  }
  return picked;
}


// Do not lead the home Shop the Directory board with a product photo of a
// portable solar kit or energy reserve. Those read as "big power gear" in the
// first cell. Category scenes (a snowy house, rooftop solar in a neighborhood)
// stay; portable energy reserves are also filtered out in pushProduct().
const SHOP_BOARD_PRODUCT_IDS: string[] = [];

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
    sceneTile('scene-lead', 'Winter storm prep', '/winter-storm-prep/', 'hero-snowy-home'),
    sceneTile('scene-power', 'Energy Reserves', '/directory/power/', 'solar-rooftops'),
    sceneTile('scene-drone', 'Drones', '/directory/drones-robotics/', 'hero-drone'),
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
    sceneTile('hub-checklists', 'Free checklists', '/winter-storm-ready-checklist/', 'gear-flatlay'),
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
    { id: 'water', href: '/directory/water/', label: 'Water storage & filters', photoKey: 'hero-water-pour' },
    { id: 'food', href: '/directory/food/', label: 'Food & prepper supplies', photoKey: 'hero-food-and-gear' },
    { id: 'vehicle', href: '/vehicle-emergency-kits/', label: 'Vehicle emergency kits', photoKey: 'car-in-snow' },
    { id: 'camping', href: '/directory/outdoor/', label: 'Off-grid & camping', photoKey: 'hero-tent-stars' },
    { id: 'first-aid', href: '/first-aid-medical-prep/', label: 'First aid & safety', photoKey: 'hero-first-aid-crisp' },
    { id: 'radios', href: '/directory/tech/', label: 'Radios, lights & comms', photoKey: 'hero-radios' },
    { id: 'drones', href: '/directory/drones-robotics/', label: 'Drones', photoKey: 'hero-drones-air' },
    { id: 'overland', href: '/directory/vehicles/', label: 'Overland & off-road', photoKey: 'hero-offroad-close' },
    { id: 'security', href: '/directory/security/', label: 'Security', photoKey: 'hero-security-mix' },
    { id: 'prepper', href: '/prepper-picks/', label: "Prepper's Picks", photoKey: 'hero-prepper-collage' },
    { id: 'alerts', href: '/alerts/', label: 'Live alerts', photoKey: 'lightning-road' },
  ];
}
