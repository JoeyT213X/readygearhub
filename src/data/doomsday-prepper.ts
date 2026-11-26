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

export const doomsdaySections: { id: DoomsdaySectionId; name: string; blurb: string }[] = [
  { id: 'shelters', name: 'Shelters & Bunkers', blurb: 'Underground shelters, safe rooms, blast doors and rapid-deploy shelters. Most are built to order, so pricing and lead times come from the maker.' },
  { id: 'vehicles', name: 'Extreme Vehicles', blurb: 'Armored, overland and expedition rigs, plus the recovery, fuel and trail gear that goes with them.' },
  { id: 'perimeter', name: 'Perimeter & Security', blurb: 'High-security fencing, gates, bollards and barriers, plus cameras, alarms and patrol tech for the property line.' },
  { id: 'air-water', name: 'Air, Water & NBC', blurb: 'Respirators, filtration and the water systems that keep a household supplied. Follow each maker’s instructions and replacement schedule.' },
  { id: 'food', name: 'Long-Term Food', blurb: 'Freeze-dried and shelf-stable food in buckets, pails and pouches, plus a way to put up your own.' },
  { id: 'energy', name: 'Energy Reserves', blurb: 'Energy reserves, home batteries, generators and solar for long outages and off-grid sites. Fuel-burning gear needs outdoor use, ventilation per the manual and a CO alarm.' },
  { id: 'comms', name: 'Comms', blurb: 'Satellite messengers, two-way radios and weather radios for when cell service is gone.' },
  { id: 'medical', name: 'Medical', blurb: 'Trauma, first-aid and defibrillator gear. Get hands-on training from the Red Cross or a local course; call 911 first in an emergency.' },
  { id: 'tools', name: 'Tools & Field Gear', blurb: 'Multi-tools, lights, cold-weather and shelter-in-place gear that earn their place in any kit.' },
];

export type DoomsdayNew = HighTicketItem & { section: DoomsdaySectionId };

const SITE = 'We don’t have a partner program with this brand yet, so this is a plain official link.';
const mk = (o: Omit<DoomsdayNew, 'category' | 'groups' | 'affiliateUrl' | 'ctaKind'> & { ctaKind?: HighTicketItem['ctaKind'] }): DoomsdayNew => ({
  category: 'doomsday-prepper', groups: ['safety-prep'], affiliateUrl: null, ctaKind: 'details', ...o,
});

