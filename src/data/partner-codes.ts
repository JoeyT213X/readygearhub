/**
 * Joseph’s personal partner / referral identity.
 * `PARTNER_REF_CODE` is what we use and show today.
 * `PARTNER_REF_CODE_PENDING` is the next identity; do not switch until told.
 */
export const PARTNER_REF_CODE = 'JOSEPHTINDIGLIA';
export const PARTNER_REF_CODE_PENDING = 'JOEYT213X';

/** Official Elephant Robotics shop with the provided referral parameter. */
export const ELEPHANT_ROBOTICS_SHOP_URL = 'https://shop.elephantrobotics.com/collections/all?ref=joeyt213x';

/**
 * Customer-facing checkout codes, only for programs that allow a coupon.
 * Elephant uses the personal partner code above. Program-specific codes
 * (BLUETTI, ALLPOWERS, iSpring) stay as their own published values.
 */
export const PROGRAM_COUPON_CODES: Record<string, string> = {
  bluetti: 'AFF5OFF',
  allpowers: 'ALLPOWERS26',
  ispring: 'REFISPRING',
  'elephant-robotics': PARTNER_REF_CODE,
};
