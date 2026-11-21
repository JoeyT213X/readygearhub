/**
 * Prepper's Picks
 *
 * A curated, data-driven list for the home-page “Prepper’s Picks” section
 * and the /prepper-picks/ page. It is meant for a household that already
 * thinks in terms of a 72-hour bag up through a longer, roughly 90-day
 * pantry — written in a calm, practical tone, not a doomsday pitch.
 *
 * How links work (one-line upgrade later)
 * ---------------------------------------
 * Every card has:
 *   - fallbackUrl: the plain official product, category, or guide URL
 *     (or an internal path such as /shop/... or /guides/...). Required.
 *   - affiliateUrl: a verified tracked URL, or null.
 *
 * Resolution order in `resolvePrepperPick()`:
 *   1. If `affiliateUrl` is a non-empty string, use it (sponsored).
 *      Paste a portal link here later — that single field swap is enough.
 *   2. Else if `programId` is a live approved program, try
 *      `resolveOutbound(programId, fallbackUrl, id)`. That reuses
 *      existing methods only (CJ `{url}` templates, Rakuten `itemLinks`,
 *      or a program `link`). No new tracking URLs are invented here.
 *   3. Else use `fallbackUrl` as a plain link (rel=noopener, not sponsored).
 *
 * Rules
 * -----
 * - Never invent tracking links, prices, or ratings.
 * - Catalog/CSV prices are omitted; cards say “See price” unless a
 *   verified in-repo price already exists (Payhip downloads only).
 * - Waterdrop, REDI, and Choice Home Warranty stay behind the paid-session
 *   guard when `programId` matches those programs.
 * - Official photos are self-hosted. Items without a licensed photo use a
 *   geometric SVG cover in /directory/covers/, never a hotlinked or
 *   unlicensed image.
 * - To add a pick later, append one object to `prepperPicks`.
 */
import { isNoPpcProgram, resolveOutbound } from './affiliates';
import type { CatalogItem, CatalogKind } from './full-catalog';
import type { SourceGroupId } from './source-directory';

export type PrepperLaneId =
  | 'water'
  | 'food'
  | 'power'
  | 'lighting'
  | 'comms'
  | 'first-aid'
  | 'fire-cooking'
  | 'shelter-warmth'
  | 'tools'
  | 'sanitation'
  | 'documents';

export type PrepperLane = {
  id: PrepperLaneId;
  name: string;
  blurb: string;
};

export const prepperLanes: PrepperLane[] = [
  { id: 'water', name: 'Water storage & filtration', blurb: 'Containers for stored water, plus filters and purifiers for drinking water at home or on the go.' },
  { id: 'food', name: 'Long-term food', blurb: 'Shelf-stable meals for a 72-hour bag and a longer pantry. Check the official page for servings and storage life.' },
  { id: 'power', name: 'Power & solar', blurb: 'Portable batteries, a small generator, and a starter solar kit. Confirm output and fuel or recharge notes on the official page.' },
  { id: 'lighting', name: 'Lighting', blurb: 'Lanterns and headlamps you can use when the lights are out, without improvising with candles as your only option.' },
  { id: 'comms', name: 'Radios & comms', blurb: 'Weather radios, a hand-crank option, and a satellite messenger for places with no cell coverage.' },
  { id: 'first-aid', name: 'First aid & IFAK', blurb: 'A trauma-oriented individual kit, a family first-aid kit, and a well-known splint. Training matters as much as the contents.' },
  { id: 'fire-cooking', name: 'Fire & cooking', blurb: 'A camp stove, stormproof matches, and a skillet that works on a backyard burner or a camp stove.' },
  { id: 'shelter-warmth', name: 'Shelter & warmth', blurb: 'An emergency bivvy, a cold-weather sleeping bag, and a simple window insulator kit for a short outage.' },
  { id: 'tools', name: 'Tools', blurb: 'A multi-tool you will actually carry, plus a second well-known option if you want a spare in the kit.' },
  { id: 'sanitation', name: 'Sanitation', blurb: 'A portable toilet and a pack-out toilet, for when household plumbing is out of service. Read the official pages for use and disposal notes.' },
  { id: 'documents', name: 'Documents & cash', blurb: 'A printed household binder, a fire-resistant safe for paper copies, and official guidance on keeping some cash and records on hand.' },
];

