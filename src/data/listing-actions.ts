/**
 * Directional CTA labels for directory cards.
 * Buttons tell the visitor what to do next; they do not name the seller
 * ("See price at …", "Visit official site", and similar stay out of the label).
 *
 *   - Buy with discount code — a program coupon applies; the code is shown next to the button
 *   - Inquire here — quote or contact-only (no public checkout)
 *   - Buy now / Shop now / See price / View deal / Get it here — a normal retail / affiliate product page.
 *     The wording rotates deterministically per product id (same product, same label on every page and build).
 *     "Buy now" and "View deal" only appear when a price is shown on the card; no urgency wording.
 *   - Inquire here / Request a quote — quote or contact-only items (no public checkout)
 *   - See details — a tool, resource, or official brand-site card
 */
import { PROGRAM_COUPON_CODES } from './partner-codes';

/** True when a URL is a site's front page (path is empty, "/", or a bare locale like /en-us/). */
export function isStoreFront(url: string): boolean {
  try {
    const u = new URL(url);
    const segs = u.pathname.split('/').filter(Boolean);
    return segs.every((seg) => /^(en[-_]us|us|en)$/i.test(seg));
  } catch {
    return false;
  }
}

export type CtaKind = 'listing' | 'inquire' | 'discount' | 'details';

export type ListingAction = { label: string; code?: string; kind: CtaKind };

const RETAIL_LABELS = ['Buy now', 'Shop now', 'See price', 'View deal', 'Get it here'];

function hashSeed(seed: string): number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) + h + seed.charCodeAt(i)) >>> 0;
  return h;
}

/** Deterministic retail button wording. `priced` = the card shows a real price. */
export function retailLabel(seed: string, priced: boolean): string {
  const pool = priced ? RETAIL_LABELS : ['Shop now', 'See price', 'Get it here'];
  return pool[hashSeed(seed || 'x') % pool.length];
}

/** Store-front or whole-collection links: the button says it opens a store, not one product. */
export function storeLabel(seed: string): string {
  return ['Visit store', 'Browse the store', 'Visit site'][hashSeed(seed || 'x') % 3];
}

/** Quote-only wording, rotated the same way. */
export function inquireLabel(seed: string): string {
  return hashSeed(seed || 'x') % 3 === 0 ? 'Request a quote' : 'Inquire here';
}

export function couponCodeFor(item: { programId?: string; couponCode?: string }): string | undefined {
  if (item.couponCode && item.couponCode.trim()) return item.couponCode.trim();
  const fromProgram = PROGRAM_COUPON_CODES[item.programId || ''];
  return fromProgram || undefined;
}

export function listingAction(item: {
  id?: string;
  title?: string;
  priceLabel?: string;
  blurb?: string;
  programId?: string;
  couponCode?: string;
  ctaKind?: CtaKind;
  ctaLabel?: string;
  offerLabel?: string;
  kind?: string;
  storeLevel?: boolean;
}): ListingAction {
  const seed = item.id || item.title || '';
  const priced = /\$\s?\d/.test(item.priceLabel || '');
  if (item.kind === 'tool' || item.kind === 'resource') {
    return { label: item.ctaLabel || 'See details', kind: 'details' };
  }
  const amount = Number((/\$\s?([\d,]+)/.exec(item.priceLabel || '') || [])[1]?.replace(/,/g, '') || 0);
  // Robots International pages offer "Request a Quote" next to the cart; use it for the big-ticket units.
  const quoteScale = item.programId === 'robots-international' && amount >= 10000;
  if (
    quoteScale ||
    item.ctaKind === 'inquire' ||
    /^(inquire|request a quote)/i.test(item.ctaLabel || '') ||
    /how to inquire/i.test(item.blurb || '')
  ) {
    return { label: inquireLabel(seed), kind: 'inquire' };
  }
  const code = couponCodeFor(item);
  if (item.ctaKind === 'discount' || code) {
    return { label: hashSeed(seed || 'x') % 2 === 0 ? 'Buy with discount code' : 'Shop with code', code, kind: 'discount' };
  }
  if (item.ctaKind === 'details') {
    return { label: 'See details', kind: 'details' };
  }
  if (item.storeLevel) {
    return { label: storeLabel(seed), kind: 'details' };
  }
  const raw = (item.ctaLabel || '').trim();
  if (/official (shop|site|store)/i.test(item.offerLabel || '') && /visit official|official site/i.test(raw)) {
    return { label: 'See details', kind: 'details' };
  }
  return { label: retailLabel(seed, priced), kind: 'listing' };
}
