/**
 * Full Source Directory catalog.
 *
 * Add a new approved partner by appending a SourceItem (and, if needed, a
 * SourceStore). Tracking links must come from affiliates.ts (exact `link` /
 * `itemLinks`, a `{url}` template via buildLink, or cjLink with an existing
 * cjAid). Never invent tracking URLs or prices. Pending partners go in
 * comingSoonPartners with no links.
 */
import {
  programs,
  isProgramLive,
  buildLink,
  cjLink,
  isNoPpcProgram,
  type Program,
} from './affiliates';
import { payhipProducts } from './payhip';

export type SourceCategoryId =
  | 'tech'
  | 'power'
  | 'home'
  | 'water'
  | 'outdoor'
  | 'audio'
  | 'tools'
  | 'auto'
  | 'fun'
  | 'safety'
  | 'downloads';

export type SourceLinkLevel = 'product' | 'merchant' | 'own';

export type SourceCategory = {
  id: SourceCategoryId;
  slug: string;
  name: string;
  short: string;
  blurb: string;
  photo?: string;
  image?: string;
};

export const sourceCategories: SourceCategory[] = [
  { id: 'tech', slug: 'tech', name: 'Tech & Gadgets', short: 'Tech', blurb: 'Paid software and everyday tech from partner stores. Plans and prices are on the seller’s site.', photo: 'power-banks' },
  { id: 'power', slug: 'power', name: 'Power & Energy', short: 'Power', blurb: 'Portable power stations and solar from partner brands we already link. Check the official page for current capacity, output, and price.', photo: 'solar-rooftops' },
  { id: 'home', slug: 'home', name: 'Home & Kitchen', short: 'Home', blurb: 'Filters and other home setups from approved partners. Read the official page for what a system does and does not treat, and for install notes.', photo: 'fireplace-living-room' },
  { id: 'water', slug: 'water', name: 'Water & Air', short: 'Water', blurb: 'Drinking-water filters and related gear from official partner shops.', photo: 'water-bottles' },
  { id: 'outdoor', slug: 'outdoor', name: 'Outdoor & Camping', short: 'Outdoor', blurb: 'Portable power that travels, plus outdoor retailers we are still waiting to add.', photo: 'lantern-dusk' },
  { id: 'audio', slug: 'audio', name: 'Audio & Entertainment', short: 'Audio', blurb: 'Headphones, speakers, and home audio once pending audio partners are approved.', image: '/directory/covers/cat-audio.svg' },
  { id: 'tools', slug: 'tools', name: 'Tools & DIY', short: 'Tools', blurb: 'Tools, parts, and workshop supplies once pending tool partners are approved.', photo: 'multitools' },
  { id: 'auto', slug: 'auto', name: 'Auto & Travel', short: 'Auto', blurb: 'Vehicle and travel electronics once pending auto partners are approved.', photo: 'car-in-snow' },
  { id: 'fun', slug: 'fun', name: 'Fun & Gifts', short: 'Fun', blurb: 'A place for gifts and just-for-fun finds as more partner stores come online.', image: '/directory/covers/cat-fun.svg' },
  { id: 'safety', slug: 'safety', name: 'Safety & Prep', short: 'Safety', blurb: 'Ready kits and paid home plans from approved partners, described plainly.', photo: 'first-aid-kit-open' },
  { id: 'downloads', slug: 'downloads', name: 'Our Downloads', short: 'Downloads', blurb: 'ReadyGearHub’s own print-at-home guides, sold as instant PDFs through Payhip.', photo: 'checklist-writing' },
];

export type ComingSoonPartner = {
  id: string;
  name: string;
  network: string;
  catalogId: string;
  categories: SourceCategoryId[];
};

/** Applied, still waiting. Shown as “More partners coming soon” with no links. */
export const comingSoonPartners: ComingSoonPartner[] = [
  { id: 'anker-solix-rakuten', name: 'Anker SOLIX US', network: 'Rakuten', catalogId: '53552', categories: ['power', 'tech'] },
  { id: 'powermarket', name: 'Powermarket', network: 'Rakuten', catalogId: '53433', categories: ['power'] },
  { id: 'batteries-plus', name: 'Batteries Plus', network: 'Rakuten', catalogId: '45126', categories: ['tools', 'power'] },
  { id: 'eastern-mountain-sports', name: 'Eastern Mountain Sports', network: 'Rakuten', catalogId: '53845', categories: ['outdoor'] },
  { id: 'cobra-electronics', name: 'Cobra Electronics', network: 'Rakuten', catalogId: '53731', categories: ['auto'] },
  { id: 'vevor', name: 'Vevor', network: 'Rakuten', catalogId: '53191', categories: ['tools'] },
  { id: 'crutchfield', name: 'Crutchfield', network: 'Rakuten', catalogId: '54321', categories: ['audio'] },
  { id: 'harman', name: 'Harman', network: 'CJ', catalogId: '3805502', categories: ['audio'] },
];

