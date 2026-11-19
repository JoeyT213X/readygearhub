/**
 * ReadyGearHub affiliate programs — the ONE place to turn on tracked links.
 *
 * HOW TO ACTIVATE A PROGRAM (see /workspace/AFFILIATE_LINKS_HOWTO.md):
 *   1. Find the program below by `id`.
 *   2. Set `status: 'approved'`.
 *   3. Fill ONE of:
 *        - CJ programs:   `cjAid` (the AID number from any CJ link for that advertiser),
 *                         or leave it '' to use CJ's deep-link generator (PID only).
 *        - other networks: `link` — a deep-link template with {url} where the
 *                         encoded product URL goes (e.g. Impact: https://x.sjv.io/c/123/456/789?u={url}),
 *                         or a plain tracked URL (no {url}) to send every click to one page.
 *        - lead programs:  `link` = the tracked landing URL from the network.
 *      Optional: `itemLinks` to paste an exact tracked link for one listing.
 *   4. Commit and push. Matching listings switch to the tracked link with
 *      rel="sponsored nofollow"; lead boxes appear on the guides listed in `lead.places`.
 *
 * Until then everything stays on the plain retailer URL and lead boxes stay hidden.
 * No secrets live here — tracking IDs are public by design (they appear in every link).
 */

export const CJ_PID = '101929817';

export type Network =
  | 'CJ' | 'Impact' | 'Awin' | 'Partnerize' | 'FlexOffers' | 'Refersion'
  | 'AvantLink' | 'ShareASale' | 'Rakuten' | 'Amazon' | 'Direct' | 'TBD';

export type Program = {
  id: string;
  name: string;
  network: Network;
  status: 'pending' | 'approved';
  /** product = swaps listing buy links; lead = pay-per-lead CTA box; text = no slots yet */
  kind: 'product' | 'lead' | 'text';
  /** Listings (src/content/items/<id>.md) this program applies to. */
  items?: string[];
  /** Retailer programs: the product page at THAT retailer for a listing (itemId -> URL). */
  retailerUrls?: Record<string, string>;
  /** Deep-link template ({url} = encoded product URL, {rawurl} = unencoded) or a fixed tracked URL. */
  link?: string;
  /** CJ only: AID of any link from this advertiser (optional). */
  cjAid?: string;
  /** Exact tracked link per listing; wins over everything else. */
  itemLinks?: Record<string, string>;
  /** Lead CTA box (kind: 'lead'). `places` are guide slugs or 'tool:<slug>'. */
  lead?: { title: string; blurb: string; button: string; places: string[] };
  note?: string;
};

