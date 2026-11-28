/**
 * Winter prep picks for Black Friday / Cyber Monday week 2026.
 * Only items from approved programs with live tracking links.
 * Prices were read from official brand stores on November 23–25, 2026
 * (America/Chicago). If a price could not be confirmed, the card says
 * "See price".
 */
export const PRICE_CHECKED = '2026-11-25';
export const PRICE_CHECKED_LABEL = 'November 23–25, 2026';

export type WinterDealSection = 'lights' | 'power' | 'cold' | 'water' | 'apparel' | 'boots' | 'warmth';

export type WinterDeal = {
  itemId: string;
  section: WinterDealSection;
  /** Display price, or "See price". */
  priceLabel: string;
  /** Date this price was read on the brand's official page (YYYY-MM-DD, from the source notes below). Required whenever priceLabel is a dollar figure. */
  checked?: string;
  /** Only where the brand's own page showed BOTH a list price and a sale price: the list figure, and whose page showed it. */
  compareAt?: string;
  compareSource?: string;
  stockNote?: string;
  why: string;
};

export const winterDealSections: { id: WinterDealSection; title: string; intro: string }[] = [
  {
    id: 'lights',
    title: 'Lights for outages and dark winter work',
    intro:
      'Flashlights and a headlamp from Wuben, an approved partner. Each card shows Wuben’s official-store price and the date we checked it. We only call a price marked down when the store’s own page shows both a list price and a sale price.',
  },
  {
    id: 'power',
    title: 'Backup power for a winter outage',
    intro:
      'Energy reserves from Anker SOLIX and BLUETTI, both approved partners. These are not the week’s Amazon best-seller list; they are the winter-outage gear we can actually send you to with a working partner link. Each card shows the official-store price and the date we checked it. We only mention a discount when the official page showed one.',
  },
  {
    id: 'cold',
    title: 'A self-heating battery for cold weather',
    intro:
      'LiTime’s LiHeat battery is built to warm itself in the cold, according to LiTime. We could not confirm a live price when we checked, so this card says “Price on the store page.”',
  },
  {
    id: 'water',
    title: 'Drinking water if pipes or supply are a problem',
    intro:
      'A countertop iSpring dispenser does not require under-sink plumbing, which can matter if a freeze has you thinking about water at home. We could not confirm a live price when we checked, so this card says “Price on the store page.”',
  },
  {
    id: 'apparel',
    title: 'Heated apparel and insulated waders',
    intro:
      'Heated jackets, heated vests, and insulated bootfoot waders from TideWe, an approved partner. Each card shows the official-store price and the date we checked it. When a product has more than one price by size, color, or whether a battery is included, the price shown can differ from the one for your option. TideWe’s 16-inch rubber hunting boots were not in stock, so we listed insulated bootfoot waders instead.',
  },
  {
    id: 'boots',
    title: 'Winter boots for snow, ice, and wet cold',
    intro:
      'Winter boots from Bogs, an approved partner. The prices below are the regular list prices on Bogs’ official store, each with the date we checked it. We are not listing sale prices or promo codes.',
  },
  {
    id: 'warmth',
    title: 'A heater, hand warmers, a throw, and a snow brush',
    intro:
      'Four specific product pages through Amazon Associates: a small electric heater, disposable hand warmers, a heated throw, and a windshield snow brush. We do not show a price on these cards, because Amazon prices change. Check the product page for the current price.',
  },
];

