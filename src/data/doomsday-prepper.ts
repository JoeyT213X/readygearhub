/**
 * Doomsday Prepper directory category (Nov 25, 2026).
 *
 * - NEW items below are official US/allied maker or shop pages. No partner program is approved for any of them,
 *   so every card is a plain official link (rel=noopener, no tracking) until a program is approved in
 *   packages/catalog/affiliates.ts. Prices appear only where the maker publishes one; each is dated.
 * - CROSS-LISTED items already live in another category. They are tagged here only (alsoIn), never removed
 *   or moved from their home category, so every other category keeps its full count.
 * - Order inside a section is the curation order: U.S. makers first, then allied, then quality. Payout is the tie-breaker.
 * - No weapons, ammunition or weapon accessories (BOTS.md rule 4); no DJI/Autel/Unitree, no Entity List / 1260H names.
 */
import type { HighTicketItem } from './high-ticket';

export type DoomsdaySectionId =
  | 'shelters' | 'vehicles' | 'perimeter' | 'air-water' | 'food' | 'energy' | 'comms' | 'medical' | 'tools';

export const doomsdaySections: { id: DoomsdaySectionId; name: string; blurb: string; photo: string }[] = [
  { id: 'shelters', name: 'Shelters & Bunkers', photo: 'hero-bunker-hatch', blurb: 'Underground shelters, safe rooms, blast doors and rapid-deploy shelters. Most are built to order, so pricing and lead times come from the maker.' },
  { id: 'vehicles', name: 'Extreme Vehicles', photo: 'hero-overland-cruiser', blurb: 'Armored, overland and expedition rigs, plus the recovery, fuel and trail gear that goes with them.' },
  { id: 'perimeter', name: 'Perimeter & Security', photo: 'stock-security-fence', blurb: 'High-security fencing, gates, bollards and barriers, plus cameras, alarms and patrol tech for the property line.' },
  { id: 'air-water', name: 'Air, Water & NBC', photo: 'stock-gas-masks', blurb: 'Respirators, filtration and the water systems that keep a household supplied. Follow each maker’s instructions and replacement schedule.' },
  { id: 'food', name: 'Long-Term Food', photo: 'hero-food-shelves', blurb: 'Freeze-dried and shelf-stable food in buckets, pails and pouches, plus a way to put up your own.' },
  { id: 'energy', name: 'Energy Reserves', photo: 'hero-bluetti-official', blurb: 'Energy reserves, home batteries, generators and solar for long outages and off-grid sites. Fuel-burning gear needs outdoor use, ventilation per the manual and a CO alarm.' },
  { id: 'comms', name: 'Comms', photo: 'hero-radios', blurb: 'Satellite messengers, two-way radios and weather radios for when cell service is gone.' },
  { id: 'medical', name: 'Medical', photo: 'hero-first-aid-crisp', blurb: 'Trauma, first-aid and defibrillator gear. Get hands-on training from the Red Cross or a local course; call 911 first in an emergency.' },
  { id: 'tools', name: 'Tools & Field Gear', photo: 'multitools', blurb: 'Multi-tools, lights, cold-weather and shelter-in-place gear that earn their place in any kit.' },
];

export type DoomsdayNew = HighTicketItem & { section: DoomsdaySectionId };

/** Internal status only: no partner program is approved for these brands (affiliateUrl stays null). Never shown on cards. */
const SITE = '';
const mk = (o: Omit<DoomsdayNew, 'category' | 'groups' | 'affiliateUrl' | 'ctaKind'> & { ctaKind?: HighTicketItem['ctaKind'] }): DoomsdayNew => ({
  category: 'doomsday-prepper', groups: ['safety-prep'], affiliateUrl: null, ctaKind: 'details', ...o,
});