export const programs: Program[] = [
  // ---- Brand programs: listings switch automatically once approved ----
  { id: 'ecoflow', name: 'EcoFlow', network: 'TBD', status: 'pending', kind: 'product',
    items: ['ecoflow-400w-portable-solar-panel', 'ecoflow-delta-3-plus', 'ecoflow-glacier-classic', 'ecoflow-river-3-plus'] },
  { id: 'bluetti', name: 'BLUETTI', network: 'TBD', status: 'pending', kind: 'product',
    items: ['bluetti-200w-solar-panel', 'bluetti-ac180', 'bluetti-ac70'] },
  { id: 'jackery', name: 'Jackery', network: 'TBD', status: 'pending', kind: 'product',
    items: ['jackery-explorer-1000-plus', 'jackery-explorer-300-v2', 'jackery-solarsaga-100-prime', 'jackery-solarsaga-200'] },
  { id: 'anker-solix', name: 'Anker SOLIX', network: 'Impact', status: 'pending', kind: 'product',
    items: ['anker-solix-c1000x', 'anker-solix-f2000', 'anker-prime-power-bank-20k-220w'] },
  { id: 'goal-zero', name: 'Goal Zero', network: 'Partnerize', status: 'pending', kind: 'product',
    items: ['goal-zero-lighthouse-600', 'goal-zero-nomad-100-plus', 'goal-zero-nomad-50', 'goal-zero-yeti-1500'] },
  { id: 'renogy', name: 'Renogy', network: 'Impact', status: 'pending', kind: 'product', items: ['renogy-100w-12v-solar-kit'] },
  { id: 'biolite', name: 'BioLite', network: 'Partnerize', status: 'pending', kind: 'product', items: ['biolite-alpenglow-500'] },
  { id: 'leatherman', name: 'Leatherman', network: 'Partnerize', status: 'pending', kind: 'product', items: ['leatherman-wave-plus'] },
  { id: 'lifestraw', name: 'LifeStraw', network: 'Impact', status: 'pending', kind: 'product',
    items: ['lifestraw-family', 'lifestraw-personal', 'lifestraw-straw-emergency-pack'] },
  { id: 'readywise', name: 'ReadyWise', network: 'CJ', status: 'pending', kind: 'product', cjAid: '',
    items: ['readywise-4-week-food-supply', 'readywise-5-day-survival-backpack', 'readywise-72-hour-food-kit'] },
  { id: 'midland', name: 'Midland Radio', network: 'Impact', status: 'pending', kind: 'product',
    items: ['midland-er310-crank-radio', 'midland-wr400'] },
  { id: 'garmin', name: 'Garmin', network: 'Impact', status: 'pending', kind: 'product', items: ['garmin-inreach-mini-2'] },
  { id: 'mountain-house', name: 'Mountain House', network: 'FlexOffers', status: 'pending', kind: 'product', items: ['mountain-house-classic-bucket'] },
  { id: 'grayl', name: 'GRAYL', network: 'AvantLink', status: 'pending', kind: 'product', items: ['grayl-geopress-24oz', 'grayl-ultrapress-16-9oz'] },
  { id: 'mymedic', name: 'MyMedic', network: 'AvantLink', status: 'pending', kind: 'product', items: ['mymedic-myfak'] },
  { id: 'fenix', name: 'Fenix Lighting', network: 'AvantLink', status: 'pending', kind: 'product', items: ['fenix-hm65r-v2'] },

  // ---- Retailer programs: fill retailerUrls with the product page at that store ----
  { id: 'walmart', name: 'Walmart', network: 'Impact', status: 'pending', kind: 'product', retailerUrls: {} },
  { id: 'home-depot', name: 'The Home Depot', network: 'Impact', status: 'pending', kind: 'product', retailerUrls: {} },
  { id: 'bass-pro', name: 'Bass Pro Shops', network: 'Impact', status: 'pending', kind: 'product', retailerUrls: {} },
  { id: 'cabelas', name: "Cabela's", network: 'Impact', status: 'pending', kind: 'product', retailerUrls: {} },
  { id: 'academy', name: 'Academy Sports + Outdoors', network: 'CJ', status: 'pending', kind: 'product', cjAid: '', retailerUrls: {} },
  { id: 'sportsmans', name: "Sportsman's Warehouse", network: 'Impact', status: 'pending', kind: 'product', retailerUrls: {} },
  { id: 'berkey', name: 'The Berkey', network: 'Refersion', status: 'pending', kind: 'product', retailerUrls: {},
    note: 'No Berkey listing yet; add one, then list it here.' },

  // ---- Programs with no listing slot yet (use in new listings/guides later) ----
  { id: 'hunter-boots', name: 'Hunter Boots', network: 'CJ', status: 'pending', kind: 'text', cjAid: '' },
  { id: 'magid', name: 'Magid Glove & Safety', network: 'CJ', status: 'pending', kind: 'text', cjAid: '' },
  { id: '1password', name: '1Password', network: 'CJ', status: 'pending', kind: 'text', cjAid: '' },

  // ---- Pay-per-lead CTA boxes (hidden until approved + link filled) ----
  { id: 'energysage', name: 'EnergySage', network: 'CJ', status: 'pending', kind: 'lead', link: '',
    lead: { title: 'Thinking about solar plus battery backup?',
      blurb: 'EnergySage lets you compare quotes from pre-screened local installers for free, with no obligation to buy.',
      button: 'Compare free solar quotes',
      places: ['generator-vs-power-station', 'how-to-pick-a-portable-power-station', 'winter-power-outage-checklist', 'tool:solar-sizer', 'tool:power-sizer'] } },
  { id: 'choice-home-warranty', name: 'Choice Home Warranty', network: 'CJ', status: 'approved', kind: 'lead', link: 'https://www.dpbolvw.net/click-101929817-12337172',
    note: 'CJ advertiser CID 4593144; $20/lead homeowners; no search bidding.',
    lead: { title: 'Worried about a furnace or water heater failing mid-storm?',
      blurb: 'A home warranty is a paid monthly or yearly plan that can cover repair or replacement of major systems and appliances. Check the price and read the coverage terms before you sign up.',
      button: 'See home warranty plans and prices',
      places: ['how-to-keep-pipes-from-freezing', 'heat-one-room-safely-in-an-outage', 'how-to-stay-warm-without-power', 'winter-power-outage-checklist', 'ice-storm-prep-checklist-south'] } },
  { id: 'modernize', name: 'Modernize', network: 'Direct', status: 'pending', kind: 'lead', link: '',
    lead: { title: 'Need a contractor after the storm?',
      blurb: 'Modernize matches you with local pros for roofing, generators, and home repairs. Free, no-obligation quotes.',
      button: 'Get free contractor quotes',
      places: ['ice-storm-prep-checklist-south', 'ice-storm-survival-checklist-for-the-south', 'power-outage-ice-storm-mississippi', 'generator-vs-power-station'] } },
  { id: 'networx', name: 'Networx', network: 'Direct', status: 'pending', kind: 'lead', link: '',
    lead: { title: 'Storm damage or frozen-pipe repairs?',
      blurb: 'Networx connects you with screened local contractors and plumbers. Compare free quotes before you hire.',
      button: 'Find a local pro',
      places: ['how-to-keep-pipes-from-freezing', 'ice-storm-survival-checklist-for-the-south', 'power-outage-ice-storm-mississippi'] } },
  { id: 'leaffilter', name: 'LeafFilter', network: 'Impact', status: 'pending', kind: 'lead', link: '',
    lead: { title: 'Ice dams and clogged gutters?',
      blurb: 'LeafFilter offers a free gutter-protection estimate at your home.',
      button: 'Get a free gutter estimate',
      places: ['ice-storm-prep-checklist-south'] } },
  { id: 'hiscox', name: 'Hiscox Small Business Insurance', network: 'CJ', status: 'pending', kind: 'lead', link: '',
    note: 'CJ advertiser CID 4165310; pays per completed quote.',
    lead: { title: 'Run a small business from home or a shop?',
      blurb: 'Hiscox offers small-business insurance quotes online in minutes. Check what covers storm-related interruptions before you need it.',
      button: 'Get a small-business insurance quote',
      places: ['power-outage-ice-storm-mississippi'] } },

  // ---- Added for tonight's signup wave (launch-prep); all stay pending until approved + link filled ----
  { id: 'sportsmans-guide', name: "Sportsman's Guide", network: 'CJ', status: 'pending', kind: 'product', cjAid: '', retailerUrls: {},
    note: 'Official page: 5% on most sales, 2% on guns & ammo. Do not promote firearms or ammo. Join only one of their programs (CJ, not also AvantLink).' },
  { id: 'allpowers', name: 'ALLPOWERS', network: 'CJ', status: 'pending', kind: 'product', cjAid: '',
    note: 'CJ advertiser CID 7797916. Also listed on Awin and AvantLink; apply inside the existing CJ account first.' },
  { id: 'dicks', name: "DICK'S Sporting Goods", network: 'CJ', status: 'pending', kind: 'product', cjAid: '', retailerUrls: {} },
  { id: 'surfshark', name: 'Surfshark', network: 'CJ', status: 'approved', kind: 'text', link: 'https://www.dpbolvw.net/click-101929817-15438560',
    note: 'CJ advertiser CID 6282055. Official page: 40% of new sales, 30-day cookie, $100 minimum. Approved in CJ; stays hidden until a tracked link is filled. Also listed on Impact and Awin — do not join a second network for this advertiser.' },
  { id: 'liberty-mutual', name: 'Liberty Mutual', network: 'CJ', status: 'pending', kind: 'lead', link: '',
    note: 'Official payouts: $10 home, $10 auto, $3 renters per completed quote. Apply inside CJ.',
    lead: { title: 'Need a home or auto insurance checkup after a freeze or storm?',
      blurb: 'Liberty Mutual lets you complete a home, auto, or renters quote online. Compare coverage for storm and freeze damage before you need a claim.',
      button: 'Get a free insurance quote',
      places: ['how-to-keep-pipes-from-freezing', 'winter-power-outage-checklist', 'winter-car-emergency-kit'] } },
  { id: 'survival-frog', name: 'Survival Frog', network: 'Awin', status: 'pending', kind: 'product',
    note: '12%, 30-day cookie. Wants survival or outdoor sites. Shipping to the USA only.' },
  { id: 'legacy-food', name: 'Legacy Food Storage', network: 'Awin', status: 'pending', kind: 'product',
    note: '10% (up to 15%), 30-day cookie. Coupon sites get 1% only.' },
  { id: 'olight', name: 'Olight USA', network: 'Awin', status: 'pending', kind: 'product',
    note: '10%, 30-day cookie. Flashlights and EDC lighting.' },
  { id: 'nitecore', name: 'NITECORE Store', network: 'Awin', status: 'pending', kind: 'product',
    note: '10% content / 5% coupon, 30-day cookie.' },
  { id: 'pecron', name: 'PECRON', network: 'Direct', status: 'pending', kind: 'product',
    note: 'Up to 10%, 15-day cookie. Portable power stations. Direct via Affiliatly.' },
  { id: 'btech', name: 'BTECH (Baofeng)', network: 'Direct', status: 'pending', kind: 'product',
    note: '5–10% tiered, manual approval.' },
  { id: 'mighty-generators', name: 'Mighty Generators', network: 'Direct', status: 'pending', kind: 'product',
    note: '3%, 60-day cookie. Hand-reviewed. Excludes home standby and commercial generators.' },
  { id: 'berkey-filter', name: 'Berkey Water Filter', network: 'Direct', status: 'pending', kind: 'product', retailerUrls: {},
    note: 'Different retailer than TheBerkey.com (Refersion). Previously published 5%, 30-day cookie, $50 minimum.' },
  { id: 'cove', name: 'Cove Smart Home Security', network: 'FlexOffers', status: 'pending', kind: 'text',
    note: '8%, 30-day cookie on FlexOffers. Sale commission, not a form-fill CPL.' },
  { id: 'acurite', name: 'AcuRite', network: 'FlexOffers', status: 'pending', kind: 'product',
    note: '6%, 45-day cookie. Weather stations.' },
  { id: 'ring', name: 'Ring', network: 'Impact', status: 'pending', kind: 'product',
    note: 'Apply in Impact once the existing account is approved. Official range 4–8%, 30-day cookie; confirm at apply.' },
  { id: 'yeti', name: 'YETI', network: 'Impact', status: 'pending', kind: 'product',
    note: 'Apply in Impact once the existing account is approved.' },
  { id: 'carhartt', name: 'Carhartt', network: 'Impact', status: 'pending', kind: 'product',
    note: 'Apply in Impact once the existing account is approved.' },
  { id: 'ace-hardware', name: 'Ace Hardware', network: 'Impact', status: 'pending', kind: 'product', retailerUrls: {},
    note: 'Apply in Impact once the existing account is approved.' },
  { id: 'mira-safety', name: 'MIRA Safety', network: 'AvantLink', status: 'pending', kind: 'product',
    note: 'Up to 10%, 30-day cookie. Save the AvantLink apply for after the network account is open.' },
  { id: 'bluecosmo', name: 'BlueCosmo ZOLEO', network: 'AvantLink', status: 'pending', kind: 'product',
    note: '10%, 90-day cookie, ZOLEO-branded products only.' },
  { id: 'angi', name: 'Angi', network: 'CJ', status: 'pending', kind: 'lead', link: '',
    note: 'CJ advertiser CID 7439025. Payout not public. Phone, link, and API leads. Do not lean on this as a primary offer.',
    lead: { title: 'Need a local pro for storm repairs?',
      blurb: 'Angi helps you find local contractors for roofing, plumbing, and home repairs. Compare options before you hire.',
      button: 'Find a local contractor',
      places: ['ice-storm-prep-checklist-south', 'ice-storm-survival-checklist-for-the-south'] } },
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
  { id: 'aquasana', name: 'Aquasana', network: 'Rakuten', status: 'pending', kind: 'product',
    note: 'Official page: commissions starting at 10%, $300+ average order, 30-day cookie. Join Rakuten Advertising (LinkShare), then apply.' },
  { id: 'amazon', name: 'Amazon Associates', network: 'Amazon', status: 'pending', kind: 'product', retailerUrls: {},
    note: 'Catch-all retailer for listings without a brand program. Official page: up to 10% depending on category. Paid ~60 days after month end.' },
  { id: 'mailerlite-referral', name: 'MailerLite', network: 'Direct', status: 'pending', kind: 'text',
    note: '30% lifetime on paid plans, 45-day cookie, Trackdesk. $100 and 2 unique sales before payout. Already a MailerLite customer.' },
  { id: 'nordvpn', name: 'NordVPN', network: 'CJ', status: 'approved', kind: 'text', link: 'https://www.anrdoezrs.net/click-101929817-12814518',
    note: 'CJ advertiser CID 4837117. Official page: 100% on a 1-month plan, 40% on 1- or 2-year, 30% on renewals, 30-day cookie. Approved in CJ; stays hidden until a tracked link is filled.' },
  { id: 'expressvpn', name: 'ExpressVPN', network: 'CJ', status: 'pending', kind: 'text',
    note: 'CJ advertiser CID 5577978. Rate is shown after apply. For a future privacy or comms guide.' },
  { id: 'proton', name: 'Proton', network: 'Direct', status: 'pending', kind: 'text',
    note: 'Official partners page: 30–100% by product and plan (VPN monthly new subs 100%; many others 30–40%), plus renewal share on some plans.' },
  { id: 'nordpass', name: 'NordPass', network: 'CJ', status: 'approved', kind: 'text', link: 'https://www.dpbolvw.net/click-101929817-13868703',
    note: 'CJ advertiser CID 5324242. Approved in CJ; stays hidden until a tracked link is filled. May also be covered by the NordVPN program.' },
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
    note: 'CJ advertiser CID 5975700.' },
  { id: 'roboform', name: 'RoboForm', network: 'CJ', status: 'pending', kind: 'text',
    note: 'CJ advertiser CID 5258939. Password manager; for a future privacy or comms guide.' },
];

