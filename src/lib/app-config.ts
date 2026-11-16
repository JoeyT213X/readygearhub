/**
 * Feature flags for ReadyGearHub interactive tools and Storm Tracker.
 *
 * A Pro tier (multi-location alerts, alert history, custom thresholds)
 * can be added later by flipping these flags and implementing the
 * corresponding UI. No payments or entitlements are implemented.
 */
export const APP_FEATURES = {
  proEnabled: false,
  multiLocation: false,
  alertHistory: false,
  customThresholds: false,
} as const;

export const ALERTS_REFRESH_MS = 5 * 60 * 1000;
export const DEFAULT_STATE = 'MS';
export const STORAGE_KEYS = {
  alerts: 'rgh-tools.alerts',
  outageTimer: 'rgh-tools.outage-timer',
  kitBuilder: 'rgh-tools.kit-builder',
  stormTracker: 'rgh-tools.storm-tracker',
} as const;
