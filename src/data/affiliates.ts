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
  | 'AvantLink' | 'ShareASale' | 'Direct' | 'TBD';

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
  { id: 'choice-home-warranty', name: 'Choice Home Warranty', network: 'CJ', status: 'pending', kind: 'lead', link: '',
    lead: { title: 'Worried about a furnace or water heater failing mid-storm?',
      blurb: 'A home warranty can cover repair or replacement of major systems and appliances. Get a free quote and read the coverage terms before you buy.',
      button: 'Get a free home warranty quote',
      places: ['how-to-keep-pipes-from-freezing', 'heat-one-room-safely-in-an-outage', 'how-to-stay-warm-without-power'] } },
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