export type SourceItem = {
  id: string;
  title: string;
  blurb: string;
  category: SourceCategoryId;
  alsoIn?: SourceCategoryId[];
  /** affiliates.ts program id, or `payhip` for our own downloads. */
  programId: string;
  sourceName: string;
  linkLevel: SourceLinkLevel;
  /** Official product or category URL, wrapped with the program’s existing deep-link method. */
  destination?: string;
  /** Use this exact tracked URL from affiliates.ts (no wrapping). */
  useProgramLink?: boolean;
  /** Use program.itemLinks[id] (verified portal links). */
  useItemLink?: boolean;
  trending?: boolean;
  trendingRank?: number;
  image: string;
  /** How the cover should sit in the 16:9 frame. Omit for SVG placeholders and Payhip covers (object-fit: cover). */
  imageKind?: 'photo' | 'banner' | 'logo';
  cta?: string;
  offerLabel?: string;
  /** Internal path for our own products (preferred over the Payhip checkout URL). */
  internalHref?: string;
  /** Verified price already in the repo (Payhip only today). */
  price?: string;
};

function payhipItems(): SourceItem[] {
  const blurbs: Record<string, string> = {
    'complete-prep-bundle': 'The three ReadyGearHub print-at-home guides together, plus both free quick-reference sheets, in one instant ZIP.',
    'family-emergency-binder': 'A fill-in household plan you can print and keep on paper: contacts, medicines, and utility shut-offs.',
    'winter-storm-prep-planner': 'A seven-day countdown and supply lists for the week before ice or a winter storm.',
    'homestead-prep-starter-guide': 'A starter plan for a farm, cabin, or house on a well: water, power, and what to write down.',
  };
  const ranks: Record<string, number> = { 'complete-prep-bundle': 7 };
  return payhipProducts.map((p) => ({
    id: `payhip-${p.slug}`,
    title: p.title,
    blurb: blurbs[p.slug] ?? p.summary,
    category: 'downloads' as const,
    programId: 'payhip',
    sourceName: 'ReadyGearHub shop',
    linkLevel: 'own' as const,
    image: p.image,
    internalHref: `/shop/${p.slug}/`,
    price: p.price,
    offerLabel: 'Instant PDF',
    cta: 'Details',
    trending: p.slug === 'complete-prep-bundle',
    trendingRank: ranks[p.slug],
  }));
}

