/**
 * Directory and category listing order: quality and documented payout, not country.
 *
 * US brands may still show a US-first badge (that work lives on the us-first-badge
 * branch). This sort does not force US listings to the top.
 *
 * Exception: items marked `filler` (currently the modest set of non-listed Chinese
 * robot dogs: Deep Robotics, Galileo, PUDU, MagicLab, MirrorMe) always sort last,
 * in a low-key bottom group. Unitree, Autel, and other 1260H / Entity List /
 * sanctioned brands stay off the catalog entirely.
 *
 * Quality signals (no star ratings, no invented review scores):
 *   - Official product photograph of the exact model (not a generic stock cover)
 *   - A recorded, dated or numeric price rather than a generic “See official site”
 *   - Partner program status: approved/live, then pending, then none
 *   - A specific product or model page, rather than a brand homepage card
 *   - A reasonably complete product blurb
 *
 * Payout is the documented base commission percent from packages/catalog/affiliates.ts
 * program notes (lower bound when the note gives a range). Unknown or unconfirmed
 * rates are 0 so we never invent a number. Lead-only and “percent off customer
 * coupon” figures are not used as payout.
 */
import { programs } from './affiliates';
import { productPhotoFor } from './product-photos';

export type RankableItem = {
  id: string;
  title: string;
  blurb?: string;
  programId?: string;
  priceLabel?: string;
  offerLabel?: string;
  kind?: string;
  origin?: string;
  image?: string;
  imageKind?: string;
  filler?: boolean;
};

/** Documented base commission %, or 0 if we do not have a confirmed rate. */
export const PROGRAM_PAYOUT_PERCENT: Record<string, number> = {
  // approved / live — from program notes
  bluetti: 5,
  'anker-solix': 5, // 5% base; 3.5% on list E10
  litime: 5, // 5% on the rates timeline (overview also says 5–6%)
  berkey: 15,
  redi: 10,
  allpowers: 10,
  surfshark: 40,
  aquasana: 10,
  ispring: 8, // GoAffPro 8% commission (10% is a customer first-order coupon)
  'epic-water-filters': 15,
  tidewe: 10,
  bogs: 2,
  wuben: 10,
  nordvpn: 40, // 40% on 1- or 2-year new sales; 100% applies only to a 1-month plan
  // pending — official rate recorded at apply, tracking still off
  'survival-frog': 12,
  'legacy-food': 10, // official 10% (up to 15%)
  olight: 10,
  nitecore: 5,
  pecron: 10,
  btech: 10,
  'mighty-generators': 3,
  'berkey-filter': 5,
  cove: 8,
  acurite: 6,
  'sportsmans-guide': 5, // 5% most sales; 2% guns/ammo (we do not link those)
  robotshop: 5,
  'robots-international': 2, // official range 2–5%; sort uses the confirmed low end
  hoverair: 5, // official range 5–8%; sort uses the confirmed low end
  imalent: 10,
  xtar: 10,
  nilight: 12,
  'outdoor-master': 15,
  'roaring-fire-gear': 10,
  'nova-safety': 8,
  'natures-generator': 5,
  amazon: 3, // Amazon Associates standard rates run roughly 1–4.5% for most gear (up to 10% in a few categories); 3 is a conservative mid-point
};

const programById = new Map(programs.map((p) => [p.id, p]));

export function payoutPercentFor(programId: string | undefined | null): number {
  if (!programId) return 0;
  return PROGRAM_PAYOUT_PERCENT[programId] ?? 0;
}

export function hasOfficialProductPhoto(item: RankableItem): boolean {
  if (productPhotoFor(item)) return true;
  return Boolean(item.imageKind === 'photo' && item.image && !item.image.endsWith('.svg'));
}

export function qualityScore(item: RankableItem): number {
  let score = 0;
  if (hasOfficialProductPhoto(item)) score += 40;
  const price = (item.priceLabel || '').trim();
  if (price && !/^see\s+(official site|price|store)/i.test(price) && !/^free$/i.test(price)) {
    score += 15;
  } else if (/^see\s+(official site|price)/i.test(price)) {
    score += 4;
  }
  const status = programById.get(item.programId || '')?.status;
  if (status === 'approved' || status === 'live') score += 20;
  else if (status === 'pending') score += 6;
  const offer = item.offerLabel || '';
  if (/product|model/i.test(offer)) score += 10;
  else if (item.kind === 'tool' || item.kind === 'resource') score += 8;
  else if (item.origin === 'source-directory' || item.kind === 'product') score += 8;
  else if (/official (shop|site|store)/i.test(offer)) score += 2;
  if ((item.blurb || '').trim().length >= 80) score += 5;
  return score;
}

/** Fillers last, then higher quality, then higher documented payout, then title. */
export function compareByQualityAndPayout(a: RankableItem, b: RankableItem): number {
  const af = a.filler ? 1 : 0;
  const bf = b.filler ? 1 : 0;
  if (af !== bf) return af - bf;
  const q = qualityScore(b) - qualityScore(a);
  if (q) return q;
  const p = payoutPercentFor(b.programId) - payoutPercentFor(a.programId);
  if (p) return p;
  return a.title.localeCompare(b.title);
}