export const doomsdayNewItems: DoomsdayNew[] = [
  // ---- Shelters & Bunkers ----
  // Rising S Bunkers (risingsbunkers.com) removed Nov 27, 2026: the official site keeps returning HTTP 502. Re-add when it loads again.
  mk({ id: 'american-safe-room', section: 'shelters', us: true, title: 'American Safe Room', sourceName: 'American Safe Room (Oregon)', fallbackUrl: 'https://americansaferoom.com/', image: '/images/photos/stock-vault-doors-960.webp', imageKind: 'photo', offerLabel: 'Shelter kits and blast doors', cta: 'Request details', ctaKind: 'inquire',
    blurb: 'Oregon maker of underground shelter kits, blast-resistant doors and hatches, and the ASR Safe Cell NBC air-filtration system. Technical manuals are public on its site; quotes by request.' }),
  mk({ id: 'survive-a-storm', section: 'shelters', us: true, title: 'Survive-A-Storm Shelters', sourceName: 'Survive-A-Storm (Oklahoma)', fallbackUrl: 'https://survive-a-storm.com/', image: '/images/photos/hero-bunker-hatch-960.webp', imageKind: 'photo', offerLabel: 'Storm shelters', cta: 'See shelters',
    blurb: 'Oklahoma maker of above-ground and below-ground steel storm shelters, which it describes as FEMA/ICC compliant.' }),
  mk({ id: 'shiftpod-shelters', section: 'shelters', us: true, title: 'SHIFTPOD rapid-deploy shelters', sourceName: 'SHIFTPOD (Advanced Shelter Systems)', fallbackUrl: 'https://shiftpod.com/', image: '/images/photos/hero-tent-stars-960.webp', imageKind: 'photo', offerLabel: 'Portable shelter', cta: 'See shelters',
    blurb: 'Integrated-frame tents with reflective, multi-layer insulated fabric, built for quick setup. A fit for a bug-out camp, work site or backup room.' }),

  // ---- Extreme Vehicles ----
  mk({ id: 'alpine-armoring', section: 'vehicles', us: true, title: 'Alpine Armoring', sourceName: 'Alpine Armoring (Virginia)', fallbackUrl: 'https://www.alpineco.com/', image: '/directory/photos/alpine-armoring-960.webp', imageKind: 'photo', offerLabel: 'Armored vehicles', cta: 'Request a quote', ctaKind: 'inquire', price: 'Alpine lists A4-level armoring at $75,000–$200,000 (as of Nov 27, 2026)',
    blurb: 'Virginia manufacturer of civilian and government armored SUVs, sedans, vans and trucks. Alpine says civilians can buy armored vehicles in the US with no federal restrictions; state road rules and insurance still apply.' }),
  mk({ id: 'four-wheel-campers', section: 'vehicles', us: true, title: 'Four Wheel Campers', sourceName: 'Four Wheel Campers (California)', fallbackUrl: 'https://www.fourwheelcampers.com/', image: '/directory/photos/four-wheel-campers-960.webp', imageKind: 'photo', offerLabel: 'Truck campers', cta: 'See campers',
    blurb: 'California builder of lightweight pop-up truck campers for pickups and flatbeds.' }),
  mk({ id: 'warn-industries', section: 'vehicles', us: true, title: 'WARN Industries winches and recovery gear', sourceName: 'WARN Industries (Oregon)', fallbackUrl: 'https://www.warn.com/', image: '/images/photos/hero-offroad-close-960.webp', imageKind: 'photo', offerLabel: 'Recovery gear', cta: 'See gear',
    blurb: 'Oregon maker of winches, hubs and recovery gear for trucks, Jeeps and UTVs.' }),
  mk({ id: 'rotopax', section: 'vehicles', us: true, title: 'RotopaX fuel and water containers', sourceName: 'RotopaX (Arizona)', fallbackUrl: 'https://rotopax.com/', image: '/images/photos/hero-overland-truck-960.webp', imageKind: 'photo', offerLabel: 'Mountable containers', cta: 'See containers',
    blurb: 'Rotationally molded fuel and water containers with vehicle mounting systems. Store fuel only as the container labeling and local rules allow.' }),
  mk({ id: 'arb-usa', section: 'vehicles', title: 'ARB 4x4 Accessories', sourceName: 'ARB USA (Australian maker, US operations)', fallbackUrl: 'https://arbusa.com/', image: '/images/photos/hero-offroad-close-960.webp', imageKind: 'photo', offerLabel: 'Bumpers, lockers, recovery', cta: 'See gear',
    blurb: 'Off-road equipment since 1975: air lockers, bull bars, recovery gear and suspension. Australia is a US ally.' }),
  mk({ id: 'inspired-overland', section: 'vehicles', title: 'Inspired Overland rooftop tents', sourceName: 'Inspired Overland', fallbackUrl: 'https://inspiredoverland.com/', image: '/images/photos/hero-tent-stars-960.webp', imageKind: 'photo', offerLabel: 'Rooftop tents', cta: 'See tents',
    blurb: 'Lightweight rooftop tents, awnings and overland gear.' }),
  mk({ id: 'baja-designs', section: 'vehicles', us: true, title: 'Baja Designs lighting', sourceName: 'Baja Designs (California)', fallbackUrl: 'https://www.bajadesigns.com/', image: '/images/photos/hero-utv-dunes-960.webp', imageKind: 'photo', offerLabel: 'Off-road lighting', cta: 'See lights',
    blurb: 'California maker of LED and laser off-road lighting for trucks, Jeeps, UTVs and bikes.' }),

  // ---- Perimeter & Security ----
  mk({ id: 'ameristar-perimeter', section: 'perimeter', us: true, title: 'Ameristar Perimeter Security', sourceName: 'Ameristar (Tulsa, Oklahoma; ASSA ABLOY)', fallbackUrl: 'https://www.ameristarperimeter.com/', image: '/images/photos/stock-security-fence-960.webp', imageKind: 'photo', offerLabel: 'Fence, gates, bollards', cta: 'Request details', ctaKind: 'inquire',
    blurb: 'Oklahoma manufacturer of ornamental and high-security fence, gates, anti-ram barriers and bollards, sold through regional sales reps and installers. Pricing is by quote.' }),
  mk({ id: 'gibraltar-perimeter', section: 'perimeter', us: true, title: 'Gibraltar Perimeter Security', sourceName: 'Gibraltar (Burnet, Texas)', fallbackUrl: 'https://www.gibraltarperimetersecurity.com/', image: '/images/photos/stock-security-fence-960.webp', imageKind: 'photo', offerLabel: 'Anti-ram barriers and fence', cta: 'Request details', ctaKind: 'inquire',
    blurb: 'Texas maker of crash-rated vehicle barriers, bollards and high-security fence and gate systems, aimed at commercial and government sites. Quotes by request.' }),
  mk({ id: 'amico-security', section: 'perimeter', us: true, title: 'AMICO Security', sourceName: 'AMICO Security (Birmingham, Alabama)', fallbackUrl: 'https://amicosecurity.com/', image: '/images/photos/stock-security-fence-960.webp', imageKind: 'photo', offerLabel: 'Security fence and barriers', cta: 'Request details', ctaKind: 'inquire',
    blurb: 'Alabama maker of metal and wire-mesh security fencing and bollard vehicle barriers. Quotes by request.' }),
  mk({ id: 'mulholland-brand', section: 'perimeter', us: true, title: 'Mulholland Brand aluminum fence and gates', sourceName: 'Mulholland Brand (Canoga Park, California)', fallbackUrl: 'https://mulhollandbrand.com/', image: '/images/photos/stock-security-fence-960.webp', imageKind: 'photo', offerLabel: 'Fence and gates', cta: 'Request a quote', ctaKind: 'inquire',
    blurb: 'Aluminum gates, fences, railings and pergolas built in its California factory.' }),
  mk({ id: 'liftmaster-gate-operators', section: 'perimeter', us: true, title: 'LiftMaster gate operators and access control', sourceName: 'LiftMaster (Chamberlain Group, Illinois)', fallbackUrl: 'https://www.liftmaster.com/', image: '/images/photos/stock-security-fence-960.webp', imageKind: 'photo', offerLabel: 'Gate openers', cta: 'See gear',
    blurb: 'Residential and commercial gate openers and access control, usually installed by a dealer. Follow the maker’s safety-sensor requirements.' }),

  // ---- Air, Water & NBC ----
  mk({ id: 'mira-safety', section: 'air-water', us: true, title: 'MIRA Safety CBRN gas masks and filters', sourceName: 'MIRA Safety (Texas)', fallbackUrl: 'https://www.mirasafety.com/', image: '/images/photos/stock-gas-masks-960.webp', imageKind: 'photo', offerLabel: 'Respirators', cta: 'See respirators',
    blurb: 'Texas maker of CBRN respirators, filters and protective gear for civil defense, industry and civilians. Learn fit-testing and filter shelf life from the maker before relying on one.' }),
  mk({ id: 'alexapure', section: 'air-water', alsoIn: ['water'], us: true, title: 'AlexaPure gravity water filters', sourceName: 'AlexaPure (Utah)', fallbackUrl: 'https://www.alexapure.com/', image: '/directory/photos/alexapure-960.webp', imageKind: 'photo', offerLabel: 'Gravity filter', cta: 'See details',
    blurb: 'Utah company that makes gravity water filters, including the AlexaPure Pro.' }),
  mk({ id: 'my-patriot-supply-alexapure-pro', section: 'air-water', alsoIn: ['water'], us: true, title: 'Alexapure Pro water filter', sourceName: 'My Patriot Supply (Idaho)', fallbackUrl: 'https://www.mypatriotsupply.com/products/alexapure-pro-water-filtration-system', image: '/directory/photos/my-patriot-supply-alexapure-pro-960.webp', imageKind: 'photo', offerLabel: 'Gravity filter', cta: 'Check listing', price: 'About $280 · checked Nov 27, 2026 · may change',
    blurb: 'A stainless, gravity-fed countertop filter sold by My Patriot Supply. It does not need electricity or plumbing. The product page lists 2.5-gallon chambers and a filter life of up to 200 gallons; extra filters, sold separately, can be added for faster flow. The maker says it is not currently sold to California customers.' }),

  // ---- Long-Term Food ----
  mk({ id: 'my-patriot-supply', section: 'food', us: true, title: 'My Patriot Supply', sourceName: 'My Patriot Supply (Idaho)', fallbackUrl: 'https://mypatriotsupply.com/', image: '/directory/photos/my-patriot-supply-960.webp', imageKind: 'photo', offerLabel: 'Food and supplies', cta: 'Visit site',
    blurb: 'Idaho company with long-term food kits, seeds and emergency supplies.' }),
  mk({ id: 'my-patriot-supply-emergency-food', section: 'food', alsoIn: ['food'], us: true, title: 'My Patriot Supply emergency food collection', sourceName: 'My Patriot Supply (Idaho)', fallbackUrl: 'https://mypatriotsupply.com/', image: '/directory/photos/my-patriot-supply-emergency-food-960.webp', imageKind: 'photo', offerLabel: 'Emergency food', cta: 'Check listing',
    blurb: 'A collection of freeze-dried and shelf-stable meals from this Idaho company, from short kits to longer household supplies.' }),
  mk({ id: 'ready-hour', section: 'food', alsoIn: ['food'], us: true, title: 'Ready Hour emergency food kits', sourceName: 'Ready Hour (Utah)', fallbackUrl: 'https://www.readyhour.com/', image: '/directory/photos/ready-hour-960.webp', imageKind: 'photo', offerLabel: 'Emergency food', cta: 'Buy now',
    blurb: 'Utah company with emergency food kits, including 3-month and 4-week household supplies.' }),
  mk({ id: 'beprepared', section: 'food', alsoIn: ['food'], us: true, title: 'BePrepared emergency food and supplies', sourceName: 'BePrepared / Emergency Essentials (Utah)', fallbackUrl: 'https://www.beprepared.com/', image: '/directory/photos/beprepared-960.webp', imageKind: 'photo', offerLabel: 'Food storage', cta: 'Check listing',
    blurb: 'Utah company, also known as Emergency Essentials, that sells long-term food storage and emergency supplies.' }),
  mk({ id: 'my-patriot-supply-2-week-food', section: 'food', alsoIn: ['food'], us: true, title: '2-Week Emergency Food Supply', sourceName: 'My Patriot Supply (Idaho)', fallbackUrl: 'https://www.mypatriotsupply.com/products/2-week-food-supply-70', image: '/directory/photos/my-patriot-supply-2-week-food-960.webp', imageKind: 'photo', offerLabel: 'Emergency food', cta: 'Check listing', price: 'About $148 · checked Nov 27, 2026 · may change',
    blurb: 'One bucket of Ready Hour meals from this Idaho company, listed at 2,000+ calories a day for one person for two weeks (114 servings, about 16 pounds). The maker says unopened pouches can keep up to 25 years when stored as directed. Meals need water and heat.' }),
  mk({ id: 'my-patriot-supply-4-week-food', section: 'food', alsoIn: ['food'], us: true, title: '4-Week Emergency Food Supply', sourceName: 'My Patriot Supply (Idaho)', fallbackUrl: 'https://www.mypatriotsupply.com/products/4-week-emergency-food-supply-2-000-calories-day', image: '/directory/photos/my-patriot-supply-4-week-food-960.webp', imageKind: 'photo', offerLabel: 'Emergency food', cta: 'See details', price: 'About $278 · checked Nov 27, 2026 · may change',
    blurb: 'Two buckets of Ready Hour meals from My Patriot Supply, listed at 2,000+ calories a day for one person for four weeks (250 servings). The maker says unopened pouches can keep up to 25 years when stored as directed. Meals need water and heat. As of Nov 27, 2026, the product page listed a 10-12 week shipping time and a limit of two per person.' }),
  mk({ id: 'my-patriot-supply-3-month-food', section: 'food', alsoIn: ['food'], us: true, title: '3-Month Emergency Food Supply', sourceName: 'My Patriot Supply (Idaho)', fallbackUrl: 'https://www.mypatriotsupply.com/products/3-month-emergency-food-supply-2-000-calories-day', image: '/directory/photos/my-patriot-supply-3-month-food-960.webp', imageKind: 'photo', offerLabel: 'Emergency food', cta: 'Buy now', price: 'About $798 · checked Nov 27, 2026 · may change',
    blurb: 'A Ready Hour kit packed in six buckets. The official product page lists 2,000+ calories a day for one person for 90 days (846 servings) and a shelf life of up to 25 years if stored as they direct. Meals need water and a heat source. Purchases are limited to two per person.' }),
  mk({ id: 'my-patriot-supply-gluten-free-kit', section: 'food', alsoIn: ['food'], us: true, title: 'Gluten-Free Emergency Food Kit', sourceName: 'My Patriot Supply (Idaho)', fallbackUrl: 'https://www.mypatriotsupply.com/products/gluten-free-kit', image: '/directory/photos/my-patriot-supply-gluten-free-kit-960.webp', imageKind: 'photo', offerLabel: 'Gluten-free food', cta: 'Visit site', price: 'About $150 · checked Nov 27, 2026 · may change',
    blurb: 'A Ready Hour gluten-free kit from My Patriot Supply, listed at 120 servings and 2,000+ calories a day for about 10 days, in 11 varieties. The maker says unopened pouches can keep up to 25 years when stored as directed. Meals need water and heat. If gluten is a medical concern, check the current ingredient lists on the product page.' }),
  mk({ id: 'harvest-right', section: 'food', us: true, title: 'Harvest Right home freeze dryers', sourceName: 'Harvest Right (Utah)', fallbackUrl: 'https://harvestright.com/', image: '/images/photos/hero-pantry-cans-960.webp', imageKind: 'photo', offerLabel: 'Freeze dryers', cta: 'See freeze dryers',
    blurb: 'Home freeze dryers from this Utah company, for putting up your own long-term food.' }),

  // ---- Energy Reserves ----
  mk({ id: 'grid-doctor-3300-emp', section: 'energy', alsoIn: ['power'], us: true, title: 'Grid Doctor 3300 solar generator', sourceName: 'My Patriot Supply (Idaho)', fallbackUrl: 'https://www.mypatriotsupply.com/products/grid-doctor-3300-emp-solar-generator', image: '/directory/photos/grid-doctor-3300-emp-960.webp', imageKind: 'photo', offerLabel: 'Prepper Power', cta: 'See details', price: 'About $2,997 · checked Nov 27, 2026 · may change',
    blurb: 'A 3,300-watt solar generator system sold by My Patriot Supply, with a 2,048 Wh lithium iron phosphate battery and the maker\'s EMP Intercept protection. The current kit includes a 200-watt waterproof solar panel. It can charge from the wall, a car outlet or solar. This is backup power, not a device that attaches to a home electrical panel.' }),
  mk({ id: 'tesla-powerwall', section: 'energy', us: true, title: 'Tesla Powerwall home battery', sourceName: 'Tesla', fallbackUrl: 'https://www.tesla.com/powerwall', image: '/images/photos/stock-solar-panel-960.webp', imageKind: 'photo', offerLabel: 'Home battery', cta: 'See home battery',
    blurb: 'Whole-home battery storage that works with solar and can back up the house in an outage. A licensed installer, a permit and a utility interconnection are normally required.' }),
  mk({ id: 'enphase-battery', section: 'energy', us: true, title: 'Enphase IQ Battery', sourceName: 'Enphase Energy (California)', fallbackUrl: 'https://enphase.com/', image: '/images/photos/solar-rooftops-960.webp', imageKind: 'photo', offerLabel: 'Home battery', cta: 'See batteries',
    blurb: 'Modular home batteries and solar microinverters, sold and installed through Enphase installers.' }),

  // ---- Comms ----
  mk({ id: 'starlink', section: 'comms', us: true, title: 'Starlink satellite internet', sourceName: 'Starlink (SpaceX)', fallbackUrl: 'https://www.starlink.com/', image: '/images/photos/hero-radios-960.webp', imageKind: 'photo', offerLabel: 'Satellite internet', cta: 'See plans',
    blurb: 'Satellite internet for homes, vehicles and remote sites.' }),
  mk({ id: 'rugged-radios', section: 'comms', us: true, title: 'Rugged Radios', sourceName: 'Rugged Radios (California)', fallbackUrl: 'https://www.ruggedradios.com/', image: '/images/photos/hero-radios-960.webp', imageKind: 'photo', offerLabel: 'GMRS and vehicle radios', cta: 'See radios',
    blurb: 'California maker of GMRS two-way radios, intercoms and headsets for trucks, UTVs and convoys. GMRS needs an FCC license in the US.' }),

  // ---- Medical ----
  mk({ id: 'north-american-rescue', section: 'medical', us: true, title: 'North American Rescue', sourceName: 'North American Rescue (South Carolina)', fallbackUrl: 'https://www.narescue.com/', image: '/images/photos/hero-first-aid-crisp-960.webp', imageKind: 'photo', offerLabel: 'Trauma and medical gear', cta: 'See gear',
    blurb: 'South Carolina maker of trauma kits, tourniquets and medical gear used by responders and civilians. Train before you need it.' }),

  // ---- Tools & Field Gear ----
  mk({ id: 'pelican-cases', section: 'tools', us: true, title: 'Pelican protective cases', sourceName: 'Pelican (California)', fallbackUrl: 'https://www.pelican.com/us/en', image: '/images/photos/multitools-960.webp', imageKind: 'photo', offerLabel: 'Hard cases', cta: 'See cases',
    blurb: 'Rugged protective cases made in the USA, a common choice for radios, medical kits and documents.' }),
  mk({ id: 'estwing-tools', section: 'tools', us: true, title: 'Estwing hand tools', sourceName: 'Estwing (Illinois)', fallbackUrl: 'https://www.estwing.com/', image: '/images/photos/stock-drill-960.webp', imageKind: 'photo', offerLabel: 'Hammers and hand tools', cta: 'See tools',
    blurb: 'Illinois maker of one-piece forged hammers, hatchets and hand tools.' }),
  mk({ id: 'my-patriot-supply-72-hour-go-bag', section: 'tools', alsoIn: ['food', 'outdoor', 'tools'], us: true, title: '72-Hour Go Bag', sourceName: 'My Patriot Supply (Idaho)', fallbackUrl: 'https://www.mypatriotsupply.com/products/go-bag', image: '/directory/photos/my-patriot-supply-72-hour-go-bag-960.webp', imageKind: 'photo', offerLabel: '72-hour kit', cta: 'Buy now', price: 'About $236 · checked Nov 27, 2026 · may change',
    blurb: 'A Ready Hour backpack kit from My Patriot Supply for the first three days away from home. It includes a 72-hour food pack (the maker lists 2,000+ calories a day for one person for three days), a filter bottle, eight water pouches, a small tent, a sleeping bag, a headlamp, fire starters and a compact cook set. The included water pouches are not a full three-day water supply, and the meals still need more water and a heat source.' }),
];