export const winterDeals: WinterDeal[] = [
  {
    itemId: 'wuben-c3',
    section: 'lights',
    priceLabel: '$24.22',
    checked: '2026-11-27',
    stockNote: 'In stock on Wubenlight when checked.',
    why: 'A compact everyday flashlight. Useful in a kit or a coat pocket when the lights go out.',
  },
  {
    itemId: 'wuben-h4',
    section: 'lights',
    priceLabel: '$23.99',
    checked: '2026-11-27',
    stockNote: 'In stock on Wubenlight when checked.',
    why: 'A rechargeable headlamp keeps both hands free for shoveling, a tire change, or moving around a dark house.',
  },
  {
    itemId: 'wuben-f5',
    section: 'lights',
    priceLabel: '$28.11',
    checked: '2026-11-27',
    stockNote: 'In stock on Wubenlight when checked.',
    why: 'A camping and tent light that can also top up a phone, according to Wuben. Handy as a room light in an outage.',
  },
  {
    itemId: 'wuben-c2',
    section: 'lights',
    priceLabel: 'See price',
    stockNote: 'In stock on Wubenlight when checked.',
    why: 'A brighter everyday flashlight we already mention in the winter car-kit guide.',
  },
  {
    itemId: 'wuben-e12r',
    section: 'lights',
    priceLabel: '$47.19',
    checked: '2026-11-27',
    stockNote: 'The red model was in stock on Wubenlight when checked; the black model was not.',
    why: 'A flashlight that can also act as a power bank, according to Wuben. The official page showed a lower price on the red model.',
  },
  {
    itemId: 'bluetti-ac180',
    section: 'power',
    priceLabel: '$549.00',
    checked: '2026-11-27',
    stockNote: 'In stock on the official BLUETTI store when checked.',
    why: 'Another mid-size energy reserve for outage backup. The official unit price matched the compare-at price, so we are not calling it a sale. BLUETTI’s program lists a sitewide code AFF5OFF for 5% off; check the official checkout, because it may not apply to every item.',
  },
  {
    itemId: 'anker-solix-c2000-gen2',
    section: 'power',
    priceLabel: '$849.99',
    checked: '2026-11-27',
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
    priceLabel: '$129.99',
    checked: '2026-11-27',
    stockNote: 'All listed sizes were in stock on TideWe when checked. The official price varied by size.',
    why: 'A waterproof heated hunting jacket TideWe sells with a battery pack. Useful as a winter outer layer when you want heat you can adjust.',
  },
  {
    itemId: 'tidewe-silentrace-heated-jacket',
    section: 'apparel',
    priceLabel: '$159.99',
    checked: '2026-11-27',
    stockNote: 'In stock on TideWe when checked.',
    why: 'A two-piece heated jacket set, with a camo outer layer and a heated mid layer, according to TideWe. A way to layer heat without buying the pieces separately.',
  },
  {
    itemId: 'tidewe-thermcore-heated-vest',
    section: 'apparel',
    priceLabel: '$99.99',
    checked: '2026-11-27',
    stockNote: 'Men’s sizes were in stock on TideWe when checked; women’s Realtree Edge sizes were not. The official price varied by color.',
    why: 'A fleece heated vest TideWe positions as a mid layer. A lower-cost way to add core heat under a shell you already own.',
  },
  {
    itemId: 'tidewe-thermshift-heated-vest',
    section: 'apparel',
    priceLabel: '$108.00',
    checked: '2026-11-27',
    stockNote: 'Most sizes were in stock on TideWe when checked. The official price varied by gender, color, and size.',
    why: 'A heated vest TideWe sells for men and women, with a battery pack. Another mid-layer option if the ThermCore color or fit is not right.',
  },
  {
    itemId: 'tidewe-torridseeker-heated-waders',
    section: 'apparel',
    priceLabel: '$149.99',
    checked: '2026-11-27',
    stockNote: 'All listed sizes were in stock on TideWe when checked. The official price varied by size and by whether a battery is included.',
    why: 'Heated chest waders with an insulated rubber bootfoot, according to TideWe. A fit for cold, wet work when a standalone boot was not in stock.',
  },
  {
    itemId: 'tidewe-aquawade-pro-waders',
    section: 'apparel',
    priceLabel: '$239.99',
    checked: '2026-11-27',
    stockNote: 'Several sizes were in stock on TideWe when checked; some sizes and one camo pattern were not. The official price varied by camo pattern.',
    why: 'Insulated breathable chest waders with a waterproof bootfoot TideWe describes as 1,600-gram insulated. A non-heated option if you want more boot insulation and do not need the heated system.',
  },  {
    itemId: 'bogs-bozeman-ii-tall',
    section: 'boots',
    priceLabel: '$185',
    checked: '2026-11-27',
    why: 'A tall men’s winter boot listed on Bogs’ official shop as the Bozeman II Tall. Useful when you want a taller shaft for snow or wet cold.',
  },
  {
    itemId: 'bogs-bozeman-ii-vibram-arctic-grip',
    section: 'boots',
    priceLabel: '$220',
    checked: '2026-11-27',
    why: 'A men’s snow boot listed on Bogs’ official shop as the Bozeman II Vibram Arctic Grip. A fit when you want the ice-oriented outsole named on the official page.',
  },
  {
    itemId: 'bogs-arcata-ii-lace',
    section: 'boots',
    priceLabel: '$180',
    checked: '2026-11-27',
    why: 'A lace-up men’s winter boot listed on Bogs’ official shop as the Arcata II Lace. An everyday winter boot for snow, slush, or wet cold.',
  },
  {
    itemId: 'bogs-arcata-ii-plaid',
    section: 'boots',
    priceLabel: '$185',
    checked: '2026-11-27',
    why: 'A women’s winter boot listed on Bogs’ official shop as the Arcata II Plaid. An everyday winter boot for snow, slush, or wet cold.',
  },
  {
    itemId: 'bogs-arcata-urban-ii-leather',
    section: 'boots',
    priceLabel: '$165',
    checked: '2026-11-27',
    why: 'A women’s winter boot listed on Bogs’ official shop as the Arcata Urban II Leather. A leather winter boot for everyday cold-weather wear.',
  },
  {
    itemId: 'bogs-arcata-ii-dash-kids',
    section: 'boots',
    priceLabel: '$125',
    checked: '2026-11-27',
    why: 'A kid’s winter boot listed on Bogs’ official shop as the Arcata II Dash. A boot to keep by the door for a cold or icy day.',
  },
  {
    itemId: 'bogs-snow-shell-cosmic-forest',
    section: 'boots',
    priceLabel: '$75',
    checked: '2026-11-27',
    why: 'A kid’s winter boot listed on Bogs’ official shop as the Snow Shell Boot in Cosmic Forest. A kids’ winter boot for everyday cold-weather wear.',
  },
];