export type PrepperPick = {
  id: string;
  title: string;
  blurb: string;
  lane: PrepperLaneId;
  sourceName: string;
  /** Paste a verified tracked URL later, or leave null. */
  affiliateUrl: string | null;
  /** Plain official product, category, or guide URL (or an internal path). */
  fallbackUrl: string;
  /** Existing affiliates.ts program id, when one applies. */
  programId?: string;
  /** Existing gear, partner, or Payhip id, when this pick is already in the catalog. */
  catalogId?: string;
  image?: string;
  imageKind?: 'photo' | 'banner' | 'logo' | 'icon';
  offerLabel?: string;
  cta?: string;
  featured?: boolean;
  hideOnPaid?: boolean;
};

export const prepperPicks: PrepperPick[] = [
  // ---- Water ----
  {
    id: 'pick-reliance-aqua-tainer',
    title: 'Reliance Aqua-Tainer water container',
    blurb: 'A stackable jerrycan many households use to store drinking water. See the official page for capacity and current price.',
    lane: 'water',
    sourceName: 'Reliance Outdoors',
    affiliateUrl: null,
    fallbackUrl: 'https://relianceoutdoors.com/products/aqua-tainer-4g-15l',
    catalogId: 'reliance-aqua-tainer',
    image: '/directory/covers/water-filter.svg',
    imageKind: 'icon',
    offerLabel: 'Water storage',
    featured: true,
  },
  {
    id: 'pick-waterbob',
    title: 'waterBOB bathtub water storage',
    blurb: 'A liner made to hold drinking water in a bathtub when a short-term outage or boil-water notice is expected. See the official page for capacity and use notes.',
    lane: 'water',
    sourceName: 'waterBOB',
    affiliateUrl: null,
    fallbackUrl: 'https://waterbob.com/product/waterbob/',
    catalogId: 'waterbob',
    image: '/directory/covers/water-filter.svg',
    imageKind: 'icon',
    offerLabel: 'Water storage',
  },
  {
    id: 'pick-sawyer-squeeze',
    title: 'Sawyer Squeeze water filter',
    blurb: 'A well-known squeeze filter for drinking water from a bottle or pouch. Read the official page for what it is designed to remove, and for care notes.',
    lane: 'water',
    sourceName: 'Sawyer',
    affiliateUrl: null,
    fallbackUrl: 'https://www.sawyer.com/product/squeeze-water-filter-system',
    catalogId: 'sawyer-squeeze-water-filter',
    image: '/directory/covers/water-filter.svg',
    imageKind: 'icon',
    offerLabel: 'Portable filter',
  },
  {
    id: 'pick-lifestraw-family',
    title: 'LifeStraw Family gravity purifier',
    blurb: 'A gravity purifier sized for a household, useful when the tap is not safe to drink. Read the official page for what it is designed to treat.',
    lane: 'water',
    sourceName: 'LifeStraw',
    affiliateUrl: null,
    fallbackUrl: 'https://lifestraw.com/products/lifestraw-family-emergency-water-filter',
    catalogId: 'lifestraw-family',
    image: '/directory/covers/countertop-filter.svg',
    imageKind: 'icon',
    offerLabel: 'Gravity purifier',
    featured: true,
  },
  {
    id: 'pick-datrex-water',
    title: 'Datrex emergency drinking water pouches',
    blurb: 'Sealed water pouches often kept in a 72-hour bag or a vehicle kit. See the official page for pouch count and storage notes.',
    lane: 'water',
    sourceName: 'Datrex',
    affiliateUrl: null,
    fallbackUrl: 'https://www.datrex.com/product/datrex-emergency-water-ration-2/',
    catalogId: 'datrex-emergency-water-dx1000w',
    image: '/directory/covers/water-filter.svg',
    imageKind: 'icon',
    offerLabel: 'Stored water',
  },

  // ---- Food ----
  {
    id: 'pick-readywise-72',
    title: 'ReadyWise 72-hour food kit',
    blurb: 'A short, shelf-stable kit sized for the first three days. Check the official page for servings, calories, and storage life.',
    lane: 'food',
    sourceName: 'ReadyWise',
    affiliateUrl: null,
    fallbackUrl: 'https://readywise.com/products/72-hour-emergency-food-and-drink-supply',
    catalogId: 'readywise-72-hour-food-kit',
    image: '/directory/covers/ready-kit.svg',
    imageKind: 'icon',
    offerLabel: '72-hour food',
    featured: true,
  },
  {
    id: 'pick-augason-30',
    title: 'Augason Farms 30-day one-person food supply',
    blurb: 'A one-month pantry kit for one person, a step toward a longer household supply. See the official page for servings and storage life.',
    lane: 'food',
    sourceName: 'Augason Farms',
    affiliateUrl: null,
    fallbackUrl: 'https://augasonfarms.com/products/30-day-1-person-emergency-food-supply-kit-194-servings',
    catalogId: 'augason-farms-30-day-1-person',
    image: '/directory/covers/ready-kit.svg',
    imageKind: 'icon',
    offerLabel: '30-day food',
    featured: true,
  },
  {
    id: 'pick-mountain-house-bucket',
    title: 'Mountain House classic meal assortment bucket',
    blurb: 'Freeze-dried meals many people already know from camping, useful in a longer pantry. Check the official page for meal count and storage life.',
    lane: 'food',
    sourceName: 'Mountain House',
    affiliateUrl: null,
    fallbackUrl: 'https://mountainhouse.com/products/classic-assortment-bucket',
    catalogId: 'mountain-house-classic-bucket',
    image: '/directory/covers/ready-kit.svg',
    imageKind: 'icon',
    offerLabel: 'Freeze-dried meals',
  },
  {
    id: 'pick-readywise-4-week',
    title: 'ReadyWise 4-week emergency food supply',
    blurb: 'A longer shelf-stable supply listed as a four-week kit. See the official page for calories, servings, and storage life.',
    lane: 'food',
    sourceName: 'ReadyWise',
    affiliateUrl: null,
    fallbackUrl: 'https://readywise.com/products/4-week-emergency-food-supply-1-800-calories-day',
    catalogId: 'readywise-4-week-food-supply',
    image: '/directory/covers/ready-kit.svg',
    imageKind: 'icon',
    offerLabel: 'Longer pantry',
  },

  // ---- Power ----
  {
    id: 'pick-bluetti-elite-200-v2',
    title: 'BLUETTI Elite 200 V2 portable power station',
    blurb: 'A mid-size portable battery for lights, chargers, and a fridge during a short outage. See the official page for current output, capacity, and price.',
    lane: 'power',
    sourceName: 'BLUETTI',
    affiliateUrl: null,
    fallbackUrl: 'https://www.bluettipower.com/products/elite-200-v2-portable-power-station',
    programId: 'bluetti',
    catalogId: 'bluetti-elite-200-v2',
    image: '/directory/photos/bluetti-elite-200-v2.webp',
    imageKind: 'photo',
    offerLabel: 'Portable power station',
    featured: true,
  },
  {
    id: 'pick-honda-eu2200i',
    title: 'Honda EU2200i inverter generator',
    blurb: 'A well-known quiet inverter generator. Read Honda’s official page for output, fuel, and safe placement away from windows and doors.',
    lane: 'power',
    sourceName: 'Honda',
    affiliateUrl: null,
    fallbackUrl: 'https://powerequipment.honda.com/generators/models/eu2200i',
    catalogId: 'honda-eu2200i',
    image: '/directory/covers/power-station.svg',
    imageKind: 'icon',
    offerLabel: 'Inverter generator',
    featured: true,
  },
  {
    id: 'pick-renogy-100w',
    title: 'Renogy 100W 12V solar panel kit',
    blurb: 'A starter 100W solar kit for charging a compatible battery or station. Confirm compatibility and current price on the official page.',
    lane: 'power',
    sourceName: 'Renogy',
    affiliateUrl: null,
    fallbackUrl: 'https://www.renogy.com/products/100w-12v-solar-panel-kit',
    catalogId: 'renogy-100w-12v-solar-kit',
    image: '/directory/covers/solar-panel.svg',
    imageKind: 'icon',
    offerLabel: 'Solar kit',
  },

  // ---- Lighting ----
  {
    id: 'pick-goal-zero-lighthouse',
    title: 'Goal Zero Lighthouse 600 lantern',
    blurb: 'A rechargeable lantern with a USB power hub, useful as a room light during an outage. See the official page for runtime and current price.',
    lane: 'lighting',
    sourceName: 'Goal Zero',
    affiliateUrl: null,
    fallbackUrl: 'https://goalzero.com/products/lighthouse-600-lantern-usb-power-hub',
    catalogId: 'goal-zero-lighthouse-600',
    image: '/directory/covers/compact-power.svg',
    imageKind: 'icon',
    offerLabel: 'Lantern',
    featured: true,
  },
  {
    id: 'pick-black-diamond-spot-400',
    title: 'Black Diamond Spot 400 headlamp',
    blurb: 'A well-known headlamp so you can keep both hands free. See the official page for output modes and current price.',
    lane: 'lighting',
    sourceName: 'Black Diamond',
    affiliateUrl: null,
    fallbackUrl: 'https://www.blackdiamondequipment.com/products/spot-400-headlamp',
    catalogId: 'black-diamond-spot-400',
    image: '/directory/covers/compact-power.svg',
    imageKind: 'icon',
    offerLabel: 'Headlamp',
  },

  // ---- Comms ----
  {
    id: 'pick-midland-er310',
    title: 'Midland ER310 emergency crank weather radio',
    blurb: 'A hand-crank NOAA weather radio with a flashlight, useful when the power and maybe the phone network are down. See the official page for features and price.',
    lane: 'comms',
    sourceName: 'Midland',
    affiliateUrl: null,
    fallbackUrl: 'https://midlandusa.com/products/er310-portable-emergency-crank-weather-radio',
    catalogId: 'midland-er310-crank-radio',
    image: '/directory/covers/compact-power.svg',
    imageKind: 'icon',
    offerLabel: 'Weather radio',
    featured: true,
  },
  {
    id: 'pick-garmin-inreach-mini-2',
    title: 'Garmin inReach Mini 2 satellite communicator',
    blurb: 'A compact satellite messenger for two-way texts and SOS where there is no cell coverage. Read Garmin’s page for subscription plans and current price.',
    lane: 'comms',
    sourceName: 'Garmin',
    affiliateUrl: null,
    fallbackUrl: 'https://www.garmin.com/en-US/p/765374',
    catalogId: 'garmin-inreach-mini-2',
    image: '/directory/covers/compact-power.svg',
    imageKind: 'icon',
    offerLabel: 'Satellite messenger',
    featured: true,
  },
  {
    id: 'pick-midland-wr400',
    title: 'Midland WR400 NOAA weather alert radio',
    blurb: 'A plug-in NOAA weather-alert radio for the house, so watches and warnings can come in even if you are not watching the news. See the official page for coverage notes and price.',
    lane: 'comms',
    sourceName: 'Midland',
    affiliateUrl: null,
    fallbackUrl: 'https://midlandusa.com/products/wr400-deluxe-noaa-weather-alert-radio',
    catalogId: 'midland-wr400',
    image: '/directory/covers/compact-power.svg',
    imageKind: 'icon',
    offerLabel: 'Home weather radio',
  },

  // ---- First aid ----
  {
    id: 'pick-mymedic-myfak',
    title: 'My Medic MyFAK first aid and trauma kit',
    blurb: 'An individual first-aid kit with trauma supplies. Training matters as much as the contents; see the official page for what is in the bag and current price.',
    lane: 'first-aid',
    sourceName: 'My Medic',
    affiliateUrl: null,
    fallbackUrl: 'https://mymedic.com/products/myfak-firstaidkit',
    catalogId: 'mymedic-myfak',
    image: '/directory/covers/ready-kit.svg',
    imageKind: 'icon',
    offerLabel: 'IFAK',
    featured: true,
  },
  {
    id: 'pick-amk-family',
    title: 'Adventure Medical Kits family first aid kit',
    blurb: 'A family-sized first-aid kit from a well-known maker. See the official page for the current contents list and price.',
    lane: 'first-aid',
    sourceName: 'Adventure Medical Kits',
    affiliateUrl: null,
    fallbackUrl: 'https://adventuremedicalkits.com/products/adventure-first-aid-family-first-aid-kit',
    catalogId: 'amk-adventure-first-aid-family',
    image: '/directory/covers/ready-kit.svg',
    imageKind: 'icon',
    offerLabel: 'Family first aid',
  },
  {
    id: 'pick-sam-splint',
    title: 'SAM Splint',
    blurb: 'A widely used reusable padded splint. See the official page for sizes and current price. This is not a substitute for first-aid training.',
    lane: 'first-aid',
    sourceName: 'SAM Medical',
    affiliateUrl: null,
    fallbackUrl: 'https://www.sammedical.com/products/sam-splint',
    catalogId: 'sam-splint',
    image: '/directory/covers/ready-kit.svg',
    imageKind: 'icon',
    offerLabel: 'Splint',
  },

  // ---- Fire & cooking ----
  {
    id: 'pick-coleman-stove',
    title: 'Coleman Classic 2-burner propane camp stove',
    blurb: 'A well-known two-burner camp stove for cooking outdoors or in a well-ventilated area. Use it only where the official instructions allow; never indoors or in a garage.',
    lane: 'fire-cooking',
    sourceName: 'Coleman',
    affiliateUrl: null,
    fallbackUrl: 'https://www.coleman.com/grills-stoves/camping-stoves/multi-burner/classic-propane-gas-camping-stove-2-burner/SAP_2223621.html',
    catalogId: 'coleman-classic-propane-stove-2-burner',
    image: '/directory/covers/ready-kit.svg',
    imageKind: 'icon',
    offerLabel: 'Camp stove',
    featured: true,
  },
  {
    id: 'pick-uco-matches',
    title: 'UCO stormproof match kit',
    blurb: 'Stormproof matches in a case, a small, reliable way to start a stove or a fire. See the official page for count and current price.',
    lane: 'fire-cooking',
    sourceName: 'UCO',
    affiliateUrl: null,
    fallbackUrl: 'https://ucogear.com/products/stormproof-match-container-w-25-matches',
    catalogId: 'uco-stormproof-match-kit',
    image: '/directory/covers/ready-kit.svg',
    imageKind: 'icon',
    offerLabel: 'Matches',
  },
  {
    id: 'pick-lodge-skillet',
    title: 'Lodge classic cast iron skillet',
    blurb: 'A skillet that works on a camp stove or an outdoor burner. See the official page for sizes and current price.',
    lane: 'fire-cooking',
    sourceName: 'Lodge',
    affiliateUrl: null,
    fallbackUrl: 'https://www.lodgecastiron.com/products/round-cast-iron-classic-skillet',
    catalogId: 'lodge-classic-cast-iron-skillet',
    image: '/directory/covers/ready-kit.svg',
    imageKind: 'icon',
    offerLabel: 'Skillet',
  },

  // ---- Shelter & warmth ----
  {
    id: 'pick-sol-bivvy',
    title: 'SOL emergency bivvy',
    blurb: 'A compact emergency bivvy with a whistle, for an unexpected night out or a cold car wait. See the official page for specs and current price.',
    lane: 'shelter-warmth',
    sourceName: 'SOL (Survive Outdoors Longer)',
    affiliateUrl: null,
    fallbackUrl: 'https://www.surviveoutdoorslonger.com/products/emergency-bivvy-with-rescue-whistle',
    catalogId: 'sol-emergency-bivvy',
    image: '/directory/covers/ready-kit.svg',
    imageKind: 'icon',
    offerLabel: 'Emergency bivvy',
    featured: true,
  },
  {
    id: 'pick-teton-celsius',
    title: 'TETON Sports Celsius Regular 0°F sleeping bag',
    blurb: 'A 0°F-rated sleeping bag many people keep for camping and for a cold house. See the official page for temperature rating, size, and price.',
    lane: 'shelter-warmth',
    sourceName: 'TETON Sports',
    affiliateUrl: null,
    fallbackUrl: 'https://tetongear.com/products/celsius-0-f-sleeping-bag-orange-grey',
    catalogId: 'teton-sports-celsius-regular-0',
    image: '/directory/covers/ready-kit.svg',
    imageKind: 'icon',
    offerLabel: 'Sleeping bag',
  },
  {
    id: 'pick-3m-window-kit',
    title: '3M indoor window insulator kit',
    blurb: 'A clear plastic insulator kit for drafty windows during a cold snap. See the official 3M page for kit size and installation notes.',
    lane: 'shelter-warmth',
    sourceName: '3M',
    affiliateUrl: null,
    fallbackUrl: 'https://www.3m.com/3M/en_US/p/d/v000241376/',
    catalogId: '3m-indoor-window-insulator-kit',
    image: '/directory/covers/ready-kit.svg',
    imageKind: 'icon',
    offerLabel: 'Window kit',
  },

  // ---- Tools ----
  {
    id: 'pick-leatherman-wave-plus',
    title: 'Leatherman Wave Plus multi-tool',
    blurb: 'A well-known multi-tool that earns a place in a bag or a drawer. See the official page for tools included and current price.',
    lane: 'tools',
    sourceName: 'Leatherman',
    affiliateUrl: null,
    fallbackUrl: 'https://www.leatherman.com/products/wave',
    catalogId: 'leatherman-wave-plus',
    image: '/directory/covers/ready-kit.svg',
    imageKind: 'icon',
    offerLabel: 'Multi-tool',
    featured: true,
  },
  {
    id: 'pick-gerber-600',
    title: 'Gerber Multi-Plier 600',
    blurb: 'A second well-known multi-tool, useful as a spare in a vehicle kit. See the official page for the current model and price.',
    lane: 'tools',
    sourceName: 'Gerber',
    affiliateUrl: null,
    fallbackUrl: 'https://www.gerbergear.com/products/multi-plier-600-basic-g07550n',
    catalogId: 'gerber-multi-plier-600-basic',
    image: '/directory/covers/ready-kit.svg',
    imageKind: 'icon',
    offerLabel: 'Multi-tool',
  },

  // ---- Sanitation (not previously in the catalog; plain official URLs) ----
  {
    id: 'pick-luggable-loo',
    title: 'Reliance Luggable Loo portable toilet',
    blurb: 'A 5-gallon portable toilet with a snap-on seat, for when household plumbing is out of service. See the official page for use and waste-bag compatibility.',
    lane: 'sanitation',
    sourceName: 'Reliance Outdoors',
    affiliateUrl: null,
    fallbackUrl: 'https://relianceoutdoors.com/products/luggable-loo-portable-toilet',
    image: '/directory/covers/sanitation.svg',
    imageKind: 'icon',
    offerLabel: 'Portable toilet',
    featured: true,
  },
  {
    id: 'pick-cleanwaste-go-anywhere',
    title: 'Cleanwaste GO Anywhere portable toilet',
    blurb: 'A folding portable toilet designed to be used with disposable toilet kits. Read the official page for use, disposal, and current price.',
    lane: 'sanitation',
    sourceName: 'Cleanwaste',
    affiliateUrl: null,
    fallbackUrl: 'https://cleanwaste.com/product/go-anywhere-portable-toilet/',
    image: '/directory/covers/sanitation.svg',
    imageKind: 'icon',
    offerLabel: 'Portable toilet',
  },

  // ---- Documents & cash ----
  {
    id: 'pick-family-binder',
    title: 'Family Emergency Binder',
    blurb: 'ReadyGearHub’s print-at-home binder for contacts, medicines, insurance, and shut-offs — the paper copies you want when the power is out.',
    lane: 'documents',
    sourceName: 'ReadyGearHub shop',
    affiliateUrl: null,
    fallbackUrl: '/shop/family-emergency-binder/',
    programId: 'payhip',
    catalogId: 'payhip-family-emergency-binder',
    image: '/shop/family-emergency-binder.png',
    offerLabel: 'Instant PDF',
    cta: 'Details',
    featured: true,
  },
  {
    id: 'pick-sentrysafe-fireproof',
    title: 'SentrySafe fireproof safes',
    blurb: 'A well-known line of fire-resistant safes for paper documents and small valuables. The link opens SentrySafe’s official fireproof-safe category; choose a model and check the official fire rating before you buy.',
    lane: 'documents',
    sourceName: 'SentrySafe',
    affiliateUrl: null,
    fallbackUrl: 'https://www.sentrysafe.com/fireproof-safes',
    image: '/directory/covers/documents.svg',
    imageKind: 'icon',
    offerLabel: 'Official category',
    cta: 'See fireproof safes at SentrySafe',
    featured: true,
  },
  {
    id: 'pick-ready-gov-finance',
    title: 'ready.gov: financial preparedness',
    blurb: 'Official U.S. guidance on keeping some cash, copies of important documents, and a simple financial plan. This is a free government resource, not a product listing.',
    lane: 'documents',
    sourceName: 'ready.gov',
    affiliateUrl: null,
    fallbackUrl: 'https://www.ready.gov/financial-preparedness',
    image: '/directory/covers/documents.svg',
    imageKind: 'icon',
    offerLabel: 'Free official resource',
    cta: 'Read ready.gov guidance',
  },
];