/**
 * Items that already live in another category. Cross-listed here only. Order = curation order within each section
 * (U.S. makers first, then allied). Ids that are not in the catalog are ignored at build time and reported by the test.
 */
export const doomsdayCrossList: Record<DoomsdaySectionId, string[]> = {
  shelters: ['atlas-survival-shelters-official', 'terra-vivos-official', 'redi-shop'],
  vehicles: [
    'earthroamer-official', 'storyteller-overland-official', 'storyteller-mode-vans', 'sportsmobile-official', 'rezvani-official', 'inkas-official',
    'jeep-wrangler', 'jeep-gladiator', 'toyota-land-cruiser', 'toyota-tacoma', 'toyota-4runner', 'toyota-tundra-2027', 'rivian-r1t', 'rivian-r1s',
    'land-rover-defender', 'ineos-grenadier', 'polaris-official', 'can-am-official', 'can-am-off-road', 'midland-overlanding-collection',
    'noco-boost-gb40', 'eton-roadguard-jump-starter', 'redi-the-roadie-pro', 'redi-roadie-plus',
  ],
  perimeter: [
    'knightscope-official', 'skydio-official', 'simplisafe-shop', 'arlo-official', 'ring-official', 'ring-battery-doorbell-4k-pro',
    'google-nest-cam-indoor-wired-3rd-gen', 'cove', 'wuben-a1', 'wuben-x1-pro', 'goal-zero-lighthouse-600',
  ],
  'air-water': [
    'berkey-big-berkey', 'berkey-travel-berkey', 'berkey-shop', 'aquasana-healthshield-whole-house', 'aquasana-whole-house', 'aquasana-healthshield-ro-matte-black',
    'ispring-rcc7', 'ispring-wgb32b', 'epic-smart-shield-max', 'epic-smart-shield', 'epic-pure-xp-pitcher',
    'grayl-geopress-24oz', 'grayl-ultrapress-16-9oz', 'sawyer-squeeze-water-filter', 'sawyer-mini-water-filter', 'katadyn-befree-0-6l',
    'lifestraw-family', 'lifestraw-personal', 'lifestraw-straw-emergency-pack', 'datrex-emergency-water-dx1000w',
    'reliance-jumbo-tainer-2', 'reliance-aqua-tainer', 'waterbob', 'kidde-kn-cob-lp2', 'eton-blackout-buddy-co', 'eton-blackout-buddy-h2o', 'kidde-smart-combo-smoke-co', 'mira-safety',
  ],
  food: [
    'readywise-1-month-two-bucket-bundle', 'readywise-4-week-food-supply', 'readywise-powdered-eggs-144-servings', 'readywise-5-day-survival-backpack', 'readywise-72-hour-food-kit',
    'mountain-house-classic-bucket', 'mountain-house-beef-stew-pouch', 'mountain-house-breakfast-skillet-pouch', 'mountain-house-macaroni-cheese-2-pack', 'mountain-house-best-sellers-kit',
    'legacy-premium-240-serving-package', 'legacy-120-serving-entree-bucket', 'legacy-60-serving-entree-bucket',
    'augason-farms-3-month-emergency-food', 'augason-farms-30-day-1-person', 'augason-farms-lunch-dinner-variety-pail', 'augason-farms-grab-and-go-backpack',
    'backpackers-pantry-14-day-emergency-kit-meat', 'backpackers-pantry-3-day-meal-kit-meat', 'survival-frog-beef-canned-meat', 'survival-frog',
  ],
  energy: [
    'goal-zero-yeti-1500', 'goal-zero-yeti-500', 'goal-zero-yeti-700', 'goal-zero-nomad-100-plus', 'goal-zero-nomad-50',
    'generac-iq3500', 'generac', 'honda-eu3200i', 'honda-eu2200i', 'honda-power', 'renogy-100w-12v-solar-kit',
    'ecoflow-delta-pro-ultra', 'ecoflow-delta-3-plus', 'ecoflow-river-3-plus', 'ecoflow-400w-portable-solar-panel', 'ecoflow-glacier-classic',
    'anker-solix-f3800-plus', 'anker-solix-f3800', 'anker-solix-c2000-gen2', 'anker-solix-bp2000-gen2',
    'anker-solix-f2000', 'anker-solix-c1000x-gen2', 
    'bluetti-apex-300', 'bluetti-apex-200', 'bluetti-ac200l', 'bluetti-ac180', 'bluetti-elite-400', 'bluetti-b300k', 'bluetti-350w-solar',
    'jackery-explorer-1000-plus', 'jackery-explorer-2000-v2', 'jackery-solarsaga-200', 'allpowers-s2000-pro', 'allpowers-r2500-v2',
    'litime-diy-solar-generator-kit', 'litime-12v-200ah-bluetooth', 'litime-2000w-12v-inverter-ats', 'litime-30a-mppt',
    'energysage',
  ],
  comms: [
    'garmin-inreach-mini-2', 'garmin-inreach-messenger', 'iridium-go-exec', 'zoleo-satellite-communicator', 'midland-gxt67-pro', 'midland-gxt1000x3vp4', 'midland-mxt115p',
    'cobra-75-allroad', 'cobra-29lx', 'midland-er310pro', 'midland-er310-crank-radio', 'midland-wr400', 'eton-elite-field-radio', 'eton-red-cross-frx2', 'eton-red-cross-journey-radio',
    'acurite', 'nwr', 'fema-app',
  ],
  medical: [
    'mymedic-myfak', 'mymedic-bleeding-control-kit', 'mymedic-cat-tourniquet-gen-7', 'mymedic-everyday-carry', 'amk-trauma-pak-quikclot', 'amk-trauma-tourniquet',
    'amk-mountain-series-explorer', 'amk-adventure-first-aid-family', 'amk-adventure-first-aid-2-0', 'sam-chest-seals', 'sam-splint', 'redi-trauma-pack',
    'philips-heartstart-onsite', 'first-aid-only-50-person-272', 'leatherman-raptor-rescue', 'kidde-pro-210', 'redcross-first-aid-training', 'redcross-first-aid',
  ],
  tools: [
    'leatherman-super-tool-300', 'leatherman-wave-plus', 'leatherman-surge', 'leatherman-rebar', 'leatherman-skeletool-cx', 'leatherman-signal', 'gerber-multi-plier-600-basic',
    'lodge-classic-cast-iron-skillet', 'coleman-classic-propane-stove-2-burner', 'mr-heater-buddy-flex', 'mr-heater-portable-buddy', 'mr-heater-buddy-flex-cooker',
    'black-diamond-spot-400', 'petzl-actik-core', 'nitecore-hc65-uhe', 'fenix-hm65r-v2', 'biolite-alpenglow-500',
    'darn-tough-hiker-boot-full-cushion', 'kahtoola-microspikes', 'sol-emergency-bivvy', 'sol-emergency-blanket', 'teton-sports-celsius-regular-0', 'therm-a-rest-z-lite-sol',
    'uco-stormproof-match-kit', 'hothands-hand-warmers', 'zippo-heatbank-9s', 'tidewe-inferno-heated-jacket', 'tidewe-thermcore-heated-vest', 'snow-joe-shovelution-18',
  ],
};

