/**
 * Representative (stock) photos for listings that have no licensed product photo.
 * These are generic category photos (Pexels or existing self-hosted Unsplash/Pexels files),
 * never presented as the exact product. Cards label them "Representative photo".
 * Files live in /public/images/photos/{key}-{480,960,1600}.webp (16:9 or close).
 */
export type StockCover = { key: string; src: string; srcset: string; alt: string };

const ALT: Record<string, string> = {
  'stock-solar-panel': 'Close-up of a solar panel',
  'stock-solar-camp': 'Solar panels set up at a campsite',
  'stock-power-station': 'Person carrying a portable power station outdoors',
  'stock-battery-bank': 'A battery bank wired to an inverter',
  'stock-rv': 'A camper trailer parked in a field',
  'stock-boat': 'A boat on calm water',
  'stock-flashlight': 'A tactical flashlight',
  'stock-lantern': 'A lantern at a lakeside campsite',
  'stock-smart-cam': 'A smart home camera and sensor',
  'stock-cctv': 'Security cameras mounted on a pole',
  'stock-alarm': 'A ceiling-mounted alarm',
  'stock-laptop': 'A laptop on a desk',
  'stock-cyber': 'Wooden blocks spelling cyber security',
  'stock-house': 'A house exterior',
  'stock-insurance': 'Home insurance paperwork',
  'stock-pipe': 'A water pipe',
  'stock-headphones': 'Headphones',
  'stock-speaker': 'A portable speaker outdoors',
  'stock-books': 'Shelves of books and records',
  'stock-drill': 'A power drill on a workbench',
  'stock-boots': 'A hiker’s boots on a trail log',
  'stock-winter-boots': 'Winter boots walking through fresh snow',
  'stock-winter-boots-2': 'Close-up of laced winter boots in fresh snow',
  'stock-snow-shovel': 'Someone shoveling snow from a driveway',
  'stock-gloves': 'A hand in a winter glove',
  'stock-radio': 'A person using a two-way radio',
  'stock-stove': 'A camp stove outdoors',
  'stock-wood-stove': 'A small wood stove',
  'hero-drones-air': 'Drones in flight',
  'hero-utv-dunes': 'An off-road vehicle on dunes',
  'hero-overland-truck': 'An overland truck',
  'hero-bunker-hatch': 'A shelter hatch',
  'hero-first-aid-crisp': 'A first aid kit',
  'hero-radios': 'Handheld radios',
  'multitools': 'Folding knives and multitools',
  'prep-food-storage': 'Shelf-stable food storage',
  'hero-water-pour': 'Pouring clean water',
  'water-bottles': 'Stacked water jugs',
  'hero-tent-stars': 'A tent under trees',
  'hero-campsite': 'Camping tents and chairs around a fire ring',
  'cast-iron-fire': 'A cast iron skillet over a fire',
  'car-in-snow': 'A car covered in snow',
  'power-banks': 'Portable electronics and chargers',
  'checklist-writing': 'Someone checking items off a list',
  'gear-flatlay': 'Outdoor gear',
  'hero-binoculars': 'A person holding binoculars',
};

export function cover(key: string): StockCover {
  const base = `/images/photos/${key}`;
  return {
    key,
    src: `${base}-960.webp`,
    srcset: `${base}-480.webp 480w, ${base}-960.webp 960w, ${base}-1600.webp 1600w`,
    alt: `Representative photo: ${(ALT[key] || 'Outdoor gear').replace(/^./, (c) => c.toLowerCase())}`,
  };
}

type Rule = [key: string, re: RegExp];

