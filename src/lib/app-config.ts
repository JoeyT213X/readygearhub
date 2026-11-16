/**
 * Feature flags for ReadyGearHub interactive tools and PWAs.
 *
 * A Pro tier can be added later by flipping these flags and implementing
 * the corresponding UI. No payments or entitlements are implemented.
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

/** Approved prices from the ReadyGearHub price sheet (Nov 15, 2026). Display only; no payments. */
export const PRICES = {
  bundleMonthly: '$3.67/mo',
  bundleYearly: '$27.47/yr',
  bundleLifetime: '$46.73 lifetime',
  runtimeReserve: '$11.83 once',
  coldHold: '$8.94 once',
  allAccounted: '$8.67 once',
  collarCard: '$6.83 once',
  aidDates: '$5.87 once',
  stormTrackerMonthly: '$2.73/mo',
  stormTrackerYearly: '$18.47/yr',
} as const;

