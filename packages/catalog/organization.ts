/**
 * Legal and contact identity for both ReadyGearHub and the company hub.
 *
 * Confirmed legal name (22 Nov 2026, America/Chicago): OMEGA UCO SOLUTIONS, LLC
 * (all caps, comma before LLC), from D&B DUNS and Mississippi new-business records.
 * Change `legalName` here only — both sites read it at build time.
 * Brand prose may still use the title-case shortName; legal-entity mentions must
 * use legalName verbatim.
 */
export const organization = {
  legalName: 'OMEGA UCO SOLUTIONS, LLC',
  shortName: 'Omega UCO Solutions',
  tagline: 'Unified Commerce Operations',
  city: 'Walnut Grove, MS',
  email: 'info@omegaucosolutions.com',
  rghEmail: 'info@readygearhub.com',
} as const;

export type Organization = typeof organization;
