/**
 * Indestructible Shoes (indestructibleshoes.com) catalog, added Nov 27, 2026.
 * One card per product model. The store lists most models as one page per color, so a card links to one
 * color's exact product page and the offer line says how many colors the store shows. Links are plain
 * (no tracking): the Shoutout/Awin program is pending, see programs 'indestructible-shoes' in
 * packages/catalog/affiliates.ts. Photos are each product's main image from the store, downloaded and
 * self-hosted in /public/directory/photos/ (never hotlinked). Prices come from the store's public product
 * feed on PRICE_CHECKED and use the dated label form that src/lib/price.ts rewrites to
 * "About $X · checked … · may change". Blurbs are our own words; claims are attributed to the maker.
 * Not listed on purpose: three cart "upsell" copies (socks, laces, insoles) of products already here.
 */
import type { CatalogItem } from './full-catalog';
import type { SourceCategoryId } from './source-directory';

export type FootwearSectionId = 'socks' | 'boots' | 'shoes' | 'accessories';

export const PRICE_CHECKED = 'Nov 27, 2026';
const STORE = 'https://indestructibleshoes.com/products/';

export const footwearSections: { id: FootwearSectionId; name: string; blurb: string }[] = [
  { id: 'socks', name: 'Socks: a team favorite', blurb: 'The compression crew socks are a ReadyGearHub team favorite, and a pair is easy to keep by the door or in a go-bag. The store sells them in a 2-pair pack.' },
  { id: 'boots', name: 'High-top work boots', blurb: 'High-ankle models for yard work, mud and storm cleanup. Safety features such as steel toes and waterproofing are the maker\u2019s own claims, so check the product page for your job and your local requirements.' },
  { id: 'shoes', name: 'Work shoes', blurb: 'Low-cut work shoes, mostly sold in several colors. Each card links to one color\u2019s page; the other colors are on the store.' },
  { id: 'accessories', name: 'Insoles, laces and extras', blurb: 'Add-ons the store sells alongside its shoes.' },
];

type Spec = {
  id: string;
  title: string;
  section: FootwearSectionId;
  handle: string;
  /** Lowest price across the colors (a "From" prefix means the colors differ), as the store's feed listed it. */
  price: string;
  /** Date this card's price was read, "Mon D, YYYY". Written by scripts/price-feed.mjs; defaults to PRICE_CHECKED. */
  checked?: string;
  offer: string;
  blurb: string;
  alsoIn?: SourceCategoryId[];
};

