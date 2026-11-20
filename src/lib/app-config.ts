/**
 * Feature flags and shared catalog for ReadyGearHub interactive tools and PWAs.
 *
 * A simple $5 one-time supporter unlock can be added later by flipping these
 * flags and wiring a checkout. No payments or entitlements are implemented.
 */
export const APP_FEATURES = {
  proEnabled: false,
  multiLocation: false,
  alertHistory: false,
  customThresholds: false,
  extraGenerators: false,
  extraAppliances: false,
  extraHousehold: false,
  extraPets: false,
  extraKits: false,
} as const;

export const ALERTS_REFRESH_MS = 5 * 60 * 1000;
export const DEFAULT_STATE = 'MS';
export const STORAGE_KEYS = {
  alerts: 'rgh-tools.alerts',
  outageTimer: 'rgh-tools.outage-timer',
  kitBuilder: 'rgh-tools.kit-builder',
  stormTracker: 'rgh-tools.storm-tracker',
  runtimeReserve: 'rgh-apps.runtime-reserve',
  coldHold: 'rgh-apps.cold-hold',
  allAccounted: 'rgh-apps.all-accounted',
  collarCard: 'rgh-apps.collar-card',
  aidDates: 'rgh-apps.aid-dates',
} as const;

/** Optional supporter unlock. Display only; no payments are taken yet. */
export const PRICES = {
  supporter: '$5 one-time',
} as const;

/** Shared, calm copy for the optional supporter unlock (coming soon). */
export const SUPPORTER_COPY = {
  short: 'Optional $5 one-time supporter unlock coming soon',
  intro:
    'The core app is free, works offline on this device, and does not need an account. An optional $5 one-time supporter unlock is coming soon — a simple way to support ReadyGearHub and turn on a few extra local conveniences.',
  noPayments: 'No payments are taken yet.',
  noServer:
    'Live multi-device sync or push alerts would need a server, and are not part of this unlock.',
} as const;

export const OFFLINE_APPS = [
  {
    href: '/apps/cold-hold/',
    name: 'Cold Hold',
    icon: '🌡️',
    blurb: 'Log fridge and freezer temperatures during a power outage, with official FDA guidance on the same screen.',
    extras: 'On Cold Hold, that could include more than two appliances and CSV or print exports.',
  },
  {
    href: '/apps/all-accounted/',
    name: 'All Accounted',
    icon: '✅',
    blurb: 'A household check-in board for storms and outages. Share a text snapshot. This is not an emergency service.',
    extras: 'On All Accounted, that could include more than six people and print or CSV extras.',
  },
  {
    href: '/storm-tracker/',
    name: 'Storm Tracker',
    icon: '⛈️',
    blurb: 'Official National Weather Service alerts for a saved county, plus an outage timer and a short Ready.gov checklist.',
    extras: 'On Storm Tracker, that could include extra saved counties, alert history, and custom thresholds on this device.',
  },
  {
    href: '/apps/runtime-reserve/',
    name: 'Runtime Reserve',
    icon: '⛽',
    blurb: 'Log generator fuel and runtime, and see estimated hours remaining from the numbers you enter. Works offline.',
    extras: 'On Runtime Reserve, that could include extra generators and CSV export.',
  },
  {
    href: '/apps/collar-card/',
    name: 'Collar Card',
    icon: '🐾',
    blurb: 'A pet emergency profile and kit tracker with expiry dates. Not veterinary advice.',
    extras: 'On Collar Card, that could include more than one pet and a printable emergency card.',
  },
  {
    href: '/apps/aid-dates/',
    name: 'Aid Dates',
    icon: '🩹',
    blurb: 'Track first-aid and supply expiry dates, soonest first. Not medical advice, and no dosing guidance.',
    extras: 'On Aid Dates, that could include more than one kit or location, plus CSV and print exports.',
  },
] as const;

export const CALCULATORS = [
  {
    href: '/tools/outage-timer/',
    name: 'Fridge & freezer outage timer',
    icon: '❄️',
    blurb: 'A live countdown based on FoodSafety.gov guidance for food kept in an unopened fridge or freezer.',
    cta: 'Open timer →',
  },
  {
    href: '/tools/kit-builder/',
    name: 'Emergency kit builder',
    icon: '📋',
    blurb: 'A printable checklist from Ready.gov guidance, sized to your household, with links to existing listings.',
    cta: 'Open kit builder →',
  },
  {
    href: '/tools/power-sizer/',
    name: 'Generator & power-station sizer',
    icon: '🔋',
    blurb: 'Add typical appliance watts, see running and starting totals, and estimate battery hours.',
    cta: 'Open sizer →',
  },
  {
    href: '/tools/solar-sizer/',
    name: 'Solar & power-station sizer',
    icon: '☀️',
    blurb: 'Estimate panel watts and battery watt-hours from your daily load and peak sun hours you look up at NREL.',
    cta: 'Open solar sizer →',
  },
  {
    href: '/tools/water-calculator/',
    name: 'Water storage calculator',
    icon: '💧',
    blurb: 'Ready.gov’s one gallon per person per day, sized to your household and the number of days you plan for.',
    cta: 'Open water calculator →',
  },
] as const;
