/**
 * Directional CTA labels for directory cards.
 * Buttons tell the visitor what to do next; they do not name the seller
 * ("See price at …", "Visit official site", and similar stay out of the label).
 *
 *   - Buy with discount code — a program coupon applies; the code is shown next to the button
 *   - Inquire here — quote or contact-only (no public checkout)
 *   - Check listing — a normal retail / affiliate product page
 *   - See details — a brand homepage or official-site card
 */
import { PROGRAM_COUPON_CODES } from './partner-codes';

export type CtaKind = 'listing' | 'inquire' | 'discount' | 'details';

export type ListingAction = { label: string; code?: string; kind: CtaKind };

const DIRECTIONAL = new Set(['Check listing', 'See details', 'Inquire here', 'Buy with discount code']);

export function couponCodeFor(item: { programId?: string; couponCode?: string }): string | undefined {
  if (item.couponCode && item.couponCode.trim()) return item.couponCode.trim();
  const fromProgram = PROGRAM_COUPON_CODES[item.programId || ''];
  return fromProgram || undefined;
}

export function listingAction(item: {
  programId?: string;
  couponCode?: string;
  ctaKind?: CtaKind;
  ctaLabel?: string;
  offerLabel?: string;
  kind?: string;
}): ListingAction {
  if (item.kind === 'tool' || item.kind === 'resource') {
    return { label: item.ctaLabel || 'See details', kind: 'details' };
  }
  if (item.ctaKind === 'inquire' || /^inquire/i.test(item.ctaLabel || '')) {
    return { label: 'Inquire here', kind: 'inquire' };
  }
  const code = couponCodeFor(item);
  if (item.ctaKind === 'discount' || code) {
    return { label: 'Buy with discount code', code, kind: 'discount' };
  }
  if (item.ctaKind === 'details') {
    return { label: 'See details', kind: 'details' };
  }
  if (item.ctaKind === 'listing') {
    return { label: 'Check listing', kind: 'listing' };
  }
  const raw = (item.ctaLabel || '').trim();
  if (DIRECTIONAL.has(raw)) {
    return { label: raw, kind: raw === 'See details' ? 'details' : raw === 'Inquire here' ? 'inquire' : 'listing' };
  }
  if (/official (shop|site|store)/i.test(item.offerLabel || '') && /visit official|official site/i.test(raw)) {
    return { label: 'See details', kind: 'details' };
  }
  return { label: 'Check listing', kind: 'listing' };
}
