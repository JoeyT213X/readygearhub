/**
 * TAKEN DOWN from the public site (November 23, 2026). Do not re-add shop
 * pages or catalog cards until Joseph asks. These Payhip listings should be
 * unpublished in the Payhip dashboard (this repo does not touch the account):
 *
 *   family-emergency-binder        ZwvsR   $5   https://payhip.com/b/ZwvsR
 *   winter-storm-prep-planner      x7iZ2   $5   https://payhip.com/b/x7iZ2
 *   homestead-prep-starter-guide   wc9Ez   $5   https://payhip.com/b/wc9Ez
 *   complete-prep-bundle           kRx6L  $10   https://payhip.com/b/kRx6L
 *
 */

/**
 * ReadyGearHub digital products sold through Payhip.
 *
 * 1-LINE SWAPS live in the constants below. Pages under /shop/, /thank-you/,
 * and /winter-storm-ready-checklist/ read these values — do not hardcode
 * product IDs or prices in those templates.
 *
 * To swap any product ID or price later, change the matching constant below
 * and rebuild. Buy buttons show "Coming soon" and the Payhip overlay script
 * is not loaded until at least one ID is filled.
 *
 *   family-emergency-binder        ZwvsR   $5   https://payhip.com/b/ZwvsR
 *   winter-storm-prep-planner      x7iZ2   $5   https://payhip.com/b/x7iZ2
 *   homestead-prep-starter-guide   wc9Ez   $5   https://payhip.com/b/wc9Ez
 *   complete-prep-bundle           kRx6L  $10   https://payhip.com/b/kRx6L
 *     (Guest-checkout digital ZIP: all three guides plus both free quick-reference
 *     sheets packed together for easy printing.)
 */

/** Single-line bundle Payhip ID (guest-checkout complete-prep-bundle.zip). */
export const PAYHIP_BUNDLE_ID = 'kRx6L';
export const PAYHIP_BINDER_ID = 'ZwvsR';
export const PAYHIP_PLANNER_ID = 'x7iZ2';
export const PAYHIP_HOMESTEAD_ID = 'wc9Ez';

export const PAYHIP_GUIDE_PRICE = '$5';
export const PAYHIP_GUIDE_PRICE_AMOUNT = '5.00';
export const PAYHIP_BUNDLE_PRICE = '$10';
export const PAYHIP_BUNDLE_PRICE_AMOUNT = '10.00';

export function payhipUrl(productId: string): string {
  return productId ? `https://payhip.com/b/${productId}` : '';
}
export type PayhipProduct = {
  slug: string;
  title: string;
  price: string;
  priceAmount: string;
  description: string;
  summary: string;
  includes: string[];
  productId: string;
  image: string;
  related: { href: string; label: string }[];
  /** Optional page-by-page preview shown on the product page. */
  preview?: { title: string; note: string }[];
  /** Optional short, honest FAQ shown on the product page. */
  faq?: { q: string; a: string }[];
  /** Show the calm free-guide / reminder signup box on the product page. */
  freeSignup?: boolean;
};

