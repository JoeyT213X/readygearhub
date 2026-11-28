/**
 * ReadyGearHub affiliate programs — the ONE place to turn on tracked links.
 *
 * HOW TO ACTIVATE A PROGRAM (1-line config swap; see also BOTS.md and
 * /workspace/AFFILIATE_LINKS_HOWTO.md):
 *   1. Find the program below by `id`. Do not rewrite directory entries or listing files.
 *   2. Set `status: 'live'` (or the equivalent `status: 'approved'`).
 *   3. Paste the network tracking URL into `url` (or the existing `link` field).
 *        - Deep-link template: put {url} where the encoded product URL goes
 *          (e.g. Impact: https://x.sjv.io/c/123/456/789?u={url}).
 *        - Or a plain tracked URL (no {url}) to send every click to one page.
 *        - CJ programs may instead use `cjAid` (the AID from any CJ link for
 *          that advertiser), or leave it '' to use CJ's deep-link generator (PID only).
 *        - Optional: `itemLinks` to paste an exact tracked link for one listing.
 *   After the next build, matching listings switch to the tracked link with
 *   rel="sponsored nofollow noopener"; lead boxes appear on the guides in `lead.places`.
 *
 * Until status is live/approved, everything stays on the plain retailer URL and
 * lead boxes stay hidden — no sponsored label, no tracking, no invented affiliate URLs.
 *
 * ppcAllowed: set `ppcAllowed: false` for partners that bar paid-search promotion
 * (currently Choice Home Warranty, REDI, Waterdrop Filter, TideWe, Bogs, and Amazon, whose Associates terms bar Amazon links in paid ads). FunnelGuards hides
 * those cards and links during an rgh_paid_search session; they stay visible on
 * ordinary organic visits. Omit the field or set it true when paid search is allowed
 * under the site Paid Advertising Policy. Use isPpcAllowed(id) and isProgramLive(id).
 *
 * No secrets live here — tracking IDs are public by design (they appear in every link).
 */

export const CJ_PID = '101929817';

/**
 * Amazon Associates tracking ID (payee OMEGA UCO SOLUTIONS, LLC). Public by design: it appears in every
 * amazon.com link. Never build an amazon.com link by hand: use amazonLink(), amazonProductUrl() or
 * amazonSearchUrl() so the tag is always attached.
 */
export const AMAZON_TAG = 'readygearhub-20';

/** The one-line disclosure Amazon requires wherever we link to amazon.com. */
export const AMAZON_DISCLOSURE = 'As an Amazon Associate I earn from qualifying purchases.';

/** True for amazon.com (any subdomain) URLs. Short links (amzn.to, a.co) cannot carry our tag and are not used. */
export function isAmazonUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  try {
    const h = new URL(url).hostname.toLowerCase();
    return h === 'amazon.com' || h.endsWith('.amazon.com');
  } catch {
    return false;
  }
}

/** Return the amazon.com URL with tag=readygearhub-20 (replacing any other tag). Non-Amazon URLs pass through unchanged. */
export function amazonLink(url: string): string {
  if (!isAmazonUrl(url)) return url;
  const u = new URL(url);
  u.searchParams.set('tag', AMAZON_TAG);
  return u.toString();
}

/** Tagged product page for a verified ASIN. */
export function amazonProductUrl(asin: string): string {
  return amazonLink(`https://www.amazon.com/dp/${asin}`);
}

/** Tagged Amazon search for an exact product name (use only when no verified ASIN exists). */
export function amazonSearchUrl(query: string): string {
  return amazonLink(`https://www.amazon.com/s?k=${encodeURIComponent(query)}`);
}

export type Network =
  | 'CJ' | 'Impact' | 'Awin' | 'Partnerize' | 'FlexOffers' | 'Refersion' | 'GoAffPro'
  | 'AvantLink' | 'ShareASale' | 'Rakuten' | 'Amazon' | 'Everflow' | 'Direct' | 'TBD';

export type Program = {
  id: string;
  name: string;
  network: Network;
  /**
   * none = not applied; pending = applied, waiting;
   * live (or the equivalent approved) = tracked links are on.
   */
  status: 'none' | 'pending' | 'approved' | 'live' | 'dropped';
  /**
   * false = FunnelGuards hides this program during paid-search sessions.
   * Omit or true = paid search is allowed under the site policy. Default true.
   */
  ppcAllowed?: boolean;
  /** Official plain URL (homepage or a safe category page). Documentation only; listings keep their own officialUrl. */
  officialUrl?: string;
  /** product = swaps listing buy links; lead = pay-per-lead CTA box; text = no slots yet */
  kind: 'product' | 'lead' | 'text';
  /** Listings (src/content/items/<id>.md) this program applies to. */
  items?: string[];
  /** Retailer programs: the product page at THAT retailer for a listing (itemId -> URL). */
  retailerUrls?: Record<string, string>;
  /**
   * Tracked URL or deep-link template ({url} = encoded product URL, {rawurl} = unencoded).
   * Alias of `link` — paste either one. This is the 1-line swap field.
   */
  url?: string;
  /** Deep-link template or a fixed tracked URL. Same as `url`; either field works. */
  link?: string;
  /** CJ only: AID of any link from this advertiser (optional). */
  cjAid?: string;
  /** Exact tracked link per listing or directory entry id; wins over the default `link`. */
  itemLinks?: Record<string, string>;
  /** Lead CTA box (kind: 'lead'). `places` are guide slugs or 'tool:<slug>'. */
  lead?: { title: string; blurb: string; button: string; places: string[] };
  note?: string;
};

