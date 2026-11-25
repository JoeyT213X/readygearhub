/**
 * Category Shorts: short vertical videos (one per home-hero category).
 * Self-hosted under /public/shorts/. Kept separate from the catalog data on purpose.
 * Stock footage and music licensed through InVideo (exported clean). No prices, stats or brand logos.
 */
export type ShortId =
  | 'winter' | 'water' | 'food' | 'vehicle' | 'first-aid' | 'camping'
  | 'radios' | 'cold' | 'security' | 'overland' | 'drones';

export interface CategoryShort {
  id: ShortId;
  /** Category name as shown on the site. */
  label: string;
  /** Hook line from the video. */
  title: string;
  /** Full Short, 540x960 H.264 + AAC. Loaded only when someone presses play. */
  src: string;
  /** 5.5s muted loop, 432x768, under 1 MB. */
  loop: string;
  poster: string;
  /** Where the category lives on the site. */
  href: string;
  /** Pages that show this Short in the side video box (pathnames, trailing slash). */
  pages: string[];
  seconds: number;
}

const s = (id: ShortId, label: string, title: string, href: string, pages: string[], seconds: number): CategoryShort => ({
  id, label, title, href, pages, seconds,
  src: `/shorts/${id}.mp4`,
  loop: `/shorts/${id}-loop.mp4`,
  poster: `/shorts/${id}-poster.webp`,
});

export const categoryShorts: CategoryShort[] = [
  s('winter', 'Winter storm & outages', '5 things to have before a southern ice storm', '/guides/winter-storm-power-outage-prep-guide-south/', ['/winter-storm-prep/'], 29),
  s('water', 'Water storage & filters', 'Build a simple water plan', '/directory/water/', ['/directory/water/', '/emergency-water/'], 24.5),
  s('food', 'Food & prepper supplies', 'Stock a calm storm pantry', '/directory/food/', ['/directory/food/'], 24.5),
  s('vehicle', 'Vehicle emergency kits', 'Pack your car for winter roads', '/vehicle-emergency-kits/', ['/vehicle-emergency-kits/'], 29),
  s('first-aid', 'First aid & safety', 'First aid & safety basics', '/first-aid-medical-prep/', ['/first-aid-medical-prep/', '/directory/safety/'], 24.5),
  s('camping', 'Off-grid & camping', 'Off-grid & camping basics', '/directory/outdoor/', ['/directory/outdoor/'], 29),
  s('radios', 'Radios, lights & comms', 'When the power and signal drop', '/directory/tech/', ['/directory/tech/'], 29),
  s('cold', 'Heated apparel & cold-weather gear', 'Dress for the cold snap', '/cold-weather-gear/', ['/cold-weather-gear/'], 29),
  s('security', 'Security', 'Simple home security basics', '/directory/security/', ['/directory/security/'], 29),
  s('overland', 'Overland & off-road', 'Overland & off-road ready', '/directory/vehicles/', ['/directory/vehicles/'], 29),
  s('drones', 'Drones', 'Drones: a view from above', '/directory/drones/', ['/directory/drones/'], 29),
];

export const shortById = (id: string) => categoryShorts.find((x) => x.id === id);

/** The Short for a page path, if that page has one. */
export function shortForPath(pathname: string): CategoryShort | undefined {
  const p = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return categoryShorts.find((x) => x.pages.includes(p));
}