export const sourceItems: SourceItem[] = [
  // ---- Power: BLUETTI product deep links via the existing {url} template ----
  {
    id: 'bluetti-elite-200-v2',
    title: 'BLUETTI Elite 200 V2 portable power station',
    blurb: 'A mid-size portable battery listed as a popular pick on BLUETTI’s official US shop. See the official page for current specs and price.',
    category: 'power',
    alsoIn: ['outdoor'],
    programId: 'bluetti',
    sourceName: 'BLUETTI',
    linkLevel: 'product',
    destination: 'https://www.bluettipower.com/products/elite-200-v2-portable-power-station',
    trending: true,
    trendingRank: 1,
    image: '/directory/photos/bluetti-elite-200-v2.webp',
    imageKind: 'photo',
    offerLabel: 'Portable power station',
  },
  {
    id: 'bluetti-ac180',
    title: 'BLUETTI AC180 portable power station',
    blurb: 'A compact station we already list in the gear directory. Check BLUETTI for current output, capacity, and price.',
    category: 'power',
    programId: 'bluetti',
    sourceName: 'BLUETTI',
    linkLevel: 'product',
    destination: 'https://www.bluettipower.com/products/ac180',
    trending: true,
    trendingRank: 2,
    image: '/directory/photos/bluetti-ac180.webp',
    imageKind: 'photo',
    offerLabel: 'Portable power station',
  },
  {
    id: 'bluetti-ac200l',
    title: 'BLUETTI AC200L portable power station',
    blurb: 'A larger portable station in BLUETTI’s current US lineup. The official product page has the current specs and price.',
    category: 'power',
    programId: 'bluetti',
    sourceName: 'BLUETTI',
    linkLevel: 'product',
    destination: 'https://www.bluettipower.com/products/ac200l-portable-power-station',
    trending: true,
    trendingRank: 3,
    image: '/directory/photos/bluetti-ac200l.webp',
    imageKind: 'photo',
    offerLabel: 'Portable power station',
  },
  {
    id: 'bluetti-ac2a',
    title: 'BLUETTI AC2A portable power station',
    blurb: 'A small, travel-friendly battery for phones, lights, and light charging on the go. See BLUETTI for current details.',
    category: 'power',
    alsoIn: ['outdoor'],
    programId: 'bluetti',
    sourceName: 'BLUETTI',
    linkLevel: 'product',
    destination: 'https://www.bluettipower.com/products/ac2a',
    trending: true,
    trendingRank: 5,
    image: '/directory/photos/bluetti-ac2a.webp',
    imageKind: 'photo',
    offerLabel: 'Portable power station',
  },
  {
    id: 'bluetti-elite-100-v2',
    title: 'BLUETTI Elite 100 V2 portable power station',
    blurb: 'A smaller unit in BLUETTI’s current Elite line. Confirm capacity and price on the official page.',
    category: 'power',
    programId: 'bluetti',
    sourceName: 'BLUETTI',
    linkLevel: 'product',
    destination: 'https://www.bluettipower.com/products/elite-100-v2-portable-power-station',
    trending: true,
    trendingRank: 10,
    image: '/directory/photos/bluetti-elite-100-v2.webp',
    imageKind: 'photo',
    offerLabel: 'Portable power station',
  },
  {
    id: 'bluetti-ac70',
    title: 'BLUETTI AC70 portable power station',
    blurb: 'A mid-compact station already in our gear listings. The official page has current specs and price.',
    category: 'power',
    alsoIn: ['outdoor'],
    programId: 'bluetti',
    sourceName: 'BLUETTI',
    linkLevel: 'product',
    destination: 'https://www.bluettipower.com/products/ac70',
    image: '/directory/photos/bluetti-ac70.webp',
    imageKind: 'photo',
    offerLabel: 'Portable power station',
  },
  {
    id: 'bluetti-elite-300',
    title: 'BLUETTI Elite 300 portable power station',
    blurb: 'A higher-capacity portable station in the current Elite line, including RV-oriented outlets on the official listing.',
    category: 'power',
    alsoIn: ['outdoor'],
    programId: 'bluetti',
    sourceName: 'BLUETTI',
    linkLevel: 'product',
    destination: 'https://www.bluettipower.com/products/elite-300-portable-power-station',
    image: '/directory/photos/bluetti-elite-300.webp',
    imageKind: 'photo',
    offerLabel: 'Portable power station',
  },
  {
    id: 'bluetti-sp200l',
    title: 'BLUETTI SP200L 200W solar panel',
    blurb: 'A foldable 200W solar panel already in our gear listings, for charging a compatible power station outdoors.',
    category: 'power',
    alsoIn: ['outdoor'],
    programId: 'bluetti',
    sourceName: 'BLUETTI',
    linkLevel: 'product',
    destination: 'https://www.bluettipower.com/products/bluetti-sp200l-solar-panel-200w',
    image: '/directory/photos/bluetti-sp200l-200w.webp',
    imageKind: 'photo',
    offerLabel: 'Solar panel',
  },
  {
    id: 'bluetti-power-stations',
    title: 'BLUETTI portable power stations',
    blurb: 'Browse BLUETTI’s official portable power station collection, including current and older models.',
    category: 'power',
    alsoIn: ['outdoor'],
    programId: 'bluetti',
    sourceName: 'BLUETTI',
    linkLevel: 'merchant',
    destination: 'https://www.bluettipower.com/collections/power-stations',
    image: '/directory/photos/bluetti-elite-200-v2.webp',
    imageKind: 'photo',
    offerLabel: 'Official collection',
    cta: 'Browse BLUETTI power stations',
  },

  // ---- Power: ALLPOWERS via existing CJ AID deep-link helper ----
  {
    id: 'allpowers-s2000-pro',
    title: 'ALLPOWERS S2000 Pro portable power station',
    blurb: 'A 2400W-class station listed among ALLPOWERS’ official US bestsellers. See the official page for current specs and price.',
    category: 'power',
    programId: 'allpowers',
    sourceName: 'ALLPOWERS',
    linkLevel: 'product',
    destination: 'https://iallpowers.com/products/allpowers-2400w-portable-power-station',
    trending: true,
    trendingRank: 4,
    image: '/directory/covers/power-station.svg',
    offerLabel: 'Portable power station',
  },
  {
    id: 'allpowers-r2500-v2',
    title: 'ALLPOWERS R2500 V2 portable power station',
    blurb: 'A larger home-and-outdoor battery in ALLPOWERS’ current US catalog. Confirm details on the official product page.',
    category: 'power',
    programId: 'allpowers',
    sourceName: 'ALLPOWERS',
    linkLevel: 'product',
    destination: 'https://iallpowers.com/products/allpowers-r2500-v2-portable-power-station-2500w-1920wh',
    image: '/directory/covers/expandable-power.svg',
    offerLabel: 'Portable power station',
  },
  {
    id: 'allpowers-r600',
    title: 'ALLPOWERS R600 portable power station',
    blurb: 'A compact 600W-class station listed on ALLPOWERS’ official bestsellers page. See the official page for current price.',
    category: 'power',
    alsoIn: ['outdoor'],
    programId: 'allpowers',
    sourceName: 'ALLPOWERS',
    linkLevel: 'product',
    destination: 'https://iallpowers.com/products/allpowersportable-power-station-r600-600w-299wh-with-lifep04-battery',
    image: '/directory/covers/compact-power.svg',
    offerLabel: 'Portable power station',
  },
  {
    id: 'allpowers-volix-p300',
    title: 'ALLPOWERS VOLIX P300 portable power station',
    blurb: 'A small grab-and-go battery for light charging. Check ALLPOWERS for current capacity and price.',
    category: 'power',
    alsoIn: ['outdoor'],
    programId: 'allpowers',
    sourceName: 'ALLPOWERS',
    linkLevel: 'product',
    destination: 'https://iallpowers.com/products/allpowers-volix-p300-portable-power-station',
    image: '/directory/covers/compact-power.svg',
    offerLabel: 'Portable power station',
  },
  {
    id: 'allpowers-best-sellers',
    title: 'ALLPOWERS official bestsellers',
    blurb: 'The official ALLPOWERS US bestsellers collection, including power stations and solar kits.',
    category: 'power',
    programId: 'allpowers',
    sourceName: 'ALLPOWERS',
    linkLevel: 'merchant',
    destination: 'https://iallpowers.com/collections/best-sellers',
    image: '/directory/covers/store.svg',
    offerLabel: 'Official collection',
    cta: 'Browse ALLPOWERS bestsellers',
  },

  // ---- Water & Home: Aquasana (verified Rakuten item links + homepage) ----
  {
    id: 'aquasana-home',
    title: 'Aquasana water filters',
    blurb: 'The official Aquasana shop for under-sink, whole-house, and other drinking-water filters.',
    category: 'water',
    programId: 'aquasana',
    sourceName: 'Aquasana',
    linkLevel: 'merchant',
    useProgramLink: true,
    image: '/directory/photos/aquasana-brand-300x250.webp',
    imageKind: 'banner',
    offerLabel: 'Official shop',
    cta: 'Shop at Aquasana',
  },
  {
    id: 'aquasana-under-sink',
    title: 'Aquasana under-sink filters',
    blurb: 'Under-sink systems for treating water at a single faucet. Read the official page for what a system does and does not remove, and for installation guidance.',
    category: 'home',
    alsoIn: ['water'],
    programId: 'aquasana',
    sourceName: 'Aquasana',
    linkLevel: 'product',
    useItemLink: true,
    trending: true,
    trendingRank: 6,
    image: '/directory/photos/aquasana-under-sink-claryum-3stage.webp',
    imageKind: 'photo',
    offerLabel: 'Under-sink filters',
    cta: 'Shop under-sink filters at Aquasana',
  },
  {
    id: 'aquasana-whole-house',
    title: 'Aquasana whole-house filters',
    blurb: 'Whole-house systems installed at the home’s main water line. Read the official page for coverage, limits, and installation guidance.',
    category: 'home',
    alsoIn: ['water'],
    programId: 'aquasana',
    sourceName: 'Aquasana',
    linkLevel: 'product',
    useItemLink: true,
    image: '/directory/photos/aquasana-rhino-whole-house.webp',
    imageKind: 'photo',
    offerLabel: 'Whole-house filters',
    cta: 'Shop whole-house filters at Aquasana',
  },
  {
    id: 'waterdrop-shop',
    title: 'Waterdrop Filter',
    blurb: 'The official Waterdrop shop for drinking-water filters and related home systems. See their site for current models and prices.',
    category: 'water',
    alsoIn: ['home'],
    programId: 'waterdrop',
    sourceName: 'Waterdrop Filter',
    linkLevel: 'merchant',
    useProgramLink: true,
    trending: true,
    trendingRank: 9,
    image: '/directory/photos/waterdrop-g3p600.webp',
    imageKind: 'photo',
    offerLabel: 'Official shop',
    cta: 'Shop at Waterdrop',
  },
  {
    id: 'berkey-shop',
    title: 'TheBerkey.com gravity filters',
    blurb: 'Official retailer for Berkey gravity-fed drinking-water filters. See the shop for current models, replacement elements, and price.',
    category: 'water',
    programId: 'berkey',
    sourceName: 'TheBerkey.com',
    linkLevel: 'merchant',
    useProgramLink: true,
    image: '/directory/covers/countertop-filter.svg',
    offerLabel: 'Official shop',
    cta: 'Shop at TheBerkey.com',
  },

  // ---- Tech: paid subscriptions, merchant-level tracked links ----
  {
    id: 'nordvpn',
    title: 'NordVPN',
    blurb: 'A paid VPN subscription. Read the current plan length, price, and terms on NordVPN’s site before you sign up.',
    category: 'tech',
    programId: 'nordvpn',
    sourceName: 'NordVPN',
    linkLevel: 'merchant',
    useProgramLink: true,
    trending: true,
    trendingRank: 8,
    image: '/directory/photos/nordvpn-faster-300x250.webp',
    imageKind: 'banner',
    offerLabel: 'Paid subscription',
    cta: 'See NordVPN plans and prices',
  },
  {
    id: 'nordpass',
    title: 'NordPass',
    blurb: 'A paid password manager from Nord Security. Check the official page for current plans and prices.',
    category: 'tech',
    programId: 'nordpass',
    sourceName: 'NordPass',
    linkLevel: 'merchant',
    useProgramLink: true,
    image: '/directory/photos/nordpass-logo-512.webp',
    imageKind: 'logo',
    offerLabel: 'Paid subscription',
    cta: 'See NordPass plans and prices',
  },
  {
    id: 'surfshark',
    title: 'Surfshark',
    blurb: 'A paid VPN subscription. See Surfshark’s official page for current plans, prices, and terms.',
    category: 'tech',
    programId: 'surfshark',
    sourceName: 'Surfshark',
    linkLevel: 'merchant',
    useProgramLink: true,
    image: '/directory/photos/surfshark-privacy.webp',
    imageKind: 'banner',
    offerLabel: 'Paid subscription',
    cta: 'See Surfshark plans and prices',
  },

  // ---- Safety ----
  {
    id: 'redi-shop',
    title: 'REDI emergency kits',
    blurb: 'Ready-made emergency and readiness kits from REDI. See the official shop for what is in each kit and the current price.',
    category: 'safety',
    programId: 'redi',
    sourceName: 'REDI',
    linkLevel: 'merchant',
    useProgramLink: true,
    image: '/directory/covers/ready-kit.svg',
    offerLabel: 'Ready kits',
    cta: 'Shop kits at REDI',
  },
  {
    id: 'choice-home-warranty',
    title: 'Choice Home Warranty',
    blurb: 'A paid monthly or yearly home warranty plan that can cover repair or replacement of major systems and appliances. Check the price and read the coverage terms before you sign up.',
    category: 'safety',
    alsoIn: ['home'],
    programId: 'choice-home-warranty',
    sourceName: 'Choice Home Warranty',
    linkLevel: 'merchant',
    useProgramLink: true,
    image: '/directory/photos/choice-home-warranty-250.webp',
    imageKind: 'logo',
    offerLabel: 'Paid home warranty plans',
    cta: 'See home warranty plans and prices',
  },

  ...payhipItems(),
];

