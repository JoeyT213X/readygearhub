/**
 * Winter prep picks for Black Friday / Cyber Monday week 2026.
 * Only items from approved programs with live tracking links.
 * Prices were read from official brand stores on November 23–25, 2026
 * (America/Chicago). If a price could not be confirmed, the card says
 * "See price".
 */
export const PRICE_CHECKED = '2026-11-25';
export const PRICE_CHECKED_LABEL = 'November 23–25, 2026';

export type WinterDealSection = 'lights' | 'power' | 'cold' | 'water' | 'apparel' | 'boots';

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
      'Energy reserves from Anker SOLIX and BLUETTI, both approved partners. These are not the week’s Amazon best-seller list; they are the winter-outage gear we can actually send you to with a working partner link. Prices below are the official-store prices we read on November 23, 2026. We only mention a discount when the official page showed one.',
  },
  {
    id: 'cold',
    title: 'A self-heating battery for cold weather',
    intro:
      'LiTime’s LiHeat battery is built to warm itself in the cold, according to LiTime. We could not confirm a live price on November 23, 2026, so this card says “Price on the store page.”',
  },
  {
    id: 'water',
    title: 'Drinking water if pipes or supply are a problem',
    intro:
      'A countertop iSpring dispenser does not require under-sink plumbing, which can matter if a freeze has you thinking about water at home. We could not confirm a live price on November 23, 2026, so this card says “Price on the store page.”',
  },
  {
    id: 'apparel',
    title: 'Heated apparel and insulated waders',
    intro:
      'Heated jackets, heated vests, and insulated bootfoot waders from TideWe, an approved partner. Official-store prices were read on November 24, 2026. When a product has more than one price by size, color, or whether a battery is included, we show the starting price. TideWe’s 16-inch rubber hunting boots were not in stock, so we listed insulated bootfoot waders instead.',
  },
  {
    id: 'boots',
    title: 'Winter boots for snow, ice, and wet cold',
    intro:
      'Winter boots from Bogs, an approved partner. The prices below are the regular list prices on Bogs’ official store as of November 25, 2026. We are not listing sale prices or promo codes.',
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
    itemId: 'bluetti-ac180',
    section: 'power',
    priceLabel: '$549.00',
    stockNote: 'In stock on the official BLUETTI store when checked.',
    why: 'Another mid-size energy reserve for outage backup. The official unit price matched the compare-at price, so we are not calling it a sale. BLUETTI’s program lists a sitewide code AFF5OFF for 5% off; check the official checkout, because it may not apply to every item.',
  },
  {
    itemId: 'anker-solix-c2000-gen2',
    section: 'power',
    priceLabel: '$849.99',
    stockNote: 'Listed as a preorder on the official Anker SOLIX store when checked.',
    why: 'A larger energy reserve if you want more runtime. This was a preorder, not immediate ship, on November 23, 2026.',
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
  {
    itemId: 'tidewe-inferno-heated-jacket',
    section: 'apparel',
    priceLabel: 'From $144.99',
    compareAt: '$379.99',
    stockNote: 'All listed sizes were in stock on TideWe when checked. The official price varied by size.',
    why: 'A waterproof heated hunting jacket TideWe sells with a battery pack. Useful as a winter outer layer when you want heat you can adjust.',
  },
  {
    itemId: 'tidewe-silentrace-heated-jacket',
    section: 'apparel',
    priceLabel: '$159.99',
    compareAt: '$399.99',
    stockNote: 'In stock on TideWe when checked.',
    why: 'A two-piece heated jacket set, with a camo outer layer and a heated mid layer, according to TideWe. A way to layer heat without buying the pieces separately.',
  },
  {
    itemId: 'tidewe-thermcore-heated-vest',
    section: 'apparel',
    priceLabel: 'From $99.99',
    stockNote: 'Men’s sizes were in stock on TideWe when checked; women’s Realtree Edge sizes were not. The official price varied by color.',
    why: 'A fleece heated vest TideWe positions as a mid layer. A lower-cost way to add core heat under a shell you already own.',
  },
  {
    itemId: 'tidewe-thermshift-heated-vest',
    section: 'apparel',
    priceLabel: 'From $108.00',
    stockNote: 'Most sizes were in stock on TideWe when checked. The official price varied by gender, color, and size.',
    why: 'A heated vest TideWe sells for men and women, with a battery pack. Another mid-layer option if the ThermCore color or fit is not right.',
  },
  {
    itemId: 'tidewe-torridseeker-heated-waders',
    section: 'apparel',
    priceLabel: 'From $149.99',
    stockNote: 'All listed sizes were in stock on TideWe when checked. The official price varied by size and by whether a battery is included.',
    why: 'Heated chest waders with an insulated rubber bootfoot, according to TideWe. A fit for cold, wet work when a standalone boot was not in stock.',
  },
  {
    itemId: 'tidewe-aquawade-pro-waders',
    section: 'apparel',
    priceLabel: 'From $239.99',
    compareAt: '$299.99',
    stockNote: 'Several sizes were in stock on TideWe when checked; some sizes and one camo pattern were not. The official price varied by camo pattern.',
    why: 'Insulated breathable chest waders with a waterproof bootfoot TideWe describes as 1,600-gram insulated. A non-heated option if you want more boot insulation and do not need the heated system.',
  },  {
    itemId: 'bogs-bozeman-ii-tall',
    section: 'boots',
    priceLabel: '$185',
    why: 'A tall men’s winter boot listed on Bogs’ official shop as the Bozeman II Tall. Useful when you want a taller shaft for snow or wet cold.',
  },
  {
    itemId: 'bogs-bozeman-ii-vibram-arctic-grip',
    section: 'boots',
    priceLabel: '$220',
    why: 'A men’s snow boot listed on Bogs’ official shop as the Bozeman II Vibram Arctic Grip. A fit when you want the ice-oriented outsole named on the official page.',
  },
  {
    itemId: 'bogs-arcata-ii-lace',
    section: 'boots',
    priceLabel: '$180',
    why: 'A lace-up men’s winter boot listed on Bogs’ official shop as the Arcata II Lace. An everyday winter boot for snow, slush, or wet cold.',
  },
  {
    itemId: 'bogs-arcata-ii-plaid',
    section: 'boots',
    priceLabel: '$185',
    why: 'A women’s winter boot listed on Bogs’ official shop as the Arcata II Plaid. An everyday winter boot for snow, slush, or wet cold.',
  },
  {
    itemId: 'bogs-arcata-urban-ii-leather',
    section: 'boots',
    priceLabel: '$165',
    why: 'A women’s winter boot listed on Bogs’ official shop as the Arcata Urban II Leather. A leather winter boot for everyday cold-weather wear.',
  },
  {
    itemId: 'bogs-arcata-ii-dash-kids',
    section: 'boots',
    priceLabel: '$125',
    why: 'A kid’s winter boot listed on Bogs’ official shop as the Arcata II Dash. A boot to keep by the door for a cold or icy day.',
  },
  {
    itemId: 'bogs-snow-shell-cosmic-forest',
    section: 'boots',
    priceLabel: '$75',
    why: 'A kid’s winter boot listed on Bogs’ official shop as the Snow Shell Boot in Cosmic Forest. A kids’ winter boot for everyday cold-weather wear.',
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
  {
    title: 'TideWe official Inferno product page',
    href: 'https://www.tidewe.com/products/inferno-mens-camo-heated-hunting-jacket-with-battery-pack',
    note: 'Official store starting price $144.99, all listed sizes in stock, read November 24, 2026.',
  },
  {
    title: 'TideWe official SilenTrace product page',
    href: 'https://www.tidewe.com/products/silentrace-heated-hunting-jacket',
    note: 'Official store price $159.99, in stock, read November 24, 2026.',
  },
  {
    title: 'TideWe official ThermCore product page',
    href: 'https://www.tidewe.com/products/heated-vest-double-sided-polar-fleece-hunting-vest-all-gender',
    note: 'Official store starting price $99.99, men’s sizes in stock, read November 24, 2026.',
  },
  {
    title: 'TideWe official ThermShift product page',
    href: 'https://www.tidewe.com/products/tidewe-heated-vest-with-battery-pack-lightweight-and-washable-vest',
    note: 'Official store starting price $108.00, most sizes in stock, read November 24, 2026.',
  },
  {
    title: 'TideWe official TorridSeeker product page',
    href: 'https://www.tidewe.com/products/tidewe-hunting-chest-waders-heated-with-800g-insulation-neoprene-duck-wader-for-men-realtree-max5-camo-waterproof-fishing-waders-size-7-14',
    note: 'Official store starting price $149.99, all listed sizes in stock, read November 24, 2026.',
  },
  {
    title: 'TideWe official AquaWade Pro product page',
    href: 'https://www.tidewe.com/products/tidewe-breathable-insulated-chest-waders-1600g-waterproof-bootfoot-duck-hunting-waders-with-steel-shank-boots',
    note: 'Official store starting price $239.99, some sizes in stock, read November 24, 2026.',
  },  {
    title: 'Bogs official Bozeman II Tall product page',
    href: 'https://www.bogsfootwear.com/shop/style/73452-001.html',
    note: 'Regular list price $185, read from the official page on November 25, 2026.',
  },
  {
    title: 'Bogs official Bozeman II Vibram Arctic Grip product page',
    href: 'https://www.bogsfootwear.com/shop/style/73421-001.html',
    note: 'Regular list price $220, read from the official page on November 25, 2026.',
  },
  {
    title: 'Bogs official Arcata II Lace product page',
    href: 'https://www.bogsfootwear.com/shop/style/73589-001.html',
    note: 'Regular list price $180, read from the official page on November 25, 2026.',
  },
  {
    title: 'Bogs official Arcata II Plaid product page',
    href: 'https://www.bogsfootwear.com/shop/style/73597-302.html',
    note: 'Regular list price $185, read from the official page on November 25, 2026.',
  },
  {
    title: 'Bogs official Arcata Urban II Leather product page',
    href: 'https://www.bogsfootwear.com/shop/style/73592-009.html',
    note: 'Regular list price $165, read from the official page on November 25, 2026.',
  },
  {
    title: 'Bogs official Arcata II Dash product page',
    href: 'https://www.bogsfootwear.com/shop/style/73118-001.html',
    note: 'Regular list price $125, read from the official page on November 25, 2026.',
  },
  {
    title: 'Bogs official Snow Shell Boot (Cosmic Forest) product page',
    href: 'https://www.bogsfootwear.com/shop/style/73377-409.html',
    note: 'Regular list price $75, read from the official page on November 25, 2026.',
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
    category: 'Heated apparel from Amazon-bestseller brands',
    leaders: 'Retail Black Friday coverage on November 22, 2026 listed Soaccks, Beamsks, and ORORO heated vests among live Amazon deals.',
    status: 'No approved program for those brands. We now list TideWe heated jackets, vests, and insulated bootfoot waders from the official TideWe store.',
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
