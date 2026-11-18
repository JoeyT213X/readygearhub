/**
 * Mississippi regions for the embeddable winter-alert widget.
 * County lists are a practical grouping for NWS area matching (no overlap).
 * Names match common local usage (Jackson Metro, Gulf Coast, Delta, etc.).
 */
export type WidgetRegion = {
  slug: string;
  name: string;
  shortLabel: string;
  counties: string[];
};

export const WIDGET_REGIONS: WidgetRegion[] = [
  {
    slug: 'jackson-metro',
    name: 'Jackson Metro',
    shortLabel: 'the Jackson Metro area',
    counties: ['Hinds', 'Madison', 'Rankin', 'Warren', 'Copiah', 'Simpson'],
  },
  {
    slug: 'gulf-coast',
    name: 'Gulf Coast',
    shortLabel: 'the Mississippi Gulf Coast',
    counties: ['Hancock', 'Harrison', 'Jackson', 'Pearl River', 'Stone', 'George'],
  },
  {
    slug: 'north-ms',
    name: 'North Mississippi',
    shortLabel: 'North Mississippi',
    counties: [
      'Alcorn', 'Benton', 'Calhoun', 'Chickasaw', 'Choctaw', 'Clay', 'DeSoto',
      'Grenada', 'Itawamba', 'Lafayette', 'Lee', 'Lowndes', 'Marshall', 'Monroe',
      'Montgomery', 'Oktibbeha', 'Panola', 'Pontotoc', 'Prentiss', 'Tate',
      'Tippah', 'Tishomingo', 'Union', 'Webster', 'Yalobusha',
    ],
  },
  {
    slug: 'delta',
    name: 'the Delta',
    shortLabel: 'the Mississippi Delta',
    counties: [
      'Bolivar', 'Carroll', 'Coahoma', 'Holmes', 'Humphreys', 'Issaquena',
      'Leflore', 'Quitman', 'Sharkey', 'Sunflower', 'Tallahatchie', 'Tunica',
      'Washington', 'Yazoo',
    ],
  },
  {
    slug: 'pine-belt',
    name: 'the Pine Belt',
    shortLabel: 'the Pine Belt',
    counties: [
      'Covington', 'Forrest', 'Greene', 'Jefferson Davis', 'Jones', 'Lamar',
      'Marion', 'Perry', 'Wayne',
    ],
  },
  {
    slug: 'southwest',
    name: 'Southwest Mississippi',
    shortLabel: 'Southwest Mississippi',
    counties: [
      'Adams', 'Amite', 'Claiborne', 'Franklin', 'Jefferson', 'Lawrence',
      'Lincoln', 'Pike', 'Walthall', 'Wilkinson',
    ],
  },
  {
    slug: 'east-central',
    name: 'East Central Mississippi',
    shortLabel: 'East Central Mississippi',
    counties: [
      'Attala', 'Clarke', 'Jasper', 'Kemper', 'Lauderdale', 'Leake', 'Neshoba',
      'Newton', 'Noxubee', 'Scott', 'Smith', 'Winston',
    ],
  },
];

export const DEFAULT_REGION_SLUG = 'jackson-metro';

export function regionBySlug(slug: string | null | undefined): WidgetRegion | undefined {
  const s = (slug || '').trim().toLowerCase();
  return WIDGET_REGIONS.find((r) => r.slug === s);
}

/** True if an NWS areaDesc mentions any county in the region. */
export function alertCoversRegion(areaDesc: string, region: WidgetRegion): boolean {
  const text = ` ${areaDesc.replace(/;/g, ' ').replace(/,/g, ' ')} `;
  return region.counties.some((county) => {
    const re = new RegExp(`\\b${county.replace(/ /g, '\\s+')}(\\s+County)?\\b`, 'i');
    return re.test(text);
  });
}