/** Items from other categories whose makers are U.S.-based (get the small U.S. chip). New items carry `us` directly. */
export const doomsdayUsCrossIds = new Set<string>([
  'atlas-survival-shelters-official', 'terra-vivos-official', 'redi-shop', 'earthroamer-official', 'storyteller-overland-official', 'storyteller-mode-vans', 'sportsmobile-official', 'rezvani-official',
  'jeep-wrangler', 'jeep-gladiator', 'rivian-r1t', 'rivian-r1s', 'polaris-official', 'can-am-official', 'noco-boost-gb40', 'redi-the-roadie-pro', 'redi-roadie-plus',
  'knightscope-official', 'skydio-official', 'simplisafe-shop', 'arlo-official', 'ring-official', 'ring-battery-doorbell-4k-pro', 'google-nest-cam-indoor-wired-3rd-gen', 'cove', 'goal-zero-lighthouse-600',
  'berkey-big-berkey', 'berkey-travel-berkey', 'berkey-shop', 'aquasana-healthshield-whole-house', 'aquasana-whole-house', 'aquasana-healthshield-ro-matte-black', 'epic-smart-shield-max', 'epic-smart-shield', 'epic-pure-xp-pitcher',
  'grayl-geopress-24oz', 'grayl-ultrapress-16-9oz', 'sawyer-squeeze-water-filter', 'sawyer-mini-water-filter', 'katadyn-befree-0-6l', 'lifestraw-family', 'lifestraw-personal', 'lifestraw-straw-emergency-pack',
  'reliance-jumbo-tainer-2', 'reliance-aqua-tainer', 'waterbob', 'kidde-kn-cob-lp2', 'kidde-smart-combo-smoke-co', 'eton-blackout-buddy-co', 'eton-blackout-buddy-h2o', 'mira-safety',
  'readywise-1-month-two-bucket-bundle', 'readywise-4-week-food-supply', 'readywise-powdered-eggs-144-servings', 'readywise-5-day-survival-backpack', 'readywise-72-hour-food-kit',
  'mountain-house-classic-bucket', 'mountain-house-beef-stew-pouch', 'mountain-house-breakfast-skillet-pouch', 'mountain-house-macaroni-cheese-2-pack', 'mountain-house-best-sellers-kit',
  'legacy-premium-240-serving-package', 'legacy-120-serving-entree-bucket', 'legacy-60-serving-entree-bucket', 'augason-farms-3-month-emergency-food', 'augason-farms-30-day-1-person',
  'augason-farms-lunch-dinner-variety-pail', 'augason-farms-grab-and-go-backpack', 'backpackers-pantry-14-day-emergency-kit-meat', 'backpackers-pantry-3-day-meal-kit-meat', 'survival-frog-beef-canned-meat', 'survival-frog',
  'goal-zero-yeti-1500', 'goal-zero-yeti-500', 'goal-zero-yeti-700', 'goal-zero-nomad-100-plus', 'goal-zero-nomad-50', 'generac-iq3500', 'generac', 'honda-power', 'renogy-100w-12v-solar-kit', 'energysage',
  'garmin-inreach-mini-2', 'garmin-inreach-messenger', 'iridium-go-exec', 'zoleo-satellite-communicator', 'midland-gxt67-pro', 'midland-gxt1000x3vp4', 'midland-mxt115p', 'midland-er310pro', 'midland-er310-crank-radio', 'midland-wr400',
  'midland-overlanding-collection', 'cobra-75-allroad', 'cobra-29lx', 'eton-elite-field-radio', 'eton-red-cross-frx2', 'eton-red-cross-journey-radio', 'acurite', 'nwr', 'fema-app',
  'mymedic-myfak', 'mymedic-bleeding-control-kit', 'mymedic-cat-tourniquet-gen-7', 'mymedic-everyday-carry', 'amk-trauma-pak-quikclot', 'amk-trauma-tourniquet', 'amk-mountain-series-explorer', 'amk-adventure-first-aid-family',
  'amk-adventure-first-aid-2-0', 'sam-chest-seals', 'sam-splint', 'redi-trauma-pack', 'philips-heartstart-onsite', 'first-aid-only-50-person-272', 'leatherman-raptor-rescue', 'kidde-pro-210', 'redcross-first-aid-training', 'redcross-first-aid',
  'leatherman-super-tool-300', 'leatherman-wave-plus', 'leatherman-surge', 'leatherman-rebar', 'leatherman-skeletool-cx', 'leatherman-signal', 'gerber-multi-plier-600-basic', 'lodge-classic-cast-iron-skillet',
  'coleman-classic-propane-stove-2-burner', 'mr-heater-buddy-flex', 'mr-heater-portable-buddy', 'mr-heater-buddy-flex-cooker', 'black-diamond-spot-400', 'biolite-alpenglow-500', 'darn-tough-hiker-boot-full-cushion',
  'kahtoola-microspikes', 'sol-emergency-bivvy', 'sol-emergency-blanket', 'teton-sports-celsius-regular-0', 'therm-a-rest-z-lite-sol', 'uco-stormproof-match-kit', 'hothands-hand-warmers', 'zippo-heatbank-9s', 'snow-joe-shovelution-18',
  'eton-roadguard-jump-starter',
]);