export type ResolvedPrepperPick = PrepperPick & {
  href: string;
  affiliate: boolean;
  hideOnPaid: boolean;
  rel: string;
  priceLabel: string;
  ctaLabel: string;
  detailHref?: string;
};

function isInternal(href: string): boolean {
  return href.startsWith('/');
}

export function resolvePrepperPick(pick: PrepperPick): ResolvedPrepperPick {
  const hideOnPaid = Boolean(pick.hideOnPaid || (pick.programId && isNoPpcProgram(pick.programId)));
  const priceLabel = pick.programId === 'payhip' ? (pick.offerLabel === 'Instant PDF' ? 'See price' : 'See price') : 'See price';
  let href = '';
  let affiliate = false;

  if (pick.affiliateUrl && pick.affiliateUrl.trim()) {
    href = pick.affiliateUrl.trim();
    affiliate = true;
  } else if (pick.programId && pick.programId !== 'payhip') {
    const out = resolveOutbound(pick.programId, pick.fallbackUrl, pick.catalogId || pick.id);
    href = out.href;
    affiliate = out.affiliate;
  } else {
    href = pick.fallbackUrl;
  }

  const internal = isInternal(href);
  const ctaLabel = pick.cta
    || (pick.programId === 'payhip' ? 'Details'
      : affiliate ? 'See price'
      : pick.offerLabel === 'Free official resource' ? 'Read official guidance'
      : 'See official page');

  return {
    ...pick,
    href,
    affiliate,
    hideOnPaid,
    rel: internal ? '' : (affiliate ? 'sponsored nofollow noopener' : 'noopener'),
    priceLabel,
    ctaLabel,
    detailHref: pick.catalogId && pick.catalogId.startsWith('payhip-')
      ? pick.fallbackUrl
      : pick.catalogId && !pick.catalogId.includes('bluetti-') && !pick.programId
        ? `/gear/${pick.catalogId}/`
        : pick.catalogId && pick.fallbackUrl.startsWith('http') && [
            'reliance-aqua-tainer','waterbob','sawyer-squeeze-water-filter','lifestraw-family',
            'datrex-emergency-water-dx1000w','readywise-72-hour-food-kit','augason-farms-30-day-1-person',
            'mountain-house-classic-bucket','readywise-4-week-food-supply','honda-eu2200i',
            'renogy-100w-12v-solar-kit','goal-zero-lighthouse-600','black-diamond-spot-400',
            'midland-er310-crank-radio','garmin-inreach-mini-2','midland-wr400','mymedic-myfak',
            'amk-adventure-first-aid-family','sam-splint','coleman-classic-propane-stove-2-burner',
            'uco-stormproof-match-kit','lodge-classic-cast-iron-skillet','sol-emergency-bivvy',
            'teton-sports-celsius-regular-0','3m-indoor-window-insulator-kit','leatherman-wave-plus',
            'gerber-multi-plier-600-basic',
          ].includes(pick.catalogId)
          ? `/gear/${pick.catalogId}/`
          : undefined,
  };
}

