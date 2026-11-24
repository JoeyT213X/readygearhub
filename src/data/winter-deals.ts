/**
 * Winter prep picks for Black Friday / Cyber Monday week 2026.
 * Only items from approved programs with live tracking links.
 * Prices were read from official brand stores on November 23, 2026
 * (America/Chicago). If a price could not be confirmed, the card says
 * "See price".
 */
export const PRICE_CHECKED = '2026-11-23';
export const PRICE_CHECKED_LABEL = 'November 23, 2026';

export type WinterDealSection = 'lights' | 'power' | 'cold' | 'water';

export type WinterDeal = {
  itemId: string;
  section: WinterDealSection;
  /** Display price, or "See price". */
  priceLabel: string;
  compareAt?: string;
  stockNote?: string;
  why: string;
};

export const winterDealSections: { id: WinterDealSection; title: string; intro: string }[] = [
  {
    id: 'lights',
    title: 'Lights for outages and dark winter work',
    intro:
      'Flashlights and a headlamp from Wuben, an approved partner. These official-store prices were marked down when we checked them on November 23, 2026. The compare-at figures come from Wuben’s own product pages.',
  },
  {
    id: 'power',
    title: 'Backup power for a winter outage',
    intro:
      'Portable power stations from Anker SOLIX and BLUETTI, both approved partners. These are not the week’s Amazon best-seller list; they are the winter-outage gear we can actually send you to with a working partner link. Prices below are the official-store prices we read on November 23, 2026. We only mention a discount when the official page showed one.',
  },
  {
    id: 'cold',
    title: 'A self-heating battery for cold weather',
    intro:
      'LiTime’s LiHeat battery is built to warm itself in the cold, according to LiTime. We could not confirm a live price on November 23, 2026, so this card says “See price.”',
  },
  {
    id: 'water',
    title: 'Drinking water if pipes or supply are a problem',
    intro:
      'A countertop iSpring dispenser does not require under-sink plumbing, which can matter if a freeze has you thinking about water at home. We could not confirm a live price on November 23, 2026, so this card says “See price.”',
  },
];

export const winterDeals: WinterDeal[] = [
  {
    itemId: 'wuben-c3',
    section: 'lights',
    priceLabel: '$24.22',
    compareAt: '$49.99',
    stockNote: 'In stock on Wubenlight when checked.',
    why: 'A compact everyday flashlight. Useful in a kit or a coat pocket when the lights go out.',
  },
  {
    itemId: 'wuben-h4',
    section: 'lights',
    priceLabel: '$23.99',
    compareAt: '$34.99',
    stockNote: 'In stock on Wubenlight when checked.',
    why: 'A rechargeable headlamp keeps both hands free for shoveling, a tire change, or moving around a dark house.',
  },
  {
    itemId: 'wuben-f5',
    section: 'lights',
    priceLabel: '$28.11',
    compareAt: '$42.99',
    stockNote: 'In stock on Wubenlight when checked.',
    why: 'A camping and tent light that can also top up a phone, according to Wuben. Handy as a room light in an outage.',
  },
  {
    itemId: 'wuben-c2',
    section: 'lights',
    priceLabel: '$39.99',
    compareAt: '$49.99',
    stockNote: 'In stock on Wubenlight when checked.',
    why: 'A brighter everyday flashlight we already mention in the winter car-kit guide.',
  },
  {
    itemId: 'wuben-e12r',
    section: 'lights',
    priceLabel: '$47.19',
    compareAt: '$99.99',
    stockNote: 'The red model was in stock on Wubenlight when checked; the black model was not.',
    why: 'A flashlight that can also act as a power bank, according to Wuben. The official page showed a lower price on the red model.',
  },
  {
    itemId: 'anker-solix-c1000x',
    section: 'power',
    priceLabel: '$499.99',
    stockNote: 'In stock on the official Anker SOLIX store when checked.',
    why: 'A mid-size station for phones, lights, and small appliances during a winter outage. This is the official-store price, not a claimed discount.',
  },
  {
    itemId: 'bluetti-ac180',
    section: 'power',
    priceLabel: '$549.00',
    stockNote: 'In stock on the official BLUETTI store when checked.',
    why: 'Another mid-size station for outage backup. The official unit price matched the compare-at price, so we are not calling it a sale. BLUETTI’s program lists a sitewide code AFF5OFF for 5% off; check the official checkout, because it may not apply to every item.',
  },
  {
    itemId: 'anker-solix-c2000-gen2',
    section: 'power',
    priceLabel: '$849.99',
    stockNote: 'Listed as a preorder on the official Anker SOLIX store when checked.',
    why: 'A larger station if you want more runtime. This was a preorder, not immediate ship, on November 23, 2026.',
  },
  {
    itemId: 'litime-12v-100ah-group24',
    section: 'cold',
    priceLabel: 'See price',
    why: 'A Group 24 lithium battery LiTime describes as self-heating. It is a better fit for a DIY or vehicle setup than as a plug-and-play house heater.',
  },
  {
    itemId: 'ispring-rcd100',
    section: 'water',
    priceLabel: 'See price',
    why: 'A plug-in countertop reverse-osmosis dispenser, according to iSpring. It is here as a water option, not because it appeared on this week’s winter best-seller lists.',
  },
];