export type SourceStore = {
  id: string;
  name: string;
  programId: string;
  hideOnPaid: boolean;
};

export function sourceStores(): SourceStore[] {
  const seen = new Map<string, SourceStore>();
  for (const item of sourceItems) {
    if (!seen.has(item.programId)) {
      seen.set(item.programId, {
        id: item.programId,
        name: item.sourceName,
        programId: item.programId,
        hideOnPaid: item.programId !== 'payhip' && isNoPpcProgram(item.programId),
      });
    }
  }
  return [...seen.values()];
}

function programById(id: string): Program | undefined {
  return programs.find((p) => p.id === id);
}

export type ResolvedSourceItem = SourceItem & {
  href: string;
  affiliate: boolean;
  hideOnPaid: boolean;
  rel: string;
  priceLabel: string;
  ctaLabel: string;
};

export function resolveSourceItem(item: SourceItem): ResolvedSourceItem {
  const hideOnPaid = item.programId !== 'payhip' && isNoPpcProgram(item.programId);
  const priceLabel = item.price || 'See price';
  const defaultCta = item.linkLevel === 'own'
    ? 'Details'
    : item.linkLevel === 'merchant'
      ? `Shop at ${item.sourceName}`
      : 'See price';
  const ctaLabel = item.cta || defaultCta;

  if (item.programId === 'payhip') {
    const href = item.internalHref || '/shop/';
    return { ...item, href, affiliate: false, hideOnPaid: false, rel: '', priceLabel, ctaLabel };
  }

  const p = programById(item.programId);
  if (!p || !isProgramLive(item.programId)) {
    return { ...item, href: item.destination || item.internalHref || '#', affiliate: false, hideOnPaid, rel: 'noopener', priceLabel, ctaLabel };
  }

  let href = '';
  if (item.useItemLink && p.itemLinks?.[item.id]) {
    href = p.itemLinks[item.id];
  } else if (item.useProgramLink) {
    href = (p.link || p.url || '').trim();
  } else if (item.destination) {
    const template = (p.link || p.url || '').trim();
    if (template.includes('{url}') || template.includes('{rawurl}')) {
      href = buildLink(p, item.destination);
    } else if (p.network === 'CJ' && p.cjAid) {
      href = cjLink(item.destination, p.cjAid);
    } else {
      href = buildLink(p, item.destination) || template;
    }
  }
  if (!href) href = (p.link || p.url || item.destination || '').trim();

  return {
    ...item,
    href,
    affiliate: true,
    hideOnPaid,
    rel: 'sponsored nofollow noopener',
    priceLabel,
    ctaLabel,
  };
}

