/**
 * Checklist text is taken from Ready.gov "Build A Kit" (https://www.ready.gov/kit)
 * and, for pets, Ready.gov "Prepare Your Pets for Disasters" (https://www.ready.gov/pets).
 * relatedItems / relatedLanes / relatedGuides use only slugs that exist in this repo.
 */
export const KIT_SOURCES = {
  kit: { name: 'Ready.gov, Build A Kit', url: 'https://www.ready.gov/kit' },
  pets: { name: 'Ready.gov, Prepare Your Pets for Disasters', url: 'https://www.ready.gov/pets' },
} as const;

export const WATER_SOURCES = {
  kit: { name: 'Ready.gov, Build A Kit', url: 'https://www.ready.gov/kit' },
  water: { name: 'Ready.gov, Water', url: 'https://www.ready.gov/water' },
  areYouReady: {
    name: 'Ready.gov, Are You Ready? An In-Depth Guide to Citizen Preparedness',
    url: 'https://www.ready.gov/sites/default/files/2021-11/are-you-ready-guide.pdf',
  },
} as const;

/** Ready.gov: one gallon per person per day for drinking and sanitation. */
export const WATER_GALLONS_PER_PERSON_PER_DAY = 1;
/**
 * Ready.gov kit/water pages say "several days," not a fixed number.
 * The Are You Ready guide says you may wish to keep 3, 7, or even 14 days
 * of water on hand, depending on where you live. This default uses 3 days
 * as that guide's shortest figure. Ready.gov does not state a required
 * "two-week supply for home."
 */
export const WATER_MIN_DAYS = 3;

export function waterGallons(people: number, days: number) {
  const p = Math.max(1, Math.floor(Number(people) || 1));
  const d = Math.max(WATER_MIN_DAYS, Math.floor(Number(days) || WATER_MIN_DAYS));
  return { people: p, days: d, gallons: p * d * WATER_GALLONS_PER_PERSON_PER_DAY };
}

export function waterPlanText(people: number, days: number) {
  const plan = waterGallons(people, days);
  const nounP = plan.people === 1 ? 'person' : 'people';
  const nounG = plan.gallons === 1 ? 'gallon' : 'gallons';
  return `For ${plan.people} ${nounP} over ${plan.days} days, that is ${plan.gallons} ${nounG} (1 gallon per person per day). Ready.gov recommends one gallon per person per day for several days. This tool uses a ${WATER_MIN_DAYS}-day minimum, the shortest figure in Ready.gov's Are You Ready guide, which says you may wish to keep 3, 7, or even 14 days of water on hand depending on where you live.`;
}


export type KitLine = {
  id: string;
  /** Short official-based label shown on the printable list. */
  label: string;
  /** Extra context; may include computed quantities added by the page script. */
  detail?: string;
  always?: boolean;
  ifPets?: boolean;
  ifInfants?: boolean;
  ifMeds?: boolean;
  ifVehicle?: boolean;
  section: 'basic' | 'additional' | 'pets' | 'vehicle' | 'maintain';
  relatedLanes?: string[];
  relatedItems?: string[];
  relatedGuides?: string[];
};