export const winterDealSources: { title: string; href: string; note: string }[] = [
  {
    title: 'Amazon Best Sellers: Indoor Electric Space Heaters',
    href: 'https://www.amazon.com/Best-Sellers-Indoor-Electric-Space-Heaters/zgbs/home-garden/19240644011',
    note: 'Read November 23, 2026. Top sellers included DREO, GiveBest, Amazon Basics, and Lasko ceramic heaters.',
  },
  {
    title: 'Amazon Best Sellers: Camping Hand Warmers & Foot Warmers',
    href: 'https://www.amazon.com/Best-Sellers-Camping-Hand-Warmers-Foot-Warmers/zgbs/sporting-goods/14332911',
    note: 'Read November 23, 2026. HotHands disposable packs led the list, followed by generic rechargeable warmers.',
  },
  {
    title: 'Amazon Best Sellers: Blankets & Throws',
    href: 'https://www.amazon.com/Best-Sellers-Blankets-Throws/zgbs/home-garden/1063280',
    note: 'Read November 23, 2026. A Bedsure heated throw was #2, with other Bedsure and GENIANI throws also high on the list.',
  },
  {
    title: 'Amazon Best Sellers: Ice Scrapers & Snow Brushes',
    href: 'https://www.amazon.com/Best-Sellers-Ice-Scrapers-Snow-Brushes/zgbs/automotive/15737041',
    note: 'Read November 23, 2026. An AstroAI 27-inch snow brush and ice scraper was #1.',
  },
  {
    title: 'Good Housekeeping, 40 Best Black Friday Deals on Amazon',
    href: 'https://www.goodhousekeeping.com/what-to-buy/sales-shopping-news/a74477388/amazon-black-friday-deals-2026/',
    note: 'Published November 19, 2026. Listed a Bedsure heated electric blanket among the week’s Amazon deals.',
  },
  {
    title: 'Black Friday Heated Clothing Deals 2026',
    href: 'https://blackfridayishere.com/black-friday-heated-clothing-deals/',
    note: 'Prices on that page were dated November 22, 2026. Live Amazon picks included Soaccks, Beamsks, and ORORO heated vests.',
  },
  {
    title: 'Anker SOLIX official C1000X product page',
    href: 'https://www.ankersolix.com/products/a1761111',
    note: 'Official store price $499.99, in stock, read November 23, 2026.',
  },
  {
    title: 'Anker SOLIX official C2000 Gen 2 product page',
    href: 'https://www.ankersolix.com/products/c2000-gen2',
    note: 'Official store price $849.99, listed as a preorder, read November 23, 2026.',
  },
  {
    title: 'BLUETTI official AC180 product page',
    href: 'https://www.bluettipower.com/products/ac180',
    note: 'Official store price $549.00, in stock, read November 23, 2026.',
  },
  {
    title: 'Wubenlight official product pages',
    href: 'https://www.wubenlight.com/',
    note: 'C3, H4, F5, C2, and E12R sale prices above were read from each product’s official page on November 23, 2026.',
  },
];

export const winterDealGaps: { category: string; leaders: string; status: string }[] = [
  {
    category: 'Space heaters',
    leaders: 'DREO, GiveBest, Amazon Basics, and Lasko led Amazon’s indoor electric space-heater best-seller list on November 23, 2026.',
    status: 'No approved affiliate program. We already have Mr. Heater write-ups, but those links do not earn.',
  },
  {
    category: 'Heated blankets and throws',
    leaders: 'Bedsure heated throws were high on Amazon’s blankets list, and Good Housekeeping flagged a Bedsure heated blanket as a Black Friday Amazon deal.',
    status: 'No approved affiliate program.',
  },
  {
    category: 'Hand warmers',
    leaders: 'HotHands packs led Amazon’s camping hand-warmer best-seller list.',
    status: 'No approved affiliate program. We have a HotHands write-up with a plain official link only.',
  },
  {
    category: 'Heated apparel',
    leaders: 'Retail Black Friday coverage on November 22, 2026 listed Soaccks, Beamsks, and ORORO heated vests among live Amazon deals.',
    status: 'No approved affiliate program. Bearskin and similar outdoor-clothing programs have not been added yet.',
  },
  {
    category: 'Snow tools and ice scrapers',
    leaders: 'An AstroAI 27-inch snow brush was #1 on Amazon’s ice-scraper and snow-brush best-seller list. Snow Joe also appears on that list.',
    status: 'No approved affiliate program. We have Snow Joe write-ups with plain official links only.',
  },
  {
    category: 'Car winter kits and jump starters',
    leaders: 'Amazon’s automotive safety-kit list and winter-kit roundups often feature bundled roadside kits. On our own site, a NOCO Boost GB40 page drew one affiliate_click, but that was a plain official link.',
    status: 'No approved affiliate program for NOCO, AstroAI, or winter car-kit brands. Pelican has not been added yet.',
  },
];

export const WINTER_DEAL_LANES = [
  'winter-storm-prep',
  'power-outage-kits',
  'vehicle-emergency-kits',
  'home-heating-backup',
  'cold-weather-gear',
  'home-backup-power-solar',
  'off-grid-power',
  'emergency-water',
] as const;

export const WINTER_DEAL_DIRECTORY_CATEGORIES = [
  'power',
  'outdoor',
  'auto',
  'home',
  'water',
  'safety',
] as const;

export function isWinterDealLane(slug: string): boolean {
  return (WINTER_DEAL_LANES as readonly string[]).includes(slug);
}

export function isWinterDealDirectoryCategory(id: string): boolean {
  return (WINTER_DEAL_DIRECTORY_CATEGORIES as readonly string[]).includes(id);
}