const LANE_GROUP: Record<PrepperLaneId, SourceGroupId> = {
  water: 'home-water',
  food: 'safety-prep',
  power: 'power-tech',
  lighting: 'power-tech',
  comms: 'power-tech',
  'first-aid': 'safety-prep',
  'fire-cooking': 'outdoor-auto',
  'shelter-warmth': 'safety-prep',
  tools: 'outdoor-auto',
  sanitation: 'home-water',
  documents: 'safety-prep',
};

const LANE_CATEGORY: Record<PrepperLaneId, string> = {
  water: 'water',
  food: 'safety',
  power: 'power',
  lighting: 'power',
  comms: 'tech',
  'first-aid': 'safety',
  'fire-cooking': 'outdoor',
  'shelter-warmth': 'safety',
  tools: 'tools',
  sanitation: 'home',
  documents: 'safety',
};

export function resolvedPrepperPicks(): ResolvedPrepperPick[] {
  return prepperPicks.map(resolvePrepperPick);
}

export function featuredPrepperPicks(): ResolvedPrepperPick[] {
  return resolvedPrepperPicks().filter((p) => p.featured);
}

/** Picks that are not already represented by a catalog/gear/partner id. */
export function newPrepperOnlyPicks(): ResolvedPrepperPick[] {
  return resolvedPrepperPicks().filter((p) => !p.catalogId);
}

