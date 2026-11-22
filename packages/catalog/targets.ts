/** Canonical ReadyGearHub paths the company workbench may link to. */
export const RGH_ORIGIN = 'https://readygearhub.com';

export type TargetLink = {
  path: string;
  content: string;
  label: string;
};

export type CategoryTarget = {
  id: string;
  label: string;
  links: TargetLink[];
};

export function withUtm(
  path: string,
  content: string,
  campaign = 'readiness-checkup',
  origin = RGH_ORIGIN,
): string {
  const url = new URL(path, origin);
  url.searchParams.set('utm_source', 'omegaucosolutions');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', campaign);
  url.searchParams.set('utm_content', content);
  return url.toString();
}

export const categoryTargets: Record<string, CategoryTarget> = {
  water: {
    id: 'water',
    label: 'Water',
    links: [
      { path: '/directory/water/', content: 'water', label: 'Water directory' },
      { path: '/tools/water-calculator/', content: 'water-calculator', label: 'Water storage calculator' },
    ],
  },
  food: {
    id: 'food',
    label: 'Food',
    links: [{ path: '/directory/food/', content: 'food', label: 'Food directory' }],
  },
  power: {
    id: 'power',
    label: 'Power',
    links: [
      { path: '/directory/power/', content: 'power', label: 'Power directory' },
      { path: '/tools/power-sizer/', content: 'power-sizer', label: 'Generator and power-station sizer' },
      { path: '/guides/how-to-pick-a-portable-power-station/', content: 'power-guide', label: 'How to pick a power station' },
    ],
  },
  tech: {
    id: 'tech',
    label: 'Lighting and communications',
    links: [
      { path: '/directory/tech/', content: 'tech', label: 'Tech and communications directory' },
      { path: '/alerts/', content: 'alerts', label: 'Official alerts' },
    ],
  },
  'first-aid': {
    id: 'first-aid',
    label: 'First aid',
    links: [{ path: '/first-aid-medical-prep/', content: 'first-aid', label: 'First aid and medical prep' }],
  },
  vehicle: {
    id: 'vehicle',
    label: 'Vehicle kit',
    links: [{ path: '/vehicle-emergency-kits/', content: 'vehicle', label: 'Vehicle emergency kits' }],
  },
  documents: {
    id: 'documents',
    label: 'Documents',
    links: [
      { path: '/shop/complete-prep-bundle/', content: 'bundle', label: 'Complete prep bundle, $10' },
      { path: '/guides/', content: 'guides', label: 'Free guides' },
    ],
  },
  alerts: {
    id: 'alerts',
    label: 'Alerts',
    links: [{ path: '/alerts/', content: 'alerts', label: 'Official alerts and live lookup' }],
  },
};

export const workbenchToolsPath = '/tools/';

/** Extra RGH destinations the checkup uses when there is no category gap. */
export const workbenchFallbacks = {
  tools: { path: '/tools/', content: 'tools', label: 'free tools' },
  guides: { path: '/guides/', content: 'guides', label: 'guides' },
  bundle: { path: '/shop/complete-prep-bundle/', content: 'bundle', label: 'See the $10 bundle' },
} as const;

