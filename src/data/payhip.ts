/**
 * ReadyGearHub digital products sold through Payhip.
 *
 * Thursday setup: after each PDF is uploaded at https://payhip.com/,
 * paste the product ID (the short code from the buy-button snippet or
 * the https://payhip.com/b/XXXX URL) into `productId`. Leave it as an
 * empty string until then. Buy buttons show "Coming soon" and the
 * Payhip overlay script is not loaded until at least one ID is filled.
 */
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
};

export const payhipProducts: PayhipProduct[] = [
  {
    slug: 'family-emergency-binder',
    title: 'Family Emergency Binder (Fillable PDF)',
    price: '$13.47',
    priceAmount: '13.47',
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
    productId: '',
    image: '/shop/family-emergency-binder.png',
    related: [
      { href: '/winter-storm-ready-checklist/', label: 'Free winter storm checklist' },
      { href: '/guides/winter-emergency-kit-for-elderly-parents/', label: 'Emergency kit for elderly parents' },
      { href: '/guides/storm-first-aid-kit/', label: 'Storm first aid kit' },
    ],
  },
  {
    slug: 'winter-storm-prep-planner',
    title: 'Winter Storm Prep Planner',
    price: '$8.73',
    priceAmount: '8.73',
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
    productId: '',
    image: '/shop/winter-storm-prep-planner.png',
    related: [
      { href: '/winter-storm-ready-checklist/', label: 'Free winter storm checklist' },
      { href: '/guides/winter-power-outage-checklist/', label: 'Winter power outage checklist' },
      { href: '/guides/how-to-stay-warm-without-power/', label: 'How to stay warm without power' },
    ],
  },
  {
    slug: 'homestead-prep-starter-guide',
    title: 'Homestead Prep Starter Guide',
    price: '$17.86',
    priceAmount: '17.86',
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
    productId: '',
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