export function resolvedSourceItems(): ResolvedSourceItem[] {
  return sourceItems.map(resolveSourceItem).filter((i) => !!i.href && i.href !== '#');
}

export function itemMatchesCategory(item: SourceItem, category: SourceCategoryId): boolean {
  return item.category === category || (item.alsoIn ?? []).includes(category);
}

export function itemsInCategory(category: SourceCategoryId, resolved = resolvedSourceItems()): ResolvedSourceItem[] {
  return sortCatalog(resolved.filter((i) => itemMatchesCategory(i, category)));
}

export function sortCatalog(items: ResolvedSourceItem[]): ResolvedSourceItem[] {
  return [...items].sort((a, b) => {
    const ar = a.trending ? (a.trendingRank ?? 50) : 1000;
    const br = b.trending ? (b.trendingRank ?? 50) : 1000;
    if (ar !== br) return ar - br;
    return a.title.localeCompare(b.title);
  });
}

export function trendingSourceItems(resolved = resolvedSourceItems()): ResolvedSourceItem[] {
  return sortCatalog(resolved.filter((i) => i.trending));
}

export function comingSoonFor(category?: SourceCategoryId): ComingSoonPartner[] {
  if (!category) return comingSoonPartners;
  return comingSoonPartners.filter((p) => p.categories.includes(category));
}

export function categoryBySlug(slug: string): SourceCategory | undefined {
  return sourceCategories.find((c) => c.slug === slug);
}

export function countsByCategory(resolved = resolvedSourceItems()): Record<SourceCategoryId, number> {
  const counts = Object.fromEntries(sourceCategories.map((c) => [c.id, 0])) as Record<SourceCategoryId, number>;
  for (const item of resolved) {
    counts[item.category] += 1;
    for (const extra of item.alsoIn ?? []) counts[extra] += 1;
  }
  return counts;
}

export function countsBySource(resolved = resolvedSourceItems()): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of resolved) {
    counts[item.sourceName] = (counts[item.sourceName] || 0) + 1;
  }
  return counts;
}
