/**
 * Legal and contact identity for both ReadyGearHub and the company hub.
 *
 * LEGAL NAME PLACEHOLDER: the exact LLC name is being verified with the
 * Mississippi Secretary of State (review window 22 Nov 2026, 1:15 PM
 * America/Chicago). Until that is confirmed, use this value everywhere.
 * Change `legalName` here only — both sites read it at build time.
 */
export const organization = {
  legalName: 'Omega UCO Solutions LLC',
  shortName: 'Omega UCO Solutions',
  tagline: 'Unified Commerce Operations',
  city: 'Walnut Grove, MS',
  email: 'info@omegaucosolutions.com',
  rghEmail: 'info@readygearhub.com',
} as const;

export type Organization = typeof organization;
