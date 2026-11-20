/**
 * Site analytics IDs. Leave an ID empty to keep that tool off — no script
 * is written to the page until it is filled in.
 *
 *   ga4Id:     "G-XXXXXXXXXX"   // Google Analytics 4 measurement ID
 *   clarityId: "xxxxxxxxxx"     // Microsoft Clarity project ID
 *   adsId:     "AW-XXXXXXXXXX"  // Google Ads tag (shares the GA4 gtag.js loader; no GTM)
 *   adsSignupLabel: "AbCdEf..." // Optional Google Ads conversion label for the
 *                               // email signup action. Leave empty to rely on the
 *                               // GA4 key event (email_signup) imported into Google Ads.
 */
export const analytics = {
  ga4Id: 'G-WTEHYS97MQ',
  adsId: 'AW-18585587131',
  adsSignupLabel: '',
  clarityId: 'zfntfpi4qw',
} as const;
