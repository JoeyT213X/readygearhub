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
 * (currently Choice Home Warranty, REDI, and Waterdrop Filter). FunnelGuards hides
 * those cards and links during an rgh_paid_search session; they stay visible on
 * ordinary organic visits. Omit the field or set it true when paid search is allowed
 * under the site Paid Advertising Policy. Use isPpcAllowed(id) and isProgramLive(id).
 *
 * No secrets live here — tracking IDs are public by design (they appear in every link).
 */

export const CJ_PID = '101929817';

export type Network =
  | 'CJ' | 'Impact' | 'Awin' | 'Partnerize' | 'FlexOffers' | 'Refersion' | 'GoAffPro'
  | 'AvantLink' | 'ShareASale' | 'Rakuten' | 'Amazon' | 'Direct' | 'TBD';

export type Program = {
  id: string;
  name: string;
  network: Network;
  /**
   * none = not applied; pending = applied, waiting;
   * live (or the equivalent approved) = tracked links are on.
   */
  status: 'none' | 'pending' | 'approved' | 'live';
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
    items: ['bluetti-200w-solar-panel', 'bluetti-ac180', 'bluetti-ac70'],
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
      'anker-solix-ps400',
      'anker-solix-ps100',
      'anker-solix-c2000-gen2-400w-kit',
      'anker-solix-f3800-plus',
      'anker-solix-f3800',
      'anker-solix-c1000x',
      'anker-solix-f2000',
      'anker-solix-c1000x-gen2',
      'anker-solix-c2000-gen2',
    ],
    itemLinks: {
      'anker-solix': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=53552&murl=https%3A%2F%2Fwww.ankersolix.com%2F',
      'anker-solix-ps400': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=53552&murl=https%3A%2F%2Fwww.ankersolix.com%2Fproducts%2Fps400-bifacial-portable-solar-panel',
      'anker-solix-ps100': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=53552&murl=https%3A%2F%2Fwww.ankersolix.com%2Fproducts%2F100w-bifacial-portable-solar-panel',
      'anker-solix-c2000-gen2-400w-kit': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=53552&murl=https%3A%2F%2Fwww.ankersolix.com%2Fproducts%2Fc2000-gen2-400w-solar-panel',
      'anker-solix-f3800-plus': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=53552&murl=https%3A%2F%2Fwww.ankersolix.com%2Fproducts%2Ff3800-plus',
      'anker-solix-c1000x': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=53552&murl=https%3A%2F%2Fwww.ankersolix.com%2Fproducts%2Fa1761111',
      'anker-solix-c1000x-gen2': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=53552&murl=https%3A%2F%2Fwww.ankersolix.com%2Fc1000-gen2',
      'anker-solix-c2000-gen2': 'https://click.linksynergy.com/deeplink?id=j8aaZmp7txc&mid=53552&murl=https%3A%2F%2Fwww.ankersolix.com%2Fproducts%2Fc2000-gen2',
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
      'litime': 'https://www.awin1.com/cread.php?awinmid=71451&awinaffid=3160581',
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
    note: 'Refersion 15%, 365-day cookie. Official retailer TheBerkey.com. Linked from /gear/ (water) and /gear/tech/ (water filters).' },
  { id: 'waterdrop', name: 'Waterdrop Filter', network: 'Rakuten', status: 'approved', kind: 'product', ppcAllowed: false,
    officialUrl: 'https://www.waterdropfilter.com/',
    link: 'https://click.linksynergy.com/fs-bin/click?id=j8aaZmp7txc&offerid=1888875&type=3&subid=0',
    note: 'Rakuten, approved Nov 19, 2026. Linked from /gear/ (water) and /gear/tech/.' },
  { id: 'redi', name: 'REDI', network: 'GoAffPro', status: 'approved', kind: 'product', ppcAllowed: false,
    officialUrl: 'https://getredi.com/',
    link: 'https://getredi.com/?ref=JOSEPHTINDIGLIA',
    note: 'GoAffPro 10%, 30-day cookie. Emergency and readiness kits. Linked from /gear/ (kits).' },

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
      places: ['ice-storm-prep-checklist-south', 'ice-storm-survival-checklist-for-the-south', 'power-outage-ice-storm-mississippi', 'generator-vs-power-station'] } },
  { id: 'networx', name: 'Networx', network: 'Direct', status: 'pending', kind: 'lead', link: '',
    lead: { title: 'Storm damage or frozen-pipe repairs?',
      blurb: 'Networx connects you with screened local contractors and plumbers. Compare free quotes before you hire.',
      button: 'Find a local pro',
      places: ['how-to-keep-pipes-from-freezing', 'ice-storm-survival-checklist-for-the-south', 'power-outage-ice-storm-mississippi'] } },
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
  { id: 'survival-frog', name: 'Survival Frog', network: 'Awin', status: 'pending', kind: 'product', officialUrl: 'https://www.survivalfrog.com/collections/n-camping',
    items: ['survival-frog', 'survival-frog-beef-canned-meat'],
    note: 'Applied Nov 21, 2026, pending in Awin. Official 12%, 30-day cookie. USA shipping only. Official food product pages stay plain until approved; confirm food is in-program before a tracked food deep link.' },
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
  { id: 'aquasana', name: 'Aquasana', network: 'Rakuten', status: 'approved', kind: 'product',
    officialUrl: 'https://www.aquasana.com/',
    link: 'https://click.linksynergy.com/fs-bin/click?id=j8aaZmp7txc&offerid=1108576.10001627&type=3&subid=0',
    itemLinks: {
      'aquasana-whole-house': 'https://click.linksynergy.com/fs-bin/click?id=j8aaZmp7txc&offerid=1108576.10002524&type=3&subid=0',
      'aquasana-under-sink': 'https://click.linksynergy.com/fs-bin/click?id=j8aaZmp7txc&offerid=1108576.10001416&type=3&subid=0',
    },
    note: 'Rakuten MID 36667, publisher SID 4780263, 0-10% tiered last-click commission, approved Nov 20, 2026. Homepage, whole-house, and under-sink tracking URLs verified from the portal. Shower link was not verified and was skipped. Linked from /gear/ (water), /gear/tech/ (water filters), and /guides/emergency-water-storage/.' },
  { id: 'amazon', name: 'Amazon Associates', network: 'Amazon', status: 'pending', kind: 'product', retailerUrls: {},
    note: 'Catch-all retailer for listings without a brand program. Official page: up to 10% depending on category. Paid ~60 days after month end.' },
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
  { id: 'crutchfield', name: 'Crutchfield', network: 'Rakuten', status: 'pending', kind: 'product',
    officialUrl: 'https://www.crutchfield.com/', items: ['crutchfield'],
    note: 'Already pending on Rakuten (SID 4780263) as of Nov 21, 2026. Do not re-apply. Tracking stays off until approved with a tracking URL.' },
  { id: 'tcgplayer', name: 'TCGplayer', network: 'Impact', status: 'none', kind: 'product',
    officialUrl: 'https://www.tcgplayer.com/',
    note: 'Parked Nov 21, 2026: Impact marketplace application for account 8245345 was declined. Brand apply is not available until a later reapply (plan: 4–8 weeks, with more traffic). Do not open a second Impact account. Official links stay plain.' },
  { id: 'ebay', name: 'eBay Partner Network', network: 'Direct', status: 'none', kind: 'product',
    officialUrl: 'https://www.ebay.com/b/Collectible-Card-Games-Accessories/2536/bn_1852210',
    note: 'eBay Partner Network. Use non-sport and collectible card-game pages only; do not promote sports cards. Not applied yet. Directory links stay plain until flipped to approved with a tracking URL.' },
  { id: 'pokemon-tcg', name: 'Pokémon TCG', network: 'TBD', status: 'none', kind: 'product',
    officialUrl: 'https://www.pokemon.com/us/pokemon-tcg',
    note: 'No public affiliate program confirmed. Keep links plain. Affiliate-ready if a program is later approved.' },
  { id: 'wizards-mtg', name: 'Magic: The Gathering (Wizards of the Coast)', network: 'TBD', status: 'none', kind: 'product',
    officialUrl: 'https://magic.wizards.com/en/products',
    note: 'No public official-shop affiliate program confirmed. Keep links plain. Affiliate-ready if a program is later approved.' },
  { id: 'marvel', name: 'Marvel Comics', network: 'TBD', status: 'none', kind: 'product',
    officialUrl: 'https://www.marvel.com/comics/',
    note: 'No public affiliate program confirmed. Do not link Marvel Unlimited (service is ending). Keep links plain. Affiliate-ready if a program is later approved.' },
  { id: 'dc-shop', name: 'DC Shop', network: 'TBD', status: 'none', kind: 'product',
    officialUrl: 'https://shop.dc.com/collections/books',
    note: 'No public affiliate program confirmed. Keep links plain. Affiliate-ready if a program is later approved.' },
  { id: 'backpackers-pantry', name: "Backpacker's Pantry", network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://www.backpackerspantry.com/',
    items: ['backpackers-pantry-3-day-meal-kit-meat', 'backpackers-pantry-14-day-emergency-kit-meat'] },
  { id: 'byrna', name: 'Byrna', network: 'Impact', status: 'none', kind: 'product', officialUrl: 'https://byrna.com/', items: ['byrna-sd-launcher', 'byrna-le-launcher', 'byrna-compact-launcher', 'byrna-tcr', 'byrna-clxl-launcher', 'byrna-duo', 'byrna-mission-4-kit', 'byrna-banshee-alarm'], note: 'Impact marketplace application for account 8245345 was declined (confirmed Nov 21, 2026). The Byrna brand link did not open an apply form. Parked: reapply to Impact in 4–8 weeks with more traffic, and contact Byrna’s affiliate team directly after the site is done. Do not open a second Impact account. Official links stay plain.' },
  { id: 'dji', name: 'DJI', network: 'Direct', status: 'pending', kind: 'product', officialUrl: 'https://www.dji.com/', items: ['dji-official', 'dji-mini-4-pro', 'dji-air-3s', 'dji-neo', 'dji-avata-2', 'dji-mini-3', 'dji-mavic-3-pro', 'dji-flip', 'dji-mini-4k', 'dji-air-3', 'dji-mavic-3-classic', 'dji-avata', 'dji-inspire-3'], note: 'Account created, email verified, and affiliate application submitted Nov 21, 2026, about 6:06 PM America/Chicago. Awaiting review. Official 2% drones / 5% handhelds, 30-day cookie. No SEM or DJI-keyword ads. Separate from DJI USA on Impact. Tracking stays off until approved.' },
  { id: 'autel-robotics', name: 'Autel Robotics', network: 'Direct', status: 'none', kind: 'product', officialUrl: 'https://www.autelrobotics.com/', items: ['autel-robotics-official', 'autel-evo-lite-enterprise', 'autel-evo-max-4t', 'autel-evo-nano-series'], note: 'Not accepting registrations as of Nov 21, 2026. Official listings stay plain.' },
  { id: 'hoverair', name: 'HOVERAir', network: 'TBD', status: 'none', kind: 'product', officialUrl: 'https://hoverair.com/', items: ['hoverair-x1', 'hoverair-x1-pro-promax', 'hoverair-versa'], note: 'No confirmed public program yet. Official links stay plain; record the items so a tracking URL can swap in later if a program is approved.' },
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
  { id: 'roaring-fire-gear', name: 'Roaring Fire Gear', network: 'Awin', status: 'pending', kind: 'product',
    note: 'Applied Nov 21, 2026, pending in Awin at 10%. Official links stay plain until approved.' },
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
export function cjLink(productUrl: string, aid = ''): string {
  return aid
    ? `https://www.anrdoezrs.net/click-${CJ_PID}-${aid}?url=${encodeURIComponent(productUrl)}`
    : `https://www.anrdoezrs.net/links/${CJ_PID}/type/dlg/${productUrl}`;
}

/** Build a tracked link for a destination URL, or '' if the program isn't ready. */
export function buildLink(p: Program, destination: string): string {
  if (!live(p)) return '';
  const template = trackingTemplate(p);
  if (template) {
    return template.includes('{url}') || template.includes('{rawurl}')
      ? template.replace('{url}', encodeURIComponent(destination)).replace('{rawurl}', destination)
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
export const NO_PPC_PROGRAM_IDS = ['choice-home-warranty', 'redi', 'waterdrop'] as const;

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
  if (affiliateUrl) return { href: affiliateUrl, affiliate: true, programId };
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

export type LeadCta = { id: string; url: string; title: string; blurb: string; button: string; name: string };

/** Approved lead boxes for a place (guide slug or 'tool:<slug>'), max 2. */
export function leadCtasFor(place: string, max = 2): LeadCta[] {
  return programs
    .filter((p) => p.kind === 'lead' && live(p) && trackingTemplate(p) && p.lead?.places.includes(place))
    .slice(0, max)
    .map((p) => ({ id: p.id, url: trackingTemplate(p), name: p.name, ...p.lead! }));
}
