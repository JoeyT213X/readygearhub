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