/** Amazon Associates product cards on /winter-deals/ (catalog items, not /gear/ pages). */
export const winterAmazonDealIds = [
  'amz-b000tkdq5c', // Lasko Mini Space Heater
  'amz-b00d7h9lia', // HotHands 10-pair hand warmers
  'amz-b07fl4wvvs', // Sunbeam heated throw
  'amz-b0b39bnhbm', // EcoNour 27-inch ice scraper
] as const;
export const winterDealSources: { title: string; href: string; note: string }[] = [
  {
    title: 'Lasko Mini Space Heater',
    href: 'https://www.amazon.com/dp/B000TKDQ5C',
    note: 'A small electric heater for a desk or bedroom. Handy for warming one room when you cannot heat the whole house.',
  },
  {
    title: 'HotHands Hand Warmers Value Pack (10 Pairs)',
    href: 'https://www.amazon.com/dp/B00D7H9LIA',
    note: 'Air-activated packs that warm your hands for hours. Keep a few in a coat, a glove box, or a go-bag.',
  },
  {
    title: 'Sunbeam Heated Throw Blanket',
    href: 'https://www.amazon.com/dp/B07FL4WVVS',
    note: 'A soft electric throw for the couch. A simple way to stay warm without heating the whole house.',
  },
  {
    title: 'EcoNour 27-inch Ice Scraper and Snow Brush (2-Pack)',
    href: 'https://www.amazon.com/dp/B0B39BNHBM',
    note: 'Clears frost and snow off a windshield and roof before you drive. A simple winter must-have for every vehicle.',
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
    note: 'Official product page, listed as a preorder when checked. The price and the date it was checked are on its card above.',
  },
  {
    title: 'BLUETTI official AC180 product page',
    href: 'https://www.bluettipower.com/products/ac180',
    note: 'Official product page, in stock when checked. The price and the date it was checked are on its card above.',
  },
  {
    title: 'Wubenlight official product pages',
    href: 'https://www.wubenlight.com/',
    note: 'Prices for the C3, H4, F5, C2 and E12R come from each product’s official page. Each card above shows its price and the date it was checked, or “Price on the store page” where none was confirmed.',
  },
  {
    title: 'TideWe official Inferno product page',
    href: 'https://www.tidewe.com/products/inferno-mens-camo-heated-hunting-jacket-with-battery-pack',
    note: 'Official product page, all listed sizes in stock when checked. The price and the date it was checked are on its card above.',
  },
  {
    title: 'TideWe official SilenTrace product page',
    href: 'https://www.tidewe.com/products/silentrace-heated-hunting-jacket',
    note: 'Official product page, in stock when checked. The price and the date it was checked are on its card above.',
  },
  {
    title: 'TideWe official ThermCore product page',
    href: 'https://www.tidewe.com/products/heated-vest-double-sided-polar-fleece-hunting-vest-all-gender',
    note: 'Official product page, men’s sizes in stock when checked. The price and the date it was checked are on its card above.',
  },
  {
    title: 'TideWe official ThermShift product page',
    href: 'https://www.tidewe.com/products/tidewe-heated-vest-with-battery-pack-lightweight-and-washable-vest',
    note: 'Official product page, most sizes in stock when checked. The price and the date it was checked are on its card above.',
  },
  {
    title: 'TideWe official TorridSeeker product page',
    href: 'https://www.tidewe.com/products/tidewe-hunting-chest-waders-heated-with-800g-insulation-neoprene-duck-wader-for-men-realtree-max5-camo-waterproof-fishing-waders-size-7-14',
    note: 'Official product page, all listed sizes in stock when checked. The price and the date it was checked are on its card above.',
  },
  {
    title: 'TideWe official AquaWade Pro product page',
    href: 'https://www.tidewe.com/products/tidewe-breathable-insulated-chest-waders-1600g-waterproof-bootfoot-duck-hunting-waders-with-steel-shank-boots',
    note: 'Official product page, some sizes in stock when checked. The price and the date it was checked are on its card above.',
  },  {
    title: 'Bogs official Bozeman II Tall product page',
    href: 'https://www.bogsfootwear.com/shop/style/73452-001.html',
    note: 'Regular list price on the official page. The price and the date it was checked are on its card above.',
  },
  {
    title: 'Bogs official Bozeman II Vibram Arctic Grip product page',
    href: 'https://www.bogsfootwear.com/shop/style/73421-001.html',
    note: 'Regular list price on the official page. The price and the date it was checked are on its card above.',
  },
  {
    title: 'Bogs official Arcata II Lace product page',
    href: 'https://www.bogsfootwear.com/shop/style/73589-001.html',
    note: 'Regular list price on the official page. The price and the date it was checked are on its card above.',
  },
  {
    title: 'Bogs official Arcata II Plaid product page',
    href: 'https://www.bogsfootwear.com/shop/style/73597-302.html',
    note: 'Regular list price on the official page. The price and the date it was checked are on its card above.',
  },
  {
    title: 'Bogs official Arcata Urban II Leather product page',
    href: 'https://www.bogsfootwear.com/shop/style/73592-009.html',
    note: 'Regular list price on the official page. The price and the date it was checked are on its card above.',
  },
  {
    title: 'Bogs official Arcata II Dash product page',
    href: 'https://www.bogsfootwear.com/shop/style/73118-001.html',
    note: 'Regular list price on the official page. The price and the date it was checked are on its card above.',
  },
  {
    title: 'Bogs official Snow Shell Boot (Cosmic Forest) product page',
    href: 'https://www.bogsfootwear.com/shop/style/73377-409.html',
    note: 'Regular list price on the official page. The price and the date it was checked are on its card above.',
  },
];

export const winterDealGaps: { category: string; leaders: string; status: string }[] = [
  {
    category: 'Heated apparel from other bestseller brands',
    leaders: 'Retail Black Friday coverage on November 22, 2026 listed Soaccks, Beamsks, and ORORO heated vests among live deals.',
    status: 'No approved program for those brands. We list TideWe heated jackets, vests, and insulated bootfoot waders from the official TideWe store.',
  },
  {
    category: 'Car winter kits and jump starters',
    leaders: 'Automotive safety-kit lists and winter-kit roundups often feature bundled roadside kits. On our own site, a NOCO Boost GB40 page drew one affiliate_click, but that was a plain official link.',
    status: 'No approved brand program for NOCO or winter car-kit brands. Pelican has not been added yet. We do list a specific EcoNour ice scraper through Amazon Associates.',
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