export function prepperPickToCatalogItem(pick: ResolvedPrepperPick): CatalogItem {
  const kind: CatalogKind = pick.programId === 'payhip'
    ? 'own'
    : pick.offerLabel === 'Free official resource'
      ? 'resource'
      : pick.affiliate
        ? 'partner'
        : 'brand';
  return {
    id: pick.id,
    title: pick.title,
    blurb: pick.blurb,
    sourceName: pick.sourceName,
    href: pick.href,
    detailHref: pick.detailHref,
    rel: pick.rel,
    affiliate: pick.affiliate,
    hideOnPaid: pick.hideOnPaid,
    programId: pick.programId || (pick.affiliate ? pick.sourceName.toLowerCase() : ''),
    category: LANE_CATEGORY[pick.lane],
    image: pick.image,
    imageKind: pick.imageKind === 'icon' ? undefined : pick.imageKind,
    priceLabel: pick.priceLabel,
    offerLabel: pick.offerLabel,
    ctaLabel: pick.ctaLabel,
    groups: [LANE_GROUP[pick.lane]],
    kind,
    origin: 'prepper',
  };
}

export function countsByPrepperLane(picks = resolvedPrepperPicks()): Record<PrepperLaneId, number> {
  const counts = Object.fromEntries(prepperLanes.map((l) => [l.id, 0])) as Record<PrepperLaneId, number>;
  for (const p of picks) counts[p.lane] += 1;
  return counts;
}