/** First match wins. Tested against "id title sourceName category". */
const RULES: Rule[] = [
  // Official resources first (free government / nonprofit pages)
  ['checklist-writing', /ready\.gov|cdc[: ]|fema|\bmema\b|insurance department|\bnaic\b|floodsmart|usda|american red cross: |national weather service/],
  // Winter footwear and snow tools (before broader snow/boot rules)
  ['stock-winter-boots', /\bbogs\b|winter boots?|snow boots?/],
  ['stock-snow-shovel', /snow shovel|shovelution|shovel/],
  // Specific LiTime picks
  ['stock-rv', /litime-12v-100ah-group24/],
  ['stock-boat', /litime-12v-100ah-trolling|trolling/],
  ['stock-battery-bank', /litime-24v-230ah|lifepo4|lithium battery|^litime /],
  ['stock-solar-camp', /diy-solar-generator|solar (generator|kit)|solar-kit|c2000-gen2-400w-kit|12v-solar-kit/],
  ['stock-solar-panel', /solar[- ]?panel|bifacial|nomad|solarsaga|\bps\d{3}\b|anker-solix-ps\d+|sp\d{3}|\bpv\d|^renogy|renogy$/],
  ['solar-rooftops', /energysage|rooftop solar/],
  ['stock-power-station', /power[- ]?station|anker.?solix|f3800|c1000|f2000|ecoflow|jackery|goal.zero|allpowers|pecron|powermarket|generac|honda|generator|battery backup|bluetti/],
  ['power-banks', /power[- ]?bank|jump ?starter|batteries plus|noco/],
  // Specific brand lines that would otherwise match broader rules
  ['multitools', /leatherman|gerber|multi-?tool|knife|raptor/],
  ['stock-radio', /zoleo|garmin|inreach|iridium|bluecosmo|satellite|walkie|btech|baofeng|gxt|xtalker|mxt/],
  ['hero-radios', /radio|midland|cobra|\beton\b|acurite|weather|crank|wr400/],
  ['hero-tent-stars', /\bteton\b|tent\b|\bsol\b|bivvy|survive outdoors|therm-a-rest/],
  // Drones and vehicles
  ['hero-drones-air', /drone|dji|autel|skydio|hoverair|mavic/],
  ['hero-utv-dunes', /polaris|can-am|utv|side-by-side/],
  ['hero-overland-truck', /toyota|jeep|land rover|ineos|inkas|rezvani|sportsmobile|storyteller|earthroamer|overland|defender|wrangler|gladiator|grenadier|vevor|vehicle/],
  ['hero-bunker-hatch', /bunker|shelter|rising s|atlas survival|terra vivos|safe room|vivos/],
  ['stock-cctv', /knightscope|reolink|arlo|eufy|camera|cove smart|simplisafe/],
  // Medical, light
  ['hero-first-aid-crisp', /first[- ]aid|medic|tourniquet|splint|chest-seals|trauma|amk|my ?medic|mymedic|sam medical|heartstart|philips|dental|blister|mira safety/],
  ['hero-campsite', /uco stormproof|match kit|yeti\b|teton|coleman classic|camp/],
  ['stock-lantern', /lantern|lighthouse|biolite|alpenglow|blackout/],
  ['stock-flashlight', /flashlight|headlamp|fenix|nitecore|olight|wuben|petzl|black diamond|spot|actik/],
  // Alarms and home sensors
  ['stock-house', /sentrysafe|safes?\b|leaffilter|3m indoor window|angi|networx|modernize|home depot|ace hardware/],
  ['stock-smart-cam', /yolink|flo by|moen|sensor|leak|\bring\b|smart home/],
  ['stock-alarm', /kidde|smoke|carbon monoxide|co alarm|alarm|fire extinguisher/],
  ['stock-pipe', /waterbob|water leak|plumb/],
  // Food and water
  ['prep-food-storage', /mountain house|readywise|augason|legacy|backpacker|survival frog|food|pantry|bucket|meal|datrex|rations/],
  ['gear-flatlay', /\bredi\b|carhartt/],
  ['water-bottles', /aqua-tainer|jumbo-tainer|jug/],
  ['hero-water-pour', /lifestraw|grayl|sawyer|katadyn|water|filter|berkey|tap score|aquasana|waterdrop|epic/],
  // Camp, heat, cold
  ['stock-wood-stove', /mr\.? heater|heater|zippo|heatbank|vornado|hothands|hand warmer|fireplace/],
  ['cast-iron-fire', /lodge|skillet|cast iron/],
  ['stock-stove', /stove|cook|coleman|jetboil/],
  ['car-in-snow', /snow joe|snow-|shovel|broom|snow/],
  ['stock-boots', /yaktrax|kahtoola|darn tough|hunter boots|\bboots?\b|waders|tidewe|\bbogs\b/],
  ['stock-gloves', /glove|magid/],
  // Insurance, services, tools
  ['stock-insurance', /insurance|warranty|american home shield|hiscox|liberty mutual|axa|travel/],
  ['stock-drill', /dewalt|milwaukee|stanley|klein|mro supreme|tool/],
  // Digital, audio, fun
  ['stock-headphones', /crutchfield|headphone|apple music|audible|skullcandy|music|audio/],
  ['stock-speaker', /jbl|sonos|speaker/],
  ['stock-cyber', /nordpass|1password|roboform|proton|incogni|deleteme|password|private internet|identitytheft|cisa|monarch|surfshark/],
  ['stock-laptop', /vpn|nord|surfshark|express|cyberghost|private internet|proton|incogni|deleteme|1password|roboform|password|digital|cisa|identitytheft|monarch/],
  ['stock-books', /comic|marvel|dc shop|graphic|card|pok|magic: the|tcgplayer|ebay|hasbro|theory11|bicycle|playing|books|games/],
  // Retail
  ['gear-flatlay', /amazon|walmart|target|academy|bass pro|cabela|dick|sportsman|retailer|marketplace/],
];

/** Listings we deliberately leave as text cards: no honest generic photo exists. */
const LEAVE_TEXT = /byrna|sabre|boston dynamics|unitree|ghost robotics|pepper spray|launcher|cleanwaste|luggable loo|toilet/i;

type Cardish = {
  id: string; title: string; sourceName?: string; category?: string;
  image?: string; imageKind?: string; kind?: string; origin?: string; programId?: string;
};

export function stockCoverFor(item: Cardish): StockCover | undefined {
  if (item.kind === 'tool' || item.kind === 'own' || item.origin === 'payhip' || item.origin === 'tools' || item.origin === 'apps') return undefined;
  const tinyCreative = /aquasana-brand-300x250|choice-home-warranty-250|nordpass-logo-512|nordvpn-faster-300x250|surfshark-privacy/.test(item.image || '');
  if (item.image && !item.image.endsWith('.svg') && !tinyCreative) return undefined;
  const hay = `${item.id} ${item.title} ${item.sourceName || ''} ${item.category || ''}`.toLowerCase().replace(/&#39;/g, "'");
  if (LEAVE_TEXT.test(hay)) return undefined;
  // Drones & Robotics: only drones get a (labeled) representative drone photo. Robot cards stay text-only.
  if (item.category === 'drones-robotics' && !/\bdrone\b|autel|hoverair/.test(hay)) return undefined;
  for (const [key, re] of RULES) {
    if (re.test(hay)) return cover(key);
  }
  return cover('gear-flatlay');
}