export const KIT_LINES: KitLine[] = [
  {
    id: 'water',
    label: 'Water: one gallon per person per day for drinking and sanitation',
    detail: 'Ready.gov recommends one gallon per person per day for several days. The Are You Ready guide says you may wish to keep 3, 7, or even 14 days of water on hand, depending on where you live. This list uses a 3-day minimum unless you choose a longer plan.',
    always: true,
    section: 'basic',
    relatedLanes: ['winter-storm-prep', 'storm-hurricane-prep'],
    relatedItems: ['reliance-aqua-tainer', 'waterbob', 'grayl-geopress-24oz', 'lifestraw-personal', 'sawyer-mini-water-filter'],
  },
  {
    id: 'food',
    label: 'Food: at least a several-day supply of non-perishable food',
    always: true,
    section: 'basic',
    relatedLanes: ['winter-storm-prep'],
    relatedItems: ['mountain-house-classic-bucket', 'readywise-4-week-food-supply', 'readywise-5-day-survival-backpack'],
  },
  {
    id: 'can-opener',
    label: 'Manual can opener (for food)',
    always: true,
    section: 'basic',
    relatedLanes: ['homestead-multi-purpose'],
    relatedItems: ['leatherman-wave-plus', 'gerber-multi-plier-600-basic'],
  },
  {
    id: 'radio',
    label: 'Battery-powered or hand crank radio and a NOAA Weather Radio with tone alert',
    always: true,
    section: 'basic',
    relatedLanes: ['winter-storm-prep'],
    relatedItems: ['midland-wr400', 'midland-er310-crank-radio', 'eton-red-cross-frx2'],
    relatedGuides: ['winter-storm-watch-vs-warning'],
  },
  {
    id: 'flashlight',
    label: 'Flashlight',
    always: true,
    section: 'basic',
    relatedLanes: ['power-outage-kits'],
    relatedItems: ['biolite-alpenglow-500', 'goal-zero-lighthouse-600', 'black-diamond-spot-400', 'fenix-hm65r-v2', 'petzl-actik-core', 'eton-blackout-buddy-h2o'],
    relatedGuides: ['winter-power-outage-checklist'],
  },
  {
    id: 'batteries',
    label: 'Extra batteries',
    always: true,
    section: 'basic',
    relatedLanes: ['power-outage-kits'],
  },
  {
    id: 'first-aid',
    label: 'First aid kit',
    always: true,
    section: 'basic',
    relatedLanes: ['vehicle-emergency-kits'],
    relatedItems: ['amk-mountain-series-hiker'],
  },
  {
    id: 'whistle',
    label: 'Whistle (to signal for help)',
    always: true,
    section: 'basic',
    relatedItems: ['sol-emergency-bivvy'],
  },
  {
    id: 'dust-mask',
    label: 'Dust mask (to help filter contaminated air)',
    always: true,
    section: 'basic',
  },
  {
    id: 'shelter-in-place',
    label: 'Plastic sheeting, scissors, and duct tape (to shelter in place)',
    always: true,
    section: 'basic',
  },
  {
    id: 'sanitation',
    label: 'Moist towelettes, garbage bags, and plastic ties (for personal sanitation)',
    always: true,
    section: 'basic',
  },
  {
    id: 'utilities',
    label: 'Wrench or pliers (to turn off utilities)',
    always: true,
    section: 'basic',
    relatedLanes: ['homestead-multi-purpose'],
    relatedItems: ['leatherman-wave-plus', 'gerber-multi-plier-600-basic'],
  },
  {
    id: 'maps',
    label: 'Local maps',
    always: true,
    section: 'basic',
  },
  {
    id: 'phone',
    label: 'Cell phone with chargers and a backup battery',
    always: true,
    section: 'basic',
    relatedLanes: ['power-outage-kits', 'off-grid-power'],
    relatedItems: ['anker-prime-power-bank-20k-220w', 'jackery-explorer-300-v2', 'anker-solix-c1000x'],
    relatedGuides: ['how-to-pick-a-portable-power-station'],
  },
  {
    id: 'soap',
    label: 'Soap, hand sanitizer, and disinfecting wipes to disinfect surfaces',
    always: true,
    section: 'additional',
  },
  {
    id: 'meds-rx',
    label: 'Prescription medications (Ready.gov notes an emergency can make refills hard)',
    ifMeds: true,
    section: 'additional',
  },
  {
    id: 'meds-otc',
    label: 'Non-prescription medications such as pain relievers, anti-diarrhea medication, antacids, or laxatives',
    always: true,
    section: 'additional',
  },
  {
    id: 'glasses',
    label: 'Prescription eyeglasses and contact lens solution',
    ifMeds: true,
    section: 'additional',
  },
  {
    id: 'infant',
    label: 'Infant formula, bottles, diapers, wipes, and diaper rash cream',
    ifInfants: true,
    section: 'additional',
  },
  {
    id: 'cash',
    label: 'Cash or traveler’s checks',
    always: true,
    section: 'additional',
  },
  {
    id: 'documents',
    label: 'Important family documents (insurance, identification, bank records) saved electronically or in a waterproof, portable container',
    always: true,
    section: 'additional',
  },
  {
    id: 'blankets',
    label: 'Sleeping bag or warm blanket for each person',
    always: true,
    section: 'additional',
    relatedLanes: ['winter-storm-prep', 'cold-weather-gear'],
    relatedItems: ['teton-sports-celsius-regular-0', 'therm-a-rest-z-lite-sol', 'sol-emergency-blanket', 'darn-tough-hiker-boot-full-cushion'],
    relatedGuides: ['how-to-stay-warm-without-power'],
  },
  {
    id: 'clothing',
    label: 'Complete change of clothing appropriate for your climate and sturdy shoes',
    always: true,
    section: 'additional',
    relatedLanes: ['cold-weather-gear'],
    relatedItems: ['darn-tough-hiker-boot-full-cushion', 'kahtoola-microspikes', 'yaktrax-pro'],
  },
  {
    id: 'extinguisher',
    label: 'Fire extinguisher',
    always: true,
    section: 'additional',
    relatedItems: ['kidde-pro-210'],
  },
  {
    id: 'matches',
    label: 'Matches in a waterproof container',
    always: true,
    section: 'additional',
    relatedItems: ['uco-stormproof-match-kit'],
  },
  {
    id: 'hygiene',
    label: 'Feminine supplies and personal hygiene items',
    always: true,
    section: 'additional',
  },
  {
    id: 'mess',
    label: 'Mess kits, paper cups, plates, paper towels, and plastic utensils',
    always: true,
    section: 'additional',
  },
  {
    id: 'paper',
    label: 'Paper and pencil',
    always: true,
    section: 'additional',
  },
  {
    id: 'kids',
    label: 'Books, games, puzzles, or other activities for children',
    always: true,
    section: 'additional',
  },
  {
    id: 'pet-food',
    label: 'Pet food: several days’ supply in an airtight, waterproof container',
    ifPets: true,
    section: 'pets',
  },
  {
    id: 'pet-water',
    label: 'Water for your pet: a bowl and several days’ supply (Ready.gov does not specify a gallon amount — plan from what your pet actually drinks)',
    ifPets: true,
    section: 'pets',
    relatedItems: ['reliance-aqua-tainer'],
  },
  {
    id: 'pet-meds',
    label: 'Extra supply of medicine your pet takes regularly, in a waterproof container',
    ifPets: true,
    section: 'pets',
  },
  {
    id: 'pet-id',
    label: 'Collar with ID tag and a harness or leash (include a backup)',
    ifPets: true,
    section: 'pets',
  },
  {
    id: 'pet-carrier',
    label: 'Traveling bag, crate, or sturdy carrier, ideally one for each pet',
    ifPets: true,
    section: 'pets',
  },
  {
    id: 'pet-records',
    label: 'Copies of your pet’s registration and other documents, plus a photo of you and your pet together',
    ifPets: true,
    section: 'pets',
  },
  {
    id: 'pet-sanitation',
    label: 'Pet sanitation supplies (litter and litter box if needed, newspapers, paper towels, plastic bags)',
    ifPets: true,
    section: 'pets',
  },
  {
    id: 'pet-familiar',
    label: 'Familiar items such as favorite toys, treats, or bedding',
    ifPets: true,
    section: 'pets',
  },
  {
    id: 'vehicle-kit',
    label: 'A kit of emergency supplies in your car in case you are stranded (Ready.gov, Kit Storage Locations)',
    ifVehicle: true,
    section: 'vehicle',
    relatedLanes: ['vehicle-emergency-kits'],
    relatedItems: ['noco-boost-gb40', 'snow-joe-telescoping-snow-broom', 'amk-mountain-series-hiker', 'sol-emergency-blanket', 'sol-emergency-bivvy', 'garmin-inreach-mini-2'],
    relatedGuides: ['winter-car-emergency-kit'],
  },
];