export const payhipProducts: PayhipProduct[] = [

  {
    slug: 'complete-prep-bundle',
    title: 'Complete Storm & Family Prep Bundle',
    price: PAYHIP_BUNDLE_PRICE,
    priceAmount: PAYHIP_BUNDLE_PRICE_AMOUNT,
    description:
      'The three ReadyGearHub print-at-home guides together: the Family Emergency Binder, the Winter Storm Prep Planner, and the Homestead Prep Starter Guide. A simple way to keep the household plan, the week-before-the-ice countdown, and the rural or well-water starter in one download.',
    summary:
      'The Family Emergency Binder, Winter Storm Prep Planner, and Homestead Prep Starter Guide, together as a print-at-home set.',
    includes: [
      'Family Emergency Binder — 12-page fillable household plan',
      'Winter Storm Prep Planner — 10-page seven-day countdown for the week before the ice',
      'Homestead Prep Starter Guide — 10-page starter for a farm, cabin, or house on a well',
      'Both free quick-reference sheets packed in for easy printing (Outage Food-Safety Chart + Emergency Contacts & Shut-Offs Sheet)',
      'Instant ZIP download after checkout, through Payhip',
      'Personal-use license; print as many household copies as you need',
    ],
    productId: PAYHIP_BUNDLE_ID,
    image: '/shop/complete-prep-bundle.png',
    freeSignup: true,
    related: [
      { href: '/shop/family-emergency-binder/', label: `Family Emergency Binder on its own (${PAYHIP_GUIDE_PRICE})` },
      { href: '/shop/winter-storm-prep-planner/', label: `Winter Storm Prep Planner on its own (${PAYHIP_GUIDE_PRICE})` },
      { href: '/shop/homestead-prep-starter-guide/', label: `Homestead Prep Starter Guide on its own (${PAYHIP_GUIDE_PRICE})` },
      { href: '/winter-storm-ready-checklist/', label: 'Free winter storm checklist' },
    ],
  },
  {
    slug: 'family-emergency-binder',
    title: 'Family Emergency Binder (Fillable PDF)',
    price: PAYHIP_GUIDE_PRICE,
    priceAmount: PAYHIP_GUIDE_PRICE_AMOUNT,
    description:
      'A fillable US Letter household plan for the people, numbers, medicines, shut-offs, and meeting places Ready.gov already tells families to write down — plus a supply checklist and a documents list. Type into the fields in a regular PDF reader, or print the pages and fill them by hand.',
    summary:
      'A fillable US Letter household plan for people, numbers, medicines, shut-offs, and meeting places. Type into the fields or print and fill by hand.',
    includes: [
      '12-page US Letter fillable PDF, with AcroForm fields you can type into and print',
      'Household, contacts, medical, insurance, utilities, evacuation, pets, supply checklist, and documents pages',
      'U.S. 911 and Poison Help (1-800-222-1222) pre-printed; all local numbers are left for you to look up',
      'Carbon monoxide and generator safety notes from Ready.gov and the CDC',
      'Personal-use license; print as many household copies as you need',
    ],
    productId: PAYHIP_BINDER_ID,
    image: '/shop/family-emergency-binder.png',
    preview: [
      { title: 'Cover and page index', note: 'What is inside and how to print it.' },
      { title: 'How to use this binder', note: 'Fill it in now, keep a paper copy, review it once a year.' },
      { title: 'Household information', note: 'Address, everyone who lives there, and access or language notes.' },
      { title: 'Emergency contacts', note: '911 and Poison Help pre-printed; room for your local numbers and an out-of-town contact.' },
      { title: 'Medical information', note: 'Conditions, medicines, allergies, doctors, and pharmacy for each person.' },
      { title: 'Insurance, work, and records', note: 'Policy numbers and who to call, without sensitive account details.' },
      { title: 'Home utilities and shut-offs', note: 'Where the water, gas, and electric shut-offs are, and the outage lines.' },
      { title: 'Evacuation and shelter-in-place', note: 'Meeting places, routes, and a go-bag list.' },
      { title: 'Pets and service animals', note: 'Food, medicines, vet, and papers to bring.' },
      { title: 'Emergency supply checklist', note: 'A starter kit based on Ready.gov that you can tick off.' },
      { title: 'Documents to copy', note: 'Which papers to copy and where the copies live.' },
      { title: 'Annual review and notes', note: 'A simple yearly check so the binder stays current.' },
    ],
    faq: [
      { q: 'Can I type into it, or do I have to print it?', a: 'Either. The fields can be typed in most PDF readers (Adobe Acrobat Reader, Preview on Mac, most phone PDF apps), then printed. Or print it blank and fill it in by hand.' },
      { q: 'Is anything about my family sent to ReadyGearHub?', a: 'No. It is a regular PDF file on your own device. Nothing you type is uploaded or seen by us.' },
      { q: 'Does it replace official alerts or 911?', a: 'No. It is a planning and reference tool. In a life-threatening emergency, call 911 or your local emergency number.' },
      { q: 'Can I print copies for the whole household?', a: 'Yes. The personal-use license lets you print as many copies as your household needs, for example one for the fridge and one for a go-bag.' },
      { q: 'What if it is not right for me?', a: 'Start with the free printable checklist below, or the free All Accounted app. If something in the binder is wrong or unclear, write to us from the contact page and we will help. If a file is broken or does not work as described, we give a full refund or a replacement; see the refund policy. Change-of-mind refunds after a working download are not offered.' },
    ],
    freeSignup: true,
    related: [
      { href: '/winter-storm-ready-checklist/', label: 'Free winter storm checklist' },
      { href: '/apps/all-accounted/', label: 'All Accounted: free household check-in app' },
      { href: '/guides/winter-emergency-kit-for-elderly-parents/', label: 'Emergency kit for elderly parents' },
      { href: '/guides/storm-first-aid-kit/', label: 'Storm first aid kit' },
    ],
  },
  {
    slug: 'winter-storm-prep-planner',
    title: 'Winter Storm Prep Planner',
    price: PAYHIP_GUIDE_PRICE,
    priceAmount: PAYHIP_GUIDE_PRICE_AMOUNT,
    description:
      'A seven-day countdown for the week before the ice: water and food, the house and the pipes, the car and cash, the kit and the contacts, then a one-room warmth plan for the outage itself. Checklists and food-safety times are taken from Ready.gov, the CDC, and FoodSafety.gov.',
    summary:
      'A seven-day countdown for the week before the ice, with checklists and food-safety times from Ready.gov, the CDC, and FoodSafety.gov.',
    includes: [
      '10-page US Letter printable planner',
      'Seven-day pre-storm countdown, winterization checklist, and a supplies list',
      'One-room warmth plan with carbon monoxide and space-heater rules',
      'Outage log and after-the-storm food-safety and recovery page',
      'Written contacts and check-in plan, plus a sources page you can keep',
    ],
    productId: PAYHIP_PLANNER_ID,
    image: '/shop/winter-storm-prep-planner.png',
    related: [
      { href: '/winter-storm-ready-checklist/', label: 'Free winter storm checklist' },
      { href: '/apps/cold-hold/', label: 'Cold Hold: free fridge and freezer temperature log' },
      { href: '/tools/kit-builder/', label: 'Free emergency kit builder' },
    ],
  },
  {
    slug: 'homestead-prep-starter-guide',
    title: 'Homestead Prep Starter Guide',
    price: PAYHIP_GUIDE_PRICE,
    priceAmount: PAYHIP_GUIDE_PRICE_AMOUNT,
    description:
      'A practical sequence for a farm, a cabin, or a house on a well: stored water, indoor-safe battery power, outdoor-only generators, food that does not need the fridge, heat without carbon monoxide, communications, animals, and a storm-day order of operations. Every safety number is cited to Ready.gov, the CDC, or FoodSafety.gov.',
    summary:
      'A practical sequence for a farm, cabin, or house on a well: water when the pump is dark, indoor-safe power, outdoor-only generators, and a storm-day order of operations.',
    includes: [
      '10-page US Letter practical guide, with lined form fields for your own property notes',
      'Water when the pump is dark, food-safety times during an outage, and a realistic power plan',
      'Generator, camp-stove, and heater rules stated the way Ready.gov and the CDC state them',
      'Communications, driveway and tree safety, animals, and a storm-day sequence',
      'A sources page so you can go back to the official guidance yourself',
    ],
    productId: PAYHIP_HOMESTEAD_ID,
    image: '/shop/homestead-prep-starter-guide.png',
    related: [
      { href: '/guides/emergency-water-storage/', label: 'Emergency water storage' },
      { href: '/guides/generator-vs-power-station/', label: 'Generator vs. power station' },
      { href: '/kits/', label: 'Storm kits' },
    ],
  },
];

export function hasPayhipId(product: PayhipProduct): boolean {
  return product.productId.trim().length > 0;
}

export function anyPayhipReady(products: PayhipProduct[] = payhipProducts): boolean {
  return products.some(hasPayhipId);
}

export function productBySlug(slug: string): PayhipProduct | undefined {
  return payhipProducts.find((p) => p.slug === slug);
}
