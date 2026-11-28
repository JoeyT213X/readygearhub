/**
 * Directional CTA labels for directory cards.
 * Buttons tell the visitor what to do next; they never name the seller or brand, and never promise a sale.
 *
 *   - Buy with discount code: only when the card's data carries a discount code (shown next to the button).
 *   - Inquire here: only quote/contact-only cards, by a clear data signal (ctaKind "inquire", an "Inquire"/"Request a
 *     quote" ctaLabel, a "how to inquire" blurb, a quote/contact offer line, or a Robots International unit of $10,000+).
 *     It is never part of the general rotation.
 *   - Everything else rotates by a hash of the card id (same card, same label on every page and every build):
 *       priced card:   Check listing / See details / Buy now / Visit site
 *       unpriced card: Check listing / See details / Visit site   ("Buy now" only with a price on the card)
 *   - View deal: only where the data records a verified sale (a list/sale pair seen on the brand's own page).
 *   - See details: a tool, resource or official-page card.
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

const PRICED_LABELS = ['Check listing', 'See details', 'Buy now', 'Visit site'];
const UNPRICED_LABELS = ['Check listing', 'See details', 'Visit site'];

function hashSeed(seed: string): number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) + h + seed.charCodeAt(i)) >>> 0;
  return h;
}

/** Deterministic retail button wording. `priced` = the card shows a real price; `onSale` = the data records a verified sale. */
export function retailLabel(seed: string, priced: boolean, onSale = false): string {
  if (onSale) return 'View deal';
  const pool = priced ? PRICED_LABELS : UNPRICED_LABELS;
  return pool[hashSeed(seed || 'x') % pool.length];
}

/** Store-front or whole-collection links: the button says it opens a store, not one product. */
export function storeLabel(seed: string): string {
  return ['Visit store', 'Browse the store', 'Visit site'][hashSeed(seed || 'x') % 3];
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
  // Amazon and Ready Alliance / Everflow cards: a deterministic mix of plain wordings (no seller name on the button).
  if (item.programId === 'amazon' || item.programId === 'my-patriot-supply' || item.programId === 'beprepared' || item.programId === 'camping-survival' || item.programId === 'ready-hour' || item.programId === 'alexapure' || item.programId === 'instafire' || item.programId === 'grid-doctor' || item.programId === 'harvest-right') {
    const MIXED_LABELS: Array<[string, CtaKind]> = [['Check listing', 'listing'], ['See details', 'details'], ['Buy now', 'listing'], ['Visit site', 'details']];
    const [label, kind] = MIXED_LABELS[hashSeed(seed || 'x') % MIXED_LABELS.length];
    return { label, kind };
  }
  const amount = Number((/\$\s?([\d,]+)/.exec(item.priceLabel || '') || [])[1]?.replace(/,/g, '') || 0);
  // Robots International pages offer "Request a Quote" next to the cart; use it for the big-ticket units.
  const quoteScale = item.programId === 'robots-international' && amount >= 10000;
  if (
    quoteScale ||
    item.ctaKind === 'inquire' ||
    /^(inquire|request a quote)/i.test(item.ctaLabel || '') ||
    /how to inquire/i.test(item.blurb || '') ||
    /\b(quote|inquir|contact us)/i.test(item.offerLabel || '')
  ) {
    return { label: 'Inquire here', kind: 'inquire' };
  }
  const code = couponCodeFor(item);
  if (code) {
    return { label: 'Buy with discount code', code, kind: 'discount' };
  }
  // Official brand pages with no listed price (vehicles, shelters, build-to-order): plain "Visit site".
  if (item.kind === 'brand' && !priced) {
    return { label: 'Visit site', kind: 'details' };
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