// ---------------------------------------------------------------------------

const live = (p: Program) => p.status === 'approved';

/** CJ deep link. With an AID uses click-PID-AID?url=; otherwise CJ's deep-link generator. */
export function cjLink(productUrl: string, aid = ''): string {
  return aid
    ? `https://www.anrdoezrs.net/click-${CJ_PID}-${aid}?url=${encodeURIComponent(productUrl)}`
    : `https://www.anrdoezrs.net/links/${CJ_PID}/type/dlg/${productUrl}`;
}

/** Build a tracked link for a destination URL, or '' if the program isn't ready. */
export function buildLink(p: Program, destination: string): string {
  if (!live(p)) return '';
  if (p.link) {
    return p.link.includes('{url}') || p.link.includes('{rawurl}')
      ? p.link.replace('{url}', encodeURIComponent(destination)).replace('{rawurl}', destination)
      : p.link;
  }
  if (p.network === 'CJ') return cjLink(destination, p.cjAid);
  return '';
}

/** Program id for a listing (approved match first, else first pending), or ''. */
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

export type LeadCta = { id: string; url: string; title: string; blurb: string; button: string; name: string };

/** Approved lead boxes for a place (guide slug or 'tool:<slug>'), max 2. */
export function leadCtasFor(place: string, max = 2): LeadCta[] {
  return programs
    .filter((p) => p.kind === 'lead' && live(p) && p.link && p.lead?.places.includes(place))
    .slice(0, max)
    .map((p) => ({ id: p.id, url: p.link!, name: p.name, ...p.lead! }));
}
