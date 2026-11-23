/**
 * Official product photos from affiliate-network catalogs and product feeds.
 * Files live in /public/directory/photos/{key}-{width}.webp. Widths never exceed
 * the source pixel size (no upscaling). Credits: IMAGE_CREDITS.md.
 */
export type ProductPhoto = {
  key: string;
  alt: string;
  src: string;
  srcset: string;
  widths: number[];
};

const ENTRIES: Record<string, { alt: string; widths: number[] }> = {
  'anker-solix-ps400': { alt: 'Anker SOLIX PS400 bifacial portable solar panel', widths: [480, 960, 1000] },
  'anker-solix-ps100': { alt: 'Anker SOLIX PS100 bifacial portable solar panel', widths: [480, 960, 1600] },
  'anker-solix-c2000-gen2-400w-kit': { alt: 'Anker SOLIX C2000 Gen 2 portable power station with a 400W solar panel kit', widths: [480, 960, 1600] },
  'anker-solix-f3800-plus': { alt: 'Anker SOLIX F3800 Plus portable power station', widths: [480, 960, 1600] },
  'anker-solix-c1000x': { alt: 'Anker SOLIX C1000X portable power station', widths: [480, 960, 1200] },
  'litime-12v-100ah-group24': { alt: 'LiTime LiHeat 12V 100Ah Group 24 self-heating lithium battery', widths: [480, 960, 1000] },
  'litime-24v-230ah': { alt: 'LiTime LiHeat 24V 230Ah self-heating lithium battery', widths: [480, 960, 1000] },
  'litime-12v-100ah-trolling': { alt: 'LiTime 12V 100Ah TM lithium marine trolling-motor battery', widths: [480, 960, 1000] },
  'litime-diy-solar-generator-kit': { alt: 'LiTime DIY solar generator complete power kit', widths: [480, 960, 1000] },
  'wuben-a1': { alt: 'Wuben A1 portable spotlight, listed as 20,000 lumens', widths: [480, 960, 1600] },
  'wuben-lightok-x1': { alt: 'Wuben Lightok X1 rechargeable flashlight, listed as 12,000 lumens, in black', widths: [480, 960, 1600] },
  'wuben-a22': { alt: 'Wuben A22 rechargeable flashlight, listed as 4,500 lumens', widths: [480, 960, 1000] },
  'wuben-h1': { alt: 'Wuben H1 rechargeable headlamp, listed as 1,200 lumens', widths: [480, 900] },
  'wuben-e7': { alt: 'Wuben E7 rechargeable headlamp, listed as 1,800 lumens, in black', widths: [480, 960, 1000] },
  'wuben-lightok-x2': { alt: 'Wuben Lightok X2 rechargeable flashlight, listed as 2,500 lumens, in white', widths: [480, 960, 1600] },
  'wuben-c2': { alt: 'Wuben C2 rechargeable everyday-carry flashlight, listed as 2,000 lumens', widths: [480, 960, 1600] },
  'anker-solix-c1000x-gen2': { alt: 'Anker SOLIX C1000 Gen 2 portable power station', widths: [480, 960, 1600] },
  'anker-solix-c2000-gen2': { alt: 'Anker SOLIX C2000 Gen 2 portable power station', widths: [480, 960, 1600] },
  'anker-solix-ps200': { alt: 'Anker SOLIX PS200 bifacial portable solar panel', widths: [480, 960, 1600, 2000] },
  'anker-solix-bp3800': { alt: 'Anker SOLIX BP3800 expansion battery, listed as 3,840Wh, for the F3800 series', widths: [480, 960, 1600, 2000] },
  'anker-solix-bp2000-gen2': { alt: 'Anker SOLIX BP2000 expansion battery (Gen 2), for the C2000 Gen 2', widths: [480, 960, 1600, 2000] },
  'anker-solix-c300x': { alt: 'Anker SOLIX C300X portable power station, listed as 288Wh and 300W', widths: [480, 960, 1600, 2000] },
  'anker-solix-c800x-100w-kit': { alt: 'Anker SOLIX C800X portable power station with a 100W solar panel kit', widths: [480, 960, 1600, 2000] },
  'anker-solix-c300-dc-60w-kit': { alt: 'Anker SOLIX C300 DC solar generator with a 60W solar panel', widths: [480, 960, 1600, 2000] },
  'litime-12v-50ah': { alt: 'LiTime 12V 50Ah lithium battery', widths: [480, 960, 1600] },
  'litime-12v-200ah-bluetooth': { alt: 'LiTime 12V 200Ah Bluetooth lithium battery', widths: [480, 960, 1000] },
  'litime-1000w-12v-inverter': { alt: 'LiTime 1000W 12V pure sine wave inverter', widths: [480, 960, 1000] },
  'litime-2000w-12v-inverter-ats': { alt: 'LiTime 2000W 12V pure sine wave inverter with an automatic transfer switch', widths: [480, 960, 1000] },
  'litime-30a-mppt': { alt: 'LiTime 30A MPPT solar charge controller', widths: [480, 960, 1000] },
  'litime-12v-10a-charger': { alt: 'LiTime 12V 10A LiFePO4 battery charger', widths: [480, 960, 1600] },
  'litime-12v-40a-dc-dc': { alt: 'LiTime 12V 40A DC-to-DC battery charger', widths: [480, 960, 1000] },
  'wuben-c3': { alt: 'Wuben C3 rechargeable flashlight, listed as 1,200 lumens, in black', widths: [480, 960, 1600] },
  'wuben-e12r': { alt: 'Wuben E12R rechargeable power-bank flashlight, listed as 1,200 lumens, in black', widths: [480, 900] },
  'wuben-f5': { alt: 'Wuben F5 rechargeable camping and tent light, in gray', widths: [480, 960, 1600] },
  'wuben-g5': { alt: 'Wuben G5 rechargeable keychain flashlight, listed as 400 lumens, in black', widths: [480, 960, 1600] },
  'wuben-x1-pro': { alt: 'Wuben X1 Pro rechargeable flashlight, listed as 12,300 lumens, in white', widths: [480, 960, 1600] },
  'wuben-x2-pro': { alt: 'Wuben X2 Pro+ rechargeable magnetic flashlight, listed as 1,500 lumens, in black', widths: [480, 960, 1600] },
  'wuben-h4': { alt: 'Wuben H4 rechargeable headlamp, in black', widths: [480, 960, 1600] },
  'wuben-lightok-x0': { alt: 'Wuben Lightok X0 rechargeable pocket flashlight, listed as 1,100 lumens, in black', widths: [480, 900] },
  'ispring-rcc7': { alt: 'iSpring RCC7 5-stage under-sink reverse osmosis system with a brushed nickel faucet and storage tank', widths: [480, 960, 1500] },
  'ispring-rcc7ak': { alt: 'iSpring RCC7AK alkaline 6-stage under-sink reverse osmosis system with a remineralization stage and storage tank', widths: [480, 960, 1500] },
  'ispring-ro500': { alt: 'iSpring RO500-BN tankless reverse osmosis system with a brushed nickel faucet', widths: [480, 960, 1600] },
  'ispring-rcd100': { alt: 'iSpring RCD100 5-stage countertop reverse osmosis water dispenser', widths: [480, 960, 1500] },
  'ispring-wgb21b': { alt: 'iSpring WGB21B 2-stage whole-house water filter with sediment and carbon-block cartridges', widths: [480, 960, 1356] },
  'ispring-wgb32b': { alt: 'iSpring WGB32B 3-stage whole-house water filter with 20-inch sediment and carbon-block cartridges', widths: [480, 960, 1500] },
  'ispring-sf2s': { alt: 'iSpring SF2S 33-stage shower filter with a replaceable cartridge', widths: [480, 960, 1493] },
  'ispring-df1': { alt: 'iSpring DF1 chrome faucet-mount drinking-water filter', widths: [480, 960, 1500] },
};