export const doomsdayNewItems: DoomsdayNew[] = [
  // ---- Shelters & Bunkers ----
  mk({ id: 'rising-s-bunkers', section: 'shelters', us: true, title: 'Rising S Bunkers', sourceName: 'Rising S Company (Texas)', fallbackUrl: 'https://risingsbunkers.com/', image: '/directory/covers/shelter.svg', offerLabel: 'Underground shelters', cta: 'Request details', ctaKind: 'inquire',
    blurb: 'Texas maker of all-steel underground bunkers, storm shelters, safe rooms and blast doors; NBC air filtration is part of its standard systems. Sizes, pricing and lead times come from the maker. ' + SITE }),
  mk({ id: 'american-safe-room', section: 'shelters', us: true, title: 'American Safe Room', sourceName: 'American Safe Room (Oregon)', fallbackUrl: 'https://americansaferoom.com/', image: '/directory/covers/shelter.svg', offerLabel: 'Shelter kits and blast doors', cta: 'Request details', ctaKind: 'inquire',
    blurb: 'Oregon maker of underground shelter kits, blast-resistant doors and hatches, and the ASR Safe Cell NBC air-filtration system. Technical manuals are public on its site; quotes by request. ' + SITE }),
  mk({ id: 'survive-a-storm', section: 'shelters', us: true, title: 'Survive-A-Storm Shelters', sourceName: 'Survive-A-Storm (Oklahoma)', fallbackUrl: 'https://survive-a-storm.com/', image: '/directory/covers/shelter.svg', offerLabel: 'Storm shelters', cta: 'See shelters',
    blurb: 'Oklahoma maker of above-ground and below-ground steel storm shelters, which it describes as FEMA/ICC compliant. Confirm the rating, installation scope and local permits before you buy. ' + SITE }),
  mk({ id: 'shiftpod-shelters', section: 'shelters', us: true, title: 'SHIFTPOD rapid-deploy shelters', sourceName: 'SHIFTPOD (Advanced Shelter Systems)', fallbackUrl: 'https://shiftpod.com/', image: '/directory/covers/shelter.svg', offerLabel: 'Portable shelter', cta: 'See shelters',
    blurb: 'Integrated-frame tents with reflective, multi-layer insulated fabric, built for quick setup. A fit for a bug-out camp, work site or backup room. ' + SITE }),

  // ---- Extreme Vehicles ----
  mk({ id: 'alpine-armoring', section: 'vehicles', us: true, title: 'Alpine Armoring', sourceName: 'Alpine Armoring (Virginia)', fallbackUrl: 'https://www.alpineco.com/', image: '/directory/covers/vehicle.svg', offerLabel: 'Armored vehicles', cta: 'Request a quote', ctaKind: 'inquire', price: 'Alpine lists A4-level armoring at $75,000–$200,000 (as of Nov 25, 2026)',
    blurb: 'Virginia manufacturer of civilian and government armored SUVs, sedans, vans and trucks. Alpine says civilians can buy armored vehicles in the US with no federal restrictions; state road rules and insurance still apply. ' + SITE }),
  mk({ id: 'four-wheel-campers', section: 'vehicles', us: true, title: 'Four Wheel Campers', sourceName: 'Four Wheel Campers (California)', fallbackUrl: 'https://www.fourwheelcampers.com/', image: '/directory/covers/vehicle.svg', offerLabel: 'Truck campers', cta: 'See campers',
    blurb: 'California builder of lightweight pop-up truck campers for pickups and flatbeds. Check your truck’s payload with the maker before ordering. ' + SITE }),
  mk({ id: 'warn-industries', section: 'vehicles', us: true, title: 'WARN Industries winches and recovery gear', sourceName: 'WARN Industries (Oregon)', fallbackUrl: 'https://www.warn.com/', image: '/directory/covers/vehicle.svg', offerLabel: 'Recovery gear', cta: 'See gear',
    blurb: 'Oregon maker of winches, hubs and recovery gear for trucks, Jeeps and UTVs. ' + SITE }),
  mk({ id: 'rotopax', section: 'vehicles', us: true, title: 'RotopaX fuel and water containers', sourceName: 'RotopaX (Arizona)', fallbackUrl: 'https://rotopax.com/', image: '/directory/covers/vehicle.svg', offerLabel: 'Mountable containers', cta: 'See containers',
    blurb: 'Rotationally molded fuel and water containers with vehicle mounting systems. Store fuel only as the container labeling and local rules allow. ' + SITE }),
  mk({ id: 'arb-usa', section: 'vehicles', title: 'ARB 4x4 Accessories', sourceName: 'ARB USA (Australian maker, US operations)', fallbackUrl: 'https://arbusa.com/', image: '/directory/covers/vehicle.svg', offerLabel: 'Bumpers, lockers, recovery', cta: 'See gear',
    blurb: 'Off-road equipment since 1975: air lockers, bull bars, recovery gear and suspension. The maker runs an affiliate program (3–5% per its page); ours is not applied yet, so this is a plain link. Australia is a US ally.' }),
  mk({ id: 'inspired-overland', section: 'vehicles', title: 'Inspired Overland rooftop tents', sourceName: 'Inspired Overland', fallbackUrl: 'https://inspiredoverland.com/', image: '/directory/covers/vehicle.svg', offerLabel: 'Rooftop tents', cta: 'See tents',
    blurb: 'Lightweight rooftop tents, awnings and overland gear. Check roof-rack load ratings before mounting any tent. ' + SITE }),
  mk({ id: 'baja-designs', section: 'vehicles', us: true, title: 'Baja Designs lighting', sourceName: 'Baja Designs (California)', fallbackUrl: 'https://www.bajadesigns.com/', image: '/directory/covers/vehicle.svg', offerLabel: 'Off-road lighting', cta: 'See lights',
    blurb: 'California maker of LED and laser off-road lighting for trucks, Jeeps, UTVs and bikes. Check local rules for on-road use. ' + SITE }),

  // ---- Perimeter & Security ----
  mk({ id: 'ameristar-perimeter', section: 'perimeter', us: true, title: 'Ameristar Perimeter Security', sourceName: 'Ameristar (Tulsa, Oklahoma; ASSA ABLOY)', fallbackUrl: 'https://www.ameristarperimeter.com/', image: '/directory/covers/store.svg', offerLabel: 'Fence, gates, bollards', cta: 'Request details', ctaKind: 'inquire',
    blurb: 'Oklahoma manufacturer of ornamental and high-security fence, gates, anti-ram barriers and bollards, sold through regional sales reps and installers. Pricing is by quote. ' + SITE }),
  mk({ id: 'gibraltar-perimeter', section: 'perimeter', us: true, title: 'Gibraltar Perimeter Security', sourceName: 'Gibraltar (Burnet, Texas)', fallbackUrl: 'https://www.gibraltarperimetersecurity.com/', image: '/directory/covers/store.svg', offerLabel: 'Anti-ram barriers and fence', cta: 'Request details', ctaKind: 'inquire',
    blurb: 'Texas maker of crash-rated vehicle barriers, bollards and high-security fence and gate systems, aimed at commercial and government sites. Quotes by request. ' + SITE }),
  mk({ id: 'amico-security', section: 'perimeter', us: true, title: 'AMICO Security', sourceName: 'AMICO Security (Birmingham, Alabama)', fallbackUrl: 'https://amicosecurity.com/', image: '/directory/covers/store.svg', offerLabel: 'Security fence and barriers', cta: 'Request details', ctaKind: 'inquire',
    blurb: 'Alabama maker of metal and wire-mesh security fencing and bollard vehicle barriers. Quotes by request. ' + SITE }),
  mk({ id: 'mulholland-brand', section: 'perimeter', us: true, title: 'Mulholland Brand aluminum fence and gates', sourceName: 'Mulholland Brand (Canoga Park, California)', fallbackUrl: 'https://mulhollandbrand.com/', image: '/directory/covers/store.svg', offerLabel: 'Fence and gates', cta: 'Request a quote', ctaKind: 'inquire',
    blurb: 'Aluminum gates, fences, railings and pergolas built in its California factory. The maker publishes a referral program (up to 5% on materials); ours is not applied yet. ' + SITE }),
  mk({ id: 'liftmaster-gate-operators', section: 'perimeter', us: true, title: 'LiftMaster gate operators and access control', sourceName: 'LiftMaster (Chamberlain Group, Illinois)', fallbackUrl: 'https://www.liftmaster.com/', image: '/directory/covers/store.svg', offerLabel: 'Gate openers', cta: 'See gear',
    blurb: 'Residential and commercial gate openers and access control, usually installed by a dealer. Follow the maker’s safety-sensor requirements. ' + SITE }),

  // ---- Air, Water & NBC ----
  mk({ id: 'mira-safety', section: 'air-water', us: true, title: 'MIRA Safety CBRN gas masks and filters', sourceName: 'MIRA Safety (Texas)', fallbackUrl: 'https://www.mirasafety.com/', image: '/directory/covers/ready-kit.svg', offerLabel: 'Respirators', cta: 'See respirators',
    blurb: 'Texas maker of CBRN respirators, filters and protective gear for civil defense, industry and civilians. Its affiliate program (up to 10%, AvantLink) is not applied yet. Learn fit-testing and filter shelf life from the maker before relying on one. ' + SITE }),

  // ---- Long-Term Food ----
  mk({ id: 'my-patriot-supply', section: 'food', us: true, title: 'My Patriot Supply', sourceName: 'My Patriot Supply (Idaho)', fallbackUrl: 'https://mypatriotsupply.com/', image: '/directory/covers/ready-kit.svg', offerLabel: 'Food storage', cta: 'See food kits',
    blurb: 'Idaho seller of long-term food kits, seeds and emergency supplies. Compare servings, calories and shelf life on the official page. ' + SITE }),
  mk({ id: 'harvest-right', section: 'food', us: true, title: 'Harvest Right home freeze dryers', sourceName: 'Harvest Right (Utah)', fallbackUrl: 'https://harvestright.com/', image: '/directory/covers/ready-kit.svg', offerLabel: 'Freeze dryers', cta: 'See freeze dryers',
    blurb: 'Home freeze dryers for putting up your own long-term food. Check the power, space and vacuum-pump needs on the official page. ' + SITE }),

  // ---- Energy Reserves ----
  mk({ id: 'tesla-powerwall', section: 'energy', us: true, title: 'Tesla Powerwall home battery', sourceName: 'Tesla', fallbackUrl: 'https://www.tesla.com/powerwall', image: '/directory/covers/battery.svg', offerLabel: 'Home battery', cta: 'See home battery',
    blurb: 'Whole-home battery storage that works with solar and can back up the house in an outage. A licensed installer, a permit and a utility interconnection are normally required. ' + SITE }),
  mk({ id: 'enphase-battery', section: 'energy', us: true, title: 'Enphase IQ Battery', sourceName: 'Enphase Energy (California)', fallbackUrl: 'https://enphase.com/', image: '/directory/covers/battery.svg', offerLabel: 'Home battery', cta: 'See batteries',
    blurb: 'Modular home batteries and solar microinverters, sold and installed through Enphase installers. Confirm installer licensing and permit scope locally. ' + SITE }),

  // ---- Comms ----
  mk({ id: 'starlink', section: 'comms', us: true, title: 'Starlink satellite internet', sourceName: 'Starlink (SpaceX)', fallbackUrl: 'https://www.starlink.com/', image: '/directory/covers/store.svg', offerLabel: 'Satellite internet', cta: 'See plans',
    blurb: 'Satellite internet for homes, vehicles and remote sites. Needs a clear view of the sky and power; plans and prices are on the official site. ' + SITE }),
  mk({ id: 'rugged-radios', section: 'comms', us: true, title: 'Rugged Radios', sourceName: 'Rugged Radios (California)', fallbackUrl: 'https://www.ruggedradios.com/', image: '/directory/covers/store.svg', offerLabel: 'GMRS and vehicle radios', cta: 'See radios',
    blurb: 'California maker of GMRS two-way radios, intercoms and headsets for trucks, UTVs and convoys. GMRS needs an FCC license in the US. Dealer program only; no affiliate program is published. ' + SITE }),

  // ---- Medical ----
  mk({ id: 'north-american-rescue', section: 'medical', us: true, title: 'North American Rescue', sourceName: 'North American Rescue (South Carolina)', fallbackUrl: 'https://www.narescue.com/', image: '/directory/covers/ready-kit.svg', offerLabel: 'Trauma and medical gear', cta: 'See gear',
    blurb: 'South Carolina maker of trauma kits, tourniquets and medical gear used by responders and civilians. Train before you need it. ' + SITE }),

  // ---- Tools & Field Gear ----
  mk({ id: 'pelican-cases', section: 'tools', us: true, title: 'Pelican protective cases', sourceName: 'Pelican (California)', fallbackUrl: 'https://www.pelican.com/us/en', image: '/directory/covers/store.svg', offerLabel: 'Hard cases', cta: 'See cases',
    blurb: 'Rugged protective cases made in the USA, a common choice for radios, medical kits and documents. ' + SITE }),
  mk({ id: 'estwing-tools', section: 'tools', us: true, title: 'Estwing hand tools', sourceName: 'Estwing (Illinois)', fallbackUrl: 'https://www.estwing.com/', image: '/directory/covers/store.svg', offerLabel: 'Hammers and hand tools', cta: 'See tools',
    blurb: 'Illinois maker of one-piece forged hammers, hatchets and hand tools. ' + SITE }),
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
    'anker-solix-f3800-plus', 'anker-solix-f3800', 'anker-solix-c2000-gen2', 'anker-solix-c2000-gen2-400w-kit', 'anker-solix-bp3800', 'anker-solix-bp2000-gen2',
    'anker-solix-f2000', 'anker-solix-c1000x-gen2', 'anker-solix-ps400', 'anker-solix-ps200',
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

export const doomsdaySectionOf: Map<string, DoomsdaySectionId> = (() => {
  const m = new Map<string, DoomsdaySectionId>();
  for (const n of doomsdayNewItems) m.set(n.id, n.section);
  for (const s of doomsdaySections) for (const id of doomsdayCrossList[s.id]) if (!m.has(id)) m.set(id, s.id);
  return m;
})();

/** Position of an id inside its section list (new items first within their section, then cross-listed in curation order). */
export function doomsdayRank(id: string): number {
  const sec = doomsdaySectionOf.get(id);
  if (!sec) return 9999;
  const news = doomsdayNewItems.filter((n) => n.section === sec).map((n) => n.id);
  const order = [...news, ...doomsdayCrossList[sec]];
  const i = order.indexOf(id);
  return i < 0 ? 9999 : i;
}