export const programs: Program[] = [
  // ---- Brand programs: listings switch automatically once approved ----
  { id: 'ecoflow', name: 'EcoFlow', network: 'TBD', status: 'pending', kind: 'product',
    items: ['ecoflow-400w-portable-solar-panel', 'ecoflow-delta-3-plus', 'ecoflow-glacier-classic', 'ecoflow-river-3-plus'] },
  { id: 'bluetti', name: 'BLUETTI', network: 'CJ', status: 'approved', kind: 'product',
    items: ['bluetti-200w-solar-panel', 'bluetti-ac180', 'bluetti-ac70', 'bluetti-apex-300-home-integration-kit'],
    cjAid: '16981946',
    link: 'https://www.jdoqocy.com/click-101929817-16981946?url={url}',
    officialUrl: 'https://www.bluettipower.com/',
    note: 'CJ AID 16981946; lands on bluettipower.com. Program code AFF5OFF for 5% off sitewide, per BLUETTI; present plainly, no urgency or countdowns. Coupon codes are allowed only because they come through the program. No brand-term search bidding and no direct linking. Linked from /gear/ (power), BLUETTI gear pages, and the winter-storm pillar backup-power section.' },
  { id: 'jackery', name: 'Jackery', network: 'TBD', status: 'pending', kind: 'product',
    items: ['jackery-explorer-1000-plus', 'jackery-explorer-300-v2', 'jackery-solarsaga-100-prime', 'jackery-solarsaga-200'] },
  { id: 'anker-solix', name: 'Anker SOLIX', network: 'Rakuten', status: 'approved', kind: 'product',
    officialUrl: 'https://www.ankersolix.com/',
    link: 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=53552&murl={url}',
    items: [
      'anker-solix',
      'anker-solix-f3800-plus',
      'anker-solix-f3800',
      'anker-solix-c1000x',
      'anker-solix-f2000',
      'anker-solix-c1000x-gen2',
      'anker-solix-c2000-gen2',
      'anker-solix-bp2000-gen2',
      'anker-solix-c300-dc-60w-kit',
      'anker-solix-f3800-10c-backup-kit',
    ],
    itemLinks: {
      'anker-solix': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=53552&murl=https%3A%2F%2Fwww.ankersolix.com%2Fcollections%2Fpower-stations',
      'anker-solix-f3800-plus': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=53552&murl=https%3A%2F%2Fwww.ankersolix.com%2Fproducts%2Ff3800-plus',
      'anker-solix-f3800-10c-backup-kit': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=53552&murl=https%3A%2F%2Fwww.ankersolix.com%2Fproducts%2Fhome-backup-kit-for-f3800-10c',
      'anker-solix-c1000x': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=53552&murl=https%3A%2F%2Fwww.ankersolix.com%2Fc1000-camping-portable-power-station-pps',
      'anker-solix-c1000x-gen2': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=53552&murl=https%3A%2F%2Fwww.ankersolix.com%2Fc1000-gen2',
      'anker-solix-c2000-gen2': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=53552&murl=https%3A%2F%2Fwww.ankersolix.com%2Fproducts%2Fc2000-gen2',
      'anker-solix-bp2000-gen2': 'https://click.linksynergy.com/link?id=j8aaZmp7txc&offerid=2103603.5355214254691844637842384&type=2&murl=https%3a%2f%2fwww.ankersolix.com%2fproducts%2fc2000-gen2-expansion-battery%3fvariant%3d53152183222602',
      'anker-solix-c300-dc-60w-kit': 'https://click.linksynergy.com/link?id=j8aaZmp7txc&offerid=2103603.5355217357556852201408261&type=2&murl=https%3a%2f%2fwww.ankersolix.com%2fproducts%2fc300-dc-60w-portable-solar-panel-1%3fvariant%3d49702034669898',
    },
    note: 'Rakuten MID 53552, publisher SID 4780263, approved/partnered Nov 23, 2026. Joined offer (Offers tab): 5.00% base commission, 3.50% when the SKU is on list E10; last click. Cookie length was not shown on Offers, Features & Services, or About, so it is not recorded here. Do not also join the Impact listing. No brand-term search bidding. Portable power stations stay off the home page and hero. Linked from /directory/power/, /directory/outdoor/, Anker SOLIX gear pages, and the winter-storm and generator-vs-power-station guides.' },
  { id: 'litime', name: 'LiTime', network: 'Awin', status: 'approved', kind: 'product',
    officialUrl: 'https://www.litime.com/',
    link: 'https://www.awin1.com/cread.php?awinmid=71451&awinaffid=3160581&ued={url}',
    items: [
      'litime',
      'litime-12v-100ah-group24',
      'litime-24v-230ah',
      'litime-12v-100ah-trolling',
      'litime-diy-solar-generator-kit',
      'litime-12v-50ah',
      'litime-12v-200ah-bluetooth',
      'litime-1000w-12v-inverter',
      'litime-2000w-12v-inverter-ats',
      'litime-30a-mppt',
      'litime-12v-10a-charger',
      'litime-12v-40a-dc-dc',
    ],
    itemLinks: {
      'litime': 'https://www.awin1.com/cread.php?awinmid=71451&awinaffid=3160581&ued=https%3A%2F%2Fwww.litime.com%2Fcollections%2Fall',
      'litime-12v-100ah-group24': 'https://www.awin1.com/cread.php?awinmid=71451&awinaffid=3160581&ued=https%3A%2F%2Fwww.litime.com%2Fproducts%2F12v-100ah-group-24-bluetooth-self-heating-battery',
      'litime-24v-230ah': 'https://www.awin1.com/cread.php?awinmid=71451&awinaffid=3160581&ued=https%3A%2F%2Fwww.litime.com%2Fproducts%2F24v-230ah-smart-self-heating-lithium-battery',
      'litime-12v-100ah-trolling': 'https://www.awin1.com/cread.php?awinmid=71451&awinaffid=3160581&ued=https%3A%2F%2Fwww.litime.com%2Fproducts%2F12v-100ah-lithium-trolling-motor-battery-with-bluetooth',
      'litime-diy-solar-generator-kit': 'https://www.awin1.com/cread.php?awinmid=71451&awinaffid=3160581&ued=https%3A%2F%2Fwww.litime.com%2Fproducts%2Flitime-diy-solar-generator-complete-power-kit-for-camping-rv-and-off-grid-living',
      'litime-12v-50ah': 'https://www.awin1.com/cread.php?awinmid=71451&awinaffid=3160581&ued=https%3A%2F%2Fwww.litime.com%2Fproducts%2Flitime-12v-50ah-lifepo4-lithium-ion-battery',
      'litime-12v-200ah-bluetooth': 'https://www.awin1.com/cread.php?awinmid=71451&awinaffid=3160581&ued=https%3A%2F%2Fwww.litime.com%2Fproducts%2F12v-200ah-bluetooth-lithium-battery',
      'litime-1000w-12v-inverter': 'https://www.awin1.com/cread.php?awinmid=71451&awinaffid=3160581&ued=https%3A%2F%2Fwww.litime.com%2Fproducts%2Flitime-1000w-12v-pure-sine-wave-inverter',
      'litime-2000w-12v-inverter-ats': 'https://www.awin1.com/cread.php?awinmid=71451&awinaffid=3160581&ued=https%3A%2F%2Fwww.litime.com%2Fproducts%2F2000w-12v-pure-sine-wave-inverter-with-20ms-ats',
      'litime-30a-mppt': 'https://www.awin1.com/cread.php?awinmid=71451&awinaffid=3160581&ued=https%3A%2F%2Fwww.litime.com%2Fproducts%2F30a-mppt-solar-charge-controller',
      'litime-12v-10a-charger': 'https://www.awin1.com/cread.php?awinmid=71451&awinaffid=3160581&ued=https%3A%2F%2Fwww.litime.com%2Fproducts%2Flitime-12v-10a-lithium-battery-charger',
      'litime-12v-40a-dc-dc': 'https://www.awin1.com/cread.php?awinmid=71451&awinaffid=3160581&ued=https%3A%2F%2Fwww.litime.com%2Fproducts%2F12v-40a-dc-to-dc-battery-charger',
    },
    note: 'Awin advertiser 71451, publisher 3160581, joined Nov 23, 2026. Commission 5% as shown on the Commission Rates timeline (program overview text also says 5%~6%; the recorded rate is 5%). Cookie length 30 days. Auto validation 50 days. No brand-term search bidding. Linked from /directory/power/, /directory/outdoor/, /directory/auto/, LiTime gear pages, and the generator-vs-power-station guide.' },
  { id: 'goal-zero', name: 'Goal Zero', network: 'Partnerize', status: 'pending', kind: 'product',
    items: ['goal-zero-lighthouse-600', 'goal-zero-nomad-100-plus', 'goal-zero-nomad-50', 'goal-zero-yeti-1500'] },
  { id: 'renogy', name: 'Renogy', network: 'Impact', status: 'none', kind: 'product', items: ['renogy-100w-12v-solar-kit'],
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain.',
  },
  { id: 'indestructible-shoes', name: 'Indestructible Shoes', network: 'Awin', status: 'pending', kind: 'product', officialUrl: 'https://indestructibleshoes.com/',
    note: 'Added Nov 27, 2026. Application via Shoutout/Awin is pending (per Destructicon); network and approval not yet confirmed. All footwear cards use plain product-page links until approved. When approved, set status and paste the tracking link (link or itemLinks); do not invent one.' },
  { id: 'biolite', name: 'BioLite', network: 'Partnerize', status: 'pending', kind: 'product', items: ['biolite-alpenglow-500'] },
  { id: 'leatherman', name: 'Leatherman', network: 'Partnerize', status: 'pending', kind: 'product', items: ['leatherman-wave-plus', 'leatherman-signal', 'leatherman-rebar', 'leatherman-wingman', 'leatherman-raptor-rescue', 'leatherman-skeletool-cx', 'leatherman-arc', 'leatherman-micra', 'leatherman-surge', 'leatherman-free-p4', 'leatherman-bond', 'leatherman-super-tool-300', 'leatherman-crunch'] },
  { id: 'lifestraw', name: 'LifeStraw', network: 'Impact', status: 'none', kind: 'product',
    items: ['lifestraw-family', 'lifestraw-personal', 'lifestraw-straw-emergency-pack'],
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain.',
  },
  { id: 'readywise', name: 'ReadyWise', network: 'CJ', status: 'none', kind: 'product', cjAid: '',
    items: ['readywise-4-week-food-supply', 'readywise-5-day-survival-backpack', 'readywise-72-hour-food-kit', 'readywise-1-month-two-bucket-bundle', 'readywise-powdered-eggs-144-servings'],
    note: 'Not found in CJ as of Nov 21, 2026. The official brand page still names Commission Junction; a third-party tracker had listed a Nov 9 removal. Do not use FlexOffers. Official links stay plain until a current apply path is confirmed.' },
  { id: 'midland', name: 'Midland Radio', network: 'Impact', status: 'none', kind: 'product',
    items: ['midland-er310-crank-radio', 'midland-wr400', 'midland-t71vp3-xtalker', 'midland-gxt1000x3vp4', 'midland-gxt67-pro', 'midland-mxt115p', 'midland-cliptalk', 'midland-er310pro', 'midland-overlanding-collection'],
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain.',
  },
  { id: 'garmin', name: 'Garmin', network: 'Impact', status: 'none', kind: 'product', items: ['garmin-inreach-mini-2'],
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain.',
  },
  { id: 'mountain-house', name: 'Mountain House', network: 'FlexOffers', status: 'none', kind: 'product', items: ['mountain-house-classic-bucket', 'mountain-house-beef-stew-pouch', 'mountain-house-breakfast-skillet-pouch', 'mountain-house-macaroni-cheese-2-pack'], note: 'FlexOffers account 1572451 was declined. Do not re-apply there. Keep official links until a retailer catch-all (Amazon/Walmart/Sportsman\'s Guide) is live.' },
  { id: 'my-patriot-supply', name: 'My Patriot Supply', network: 'Everflow', status: 'approved', kind: 'product',
    officialUrl: 'https://mypatriotsupply.com/',
    items: [
      'my-patriot-supply',
      'my-patriot-supply-emergency-food',
      'my-patriot-supply-generators',
      'my-patriot-supply-3-month-food',
      'my-patriot-supply-4-week-food',
      'my-patriot-supply-2-week-food',
      'my-patriot-supply-gluten-free-kit',
      'my-patriot-supply-alexapure-pro',
      'my-patriot-supply-72-hour-go-bag',
    ],
    link: 'https://www.rzmaf8trk.com/36R3J12/2CTPL/',
    itemLinks: {
      'my-patriot-supply': 'https://www.rzmaf8trk.com/36R3J12/2CTPL/',
      'my-patriot-supply-emergency-food': 'https://www.rzmaf8trk.com/36R3J12/2CTPL/?uid=22',
      'my-patriot-supply-generators': 'https://www.rzmaf8trk.com/36R3J12/2CTPL/?uid=23',
      'my-patriot-supply-3-month-food': 'https://www.rzmaf8trk.com/36R3J12/2CTPL/?uid=22',
      'my-patriot-supply-4-week-food': 'https://www.rzmaf8trk.com/36R3J12/2CTPL/?uid=22',
      'my-patriot-supply-2-week-food': 'https://www.rzmaf8trk.com/36R3J12/2CTPL/?uid=22',
      'my-patriot-supply-gluten-free-kit': 'https://www.rzmaf8trk.com/36R3J12/2CTPL/?uid=22',
      'my-patriot-supply-alexapure-pro': 'https://www.rzmaf8trk.com/36R3J12/2CTPL/',
      'my-patriot-supply-72-hour-go-bag': 'https://www.rzmaf8trk.com/36R3J12/2CTPL/',
    },
    note: 'Ready Alliance Group / Everflow, affiliate ID 1361, 10% CPS. Approved Nov 27, 2026 (OMEGA UCO SOLUTIONS, LLC). Official tracking links from Sean Montana: main store, Emergency Food Collection (uid=22), Generators Collection (uid=23). Compact tracking URL does not support per-product deep links (tested url, deeplink, destination, dest, offer_url; all ignored, landing stays the collection or homepage). Food kits use uid=22; water and go-bag cards use the main link; generator cards use uid=23. ppcAllowed is omitted (default: cards stay visible in paid-search sessions). Sean confirmed brand bidding is not allowed; do not bid on their brand terms in ads.' },
  { id: 'beprepared', name: 'BePrepared (Emergency Essentials)', network: 'Everflow', status: 'approved', kind: 'product',
    officialUrl: 'https://www.beprepared.com/',
    items: ['beprepared'],
    link: 'https://www.beprepared.com/?_ef_transaction_id=&utm_source=everflow&utm_medium=aff&utm_campaign=&utm_term=1361&utm_content=&oid=2&affid=1361',
    itemLinks: { 'beprepared': 'https://www.beprepared.com/?_ef_transaction_id=&utm_source=everflow&utm_medium=aff&utm_campaign=&utm_term=1361&utm_content=&oid=2&affid=1361' },
    note: 'Ready Alliance Group / Everflow, affiliate ID 1361, offer oid=2, 10% CPS. Approved Nov 27, 2026. ppcAllowed omitted (cards stay visible in paid-search sessions). Brand bidding is not allowed.' },
  { id: 'camping-survival', name: 'Camping Survival', network: 'Everflow', status: 'approved', kind: 'product',
    officialUrl: 'https://www.campingsurvival.com/',
    items: ['camping-survival'],
    link: 'https://www.campingsurvival.com?_ef_transaction_id=&utm_source=everflow&utm_medium=aff&utm_campaign=&utm_term=1361&utm_content=&oid=7&affid=1361',
    itemLinks: { 'camping-survival': 'https://www.campingsurvival.com?_ef_transaction_id=&utm_source=everflow&utm_medium=aff&utm_campaign=&utm_term=1361&utm_content=&oid=7&affid=1361' },
    note: 'Ready Alliance Group / Everflow, affiliate ID 1361, offer oid=7, 10% CPS. Approved Nov 27, 2026. ppcAllowed omitted (cards stay visible in paid-search sessions). Brand bidding is not allowed.' },
  { id: 'ready-hour', name: 'Ready Hour', network: 'Everflow', status: 'approved', kind: 'product',
    officialUrl: 'https://www.readyhour.com/',
    items: ['ready-hour'],
    link: 'https://www.readyhour.com?_ef_transaction_id=&oid=8&affid=1361',
    itemLinks: { 'ready-hour': 'https://www.readyhour.com?_ef_transaction_id=&oid=8&affid=1361' },
    note: 'Ready Alliance Group / Everflow, affiliate ID 1361, offer oid=8, 10% CPS. Approved Nov 27, 2026. ppcAllowed omitted (cards stay visible in paid-search sessions). Brand bidding is not allowed.' },
  { id: 'alexapure', name: 'AlexaPure', network: 'Everflow', status: 'approved', kind: 'product',
    officialUrl: 'https://www.alexapure.com/',
    items: ['alexapure'],
    link: 'https://www.alexapure.com?_ef_transaction_id=&oid=9&affid=1361',
    itemLinks: { 'alexapure': 'https://www.alexapure.com?_ef_transaction_id=&oid=9&affid=1361' },
    note: 'Ready Alliance Group / Everflow, affiliate ID 1361, offer oid=9, 10% CPS. Approved Nov 27, 2026. ppcAllowed omitted (cards stay visible in paid-search sessions). Brand bidding is not allowed.' },
  { id: 'instafire', name: 'InstaFire', network: 'Everflow', status: 'approved', kind: 'product',
    officialUrl: 'https://www.instafire.com/',
    items: ['instafire'],
    link: 'https://www.instafire.com?_ef_transaction_id=&oid=10&affid=1361',
    itemLinks: { 'instafire': 'https://www.instafire.com?_ef_transaction_id=&oid=10&affid=1361' },
    note: 'Ready Alliance Group / Everflow, affiliate ID 1361, offer oid=10, 10% CPS. Approved Nov 27, 2026. ppcAllowed omitted (cards stay visible in paid-search sessions). Brand bidding is not allowed.' },
  { id: 'grid-doctor', name: 'Grid Doctor 3300 EMP', network: 'Everflow', status: 'approved', kind: 'product',
    officialUrl: 'https://www.mypatriotsupply.com/products/grid-doctor-3300-emp-solar-generator',
    items: ['grid-doctor-3300-emp'],
    link: 'https://www.rzmaf8trk.com/36R3J12/2CTPL/?uid=23',
    itemLinks: { 'grid-doctor-3300-emp': 'https://www.rzmaf8trk.com/36R3J12/2CTPL/?uid=23' },
    note: 'Ready Alliance Group / Everflow, affiliate ID 1361, 10% CPS. Sold on My Patriot Supply. Official generators collection link (uid=23) is used because the compact Everflow URL does not support deep linking to the product or special-offer page (tested Nov 27, 2026). ppcAllowed omitted (cards stay visible in paid-search sessions). Brand bidding is not allowed.' },
  { id: 'grayl', name: 'GRAYL', network: 'AvantLink', status: 'none', kind: 'product', items: ['grayl-geopress-24oz', 'grayl-ultrapress-16-9oz'],
    note: 'AvantLink application 1685501 was declined Nov 20, 2026. Parked; reapply later. Do not use AvantLink as a path today. Official links stay plain.',
  },
  { id: 'mymedic', name: 'MyMedic', network: 'AvantLink', status: 'none', kind: 'product', items: ['mymedic-myfak', 'mymedic-bleeding-control-kit', 'mymedic-everyday-carry', 'mymedic-cat-tourniquet-gen-7'],
    note: 'AvantLink application 1685501 was declined Nov 20, 2026. Parked; reapply later. Do not use AvantLink as a path today. Official links stay plain.',
  },
  { id: 'fenix', name: 'Fenix Lighting', network: 'AvantLink', status: 'none', kind: 'product', items: ['fenix-hm65r-v2'],
    note: 'AvantLink application 1685501 was declined Nov 20, 2026. Parked; reapply later. Do not use AvantLink as a path today. Official links stay plain.',
  },

  // ---- Retailer programs: fill retailerUrls with the product page at that store ----
  { id: 'walmart', name: 'Walmart', network: 'Impact', status: 'none', kind: 'product', retailerUrls: {}, items: ['walmart', 'walmart-board-games'],
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain.',
  },
  { id: 'home-depot', name: 'The Home Depot', network: 'Impact', status: 'none', kind: 'product', retailerUrls: {},
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain.',
  },
  { id: 'bass-pro', name: 'Bass Pro Shops', network: 'Impact', status: 'none', kind: 'product', retailerUrls: {}, officialUrl: 'https://www.basspro.com/c/camping',
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain. Directory links to the camping category only. Do not promote firearms or ammunition (BOTS.md rule 4). If later approved, flip only with a camping/outdoor deep link and owner sign-off.' },
  { id: 'cabelas', name: "Cabela's", network: 'Impact', status: 'none', kind: 'product', retailerUrls: {}, officialUrl: 'https://www.cabelas.com/c/camping',
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain. Directory links to the camping category only. Do not promote firearms or ammunition (BOTS.md rule 4). If later approved, flip only with a camping/outdoor deep link and owner sign-off.' },
  { id: 'academy', name: 'Academy Sports + Outdoors', network: 'CJ', status: 'pending', kind: 'product', cjAid: '', retailerUrls: {}, officialUrl: 'https://www.academy.com/',
    note: 'Directory uses the official homepage (camping category URLs were not reliably reachable). Do not promote firearms or ammunition (BOTS.md rule 4). If later approved, flip only with a camping/outdoor deep link and owner sign-off.' },
  { id: 'sportsmans', name: "Sportsman's Warehouse", network: 'Impact', status: 'none', kind: 'product', retailerUrls: {}, officialUrl: 'https://www.sportsmans.com/camping-gear-supplies/c/cat100829',
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain. Directory links to the camping-gear category only. Do not promote firearms or ammunition (BOTS.md rule 4). If later approved, flip only with a camping/outdoor deep link and owner sign-off.' },
  { id: 'berkey', name: 'TheBerkey.com', network: 'Refersion', status: 'approved', kind: 'product',
    officialUrl: 'https://theberkey.com/',
    link: 'https://theberkey.com/?rfsn=9422720.32fae8',
    items: ['berkey-shop', 'berkey-big-berkey', 'berkey-travel-berkey'],
    itemLinks: {
      'berkey-shop': 'https://theberkey.com/collections/all?rfsn=9422720.32fae8',
      'berkey-big-berkey': 'https://theberkey.com/products/big-berkey-water-filter?rfsn=9422720.32fae8',
      'berkey-travel-berkey': 'https://theberkey.com/products/travel-berkey-water-filter?rfsn=9422720.32fae8',
    },
    note: 'Refersion 15%, 365-day cookie. Official retailer TheBerkey.com. Linked from /gear/ (water) and /gear/tech/ (water filters).' },
  { id: 'waterdrop', name: 'Waterdrop Filter', network: 'Rakuten', status: 'approved', kind: 'product', ppcAllowed: false,
    officialUrl: 'https://www.waterdropfilter.com/',
    link: 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=53950&murl={url}',
    itemLinks: {
      'waterdrop-shop': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=53950&murl=https%3A%2F%2Fwww.waterdropfilter.com%2F',
    },
    note: 'Rakuten MID 53950, publisher SID 4780263 / id j8aaZmp7txc, approved Nov 19, 2026. Product cards use the standard Rakuten deeplink with that MID (from the official product catalog). The merchant shop card keeps the portal-issued offer link (offerid 1888875). Linked from /gear/ (water) and /gear/tech/.' },
  { id: 'redi', name: 'REDI', network: 'GoAffPro', status: 'approved', kind: 'product', ppcAllowed: false,
    officialUrl: 'https://getredi.com/',
    link: 'https://getredi.com/?ref=JOSEPHTINDIGLIA',
    items: ['redi-shop', 'redi-the-roadie', 'redi-roadie-plus', 'redi-roadie-pro', 'redi-trauma-pack'],
    itemLinks: {
      'redi-shop': 'https://getredi.com/collections/all?ref=JOSEPHTINDIGLIA',
      'redi-the-roadie': 'https://getredi.com/products/the-roadie?ref=JOSEPHTINDIGLIA',
      'redi-roadie-plus': 'https://getredi.com/products/roadie-plus?ref=JOSEPHTINDIGLIA',
      'redi-roadie-pro': 'https://getredi.com/products/roadie-pro?ref=JOSEPHTINDIGLIA',
      'redi-trauma-pack': 'https://getredi.com/products/trauma-kit?ref=JOSEPHTINDIGLIA',
    },
    note: 'GoAffPro 10%, 30-day cookie. Emergency and readiness kits. Linked from /gear/ (kits).' },

  { id: 'aquatru', name: 'AquaTru', network: 'TBD', status: 'none', kind: 'product', ppcAllowed: false,
    officialUrl: 'https://aquatruwater.com/',
    items: ['aquatru-carafe'],
    note: 'No approved partner program yet. Official links stay plain. No brand-term paid search.' },
  { id: 'harvest-right', name: 'Harvest Right', network: 'iDev', status: 'approved', kind: 'product', ppcAllowed: false,
    officialUrl: 'https://harvestright.com/',
    items: ['harvest-right', 'harvest-right-countertop-360'],
    link: 'https://affiliates.harvestright.com/4218.html',
    itemLinks: {
      'harvest-right': 'https://affiliates.harvestright.com/4218.html',
      'harvest-right-countertop-360': 'https://affiliates.harvestright.com/4218.html',
    },
    note: 'iDev Affiliates, affiliate ID 4218, 5% level, 45-day cookie (idev cookie on affiliates.harvestright.com, Max-Age 3888000s). Approved Nov 27, 2026. Deep linking via idevaffiliate.php?id=4218&url= is not enabled (url, page, dest, target, tid, relative paths, and 4218.html?url= all redirected to the Harvest Right homepage). Both cards use the official 4218.html tracking link, which lands on harvestright.com and sets the affiliate cookie. ppcAllowed false: no brand-term paid search. No coupon abuse. While in the program, do not promote other freeze-dryer brands.' },


  // ---- Programs with no listing slot yet (use in new listings/guides later) ----
  { id: 'hunter-boots', name: 'Hunter Boots', network: 'CJ', status: 'pending', kind: 'text', cjAid: '' },
  { id: 'magid', name: 'Magid Glove & Safety', network: 'CJ', status: 'pending', kind: 'text', cjAid: '' },
  { id: '1password', name: '1Password', network: 'CJ', status: 'pending', kind: 'text', cjAid: '' },

  // ---- Pay-per-lead CTA boxes (hidden until approved + link filled) ----
  { id: 'energysage', name: 'EnergySage', network: 'CJ', status: 'pending', kind: 'lead', link: '',
    lead: { title: 'Thinking about solar plus battery backup?',
      blurb: 'EnergySage lets you compare quotes from pre-screened local installers for free, with no obligation to buy.',
      button: 'Compare free solar quotes',
      places: ['generator-vs-power-station', 'how-to-pick-a-portable-power-station', 'winter-power-outage-checklist', 'tool:solar-sizer', 'tool:power-sizer', 'project:solar-generators'] } },
  { id: 'choice-home-warranty', name: 'Choice Home Warranty', network: 'CJ', status: 'approved', kind: 'lead', ppcAllowed: false, link: 'https://www.dpbolvw.net/click-101929817-12337172',
    note: 'CJ advertiser CID 4593144; $20/lead homeowners; no search bidding.',
    lead: { title: 'Worried about a furnace or water heater failing mid-storm?',
      blurb: 'A home warranty is a paid monthly or yearly plan that can cover repair or replacement of major systems and appliances. Check the price and read the coverage terms before you sign up.',
      button: 'See home warranty plans and prices',
      places: ['how-to-keep-pipes-from-freezing', 'heat-one-room-safely-in-an-outage', 'how-to-stay-warm-without-power', 'winter-power-outage-checklist', 'ice-storm-prep-checklist-south', 'winter-storm-power-outage-prep-guide-south'] } },
  { id: 'modernize', name: 'Modernize', network: 'Direct', status: 'pending', kind: 'lead', link: '',
    lead: { title: 'Need a contractor after the storm?',
      blurb: 'Modernize matches you with local pros for roofing, generators, and home repairs. Free, no-obligation quotes.',
      button: 'Get free contractor quotes',
      places: ['ice-storm-prep-checklist-south', 'power-outage-ice-storm-mississippi', 'generator-vs-power-station', 'project:fencing-gates', 'project:outbuildings-safe-rooms'] } },
  { id: 'networx', name: 'Networx', network: 'Direct', status: 'pending', kind: 'lead', link: '',
    lead: { title: 'Storm damage or frozen-pipe repairs?',
      blurb: 'Networx connects you with screened local contractors and plumbers. Compare free quotes before you hire.',
      button: 'Find a local pro',
      places: ['how-to-keep-pipes-from-freezing', 'power-outage-ice-storm-mississippi', 'project:fencing-gates', 'project:wells', 'project:outbuildings-safe-rooms', 'project:grading-excavation'] } },
  { id: 'leaffilter', name: 'LeafFilter', network: 'Impact', status: 'none', kind: 'lead', link: '',
    lead: { title: 'Ice dams and clogged gutters?',
      blurb: 'LeafFilter offers a free gutter-protection estimate at your home.',
      button: 'Get a free gutter estimate',
      places: ['ice-storm-prep-checklist-south'] },
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain.',
  },
  { id: 'hiscox', name: 'Hiscox Small Business Insurance', network: 'CJ', status: 'pending', kind: 'lead', link: '',
    note: 'CJ advertiser CID 4165310; pays per completed quote.',
    lead: { title: 'Run a small business from home or a shop?',
      blurb: 'Hiscox offers small-business insurance quotes online in minutes. Check what covers storm-related interruptions before you need it.',
      button: 'Get a small-business insurance quote',
      places: ['power-outage-ice-storm-mississippi'] } },

  // ---- Added for tonight's signup wave (launch-prep); all stay pending until approved + link filled ----
  { id: 'sportsmans-guide', name: "Sportsman's Guide", network: 'CJ', status: 'pending', kind: 'product', cjAid: '', retailerUrls: {}, officialUrl: 'https://www.sportsmansguide.com/department/camping?d=117',
    note: 'Applied, pending in CJ as of Nov 21, 2026. Official 5% on most sales, 2% on guns and ammo. Directory links to the camping department only — never the homepage (which merchandises firearms). Do not promote firearms or ammo. CJ only, not also AvantLink. If later approved, flip only with a camping/outdoor deep link and owner sign-off.' },
  { id: 'allpowers', name: 'ALLPOWERS', network: 'CJ', status: 'approved', kind: 'product',
    cjAid: '17227114',
    link: 'https://www.kqzyfj.com/click-101929817-17227114',
    officialUrl: 'https://www.iallpowers.com/',
    note: 'CJ advertiser CID 7797916, AID 17227114; lands on iallpowers.com. Program code ALLPOWERS26 for 10% off sitewide, per ALLPOWERS; present plainly, no urgency or countdowns. Coupon codes are allowed only because they come through the program. No brand-term search bidding and no direct linking. Linked from /gear/ (power) and the winter-storm pillar backup-power section. Also listed on Awin and AvantLink; stay in the existing CJ account.' },
  { id: 'dicks', name: "DICK'S Sporting Goods", network: 'CJ', status: 'none', kind: 'product', cjAid: '', retailerUrls: {}, officialUrl: 'https://www.dickssportinggoods.com/c/camping-hiking-gear',
    note: 'Not accepted on CJ as of Nov 21, 2026 (special terms). Do not re-apply under the same terms. Directory links stay on the camping-hiking category only. Do not promote firearms or ammunition.' },
  { id: 'surfshark', name: 'Surfshark', network: 'CJ', status: 'approved', kind: 'text', link: 'https://www.dpbolvw.net/click-101929817-15438560',
    note: 'CJ advertiser CID 6282055. Official page: 40% of new sales, 30-day cookie, $100 minimum. Approved in CJ; stays hidden until a tracked link is filled. Also listed on Impact and Awin — do not join a second network for this advertiser.' },
  { id: 'liberty-mutual', name: 'Liberty Mutual', network: 'CJ', status: 'none', kind: 'lead', link: '',
    note: 'Skipped Nov 21, 2026. Not applied. Official payouts if later joined: $10 home, $10 auto, $3 renters per completed quote. Lead box stays hidden until approved.',
    lead: { title: 'Need a home or auto insurance checkup after a freeze or storm?',
      blurb: 'Liberty Mutual lets you complete a home, auto, or renters quote online. Compare coverage for storm and freeze damage before you need a claim.',
      button: 'Get a free insurance quote',
      places: ['how-to-keep-pipes-from-freezing', 'winter-power-outage-checklist', 'winter-car-emergency-kit'] } },
  { id: 'survival-frog', name: 'Survival Frog', network: 'Awin', status: 'dropped', kind: 'product', officialUrl: 'https://www.survivalfrog.com/collections/n-camping',
    items: ['survival-frog', 'survival-frog-beef-canned-meat'],
    note: 'DROPPED Nov 27, 2026: application rejected; cards removed. Was: applied Nov 21, 2026, pending in Awin. Official 12%, 30-day cookie. USA shipping only. Official food product pages stay plain until approved; confirm food is in-program before a tracked food deep link.' },
  { id: 'legacy-food', name: 'Legacy Food Storage', network: 'Awin', status: 'pending', kind: 'product',
    items: ['legacy-food', 'legacy-120-serving-entree-bucket', 'legacy-60-serving-entree-bucket', 'legacy-premium-240-serving-package'],
    officialUrl: 'https://www.legacyfoodstorage.com/',
    note: 'Applied Nov 21, 2026, pending in Awin. Official brand page 10% (up to 15%), 30-day cookie; coupon sites 1% only. Confirm the live Awin contract (catalogs have shown lower). Tracking stays off until approved.' },
  { id: 'olight', name: 'Olight USA', network: 'Awin', status: 'pending', kind: 'product',
    items: ['olight-official'], officialUrl: 'https://www.olight.com/all-products',
    note: 'Applied Nov 21, 2026, pending in Awin. Official 10%, 30-day cookie. Flashlights and EDC lighting only, not weapon lights. Tracking stays off until approved.' },
  { id: 'nitecore', name: 'NITECORE Store', network: 'Awin', status: 'pending', kind: 'product',
    items: ['nitecore-edc29', 'nitecore-edc37', 'nitecore-hc65-uhe'], officialUrl: 'https://nitecorestore.com/',
    note: 'Applied Nov 21, 2026, pending in Awin at 5% (the rate recorded at apply; an earlier official Awin profile also listed 10% content / 5% coupon). Tracking stays off until approved.' },
  { id: 'pecron', name: 'PECRON', network: 'Direct', status: 'pending', kind: 'product',
    note: 'Application submitted Nov 21, 2026, about 6:01 PM America/Chicago via Affiliatly. Pending review. Official up to 10%, 15-day cookie. Portable power stations stay off the home page. Tracking stays off until approved.' },
  { id: 'btech', name: 'BTECH (Baofeng)', network: 'Direct', status: 'pending', kind: 'product',
    items: ['btech-uv-5x3'], officialUrl: 'https://baofengtech.com/',
    note: '5–10% tiered, manual approval. Direct program; tracking stays off until approved.' },
  { id: 'mighty-generators', name: 'Mighty Generators', network: 'Direct', status: 'pending', kind: 'product',
    note: 'Signed up Nov 21, 2026, at 3%. Email verification done. Pending review. 60-day cookie. Excludes home standby and commercial generators. No brand-term bidding. Tracking stays off until approved. Not featured on the home page.' },
  { id: 'berkey-filter', name: 'Berkey Water Filter', network: 'Direct', status: 'pending', kind: 'product', retailerUrls: {},
    note: 'Different retailer than TheBerkey.com (Refersion). Previously published 5%, 30-day cookie, $50 minimum.' },
  { id: 'cove', name: 'Cove Smart Home Security', network: 'FlexOffers', status: 'pending', kind: 'text',
    note: '8%, 30-day cookie on FlexOffers. Sale commission, not a form-fill CPL.' },
  { id: 'acurite', name: 'AcuRite', network: 'FlexOffers', status: 'pending', kind: 'product',
    note: '6%, 45-day cookie. Weather stations.' },
  { id: 'ring', name: 'Ring', network: 'Impact', status: 'none', kind: 'product',
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain. Official range 4–8%, 30-day cookie; confirm if later approved.' },
  { id: 'yeti', name: 'YETI', network: 'Impact', status: 'none', kind: 'product',
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain.' },
  { id: 'carhartt', name: 'Carhartt', network: 'Impact', status: 'none', kind: 'product',
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain.' },
  { id: 'ace-hardware', name: 'Ace Hardware', network: 'Impact', status: 'none', kind: 'product', retailerUrls: {},
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain.' },
  { id: 'mira-safety', name: 'MIRA Safety', network: 'AvantLink', status: 'none', kind: 'product',
    note: 'AvantLink application 1685501 was declined Nov 20, 2026. Parked; reapply later. Do not use AvantLink as a path today. Official links stay plain. Up to 10%, 30-day cookie if later approved.' },
  { id: 'bluecosmo', name: 'BlueCosmo ZOLEO', network: 'AvantLink', status: 'none', kind: 'product',
    note: 'AvantLink application 1685501 was declined Nov 20, 2026. Parked; reapply later. Do not use AvantLink as a path today. Official links stay plain. 10%, 90-day cookie, ZOLEO-branded products only.' },
  { id: 'angi', name: 'Angi', network: 'CJ', status: 'pending', kind: 'lead', link: '', officialUrl: 'https://www.angi.com/',
    note: 'CJ advertiser CID 7439025. Payout not public. Phone, link, and API leads. Do not lean on this as a primary offer.',
    lead: { title: 'Need a local pro for storm repairs?',
      blurb: 'Angi helps you find local contractors for roofing, plumbing, and home repairs. Compare options before you hire.',
      button: 'Find a local contractor',
      places: ['ice-storm-prep-checklist-south', 'project:shelters', 'project:fencing-gates', 'project:wells', 'project:septic', 'project:solar-generators', 'project:outbuildings-safe-rooms', 'project:grading-excavation'] } },
  { id: 'american-home-shield', name: 'American Home Shield', network: 'Direct', status: 'pending', kind: 'lead', link: '',
    note: 'Program-manager page lists $18 per lead and $30 per order, 30-day cookie; confirm in the contract. Do not stack on the same page as Choice Home Warranty at launch.',
    lead: { title: 'Thinking about a home warranty for major systems?',
      blurb: 'American Home Shield sells paid warranty plans that can cover repair or replacement of major home systems and appliances. Check the price and read the coverage terms before you sign up.',
      button: 'See home warranty plans and prices',
      places: ['heat-one-room-safely-in-an-outage', 'how-to-stay-warm-without-power'] } },
  { id: 'matchburst', name: 'MatchBurst', network: 'Awin', status: 'pending', kind: 'lead', link: '',
    note: 'Awin merchant 114854, 30-day cookie. Payout not public. Apply after joining Awin.',
    lead: { title: 'Compare quotes for home projects after the storm?',
      blurb: 'MatchBurst connects you with local quotes for roofing, windows, HVAC, and other home-improvement work.',
      button: 'Compare home-improvement quotes',
      places: ['ice-storm-prep-checklist-south'] } },
  { id: 'tap-score', name: 'Tap Score', network: 'Direct', status: 'pending', kind: 'product',
    note: 'Purchase commission on water-test kits, not pay-per-lead. Rate is shown at signup. Questions: affiliates@mytapscore.com.' },
  { id: 'aquasana', name: 'Aquasana', network: 'Rakuten', status: 'approved', kind: 'product',
    officialUrl: 'https://www.aquasana.com/',
    link: 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=36667&murl={url}',
    itemLinks: {
      // Shop card deep-links to the Aquasana home page with the program deeplink (Nov 27, 2026). The under-sink and
      // whole-house category cards were merged into the specific product cards, so their offer links are retired.
      'aquasana-home': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=36667&murl=https%3A%2F%2Fwww.aquasana.com%2F',
    },
    note: 'Rakuten MID 36667, publisher SID 4780263 / id j8aaZmp7txc, 0-10% tiered last-click commission, approved Nov 20, 2026. Merchant, whole-house, and under-sink cards keep portal-issued offer links. Other product cards use the standard Rakuten deeplink with that MID so they open the official product page, not the homepage. Linked from /gear/ (water), /gear/tech/ (water filters), and /guides/emergency-water-storage/.' },
  { id: 'ispring', name: 'iSpring Water Systems', network: 'GoAffPro', status: 'approved', kind: 'product',
    officialUrl: 'https://www.ispringfilter.com/',
    link: '{rawurl}?ref=JOSEPHTINDIGLIA',
    items: [
      'ispring-home',
      'ispring-rcc7',
      'ispring-rcc7ak',
      'ispring-ro500',
      'ispring-rcd100',
      'ispring-wgb21b',
      'ispring-wgb32b',
      'ispring-sf2s',
      'ispring-df1',
    ],
    itemLinks: {
      'ispring-home': 'https://www.ispringfilter.com/collections/all?ref=JOSEPHTINDIGLIA',
      'ispring-rcc7': 'https://www.ispringfilter.com/products/5-stage-essence-ro-water-filtration-system-ispring-rcc7-5-stage-residential-under-sink-reverse-osmosis-water-filter-system-wqa-certified-75-gpd?ref=JOSEPHTINDIGLIA',
      'ispring-rcc7ak': 'https://www.ispringfilter.com/products/ispring-6-stage-75-gpd-high-capacity-under-sink-reverse-osmosis-drinking-water-filter-system-with-alkaline-remineralization?ref=JOSEPHTINDIGLIA',
      'ispring-ro500': 'https://www.ispringfilter.com/products/ispring-ro500-bn-tankless-ro-reverse-osmosis-water-filtration-system-500-gpd-fast-flow-brushed-nickel-faucet-21-pure-to-drain-ratio-white-nsf-certified?ref=JOSEPHTINDIGLIA',
      'ispring-rcd100': 'https://www.ispringfilter.com/products/ispring-rcd100-5-stage-countertop-reverse-osmosis-system-instant-hot-ro-water-dispenser-with-uv-251-pure-to-drain-100-gpd-portable-water-filtration-system-customizable-temperature-options-bpa-free-plug-and-play?ref=JOSEPHTINDIGLIA',
      'ispring-wgb21b': 'https://www.ispringfilter.com/products/ispring-wgb21b-2-stage-heavy-duty-whole-house-water-filtration-system-10x45-in-sediment-filter-and-cto-filter1in-inletoutlet?ref=JOSEPHTINDIGLIA',
      'ispring-wgb32b': 'https://www.ispringfilter.com/products/ispring-whole-house-water-filtration-system-sediment-carbon-big-blue?ref=JOSEPHTINDIGLIA',
      'ispring-sf2s': 'https://www.ispringfilter.com/products/ispring-sf2s-stylish-multi-stage-high-output-shower-head-filter-with-replaceable-cartridge-to-remove-chlorine-sediment-and-heavy-minerals-chrome_782?ref=JOSEPHTINDIGLIA',
      'ispring-df1': 'https://www.ispringfilter.com/products/ispring-df1-faucet-mount-water-filter-150-contaminants-removal-500gal-filter-life-15gpm-filtration-rate?ref=JOSEPHTINDIGLIA',
    },
    note: 'GoAffPro, 8% commission, 40-day hold, approved Nov 23, 2026. Shop and product links append ?ref=JOSEPHTINDIGLIA. Program code REFISPRING for 10% off a new customer’s first filtration system at ispringfilter.com (one use, not combinable); present plainly, no urgency. Coupon codes are allowed only because they come through the program. No brand-term search bidding information was provided; do not bid on iSpring brand terms until we have written permission. Linked from /gear/ (water), /gear/tech/ (water filters), and the Full Source Directory water and home tabs.' },
  { id: 'epic-water-filters', name: 'Epic Water Filters', network: 'Direct', status: 'approved', kind: 'product',
    officialUrl: 'https://www.epicwaterfilters.com/',
    link: 'https://pmx-production.herokuapp.com/affiliate-link/AMLTBUQYRO',
    items: [
      'epic-pure-xp-pitcher',
      'epic-nano-xp-pitcher',
      'epic-smart-shield',
      'epic-smart-shield-max',
      'epic-og-ultimate-travel-bottle',
    ],
    itemLinks: {
      'epic-pure-xp-pitcher': 'https://www.epicwaterfilters.com/products/pure-xp-water-filter-pitcher?ref=XJZEKTWOCV',
      'epic-nano-xp-pitcher': 'https://www.epicwaterfilters.com/products/epic-nano-water-filter-pitcher?ref=XJZEKTWOCV',
      'epic-smart-shield': 'https://www.epicwaterfilters.com/products/epic-smart-shield-under-sink-water-filter-system?ref=XJZEKTWOCV',
      'epic-smart-shield-max': 'https://www.epicwaterfilters.com/products/epic-smart-shield-max?ref=XJZEKTWOCV',
      'epic-og-ultimate-travel-bottle': 'https://www.epicwaterfilters.com/products/ultimate-travel-bottle-og?ref=XJZEKTWOCV',
    },
    note: 'LINK AUDIT Nov 25, 2026: product cards now deep-link to the exact Epic product page with the program-issued ref=XJZEKTWOCV (the same ref PMX appends when its issued link https://pmx-production.herokuapp.com/affiliate-link/AMLTBUQYRO redirects to the Epic home page); the issued PMX link alone only lands on the home page. CONFIRM in the PMX dashboard that a deep-link click or test order is credited; revert itemLinks to the PMX link if not. PMX affiliate platform, 15% commission, 60-day cookie, approved Nov 24, 2026. Public PMX docs did not confirm a per-product redirect parameter, so every card uses the issued affiliate link (https://pmx-production.herokuapp.com/affiliate-link/AMLTBUQYRO) rather than an invented deep-link query. Official product URLs stay on the write-ups for reference. Linked from /gear/ (water), /gear/tech/ (water filters), and the Full Source Directory water and home tabs.' },
  { id: 'tidewe', name: 'TideWe', network: 'Awin', status: 'approved', kind: 'product', ppcAllowed: false,
    officialUrl: 'https://www.tidewe.com/',
    link: 'https://www.awin1.com/cread.php?awinmid=78182&awinaffid=3160581&ued={url}',
    items: [
      'tidewe-inferno-heated-jacket',
      'tidewe-silentrace-heated-jacket',
      'tidewe-thermcore-heated-vest',
      'tidewe-thermshift-heated-vest',
      'tidewe-torridseeker-heated-waders',
      'tidewe-aquawade-pro-waders',
    ],
    itemLinks: {
      'tidewe-inferno-heated-jacket': 'https://www.awin1.com/cread.php?awinmid=78182&awinaffid=3160581&ued=https%3A%2F%2Fwww.tidewe.com%2Fproducts%2Finferno-mens-camo-heated-hunting-jacket-with-battery-pack',
      'tidewe-silentrace-heated-jacket': 'https://www.awin1.com/cread.php?awinmid=78182&awinaffid=3160581&ued=https%3A%2F%2Fwww.tidewe.com%2Fproducts%2Fsilentrace-heated-hunting-jacket',
      'tidewe-thermcore-heated-vest': 'https://www.awin1.com/cread.php?awinmid=78182&awinaffid=3160581&ued=https%3A%2F%2Fwww.tidewe.com%2Fproducts%2Fheated-vest-double-sided-polar-fleece-hunting-vest-all-gender',
      'tidewe-thermshift-heated-vest': 'https://www.awin1.com/cread.php?awinmid=78182&awinaffid=3160581&ued=https%3A%2F%2Fwww.tidewe.com%2Fproducts%2Ftidewe-heated-vest-with-battery-pack-lightweight-and-washable-vest',
      'tidewe-torridseeker-heated-waders': 'https://www.awin1.com/cread.php?awinmid=78182&awinaffid=3160581&ued=https%3A%2F%2Fwww.tidewe.com%2Fproducts%2Ftidewe-hunting-chest-waders-heated-with-800g-insulation-neoprene-duck-wader-for-men-realtree-max5-camo-waterproof-fishing-waders-size-7-14',
      'tidewe-aquawade-pro-waders': 'https://www.awin1.com/cread.php?awinmid=78182&awinaffid=3160581&ued=https%3A%2F%2Fwww.tidewe.com%2Fproducts%2Ftidewe-breathable-insulated-chest-waders-1600g-waterproof-bootfoot-duck-hunting-waders-with-steel-shank-boots',
    },
    note: 'Awin advertiser 78182, publisher 3160581, 10% commission, 30-day cookie, joined Nov 24, 2026. TideWe bans all PPC, including Google, Bing, and paid social, plus brand/TM+ bidding. Keep TideWe permanently off all paid-search landing pages and paid-ad sessions, alongside Choice Home Warranty, REDI, and Waterdrop. Only coupons issued through the affiliate program may be used. Linked from /winter-deals/, /gear/ (Warmth, Vehicle, Tools & Retailers), and the Full Source Directory outdoor tab.' },

  { id: 'bogs', name: 'Bogs Footwear', network: 'Rakuten', status: 'approved', kind: 'product', ppcAllowed: false,
    officialUrl: 'https://www.bogsfootwear.com/',
    link: 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=37142&murl={url}',
    items: [
      'bogs-bozeman-ii-tall',
      'bogs-bozeman-ii-vibram-arctic-grip',
      'bogs-arcata-ii-lace',
      'bogs-arcata-ii-plaid',
      'bogs-arcata-urban-ii-leather',
      'bogs-arcata-ii-dash-kids',
      'bogs-snow-shell-cosmic-forest',
    ],
    itemLinks: {
      'bogs-bozeman-ii-tall': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=37142&murl=https%3A%2F%2Fwww.bogsfootwear.com%2Fshop%2Fstyle%2F73452-001.html',
      'bogs-bozeman-ii-vibram-arctic-grip': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=37142&murl=https%3A%2F%2Fwww.bogsfootwear.com%2Fshop%2Fstyle%2F73421-001.html',
      'bogs-arcata-ii-lace': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=37142&murl=https%3A%2F%2Fwww.bogsfootwear.com%2Fshop%2Fstyle%2F73589-001.html',
      'bogs-arcata-ii-plaid': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=37142&murl=https%3A%2F%2Fwww.bogsfootwear.com%2Fshop%2Fstyle%2F73597-302.html',
      'bogs-arcata-urban-ii-leather': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=37142&murl=https%3A%2F%2Fwww.bogsfootwear.com%2Fshop%2Fstyle%2F73592-009.html',
      'bogs-arcata-ii-dash-kids': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=37142&murl=https%3A%2F%2Fwww.bogsfootwear.com%2Fshop%2Fstyle%2F73118-001.html',
      'bogs-snow-shell-cosmic-forest': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=37142&murl=https%3A%2F%2Fwww.bogsfootwear.com%2Fshop%2Fstyle%2F73377-409.html',
    },
    note: 'Rakuten MID 37142, publisher SID 4780263, 2% last-click commission, approved by Joseph Nov 25, 2026. PPC, coupon, and image terms could not be confirmed because the terms document would not open, so Bogs stays off all paid-search landing pages and paid-ad sessions, alongside Choice Home Warranty, REDI, Waterdrop, and TideWe. Do not show promo codes or sale prices. No official product photos are used because image terms were not confirmed. Linked from /winter-deals/, /cold-weather-gear/, /gear/ (Warmth, Vehicle, Tools & Retailers), and the Full Source Directory outdoor tab.' },
  { id: 'amazon', name: 'Amazon Associates', network: 'Amazon', status: 'live', kind: 'product', ppcAllowed: false,
    /** Gear listings with a verified ASIN (amazon.com page title checked Nov 27, 2026). Brand programs that are live still win. */
    retailerUrls: {
      'mr-heater-portable-buddy': amazonProductUrl('B002G51BZU'),
      'black-diamond-spot-400': amazonProductUrl('B0H1R7G7VN'),
      'leatherman-signal': amazonProductUrl('B0GJPS57XR'),
      'leatherman-wave-plus': amazonProductUrl('B079MJBP21'),
      'amk-mountain-series-explorer': amazonProductUrl('B0711J9FJP'),
      'grayl-ultrapress-16-9oz': amazonProductUrl('B0HCXRBQG1'),
      'hothands-hand-warmers': amazonProductUrl('B00D7H9LIA'),
      // B004Y6V5CI is a different Kidde model (KN-COPP-B-LPM), verified on the Amazon page Nov 27, 2026.
      'kidde-kn-cob-lp2': amazonProductUrl('B004Y6V6K4'),
      'goal-zero-lighthouse-600': amazonProductUrl('B08HRM4J8Y'),
      'noco-boost-gb40': amazonProductUrl('B015TKUPIC'),
      'yaktrax-pro': amazonProductUrl('B0094GO6ZG'),
      'midland-wr400': amazonProductUrl('B071HFV836'),
      'honda-eu2200i': amazonProductUrl('B08YJVDGS1'),
      'darn-tough-hiker-boot-full-cushion': amazonProductUrl('B0DN6QLNJV'),
      'kahtoola-microspikes': amazonProductUrl('B00RXXKM50'),
      'zippo-heatbank-9s': amazonProductUrl('B07Q6GQM9D'),
      'leatherman-skeletool-cx': amazonProductUrl('B000059GTH'),
      'amk-mountain-series-hiker': amazonProductUrl('B072HR2MLV'),
      'amk-adventure-first-aid-family': amazonProductUrl('B0079ODGHO'),
      'sol-emergency-blanket': amazonProductUrl('B00HJTH91S'),
      '3m-indoor-window-insulator-kit': amazonProductUrl('B000AXXCUC'),
      'generac-iq3500': amazonProductUrl('B07H8S6L5G'),
      'champion-4000-dual-fuel-inverter': amazonProductUrl('B0D6SQR1L1'),
      'champion-5000-trifuel': amazonProductUrl('B0C9K71B7M'),
      'champion-12500-trifuel': amazonProductUrl('B0DLPLDXFC'),
      'generac-5200-dual-fuel-inverter': amazonProductUrl('B0DT7PQLPQ'),
      'reliance-31410crk': amazonProductUrl('B000HS2L3O'),
      'square-d-homcgk2c': amazonProductUrl('B00CONE4MG'),
      'generac-homelink-30': amazonProductUrl('B00V4NDFZO'),
      'flame-king-20lb': amazonProductUrl('B000FIVGYQ'),
      'champion-12ft-propane-hose': amazonProductUrl('B09VQ4F138'),
      'gentent-open-frame': amazonProductUrl('B0GFG7FLYP'),
      'kidde-plugin-battery-co': amazonProductUrl('B0G1C86M5S'),

      'lifestraw-personal': amazonProductUrl('B006QF3TW4'),
      'therm-a-rest-z-lite-sol': amazonProductUrl('B005I6R0WC'),
      'vornado-avh10': amazonProductUrl('B0FK5XX2VQ'),
      'kidde-pro-210': amazonProductUrl('B0F4DZ7FM9'),
      'first-aid-only-50-person-272': amazonProductUrl('B0BR5RMJFC'),
      'sam-splint': amazonProductUrl('B001MYCCKY'),
      'datrex-emergency-water-dx1000w': amazonProductUrl('B00ANY4EXM'),
      'goal-zero-yeti-1500': amazonProductUrl('B0GMKKGQCY'),
      'amk-trauma-pak-quikclot': amazonProductUrl('B003BS2PW4'),
      'lodge-classic-cast-iron-skillet': amazonProductUrl('B00WTSCXIS'),
      'fenix-hm65r-v2': amazonProductUrl('B0HG32N3YC'),
      'philips-heartstart-onsite': amazonProductUrl('B00KSAL7LS'),
    },
    note: 'Tracking ID readygearhub-20 (payee OMEGA UCO SOLUTIONS, LLC), account created Nov 25, 2026. Catch-all retailer for listings without a brand program. Every amazon.com link gets tag=readygearhub-20 through amazonLink(). Required disclosure: "As an Amazon Associate I earn from qualifying purchases." Hidden in paid-search sessions (Associates terms bar Amazon links in paid ads). Rates are set by Amazon per product category (most gear is roughly 3–4.5%). Paid ~60 days after month end.' },
  { id: 'mailerlite-referral', name: 'MailerLite', network: 'Direct', status: 'pending', kind: 'text',
    note: '30% lifetime on paid plans, 45-day cookie, Trackdesk. $100 and 2 unique sales before payout. Already a MailerLite customer.' },
  { id: 'nordvpn', name: 'NordVPN', network: 'CJ', status: 'approved', kind: 'text', link: 'https://www.anrdoezrs.net/click-101929817-12814518',
    note: 'CJ advertiser CID 4837117. Official page: 100% on a 1-month plan, 40% on 1- or 2-year, 30% on renewals, 30-day cookie. Linked as a paid subscription from winter-storm-power-outage-prep-guide-south. Text affiliates have no lead.places slots; the in-guide link uses the tracked URL with rel=sponsored and data-program=nordvpn.' },
  { id: 'expressvpn', name: 'ExpressVPN', network: 'CJ', status: 'pending', kind: 'text',
    note: 'CJ advertiser CID 5577978. Rate is shown after apply. For a future privacy or comms guide.' },
  { id: 'proton', name: 'Proton', network: 'Direct', status: 'pending', kind: 'text',
    note: 'Official partners page: 30–100% by product and plan (VPN monthly new subs 100%; many others 30–40%), plus renewal share on some plans.' },
  { id: 'nordpass', name: 'NordPass', network: 'CJ', status: 'approved', kind: 'text', link: 'https://www.dpbolvw.net/click-101929817-13868703',
    note: 'CJ advertiser CID 5324242. Linked as a paid subscription from winter-storm-power-outage-prep-guide-south. Text affiliates have no lead.places slots; the in-guide link uses the tracked URL with rel=sponsored and data-program=nordpass. May also be covered by the NordVPN program.' },
  { id: 'monarch', name: 'Monarch', network: 'Direct', status: 'pending', kind: 'text',
    note: 'Official Affiliate Partners page. Payout is shown on the apply form. Budgeting / emergency-fund angle.' },

  // ---- Additional CJ advertisers (approved stay hidden until a tracked link is filled) ----
  { id: 'cyberghost', name: 'CyberGhost', network: 'CJ', status: 'pending', kind: 'text',
    note: 'CJ advertiser CID 4996371. VPN; for a future privacy or comms guide.' },
  { id: 'deleteme', name: 'DeleteMe', network: 'CJ', status: 'pending', kind: 'text',
    note: 'CJ advertiser CID 5273598. Personal data-removal service.' },
  { id: 'axa-insurance-usa', name: 'AXA Insurance USA', network: 'CJ', status: 'pending', kind: 'text',
    note: 'CJ advertiser CID 7633648. Insurance; lead CTA copy and placements can be added after approval.' },
  { id: 'private-internet-access', name: 'Private Internet Access', network: 'CJ', status: 'pending', kind: 'text',
    note: 'CJ advertiser CID 5483733. VPN; for a future privacy or comms guide.' },
  { id: 'mro-supreme', name: 'MRO Supreme', network: 'CJ', status: 'pending', kind: 'text',
    note: 'CJ advertiser CID 7973978.' },
  { id: 'incogni', name: 'Incogni', network: 'CJ', status: 'pending', kind: 'text',
    note: 'CJ advertiser CID 6867883. Personal data-removal service.' },
  { id: 'coleman', name: 'Coleman', network: 'CJ', status: 'pending', kind: 'product', cjAid: '',
    items: ['coleman-classic-propane-stove-2-burner'],
    note: 'Applied Nov 18, 2026, pending in CJ (CID 5975700). Tracking stays off until approved.' },

  { id: 'roboform', name: 'RoboForm', network: 'CJ', status: 'pending', kind: 'text',
    note: 'CJ advertiser CID 5258939. Password manager; for a future privacy or comms guide.' },

  // ---- Brand programs added so every commercial listing/directory entry is affiliate-ready ----
  // status 'none' = we have not applied yet. Links stay plain until flipped to approved with a tracking URL.
  { id: 'honda-power', name: 'Honda Power Equipment', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://powerequipment.honda.com/generators',
    items: ['honda-eu2200i', 'honda-eu3200i'] },
  { id: 'generac', name: 'Generac', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.generac.com/',
    items: ['generac-iq3500'] },
  { id: 'katadyn', name: 'Katadyn', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://katadyn.com/en-us/',
    items: ['katadyn-befree-0-6l'] },
  { id: 'sawyer', name: 'Sawyer', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.sawyer.com/',
    items: ['sawyer-mini-water-filter', 'sawyer-squeeze-water-filter'] },
  { id: 'augason-farms', name: 'Augason Farms', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://augasonfarms.com/',
    items: ['augason-farms-30-day-1-person', 'augason-farms-3-month-emergency-food', 'augason-farms-lunch-dinner-variety-pail', 'augason-farms-grab-and-go-backpack'] },
  { id: 'amk', name: 'Adventure Medical Kits', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://adventuremedicalkits.com/',
    items: ['amk-adventure-first-aid-family', 'amk-adventure-first-aid-2-0', 'amk-mountain-series-explorer', 'amk-mountain-series-hiker', 'amk-trauma-pak-quikclot', 'amk-ultralight-watertight-9', 'amk-blister-medic-kit', 'amk-sports-first-aid-kit', 'amk-trauma-tourniquet', 'amk-dental-medic-kit'] },
  { id: 'first-aid-only', name: 'First Aid Only', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://firstaidonly.com/',
    items: ['first-aid-only-50-person-272'] },
  { id: 'petzl', name: 'Petzl', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.petzl.com/US/en',
    items: ['petzl-actik-core'] },
  { id: 'black-diamond', name: 'Black Diamond', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.blackdiamondequipment.com/',
    items: ['black-diamond-spot-400'] },
  { id: 'eton', name: 'Eton', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://etoncorp.com/',
    items: ['eton-blackout-buddy-co', 'eton-blackout-buddy-h2o', 'eton-red-cross-frx2', 'eton-elite-executive-radio', 'eton-elite-traveler-radio', 'eton-elite-field-radio', 'eton-red-cross-journey-radio', 'eton-roadguard-jump-starter'] },
  { id: 'kidde', name: 'Kidde', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.kidde.com/',
    items: ['kidde-kn-cob-lp2', 'kidde-pro-210'] },
  { id: '3m', name: '3M', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.3m.com/',
    items: ['3m-indoor-window-insulator-kit'] },
  { id: 'darn-tough', name: 'Darn Tough', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.darntough.com/',
    items: ['darn-tough-hiker-boot-full-cushion'] },
  { id: 'datrex', name: 'Datrex', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.datrex.com/',
    items: ['datrex-emergency-water-dx1000w'] },
  { id: 'gerber', name: 'Gerber', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.gerbergear.com/',
    items: ['gerber-multi-plier-600-basic'],
    note: 'Listing is a multi-tool. Knives only as multi-tools or utility tools (BOTS.md rule 4).' },
  { id: 'hothands', name: 'HotHands', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://kobayashiamericas.com/hothands/',
    items: ['hothands-hand-warmers'] },
  { id: 'kahtoola', name: 'Kahtoola', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://kahtoola.com/',
    items: ['kahtoola-microspikes'] },
  { id: 'lodge', name: 'Lodge', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.lodgecastiron.com/',
    items: ['lodge-classic-cast-iron-skillet'] },
  { id: 'mr-heater', name: 'Mr. Heater', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.mrheater.com/',
    items: ['mr-heater-buddy-flex', 'mr-heater-buddy-flex-cooker', 'mr-heater-portable-buddy'] },
  { id: 'noco', name: 'NOCO', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://no.co/gb40',
    items: ['noco-boost-gb40'] },
  { id: 'philips', name: 'Philips', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.usa.philips.com/healthcare/product/HCM5066A',
    items: ['philips-heartstart-onsite'] },
  { id: 'reliance', name: 'Reliance Outdoors', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://relianceoutdoors.com/',
    items: ['reliance-aqua-tainer', 'reliance-jumbo-tainer-2'] },
  { id: 'sam-medical', name: 'SAM Medical', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.sammedical.com/',
    items: ['sam-splint', 'sam-chest-seals'] },
  { id: 'snow-joe', name: 'Snow Joe', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://shopjoe.com/',
    items: ['snow-joe-shovelution-18', 'snow-joe-telescoping-snow-broom'] },
  { id: 'sol', name: 'SOL (Survive Outdoors Longer)', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.surviveoutdoorslonger.com/',
    items: ['sol-emergency-bivvy', 'sol-emergency-blanket'] },
  { id: 'teton-sports', name: 'TETON Sports', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://tetongear.com/',
    items: ['teton-sports-celsius-regular-0'] },
  { id: 'therm-a-rest', name: 'Therm-a-Rest', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://cascadedesigns.com/',
    items: ['therm-a-rest-z-lite-sol'] },
  { id: 'uco', name: 'UCO', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://ucogear.com/',
    items: ['uco-stormproof-match-kit'] },
  { id: 'vornado', name: 'Vornado', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://vornado.com/',
    items: ['vornado-avh10'] },
  { id: 'waterbob', name: 'waterBOB', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://waterbob.com/',
    items: ['waterbob'] },
  { id: 'yaktrax', name: 'Yaktrax', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://yaktrax.com/',
    items: ['yaktrax-pro'] },
  { id: 'zippo', name: 'Zippo', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://zippo.com/',
    items: ['zippo-heatbank-9s'] },
  { id: 'zoleo', name: 'ZOLEO', network: 'TBD', status: 'pending', kind: 'product', officialUrl: 'https://www.zoleo.com/en-us/product/zoleo-global-satellite-communicator',
    note: 'Impact/AvantLink/Awin pending. Keep links plain until approved and a tracking URL is filled.' },
  { id: 'iridium', name: 'Iridium', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.iridium.com/products/iridium-go-exec-portable-wireless-access-device',
    note: 'Not applied yet. Directory links stay plain until flipped to approved with a tracking URL.' },
  { id: 'moen', name: 'Moen (Flo)', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.moen.com/products/900-001',
    note: 'Not applied yet. Directory links stay plain until flipped to approved with a tracking URL.' },
  { id: 'yolink', name: 'YoLink', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://shop.yosmart.com/products/ys7986',
    note: 'Not applied yet. Directory links stay plain until flipped to approved with a tracking URL.' },

  // ---- Offline entertainment: leave status none until a program is approved ----
  { id: 'apple-services', name: 'Apple Services Performance Partners', network: 'Partnerize', status: 'none', kind: 'product',
    officialUrl: 'https://www.apple.com/apple-music/',
    note: 'Covers Apple Music and related Apple Services. Apple is selective; keep links plain until approved and a Partnerize tracking URL is filled.' },
  { id: 'jbl', name: 'JBL (Harman)', network: 'CJ', status: 'pending', kind: 'product',
    officialUrl: 'https://www.jbl.com/FLIP-7.html', cjAid: '',
    items: ['jbl-flip-7'],
    note: 'Already applied on CJ (advertiser 3805502). Do not re-apply. Tracking stays off until approved with a tracking URL or cjAid.' },
  { id: 'sonos', name: 'Sonos', network: 'Impact', status: 'none', kind: 'product',
    officialUrl: 'https://www.sonos.com/en-us/shop/roam-2',
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain.' },
  { id: 'skullcandy', name: 'Skullcandy', network: 'Impact', status: 'none', kind: 'product',
    officialUrl: 'https://www.skullcandy.com/products/session-360',
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain. Official signup page: skullcandy.com/pages/affiliates-and-creators (only after a later Impact reapply).' },
  { id: 'crutchfield', name: 'Crutchfield', network: 'Rakuten', status: 'dropped', kind: 'product',
    officialUrl: 'https://www.crutchfield.com/', items: [],
    note: 'DROPPED Nov 25, 2026. Standing rule: no Crutchfield. The directory listing and the coming-soon mention were removed. Do not relist or turn tracking on.' },
  { id: 'tcgplayer', name: 'TCGplayer', network: 'Impact', status: 'none', kind: 'product',
    officialUrl: 'https://www.tcgplayer.com/',
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain.' },
  { id: 'ebay', name: 'eBay Partner Network', network: 'Direct', status: 'dropped', kind: 'product', ppcAllowed: false,
    officialUrl: 'https://www.ebay.com/b/Collectible-Card-Games-Accessories/2536/bn_1852210', items: [],
    note: 'DROPPED Nov 27, 2026 (go-live exclusions audit). Standing rule: no EPN / eBay Partner Network. The two plain eBay directory cards were removed. Do not relist or turn tracking on.' },
  { id: 'pokemon-tcg', name: 'Pokémon TCG', network: 'TBD', status: 'none', kind: 'product',
    officialUrl: 'https://www.pokemon.com/us/pokemon-tcg',
    note: 'No public affiliate program confirmed. Keep links plain. Affiliate-ready if a program is later approved.' },
  { id: 'wizards-mtg', name: 'Magic: The Gathering (Wizards of the Coast)', network: 'TBD', status: 'none', kind: 'product',
    officialUrl: 'https://magic.wizards.com/en/products',
    note: 'No public official-shop affiliate program confirmed. Keep links plain. Affiliate-ready if a program is later approved.' },
  { id: 'marvel', name: 'Marvel Comics', network: 'TBD', status: 'dropped', kind: 'product',
    officialUrl: 'https://www.marvel.com/comics/', items: [],
    note: 'DROPPED Nov 25, 2026. Standing rule: no Marvel. The Marvel Comics directory listing was removed. Do not relist or turn tracking on.' },
  { id: 'dc-shop', name: 'DC Shop', network: 'TBD', status: 'none', kind: 'product',
    officialUrl: 'https://shop.dc.com/collections/books',
    note: 'No public affiliate program confirmed. Keep links plain. Affiliate-ready if a program is later approved.' },
  { id: 'backpackers-pantry', name: "Backpacker's Pantry", network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.backpackerspantry.com/',
    items: ['backpackers-pantry-3-day-meal-kit-meat', 'backpackers-pantry-14-day-emergency-kit-meat'] },
  { id: 'byrna', name: 'Byrna', network: 'Impact', status: 'dropped', kind: 'product', officialUrl: 'https://byrna.com/', items: ['byrna-sd-launcher', 'byrna-le-launcher', 'byrna-compact-launcher', 'byrna-tcr', 'byrna-clxl-launcher', 'byrna-duo', 'byrna-mission-4-kit', 'byrna-banshee-alarm'], note: 'Impact marketplace application for account 8245345 was declined (confirmed Nov 21, 2026). The Byrna brand link did not open an apply form. Parked: reapply to Impact in 4–8 weeks with more traffic, and contact Byrna’s affiliate team directly after the site is done. Do not open a second Impact account. Official links stay plain.' },
  { id: 'dji', name: 'DJI', network: 'Direct', status: 'dropped', kind: 'product', ppcAllowed: false, officialUrl: 'https://www.dji.com/', items: [], note: 'DROPPED Nov 25, 2026. Standing rule: do not list DJI. All 16 DJI listings were removed from /directory/drones/ and the rest of the site. Do not relist or turn tracking on. No paid traffic.' },
  { id: 'autel-robotics', name: 'Autel Robotics', network: 'Direct', status: 'dropped', kind: 'product', ppcAllowed: false, officialUrl: 'https://shop.autelrobotics.com/', items: [], note: 'DROPPED Nov 25, 2026. Autel Robotics Co., Ltd. (Shenzhen) was added to the DoD Section 1260H list of Chinese military companies on June 10, 2026 (91 FR 35189), as a military-civil fusion contributor designated a “Little Giant.” Listings were removed from the Drones & Robotics category. Do not relist or turn tracking on. No paid traffic.' },
  { id: 'hoverair', name: 'HOVERAir', network: 'TBD', status: 'pending', kind: 'product', ppcAllowed: false, officialUrl: 'https://hoverair.com/', items: ['hoverair-x1-pro-promax', 'hoverair-aqua', 'hoverair-x1-smart', 'hoverair-x1'], note: 'Application in progress as of Nov 25, 2026 (Awin/ShareASale route, not Impact). Official 5 to 8%, 30-day cookie. Pending, so listings use plain official links and affiliateUrl stays empty (TODO(affiliate)). Maker is Shenzhen Zero Zero Infinity Technology / Zero Zero Robotics (China). Checked Nov 25, 2026: the company is not named on the June 10, 2026 DoD 1260H list or the BIS Entity List. Foreign-produced UAS and critical components are on the FCC Covered List by place of production (Dec 22, 2025), so new models cannot get FCC authorization; do not promise the newest model. The FCC directed that US sales of the Versa cease after its camera authorization was set aside; the Versa card was removed Nov 25, 2026. The other HOVERAir models remain, pending, as plain official links. No paid traffic.' },
  { id: 'robotshop', name: 'RobotShop', network: 'Direct', status: 'pending', kind: 'product', ppcAllowed: false, officialUrl: 'https://www.robotshop.com/', items: ['rs-deep-robotics-lite3-basic-quadruped-robot', 'rs-deep-robotics-lite3-venture-quadruped-robot', 'rs-deep-robotics-lite3-pro-quadruped-robot', 'rs-deep-robotics-lite3-lidar-quadruped-robot'], note: 'Application in progress as of Nov 25, 2026 (UpPromote, in-house). Official 5%, 30-day cookie. Unitree and Dagu stay off. A modest Deep Robotics Lite3 set may appear as bottom-of-page fillers only (not featured, not on the home page); Deep Robotics is not on the June 10, 2026 DoD 1260H list or the Entity List as of Nov 25, 2026. If later approved, do not promote fillers or add listed brands. Not on FlexOffers. No paid traffic.' },
  { id: 'robots-international', name: 'Robots International', network: 'Direct', status: 'approved', kind: 'product', ppcAllowed: false, officialUrl: 'https://www.robotsinternational.com/',
    // Approved Nov 25, 2026, referral code FD9FABE4. Link format from robotsinternational.com/partners/terms/ (2–5%, 90-day cookie): /partners/ref/CODE?to=/product-page
    link: 'https://www.robotsinternational.com/partners/ref/FD9FABE4?to={path}', items: ['ri-fx-navi-embodied-ai-quadruped-robot', 'ri-fx-aegis-ultra-w-wheel-legged-robot-dog', 'ri-fx-aegis-ultra-w-plus', 'ri-fx-aegis-ultra-plus', 'ri-fx-aegis-ultra', 'ri-fx-aegis-pro', 'ri-fx-aegis-quadruped-robot-dog', 'ri-galileo-c1', 'ri-galileo-c1-w', 'ri-pudu-d5-w-wheeled-quadruped-robot', 'ri-pudu-d5-quadruped-robot', 'ri-magiclab-magicdog-quadruped-robot', 'ri-mirrorme-bpx-pro'], note: 'Approved Nov 25, 2026 (referral code FD9FABE4, Affiliate tier; same program as RobotsUSA). Official 2 to 5%, 90-day cookie, US$50 payout minimum, links must be marked sponsored. Main listings are Faraday Future FX Aegis/Navi (US, California). A modest filler set of non-listed Chinese robot dogs (Galileo C1, PUDU, MagicLab, MirrorMe) may appear at the bottom of the Drones & Robotics page only. Unitree (1260H) stays off. Guo Xing, Topsky, Rotunbot, and Dagu stay off. No weaponized robots. No paid traffic.' },
  { id: 'elephant-robotics', name: 'Elephant Robotics', network: 'Direct', status: 'approved', kind: 'product', ppcAllowed: false, officialUrl: 'https://shop.elephantrobotics.com/?ref=joeyt213x',
    // Approved for referrals Nov 25, 2026 (team board). The shop link already carries ref=joeyt213x.
    itemLinks: { 'elephant-robotics-official-shop': 'https://shop.elephantrobotics.com/collections/all?ref=joeyt213x' }, items: ['elephant-robotics-official-shop'], note: 'Partner relationship in progress as of Nov 25, 2026. Official shop URL uses the provided ref=joeyt213x (do not rewrite). Customer-facing personal code is the single PARTNER_REF_CODE (JOSEPHTINDIGLIA today; JOEYT213X pending). Shenzhen Elephant Robotics Technology Co., Ltd. was not named on the June 10, 2026 DoD 1260H list (91 FR 35189) or the BIS Entity List as of Nov 25, 2026. Civilian arms, cobots, and education kits only — not a robot-dog filler lineup and not featured on the home page. Pending, so listings use the plain official shop link and affiliateUrl stays empty (TODO(affiliate)). No paid traffic. Do not add a full product lineup unless asked.' },
  { id: 'skydio', name: 'Skydio', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.skydio.com/', items: ['skydio-official', 'skydio-x10'], note: 'No confirmed public program yet. Official links stay plain.' },
  { id: 'bicycle-cards', name: 'Bicycle Playing Cards', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://bicyclecards.com/' },
  { id: 'us-playing-card', name: 'The United States Playing Card Company', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.usplayingcard.com/' },
  { id: 'theory11', name: 'Theory11', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.theory11.com/' },
  { id: 'hasbro-pulse', name: 'Hasbro Pulse', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://hasbropulse.com/' },


  { id: 'sabre', name: 'SABRE', network: 'Impact', status: 'none', kind: 'product', officialUrl: 'https://www.sabrered.com/',
    items: ['sabre-smart-pepper-spray', 'sabre-mighty-discreet', 'sabre-pepper-spray-alarm-kit', 'sabre-home-defense-launcher'],
    note: 'Impact marketplace application for account 8245345 was declined (confirmed Nov 21, 2026). The SABRE brand link did not open an apply form. Parked: reapply to Impact in 4–8 weeks with more traffic. Do not open a second Impact account. Official links stay plain.' },
  { id: 'reolink', name: 'Reolink', network: 'Awin', status: 'none', kind: 'product', officialUrl: 'https://reolink.com/',
    items: ['reolink-argus-4-pro', 'reolink-video-doorbell-wifi', 'reolink-e1-pro'],
    note: 'Awin program is Germany-only. Skipped Nov 21, 2026; not joinable for us. Official listings stay plain. Do not join a second network for this brand unless terms allow it.' },
  { id: 'eufy', name: 'eufy Security', network: 'Impact', status: 'none', kind: 'product', officialUrl: 'https://www.eufy.com/eufy-local-security',
    items: ['eufy-security'],
    note: 'Impact marketplace application for account 8245345 was declined (confirmed Nov 21, 2026). Parked: reapply in 4–8 weeks with more traffic. Do not open a second Impact account. Official 7–15%, 30-day cookie if later approved. Official links stay plain.' },
  { id: 'cobra', name: 'Cobra Electronics', network: 'Rakuten', status: 'pending', kind: 'product', officialUrl: 'https://www.cobra.com/',
    items: ['cobra-75-allroad', 'cobra-29lx', 'cobra-29ltd', 'cobra-25ltd'],
    note: 'Applied Nov 21, 2026, pending in Rakuten mid 53731. Official links stay plain until approved.' },
  { id: 'vevor', name: 'VEVOR', network: 'Rakuten', status: 'pending', kind: 'product', officialUrl: 'https://www.vevor.com/',
    items: ['vevor-electric-winches', 'vevor-rooftop-tents'],
    note: 'Applied Nov 21, 2026, pending in Rakuten mid 53191. Official links stay plain until approved.' },
  { id: 'wuben', name: 'Wuben', network: 'Awin', status: 'approved', kind: 'product',
    officialUrl: 'https://www.wubenlight.com/',
    link: 'https://www.awin1.com/cread.php?awinmid=92053&awinaffid=3160581&ued={url}',
    items: [
      'wuben-official',
      'wuben-a1',
      'wuben-lightok-x1',
      'wuben-a22',
      'wuben-h1',
      'wuben-e7',
      'wuben-lightok-x2',
      'wuben-c2',
      'wuben-c3',
      'wuben-e12r',
      'wuben-f5',
      'wuben-g5',
      'wuben-x1-pro',
      'wuben-x2-pro',
      'wuben-h4',
      'wuben-lightok-x0',
    ],
    itemLinks: {
      'wuben-official': 'https://www.awin1.com/cread.php?awinmid=92053&awinaffid=3160581',
      'wuben-a1': 'https://www.awin1.com/cread.php?awinmid=92053&awinaffid=3160581&ued=https%3A%2F%2Fwww.wubenlight.com%2Fproducts%2Fwuben-a1-longest-throw-spotlight-flashlight',
      'wuben-lightok-x1': 'https://www.awin1.com/cread.php?awinmid=92053&awinaffid=3160581&ued=https%3A%2F%2Fwww.wubenlight.com%2Fproducts%2Fwuben-x1-small-and-powerful-ecl-flashlight-12000-lumens',
      'wuben-a22': 'https://www.awin1.com/cread.php?awinmid=92053&awinaffid=3160581&ued=https%3A%2F%2Fwww.wubenlight.com%2Fproducts%2Fa22-4500-lumen-high-power-rechargeable-flashlight',
      'wuben-h1': 'https://www.awin1.com/cread.php?awinmid=92053&awinaffid=3160581&ued=https%3A%2F%2Fwww.wubenlight.com%2Fproducts%2Fwuben-h1-super-bright-led-rechargeable-headlamp',
      'wuben-e7': 'https://www.awin1.com/cread.php?awinmid=92053&awinaffid=3160581&ued=https%3A%2F%2Fwww.wubenlight.com%2Fproducts%2Fe7-best-rechargeable-hunting-led-headlamp-1800-lumens',
      'wuben-lightok-x2': 'https://www.awin1.com/cread.php?awinmid=92053&awinaffid=3160581&ued=https%3A%2F%2Fwww.wubenlight.com%2Fproducts%2Flightok-x2-edc-camping-2500-lumens-carry-light-clearance',
      'wuben-c2': 'https://www.awin1.com/cread.php?awinmid=92053&awinaffid=3160581&ued=https%3A%2F%2Fwww.wubenlight.com%2Fproducts%2Fwuben-c2-2000-lumens-flashlight-for-outdoor-needs',
      'wuben-c3': 'https://www.awin1.com/cread.php?awinmid=92053&awinaffid=3160581&ued=https%3A%2F%2Fwww.wubenlight.com%2Fproducts%2Fwuben-c3-1200-lumens-flashlight-for-everyday-carry',
      'wuben-e12r': 'https://www.awin1.com/cread.php?awinmid=92053&awinaffid=3160581&ued=https%3A%2F%2Fwww.wubenlight.com%2Fproducts%2Fwuben-e12r-power-bank-flashlight',
      'wuben-f5': 'https://www.awin1.com/cread.php?awinmid=92053&awinaffid=3160581&ued=https%3A%2F%2Fwww.wubenlight.com%2Fproducts%2Fwuben-f5-power-bank-camping-light',
      'wuben-g5': 'https://www.awin1.com/cread.php?awinmid=92053&awinaffid=3160581&ued=https%3A%2F%2Fwww.wubenlight.com%2Fproducts%2Fwuben-g5-400-lumens-edc-compact-flashlight',
      'wuben-x1-pro': 'https://www.awin1.com/cread.php?awinmid=92053&awinaffid=3160581&ued=https%3A%2F%2Fwww.wubenlight.com%2Fproducts%2Fwuben-x1-pro',
      'wuben-x2-pro': 'https://www.awin1.com/cread.php?awinmid=92053&awinaffid=3160581&ued=https%3A%2F%2Fwww.wubenlight.com%2Fproducts%2Fwuben-x2-pro-1500-lumens-magnetic-edc-tactical-flashlight',
      'wuben-h4': 'https://www.awin1.com/cread.php?awinmid=92053&awinaffid=3160581&ued=https%3A%2F%2Fwww.wubenlight.com%2Fproducts%2Fwuben-h4-rechargeable-hunting-led-headlamp',
      'wuben-lightok-x0': 'https://www.awin1.com/cread.php?awinmid=92053&awinaffid=3160581&ued=https%3A%2F%2Fwww.wubenlight.com%2Fproducts%2Flightok-x0-best-edc-flashlight-1100-lumens',
    },
    note: 'Awin advertiser 92053 (Wubenlight), publisher 3160581, approved Nov 23, 2026. Commission recorded as 10%+ (the earlier application listed 10%; confirm the live rate in Awin if a more precise figure is needed). Contact listed at approval: Alan@wubenlight.com. Cookie length was not recorded. No brand-term PPC information was provided; do not bid on Wuben brand terms until we have written permission. Product URLs and images came from the Awin product feed (F3678) on Nov 23, 2026. Linked from /directory/outdoor/, /directory/safety/, Wuben gear pages, and lighting notes in the winter-storm and power-outage guides. Not featured on the home hero.' },
  { id: 'batteries-plus', name: 'Batteries Plus', network: 'Rakuten', status: 'pending', kind: 'product', officialUrl: 'https://www.batteriesplus.com/',
    items: ['batteries-plus-official'],
    note: 'Applied Nov 21, 2026, pending in Rakuten mid 45126. Official links stay plain until approved.' },
  { id: 'target', name: 'Target', network: 'Impact', status: 'none', kind: 'product', officialUrl: 'https://www.target.com/',
    items: ['target-board-games'],
    note: 'Impact marketplace application for account 8245345 was declined (confirmed Nov 21, 2026). Parked: reapply in 4–8 weeks with more traffic. Do not open a second Impact account. Official 7-day cookie if later approved. Official links stay plain.' },
  { id: 'ems', name: 'Eastern Mountain Sports', network: 'Rakuten', status: 'pending', kind: 'product', officialUrl: 'https://www.ems.com/',
    note: 'Applied Nov 21, 2026, pending in Rakuten mid 53845. No product cards added this pass; tracking stays off until approved.' },

  { id: 'bougerv', name: 'BougeRV', network: 'Awin', status: 'approved', kind: 'product',
    officialUrl: 'https://www.bougerv.com/',
    link: 'https://www.awin1.com/cread.php?awinmid=52765&awinaffid=3160581&ued={url}',
    items: [
      'bougerv-12v-100ah-group24',
      'bougerv-100w-portable-solar-panel',
      'bougerv-200w-portable-solar-panel',
      'bougerv-crd2-43qt-dual-zone',
      'bougerv-sunflow-40a-mppt',
      'bougerv-2000w-12v-inverter',
    ],
    itemLinks: {
      'bougerv-12v-100ah-group24': 'https://www.awin1.com/cread.php?awinmid=52765&awinaffid=3160581&ued=https%3A%2F%2Fwww.bougerv.com%2Fproducts%2F100ah-lifepo4-battery',
      'bougerv-100w-portable-solar-panel': 'https://www.awin1.com/cread.php?awinmid=52765&awinaffid=3160581&ued=https%3A%2F%2Fwww.bougerv.com%2Fproducts%2F100w-portable-solar-panel',
      'bougerv-200w-portable-solar-panel': 'https://www.awin1.com/cread.php?awinmid=52765&awinaffid=3160581&ued=https%3A%2F%2Fwww.bougerv.com%2Fproducts%2F200w-portable-solar-panel',
      'bougerv-crd2-43qt-dual-zone': 'https://www.awin1.com/cread.php?awinmid=52765&awinaffid=3160581&ued=https%3A%2F%2Fwww.bougerv.com%2Fproducts%2Fdual-zone-portable-fridge-freezer',
      'bougerv-sunflow-40a-mppt': 'https://www.awin1.com/cread.php?awinmid=52765&awinaffid=3160581&ued=https%3A%2F%2Fwww.bougerv.com%2Fproducts%2Fsunflow-40a-mppt-solar-charge-controller',
      'bougerv-2000w-12v-inverter': 'https://www.awin1.com/cread.php?awinmid=52765&awinaffid=3160581&ued=https%3A%2F%2Fwww.bougerv.com%2Fproducts%2F2000w-12v-pure-sine-wave-inverter-with-bluetooth',
    },
    note: 'Awin advertiser 52765, publisher 3160581; membership active Nov 26, 2026 (Awin email). Product deep links checked Nov 27, 2026: each lands on the matching bougerv.com product page with the Awin awc parameter. Commission and cookie: confirm in the Awin profile. No brand-term paid search until terms are read.' },
  { id: 'imalent', name: 'IMALENT', network: 'Awin', status: 'pending', kind: 'product',
    officialUrl: 'https://www.imalent.com/',
    note: 'Applied Nov 21, 2026, pending in Awin at 10%. Official links stay plain until approved.' },
  { id: 'xtar', name: 'XTAR', network: 'Awin', status: 'pending', kind: 'product',
    officialUrl: 'https://www.xtarlight.com/',
    note: 'Applied Nov 21, 2026, pending in Awin at 10%. Official links stay plain until approved.' },
  { id: 'nilight', name: 'Nilight', network: 'Awin', status: 'pending', kind: 'product',
    note: 'Applied Nov 21, 2026, pending in Awin at 12%. Official links stay plain until approved.' },
  { id: 'outdoor-master', name: 'OutdoorMaster', network: 'Awin', status: 'pending', kind: 'product',
    note: 'Applied Nov 21, 2026, pending in Awin at 15%. Official links stay plain until approved.' },
  { id: 'roaring-fire-gear', name: 'Roaring Fire Gear', network: 'Awin', status: 'dropped', kind: 'product',
    note: 'DROPPED Nov 27, 2026 (not approved); no cards. Was: applied Nov 21, 2026, pending in Awin at 10%. Official links stay plain until approved.' },
  { id: 'nova-safety', name: 'Nova Safety Tools', network: 'Awin', status: 'pending', kind: 'product',
    note: 'Applied Nov 21, 2026, pending in Awin at 8%. Official links stay plain until approved.' },
  { id: 'natures-generator', name: "Nature's Generator", network: 'Awin', status: 'pending', kind: 'product',
    note: 'Applied Nov 21, 2026, pending in Awin at 5%. Portable power; stay off the home page. Official links stay plain until approved.' },
  { id: 'powermarket', name: 'Powermarket', network: 'Rakuten', status: 'pending', kind: 'product',
    note: 'Applied Nov 21, 2026, pending in Rakuten mid 53433. Official links stay plain until approved.' },
];

// ---------------------------------------------------------------------------

const live = (p: Program) => p.status === 'approved' || p.status === 'live';

/** True when the program is live/approved and may emit a tracked link. */
export function isProgramLive(programId: string | undefined | null): boolean {
  if (!programId) return false;
  const p = programs.find((x) => x.id === programId);
  return !!p && live(p);
}

/** Tracked template from `link` or `url` (either field is enough). */
function trackingTemplate(p: Program): string {
  return (p.link || p.url || '').trim();
}

/** CJ deep link. With an AID uses click-PID-AID?url=; otherwise CJ's deep-link generator. */
/**
 * CJ advertisers whose `click-<pid>-<aid>?url=` links drop the deep link and land on the homepage
 * (verified Nov 25, 2026: ALLPOWERS). They keep the destination with CJ's `/links/<pid>/type/dlg/<url>` form.
 */
const CJ_DLG_ONLY_AIDS = new Set(['17227114']);

export function cjLink(productUrl: string, aid = ''): string {
  return aid && !CJ_DLG_ONLY_AIDS.has(aid)
    ? `https://www.anrdoezrs.net/click-${CJ_PID}-${aid}?url=${encodeURIComponent(productUrl)}`
    : `https://www.anrdoezrs.net/links/${CJ_PID}/type/dlg/${productUrl}`;
}

/** Build a tracked link for a destination URL, or '' if the program isn't ready. */
export function buildLink(p: Program, destination: string): string {
  if (!live(p)) return '';
  if (p.network === 'Amazon') return amazonLink(destination);
  const template = trackingTemplate(p);
  if (template) {
    return template.includes('{url}') || template.includes('{rawurl}')
      ? template.replace('{url}', encodeURIComponent(destination)).replace('{rawurl}', destination)
      : template.includes('{path}')
        ? template.replace('{path}', (() => { try { const u = new URL(destination); return u.pathname + u.search; } catch { return '/'; } })())
        : template;
  }
  if (p.network === 'CJ') return cjLink(destination, p.cjAid);
  return '';
}


/**
 * Programs that bar paid-search / PPC promotion. During an rgh_paid_search
 * session, FunnelGuards hides every card or link for these ids (and matching
 * official / tracking URLs). They stay fully visible on ordinary organic visits.
 * Prefer setting `ppcAllowed: false` on the program as well; isPpcAllowed()
 * and noPpcProgramIds() honor both this list and the per-program flag.
 */
export const NO_PPC_PROGRAM_IDS = ['choice-home-warranty', 'redi', 'waterdrop', 'tidewe', 'bogs', 'robotshop', 'robots-international', 'autel-robotics', 'hoverair', 'elephant-robotics', 'amazon'] as const;

/** Paid-search allowed for this program? Default true unless listed or ppcAllowed is false. */
export function isPpcAllowed(programId: string | undefined | null): boolean {
  if (!programId) return true;
  const p = programs.find((x) => x.id === programId);
  if (p && typeof p.ppcAllowed === 'boolean') return p.ppcAllowed;
  return !(NO_PPC_PROGRAM_IDS as readonly string[]).includes(programId);
}

export function isNoPpcProgram(id: string | undefined | null): boolean {
  return !!id && !isPpcAllowed(id);
}

/** Ids FunnelGuards should hide in a paid-search session (list + ppcAllowed: false). */
export function noPpcProgramIds(): string[] {
  const ids = new Set<string>(NO_PPC_PROGRAM_IDS);
  for (const p of programs) {
    if (p.ppcAllowed === false) ids.add(p.id);
  }
  return [...ids];
}

export type OutboundLink = { href: string; affiliate: boolean; programId: string };

/**
 * Single outbound-link helper. Live/approved programs with a tracking URL become
 * tracked links (caller should set rel="sponsored nofollow noopener" and
 * data-program). Status "none" or "pending", missing tracking URLs, and
 * entries with no program id stay on the plain destination — no sponsored
 * label, no tracking. Government and free-resource entries must pass no
 * programId so they can never flip.
 */
export function resolveOutbound(programId: string | undefined, destination: string, entryId?: string): OutboundLink {
  const id = programId || '';
  // Any amazon.com destination always carries our tag, whichever program (or none) the entry names.
  if (isAmazonUrl(destination)) return { href: amazonLink(destination), affiliate: true, programId: id || 'amazon' };
  if (!id) return { href: destination, affiliate: false, programId: '' };
  const p = programs.find((x) => x.id === id);
  if (p && live(p) && entryId && p.itemLinks?.[entryId]) {
    return { href: p.itemLinks[entryId], affiliate: true, programId: id };
  }
  const tracked = p ? buildLink(p, destination) : '';
  return { href: tracked || destination, affiliate: Boolean(tracked), programId: id };
}

/** Listing buy-button resolver. A manual affiliateUrl in the markdown wins; otherwise the program helper. */
export function resolveItemOutbound(itemId: string, officialUrl: string, affiliateUrl?: string): OutboundLink {
  const programId = programIdForItem(itemId);
  if (isAmazonUrl(affiliateUrl)) return { href: amazonLink(affiliateUrl as string), affiliate: true, programId: 'amazon' };
  if (affiliateUrl) return { href: affiliateUrl, affiliate: true, programId };
  if (isAmazonUrl(officialUrl)) return { href: amazonLink(officialUrl), affiliate: true, programId: 'amazon' };
  const fromProgram = trackedItemLink(itemId, officialUrl);
  if (fromProgram) return { href: fromProgram, affiliate: true, programId };
  return { href: officialUrl, affiliate: false, programId };
}

/** Program id for a listing (approved match first, else first none/pending), or ''. */
export function programIdForItem(itemId: string): string {
  let pending = '';
  for (const p of programs) {
    if (p.kind !== 'product') continue;
    const match = !!(p.itemLinks?.[itemId] || p.items?.includes(itemId) || p.retailerUrls?.[itemId]);
    if (!match) continue;
    if (live(p)) return p.id;
    if (!pending) pending = p.id;
  }
  return pending;
}

/** Tracked link for a listing, or '' to keep the plain official URL. */
export function trackedItemLink(itemId: string, officialUrl: string): string {
  for (const p of programs) {
    if (!live(p) || p.kind !== 'product') continue;
    if (p.itemLinks?.[itemId]) return p.itemLinks[itemId];
    if (p.items?.includes(itemId)) { const l = buildLink(p, officialUrl); if (l) return l; }
    const r = p.retailerUrls?.[itemId];
    if (r) { const l = buildLink(p, r); if (l) return l; }
  }
  return '';
}

export type LeadCta = { id: string; url: string; title: string; blurb: string; button: string; name: string; preview?: boolean };

/**
 * Lead boxes for a place (guide slug, 'tool:<slug>' or 'project:<section id>'), max `max` (default 2).
 * Only approved/live programs with a tracking link show. `preview` (build-time PUBLIC_PREVIEW_LEADS=1,
 * never on in production) also shows boxes for programs still `pending`, flagged `preview: true`
 * and without a link, so layouts can be tested. It never changes a program's status.
 */
export function leadCtasFor(place: string, max = 2, preview = false): LeadCta[] {
  return programs
    .filter((p) => p.kind === 'lead' && p.lead && p.lead.places.includes(place)
      && ((live(p) && trackingTemplate(p)) || (preview && p.status === 'pending')))
    .slice(0, max)
    .map((p) => {
      const ready = live(p) && !!trackingTemplate(p);
      // A {url} deep-link template (used to track outside citations) resolves to the program's own site for its box.
      return { id: p.id, url: ready ? buildLink(p, p.officialUrl ?? '') : '', name: p.name, preview: !ready, ...p.lead! };
    });
}