const BY_ID: Record<string, string> = {
  'anker-solix-ps400': 'anker-solix-ps400',
  'anker-solix-ps100': 'anker-solix-ps100',
  'anker-solix-c2000-gen2-400w-kit': 'anker-solix-c2000-gen2-400w-kit',
  'anker-solix-f3800-plus': 'anker-solix-f3800-plus',
  'anker-solix-c1000x': 'anker-solix-c1000x',
  'litime-12v-100ah-group24': 'litime-12v-100ah-group24',
  'litime-24v-230ah': 'litime-24v-230ah',
  'litime-12v-100ah-trolling': 'litime-12v-100ah-trolling',
  'litime-diy-solar-generator-kit': 'litime-diy-solar-generator-kit',
  'wuben-a1': 'wuben-a1',
  'wuben-lightok-x1': 'wuben-lightok-x1',
  'wuben-a22': 'wuben-a22',
  'wuben-h1': 'wuben-h1',
  'wuben-e7': 'wuben-e7',
  'wuben-lightok-x2': 'wuben-lightok-x2',
  'wuben-c2': 'wuben-c2',
  'anker-solix-c1000x-gen2': 'anker-solix-c1000x-gen2',
  'anker-solix-c2000-gen2': 'anker-solix-c2000-gen2',
  'anker-solix-ps200': 'anker-solix-ps200',
  'anker-solix-bp3800': 'anker-solix-bp3800',
  'anker-solix-bp2000-gen2': 'anker-solix-bp2000-gen2',
  'anker-solix-c300x': 'anker-solix-c300x',
  'anker-solix-c800x-100w-kit': 'anker-solix-c800x-100w-kit',
  'anker-solix-c300-dc-60w-kit': 'anker-solix-c300-dc-60w-kit',
  'litime-12v-50ah': 'litime-12v-50ah',
  'litime-12v-200ah-bluetooth': 'litime-12v-200ah-bluetooth',
  'litime-1000w-12v-inverter': 'litime-1000w-12v-inverter',
  'litime-2000w-12v-inverter-ats': 'litime-2000w-12v-inverter-ats',
  'litime-30a-mppt': 'litime-30a-mppt',
  'litime-12v-10a-charger': 'litime-12v-10a-charger',
  'litime-12v-40a-dc-dc': 'litime-12v-40a-dc-dc',
  'wuben-c3': 'wuben-c3',
  'wuben-e12r': 'wuben-e12r',
  'wuben-f5': 'wuben-f5',
  'wuben-g5': 'wuben-g5',
  'wuben-x1-pro': 'wuben-x1-pro',
  'wuben-x2-pro': 'wuben-x2-pro',
  'wuben-h4': 'wuben-h4',
  'wuben-lightok-x0': 'wuben-lightok-x0',
  'ispring-rcc7': 'ispring-rcc7',
  'ispring-rcc7ak': 'ispring-rcc7ak',
  'ispring-ro500': 'ispring-ro500',
  'ispring-rcd100': 'ispring-rcd100',
  'ispring-wgb21b': 'ispring-wgb21b',
  'ispring-wgb32b': 'ispring-wgb32b',
  'ispring-sf2s': 'ispring-sf2s',
  'ispring-df1': 'ispring-df1',
};