const SPECS: Spec[] = [
  { id: 'indestructible-compression-crew-socks', title: 'Compression crew socks, 2 pairs', section: 'socks', handle: 'indestructible-compression-crew-socks', price: '$15', checked: 'Nov 27, 2026', offer: 'Socks, 2-pair pack', blurb: 'Two pairs of crew-length compression socks in sizes 7 to 12, with extra padding and a seamless toe per the maker. Easy to keep a spare pair by the door for long shifts, storm cleanup and travel days.', alsoIn: ['outdoor', 'safety'] },
  { id: 'indestructible-hype-2-boot', title: 'Hype 2.0 work boot', section: 'boots', handle: 'hype-indestructible-shoes', price: '$89', checked: 'Nov 27, 2026', offer: 'High-top work boot, 3 colors', blurb: 'A high-top work boot that the maker lists as waterproof leather with a steel toe, in several colors and a wide-width option. A sensible one to look at for wet yards and muddy cleanup days.', alsoIn: ['outdoor'] },
  { id: 'indestructible-star-101-boot', title: 'Star 101 work boot', section: 'boots', handle: 'star-black', price: '$88', checked: 'Nov 27, 2026', offer: 'High-top work boot, 2 colors', blurb: 'A high-top work boot sold in black or brown, listed by the maker with a waterproof upper, a steel toe and a skid-resistant sole. Worth a look if you spend wet, sloppy days outdoors.', alsoIn: ['outdoor'] },
  { id: 'indestructible-defendr-boot', title: 'Defendr work boot', section: 'boots', handle: 'defendr-grey', price: '$89', checked: 'Nov 27, 2026', offer: 'High-top work boot, 2 colors', blurb: 'A high-top work boot with a water-resistant upper and a steel toe, per the product page. Sold in grey or sand.', alsoIn: ['outdoor'] },
  { id: 'indestructible-j3-boot', title: 'J3 work boot', section: 'boots', handle: 'j3-black', price: '$86', checked: 'Nov 27, 2026', offer: 'High-top work boot, 3 colors', blurb: 'A high-ankle work boot with a listed steel toe and a mesh lining, offered in wide widths. The page shows black, grey and red.' },
  { id: 'indestructible-fable-boot', title: 'Fable work boot', section: 'boots', handle: 'fable-black', price: '$88', checked: 'Nov 27, 2026', offer: 'High-top work boot, 3 colors', blurb: 'A high-top work boot with a listed steel toe and a skid-resistant sole, in black, grey or brown. A fit for garage jobs and hauling storm debris.', alsoIn: ['outdoor'] },
  { id: 'indestructible-ares-boot', title: 'Ares work boot', section: 'boots', handle: 'ares-black', price: '$89', checked: 'Nov 27, 2026', offer: 'High-top work boot', blurb: 'A black high-ankle work boot. The maker lists a steel toe, a mesh lining and a skid-resistant sole.', alsoIn: ['outdoor'] },
  { id: 'indestructible-conquer-boot', title: 'Conquer work boot', section: 'boots', handle: 'conquer-beige', price: '$86', checked: 'Nov 27, 2026', offer: 'High-top work boot', blurb: 'A beige high-top work boot with a steel toe and a mesh lining, according to the maker. Check the page for sizing before you order.' },
  { id: 'indestructible-surge', title: 'Surge work shoe', section: 'shoes', handle: 'surge', price: '$89', checked: 'Nov 27, 2026', offer: 'Work shoe', blurb: 'A lightweight work shoe that the maker lists with a steel toe, a mesh lining and a grippy sole. A practical pick for yard work and the days after a storm.' },
  { id: 'indestructible-bolt', title: 'Bolt work shoe', section: 'shoes', handle: 'steelure-pluse-1', price: '$89', checked: 'Nov 27, 2026', offer: 'Work shoe, 2 colors', blurb: 'A tie-up work shoe sold in black or brown. The product page lists a steel toe, a mesh lining and fire-resistant materials, all as the maker\'s own claims.' },
  { id: 'indestructible-steelure-pluse', title: 'Steelure Pluse work shoe', section: 'shoes', handle: '117-steelure-pluse', price: '$87', checked: 'Nov 27, 2026', offer: 'Work shoe', blurb: 'A work shoe with no-tie laces, so it pulls on fast when you need to check the yard. The maker lists a steel toe and a mesh lining.' },
  { id: 'indestructible-titan', title: 'Titan work shoe', section: 'shoes', handle: 'titan-brown', price: '$85', checked: 'Nov 27, 2026', offer: 'Work shoe', blurb: 'A brown work shoe from the maker\'s Zenex line, listed with a mesh lining and a skid-resistant sole. The page does not name a toe type, so read it before ordering.' },
  { id: 'indestructible-flux', title: 'Flux work shoe', section: 'shoes', handle: 'flux-indestructible-shoes', price: '$85', checked: 'Nov 27, 2026', offer: 'Work shoe', blurb: 'A brown everyday work shoe with a steel toe and a mesh lining, per the maker. Plain, simple and easy to keep by the door.' },
  { id: 'indestructible-onyx', title: 'Onyx work shoe', section: 'shoes', handle: 'onyx-grey', price: '$85', checked: 'Nov 27, 2026', offer: 'Work shoe, 2 colors', blurb: 'A work shoe with a water-resistant upper and a listed steel toe, sold in grey or brown. Handy for wet driveways and soggy mornings.', alsoIn: ['outdoor'] },
  { id: 'indestructible-trekfit', title: 'TrekFit work shoe', section: 'shoes', handle: 'trekfit-black', price: '$85', checked: 'Nov 27, 2026', offer: 'Work shoe, 2 colors', blurb: 'A breathable mesh work shoe with a steel toe, per the maker. Sold in black or brown.' },
  { id: 'indestructible-safetix', title: 'Safetix safety shoe', section: 'shoes', handle: 'safetix-black', price: '$85', checked: 'Nov 27, 2026', offer: 'Work shoe, 3 colors', blurb: 'The maker calls this its all-year safety shoe, and says it is metal-free with electrical insulation. That is the maker\'s claim, so check the page for what it covers before you rely on it.' },
  { id: 'indestructible-flashwalk', title: 'FlashWalk work shoe', section: 'shoes', handle: 'flashwalk-black', price: '$83', checked: 'Nov 27, 2026', offer: 'Work shoe, 3 colors', blurb: 'A steel-toe, mesh-lined work shoe with a skid-resistant sole, per the product page. Comes in black, grey or black and blue.' },
  { id: 'indestructible-dashguard', title: 'DashGuard work shoe', section: 'shoes', handle: 'dashguard-grey-black', price: '$83', checked: 'Nov 27, 2026', offer: 'Work shoe, 2 colors', blurb: 'A work shoe in grey and black or orange and black, with a listed steel toe and slip-resistant sole. One for the garage or the job site.' },
  { id: 'indestructible-capped', title: 'Capped work shoe', section: 'shoes', handle: 'capped-black', price: '$83', checked: 'Nov 27, 2026', offer: 'Work shoe, 2 colors', blurb: 'A work shoe in black or sand with a steel toe and a skid-resistant sole, per the maker. The neutral look suits work, errands and cleanup.' },
  { id: 'indestructible-armara', title: 'Armara work shoe', section: 'shoes', handle: 'armara', price: '$87', checked: 'Nov 27, 2026', offer: 'Work shoe', blurb: 'A work shoe with a listed steel toe, a mesh lining and a skid-resistant sole. A single colorway, so there is only one page to check.' },
  { id: 'indestructible-aura', title: 'Aura work shoe', section: 'shoes', handle: 'aura-black', price: '$86', checked: 'Nov 27, 2026', offer: 'Work shoe, 4 colors', blurb: 'A steel-toe work shoe with a mesh lining, sold in four colors. Pick the one you like and confirm your size on the store page.' },
  { id: 'indestructible-protex', title: 'Protex work shoe', section: 'shoes', handle: 'protex-black', price: '$89', checked: 'Nov 27, 2026', offer: 'Work shoe', blurb: 'A black work shoe that the maker lists with a steel toe, a mesh lining and a skid-resistant sole.' },
  { id: 'indestructible-xeno', title: 'Xeno work shoe', section: 'shoes', handle: 'xeno-black-green', price: '$86', checked: 'Nov 27, 2026', offer: 'Work shoe, 2 colors', blurb: 'A work shoe with accent colors, in black and green or black and red. The page lists a steel toe and a skid-resistant sole.' },
  { id: 'indestructible-space', title: 'Space work shoe', section: 'shoes', handle: 'space-black', price: '$83', checked: 'Nov 27, 2026', offer: 'Work shoe, 2 colors', blurb: 'A steel-toe work shoe with a mesh lining, offered in black or pink. The maker also lists a skid-resistant sole.' },
  { id: 'indestructible-jet', title: 'Jet work shoe', section: 'shoes', handle: 'jet-black', price: '$87', checked: 'Nov 27, 2026', offer: 'Work shoe, 2 colors', blurb: 'A work shoe with no-tie laces and a wide-width option, listed with a steel toe. Easy to slip on, which helps on a rushed morning.' },
  { id: 'indestructible-fator', title: 'Fator work shoe', section: 'shoes', handle: 'fator-black', price: '$83', checked: 'Nov 27, 2026', offer: 'Work shoe', blurb: 'A black work shoe with a steel toe and a mesh lining, per the product page.' },
  { id: 'indestructible-ryder', title: 'Ryder work shoe', section: 'shoes', handle: 'ryder-black', price: '$87', checked: 'Nov 27, 2026', offer: 'Work shoe, 4 colors', blurb: 'A no-tie, mesh-lined work shoe with a listed steel toe. The page quotes an ASTM F2413-18 rating, so check that it matches what your workplace requires. The pink pair is listed for women.' },
  { id: 'indestructible-ryder-1-5', title: 'Ryder 1.5 work shoe', section: 'shoes', handle: 'ryder-1-5-black', price: '$89', checked: 'Nov 27, 2026', offer: 'Work shoe, 3 colors', blurb: 'The Ryder 1.5, a breathable no-tie work shoe with a steel toe per the maker. Sold in black, grey or green.' },
  { id: 'indestructible-flyer', title: 'Flyer work shoe', section: 'shoes', handle: 'flyer-white', price: '$83', checked: 'Nov 27, 2026', offer: 'Work shoe', blurb: 'A white work shoe with a listed steel toe and a skid-resistant sole. White shows dirt, so expect it to look worked-in fast.' },
  { id: 'indestructible-hummer', title: 'Hummer work shoe', section: 'shoes', handle: 'hummer-red', price: '$89', checked: 'Nov 27, 2026', offer: 'Work shoe', blurb: 'A red work shoe with a listed steel toe and a mesh lining. A bright option if you want your pair easy to spot.' },
  { id: 'indestructible-kivini', title: 'Kivini work shoe', section: 'shoes', handle: 'kivini-black-red', price: '$83', checked: 'Nov 27, 2026', offer: 'Work shoe, 2 colors', blurb: 'A steel-toe work shoe with a skid-resistant sole, in black and red or black and green.' },
  { id: 'indestructible-zip', title: 'Zip work shoe', section: 'shoes', handle: 'zip-black', price: '$83', checked: 'Nov 27, 2026', offer: 'Work shoe, 2 colors', blurb: 'A steel-toe work shoe with a mesh lining, sold in black or grey.' },
  { id: 'indestructible-xciter', title: 'Xciter work shoe', section: 'shoes', handle: 'xciter-black', price: '$89', checked: 'Nov 27, 2026', offer: 'Work shoe, 3 colors', blurb: 'A steel-toe work shoe with a mesh lining, offered in black, grey or green.' },
  { id: 'indestructible-xciter-mesh', title: 'Xciter Mesh work shoe', section: 'shoes', handle: 'exciter-mesh-black', price: '$89', checked: 'Nov 27, 2026', offer: 'Work shoe, 3 colors', blurb: 'The Mesh version of the Xciter, with a steel toe and a mesh lining per the maker. Sold in black, grey or green.' },
  { id: 'indestructible-s-series', title: 'S Series work shoe', section: 'shoes', handle: 's-series-black-red', price: '$89', checked: 'Nov 27, 2026', offer: 'Work shoe, 3 colors', blurb: 'A steel-toe work shoe with a skid-resistant sole and a wide-width option, in black with red, yellow or grey accents. The store shows the grey pair as sold out right now.' },
  { id: 'indestructible-ziczac', title: 'Ziczac work shoe', section: 'shoes', handle: 'ziczac-black-red', price: '$89', checked: 'Nov 27, 2026', offer: 'Work shoe', blurb: 'A black and red work shoe with a listed steel toe and a mesh lining.' },
  { id: 'indestructible-camox', title: 'CamoX work shoe', section: 'shoes', handle: 'camox-black-red', price: '$88', checked: 'Nov 27, 2026', offer: 'Work shoe, 2 colors', blurb: 'A work shoe with a waterproof upper and steel toe, per the maker. Sold in black and red or black and white.', alsoIn: ['outdoor'] },
  { id: 'indestructible-origin', title: 'Origin work shoe', section: 'shoes', handle: 'origin-red-black', price: '$88', checked: 'Nov 27, 2026', offer: 'Work shoe', blurb: 'A work shoe that looks like an everyday sneaker. The page lists an anti-puncture base, a skid-resistant sole and electrical insulation, all as the maker\'s claims.' },
  { id: 'indestructible-stripe', title: 'Stripe work shoe', section: 'shoes', handle: 'stripe-orange-blue', price: 'See price', offer: 'Work shoe', blurb: 'A sneaker-style work shoe in orange and blue, with an anti-puncture base and a skid-resistant sole per the maker. The store shows it as sold out right now.' },
  { id: 'indestructible-retro', title: 'Retro work shoe', section: 'shoes', handle: 'retro-black-red', price: '$88', checked: 'Nov 27, 2026', offer: 'Work shoe', blurb: 'A sneaker-style work shoe in black and red. The maker lists an anti-puncture base, shock-absorbing cushioning and a skid-resistant sole.' },
  { id: 'indestructible-insoles', title: 'Comfort and energy work insoles', section: 'accessories', handle: 'indestructible-insoles', price: '$19', checked: 'Nov 27, 2026', offer: 'Insoles', blurb: 'One pair of gel work insoles for men\'s shoe sizes 8 to 12, trim-to-fit, with arch support per the maker. Built for people on hard floors all day.', alsoIn: ['tools'] },
  { id: 'indestructible-no-tie-laces', title: 'No-tie elastic shoelaces', section: 'accessories', handle: 'indestructible-no-tie-shoelaces', price: '$9', checked: 'Nov 27, 2026', offer: 'Laces', blurb: 'A pair of elastic no-tie laces in one size, with a reflective stripe per the maker.', alsoIn: ['tools'] },
  { id: 'indestructible-kneetec', title: 'KneeTec knee support pads', section: 'accessories', handle: 'kneetec-support-pads', price: '$59', checked: 'Nov 27, 2026', offer: 'Knee support', blurb: 'A pair of suede-fabric knee support pads with a strap, sold as joint support. Check the page for sizing and fit.', alsoIn: ['tools'] },
  { id: 'indestructible-ems-foot-pad', title: 'EMS foot massager pad', section: 'accessories', handle: 'ems-foot-massager-pad', price: '$19.99', checked: 'Nov 27, 2026', offer: 'Foot massager', blurb: 'A slip-in foot pad that uses electrical muscle stimulation, with several modes. Read the maker\'s safety notes before you use one.' },
  { id: 'indestructible-vigoleg', title: 'VigoLEG air massager', section: 'accessories', handle: 'vigoleg-air-massager', price: '$89', checked: 'Nov 27, 2026', offer: 'Leg massager', blurb: 'A leg massager sold with a choice of US or EU plug. The store page has no description, so read the product page carefully before you order.' },
  { id: 'indestructible-vigogun', title: 'VigoGUN V2 percussion massager', section: 'accessories', handle: 'vigogun-v2', price: '$89', checked: 'Nov 27, 2026', offer: 'Massager', blurb: 'A rechargeable percussion massager with five speed settings, listed as a 2-pound unit. It is a muscle massager.' },
  { id: 'indestructible-urban-edge-sunglasses', title: 'Urban Edge sunglasses', section: 'accessories', handle: 'urban-edge-sunglasses', price: '$19.99', checked: 'Nov 27, 2026', offer: 'Sunglasses', blurb: 'Men\'s sunglasses with a lightweight frame, listed on the shoe maker\'s store.' },
];

/** Position of a card inside the page: section order first (socks on top), then the order above. */
const ORDER = new Map(SPECS.map((s, i) => [s.id, footwearSections.findIndex((x) => x.id === s.section) * 1000 + i]));
export const footwearRank = (id: string): number => ORDER.get(id) ?? 99999;

export function footwearCatalogItems(): CatalogItem[] {
  return SPECS.map((s): CatalogItem => ({
    id: s.id,
    title: s.title,
    blurb: s.blurb,
    sourceName: 'Indestructible Shoes',
    href: STORE + s.handle,
    rel: 'noopener',
    affiliate: false,
    hideOnPaid: false,
    programId: 'indestructible-shoes',
    category: 'footwear',
    alsoIn: s.alsoIn,
    section: s.section,
    image: `/directory/photos/${s.id}-960.webp`,
    imageKind: 'photo',
    priceLabel: /\$\s?\d/.test(s.price) ? `${s.price} as of ${s.checked ?? PRICE_CHECKED}` : 'See price',
    offerLabel: s.offer,
    ctaLabel: 'Check listing',
    ctaKind: 'listing',
    groups: ['outdoor-auto'],
    kind: 'partner',
    origin: 'directory',
  }));
}