/** Amazon Associates picks that already carry category or alsoIn "doomsday-prepper".
 *  Mapped here so they render in the visible section grids (not only in JSON-LD).
 *  Official curated items stay first; these follow in a quality-then-staples order.
 *  Page sort is still U.S. badge, then doomsdayRank. */
export const doomsdayAmazonCross: Record<DoomsdaySectionId, readonly string[]> = {
  shelters: [],
  vehicles: [],
  perimeter: [],
  'air-water': [
    'amz-b06xzvbsmx', // Sawyer SP160 gravity filter
    'amz-b075tttx2r', // Katadyn Hiker Pro
    'amz-b01n7gc9z6', // MSR TrailShot
    'amz-b08c9hc52j', // Aquamira drops
    'amz-b001949tks', // Potable Aqua tablets
    'amz-b09ffqn924', // Aquatabs
    'amz-b06y3k69d1', // Mayday water pouches
    'amz-b00u415mgw', // Scepter can spout
    'amz-b01h0s90qe', // 3M half-face respirator
    'amz-b00aefckky', // 3M P100 cartridges
    'amz-b008mcuzzs', // 3M 8210 N95
    'amz-b0dswjj5tm', // ThyroSafe potassium iodide
    'amz-b0ckm5fjqx', // GQ Geiger counter
  ],
  food: [
    'amz-b0843j11jw', // Mountain House meal bucket
    'amz-b0b8jzdc13', // ReadyWise 90-day supply
    'amz-b08kskc8nm', // ReadyWise protein bucket
    'amz-b0755h39hb', // Augason vegetable medley
    'amz-b0djtzwjry', // Peak Refuel granola
    'amz-b001cs7mbe', // Datrex ration bars
    'amz-b001eq5nhe', // SPAM
    'amz-b004ahdv5a', // Wild Planet tuna
    'amz-b01m6wm4c5', // Jif peanut butter
    'amz-b006m14uc0', // Sue Bee honey
    'amz-b07vcm66n6', // Bob's Red Mill oats
    'amz-b000rhsy9k', // Pinto beans
    'amz-b000joq57e', // Mahatma rice
    'amz-b08s7s98l2', // Survival seed vault
    'amz-b00004s88z', // All American canner
    'amz-b00di342b4', // FoodSaver
    'amz-b0bpw1l2tf', // Ball mason jars
    'amz-b0c6nmyvhw', // Food-grade buckets
    'amz-b010bvoadk', // ShieldPro mylar bags
    'amz-b0hqwy1rr3', // FreshUS oxygen absorbers
    'amz-b000q3cjgo', // Morton salt
  ],
  energy: [],
  comms: [
    'amz-b001eug3ii', // Kaito KA500 emergency radio
    'amz-b073sdlwxd', // Mission Darkness faraday tote
  ],
  medical: [
    'amz-b01itakg6a', // NAR C-A-T tourniquet
    'amz-b00hjth5l2', // QuikClot gauze
    'amz-b009ejufda', // Celox Rapid gauze
    'amz-b01hgslb6k', // Surviveware first aid kit
  ],
  tools: [
    'amz-b079mjbp21', // Leatherman Wave+
    'amz-b01fscrjlc', // Estwing camper's axe
    'amz-b0002yto7e', // Fiskars X7 hatchet
    'amz-b004m3baqe', // Fiskars X27 splitting axe
    'amz-b000ced1qy', // Silky PocketBoy
    'amz-b0001ix7ow', // Bahco Laplander
    'amz-b00u1ocpwq', // Lodge dutch oven
    'amz-b0006vordy', // Camp Chef two-burner
    'amz-b007dbd3iu', // Solo Stove Lite
    'amz-b07mw96bhy', // GSI cookset
    'amz-b0bkfltm3t', // Therm-a-Rest pad
    'amz-b00ezexcbg', // SOL bivvy
    'amz-b00oj8n8ik', // Rothco wool blanket
    'amz-b00dz1nfsk', // Primacare mylar blankets
    'amz-b000s5odnc', // Rothco paracord
    'amz-b004vrkwr4', // Condor 3-day pack
    'amz-b0013axy54', // Maxpedition Falcon-II
    'amz-b0ghcdvc7q', // Ready America 72-hour kit
  ],
};

export const doomsdaySectionOf: Map<string, DoomsdaySectionId> = (() => {
  const m = new Map<string, DoomsdaySectionId>();
  for (const n of doomsdayNewItems) m.set(n.id, n.section);
  for (const s of doomsdaySections) {
    for (const id of doomsdayCrossList[s.id]) if (!m.has(id)) m.set(id, s.id);
    for (const id of doomsdayAmazonCross[s.id]) if (!m.has(id)) m.set(id, s.id);
  }
  return m;
})();

/** Position of an id inside its section list (new items first within their section, then cross-listed in curation order). */
export function doomsdayRank(id: string): number {
  const sec = doomsdaySectionOf.get(id);
  if (!sec) return 9999;
  const news = doomsdayNewItems.filter((n) => n.section === sec).map((n) => n.id);
  const order = [...news, ...doomsdayCrossList[sec], ...doomsdayAmazonCross[sec]];
  const i = order.indexOf(id);
  return i < 0 ? 9999 : i;
}