function build(key: string): ProductPhoto {
  const e = ENTRIES[key];
  const def = e.widths.includes(960) ? 960 : e.widths[e.widths.length - 1];
  return {
    key,
    alt: e.alt,
    src: `/directory/photos/${key}-${def}.webp`,
    srcset: e.widths.map((w) => `/directory/photos/${key}-${w}.webp ${w}w`).join(', '),
    widths: e.widths,
  };
}

const CACHE: Record<string, ProductPhoto> = {};
export function productPhotoByKey(key: string): ProductPhoto | undefined {
  if (!ENTRIES[key]) return undefined;
  return (CACHE[key] ??= build(key));
}

export function productPhotoFor(item: { id?: string }): ProductPhoto | undefined {
  const key = BY_ID[item.id || ''];
  return key ? productPhotoByKey(key) : undefined;
}

/** Subtle category tint for official product-photo backdrops. */
export function photoBackdropClass(item: {
  id?: string;
  title?: string;
  name?: string;
  offerLabel?: string;
  category?: string;
  brand?: string;
  tags?: string[];
}): string {
  const hay = [
    item.id, item.title, item.name, item.offerLabel, item.category, item.brand, ...(item.tags ?? []),
  ].filter(Boolean).join(' ').toLowerCase();
  if (/flashlight|headlamp|spotlight|lantern|\blighting\b|wuben/.test(hay)) return 'backdrop-light';
  if (/(?:\bbatter(?:y|ies)\b|litime)/.test(hay) && !/solar|panel|generator kit|power station|inverter|charger|mppt|anker-solix|bluetti/.test(hay)) return 'backdrop-battery';
  if (item.category === 'power' || /power station|solar|anker-solix|bluetti|inverter|charger|mppt/.test(hay)) return 'backdrop-power';
  if (item.category === 'water' || /ispring|aquasana|waterdrop|\bberkey\b|reverse osmosis|water filter|filtration/.test(hay)) return 'backdrop-water';
  return 'backdrop-default';
}
