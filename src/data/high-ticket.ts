/**
 * Official high-ticket directory listings (drones, vehicles, shelters, robots).
 *
 * These are official manufacturer or shop pages only. There is no approved
 * partner program for these brands yet, so `affiliateUrl` is null and the
 * card uses `fallbackUrl` as a plain official link (rel=noopener).
 *
 * Upgrade later: paste a verified tracked URL into `affiliateUrl`. Never
 * invent tracking links, prices, or ratings. Do not attach a stock photo
 * that could be mistaken for a branded product (especially Boston Dynamics).
 * The Ghost Robotics Vision 60 photograph is a U.S. Army public-domain
 * image and is used only on that listing.
 */
import type { CatalogItem } from './full-catalog';
import type { SourceCategoryId, SourceGroupId } from './source-directory';

export type HighTicketItem = {
  id: string;
  title: string;
  blurb: string;
  sourceName: string;
  category: SourceCategoryId;
  alsoIn?: SourceCategoryId[];
  groups: SourceGroupId[];
  affiliateUrl: string | null;
  fallbackUrl: string;
  image?: string;
  imageKind?: 'photo' | 'banner' | 'logo';
  offerLabel?: string;
  cta?: string;
};

export const highTicketItems: HighTicketItem[] = [
  // ---- Drones ----
  {
    id: 'dji-official',
    title: 'DJI official store',
    blurb: 'Official DJI site for current consumer and enterprise drones, accessories, and support. Check the official page for models, local rules, and pricing. We don’t have a partner program with this brand yet.',
    sourceName: 'DJI',
    category: 'drones',
    alsoIn: ['tech'],
    groups: ['power-tech'],
    affiliateUrl: null,
    fallbackUrl: 'https://www.dji.com/',
    image: '/directory/covers/drone.svg',
    offerLabel: 'Official shop',
    cta: 'Visit official site',
  },
  {
    id: 'autel-robotics-official',
    title: 'Autel Robotics official shop',
    blurb: 'Official Autel Robotics shop for current drone models and accessories. See the official page for specs, availability, and price. We don’t have a partner program with this brand yet.',
    sourceName: 'Autel Robotics',
    category: 'drones',
    alsoIn: ['tech'],
    groups: ['power-tech'],
    affiliateUrl: null,
    fallbackUrl: 'https://shop.autelrobotics.com/',
    image: '/directory/covers/drone.svg',
    offerLabel: 'Official shop',
    cta: 'Visit official shop',
  },
  {
    id: 'skydio-official',
    title: 'Skydio official site',
    blurb: 'Official Skydio site for current autonomous drone platforms and programs. Check the official page for models and how to inquire. We don’t have a partner program with this brand yet.',
    sourceName: 'Skydio',
    category: 'drones',
    alsoIn: ['tech'],
    groups: ['power-tech'],
    affiliateUrl: null,
    fallbackUrl: 'https://www.skydio.com/',
    image: '/directory/covers/drone.svg',
    offerLabel: 'Official site',
    cta: 'Visit official site',
  },

  // ---- Vehicles ----
  {
    id: 'rezvani-official',
    title: 'Rezvani Motors official site',
    blurb: 'Official Rezvani site for current custom and tactical vehicle programs. Configuration, availability, and pricing are on the official site. We don’t have a partner program with this brand yet.',
    sourceName: 'Rezvani Motors',
    category: 'vehicles',
    alsoIn: ['auto'],
    groups: ['outdoor-auto'],
    affiliateUrl: null,
    fallbackUrl: 'https://www.rezvanimotors.com/',
    image: '/directory/covers/vehicle.svg',
    offerLabel: 'Official site',
    cta: 'Visit official site',
  },
  {
    id: 'inkas-official',
    title: 'INKAS Armored official site',
    blurb: 'Official INKAS site for factory armored vehicles. Specifications, lead times, and how to inquire are on the official site. We don’t have a partner program with this brand yet.',
    sourceName: 'INKAS Armored',
    category: 'vehicles',
    alsoIn: ['auto'],
    groups: ['outdoor-auto'],
    affiliateUrl: null,
    fallbackUrl: 'https://inkasarmored.com/',
    image: '/directory/covers/vehicle.svg',
    offerLabel: 'Official site',
    cta: 'Visit official site',
  },
  {
    id: 'earthroamer-official',
    title: 'EarthRoamer official site',
    blurb: 'Official EarthRoamer site for expedition vehicles. Models, build options, and pricing are on the official site. We don’t have a partner program with this brand yet.',
    sourceName: 'EarthRoamer',
    category: 'vehicles',
    alsoIn: ['auto', 'outdoor'],
    groups: ['outdoor-auto'],
    affiliateUrl: null,
    fallbackUrl: 'https://earthroamer.com/',
    image: '/directory/covers/vehicle.svg',
    offerLabel: 'Official site',
    cta: 'Visit official site',
  },
  {
    id: 'storyteller-overland-official',
    title: 'Storyteller Overland official site',
    blurb: 'Official Storyteller Overland site, including the GXV overland vehicle line. Current models and pricing are on the official site. We don’t have a partner program with this brand yet.',
    sourceName: 'Storyteller Overland',
    category: 'vehicles',
    alsoIn: ['auto', 'outdoor'],
    groups: ['outdoor-auto'],
    affiliateUrl: null,
    fallbackUrl: 'https://www.storytelleroverland.com/',
    image: '/directory/covers/vehicle.svg',
    offerLabel: 'Official site',
    cta: 'Visit official site',
  },
  {
    id: 'polaris-official',
    title: 'Polaris official site',
    blurb: 'Official Polaris site for current off-road and side-by-side vehicles. Check the official page for models, dealers, and pricing. We don’t have a partner program with this brand yet.',
    sourceName: 'Polaris',
    category: 'vehicles',
    alsoIn: ['auto', 'outdoor'],
    groups: ['outdoor-auto'],
    affiliateUrl: null,
    fallbackUrl: 'https://www.polaris.com/en-us/',
    image: '/directory/covers/vehicle.svg',
    offerLabel: 'Official site',
    cta: 'Visit official site',
  },
  {
    id: 'can-am-official',
    title: 'Can-Am official site',
    blurb: 'Official Can-Am (BRP) site for current off-road and side-by-side vehicles. Check the official page for models, dealers, and pricing. We don’t have a partner program with this brand yet.',
    sourceName: 'Can-Am',
    category: 'vehicles',
    alsoIn: ['auto', 'outdoor'],
    groups: ['outdoor-auto'],
    affiliateUrl: null,
    fallbackUrl: 'https://can-am.brp.com/us/en/',
    image: '/directory/covers/vehicle.svg',
    offerLabel: 'Official site',
    cta: 'Visit official site',
  },

  // ---- Shelters ----
  {
    id: 'atlas-survival-shelters-official',
    title: 'Atlas Survival Shelters official site',
    blurb: 'Official Atlas Survival Shelters site for current shelter models. Specifications, lead times, and pricing are on the official site. We don’t have a partner program with this brand yet.',
    sourceName: 'Atlas Survival Shelters',
    category: 'security',
    alsoIn: ['safety'],
    groups: ['safety-prep'],
    affiliateUrl: null,
    fallbackUrl: 'https://atlassurvivalshelters.com/',
    image: '/directory/covers/shelter.svg',
    offerLabel: 'Official site',
    cta: 'Visit official site',
  },
  {
    id: 'rising-s-bunkers-official',
    title: 'Rising S Bunkers official site',
    blurb: 'Official Rising S Bunkers site for current shelter models. Specifications, lead times, and pricing are on the official site. We don’t have a partner program with this brand yet.',
    sourceName: 'Rising S Bunkers',
    category: 'security',
    alsoIn: ['safety'],
    groups: ['safety-prep'],
    affiliateUrl: null,
    fallbackUrl: 'https://risingsbunkers.com/',
    image: '/directory/covers/shelter.svg',
    offerLabel: 'Official site',
    cta: 'Visit official site',
  },
  {
    id: 'terra-vivos-official',
    title: 'Terra Vivos official site',
    blurb: 'Official Terra Vivos (Vivos) site for community and private shelter programs. Availability and how to inquire are on the official site. We don’t have a partner program with this brand yet.',
    sourceName: 'Terra Vivos',
    category: 'security',
    alsoIn: ['safety'],
    groups: ['safety-prep'],
    affiliateUrl: null,
    fallbackUrl: 'https://terravivos.com/',
    image: '/directory/covers/shelter.svg',
    offerLabel: 'Official site',
    cta: 'Visit official site',
  },

  // ---- Robots ----
  {
    id: 'unitree-official',
    title: 'Unitree official site',
    blurb: 'Official Unitree site for current robotics platforms. See the official page for models and how to inquire. The cover on this card is an original illustration, not a product photograph. We don’t have a partner program with this brand yet.',
    sourceName: 'Unitree',
    category: 'security',
    alsoIn: ['tech'],
    groups: ['safety-prep', 'power-tech'],
    affiliateUrl: null,
    fallbackUrl: 'https://www.unitree.com/',
    image: '/directory/covers/robot.svg',
    offerLabel: 'Official site',
    cta: 'Visit official site',
  },
  {
    id: 'boston-dynamics-official',
    title: 'Boston Dynamics official site',
    blurb: 'Official Boston Dynamics site for current robotics platforms. See the official page for products and how to inquire. The cover on this card is an original illustration, not a product photograph. We don’t have a partner program with this company yet.',
    sourceName: 'Boston Dynamics',
    category: 'security',
    alsoIn: ['tech'],
    groups: ['safety-prep', 'power-tech'],
    affiliateUrl: null,
    fallbackUrl: 'https://bostondynamics.com/',
    image: '/directory/covers/robot.svg',
    offerLabel: 'Official site',
    cta: 'Visit official site',
  },
  {
    id: 'ghost-robotics-official',
    title: 'Ghost Robotics official site',
    blurb: 'Official Ghost Robotics site. The photograph shows a Ghost Robotics Vision 60 (also marked Civitas) at BSDA 2024, taken by a U.S. Army photographer and released as a public-domain image. See the official site for current platforms and how to inquire. We don’t have a partner program with this brand yet.',
    sourceName: 'Ghost Robotics',
    category: 'security',
    alsoIn: ['tech'],
    groups: ['safety-prep', 'power-tech'],
    affiliateUrl: null,
    fallbackUrl: 'https://www.ghostrobotics.io/',
    image: '/images/photos/hero-security-robot-960.webp',
    imageKind: 'photo',
    offerLabel: 'Official site',
    cta: 'Visit official site',
  },
  {
    id: 'knightscope-official',
    title: 'Knightscope official site',
    blurb: 'Official Knightscope site for autonomous security robots. See the official page for current platforms and how to inquire. The cover on this card is an original illustration, not a product photograph. We don’t have a partner program with this brand yet.',
    sourceName: 'Knightscope',
    category: 'security',
    alsoIn: ['tech'],
    groups: ['safety-prep', 'power-tech'],
    affiliateUrl: null,
    fallbackUrl: 'https://knightscope.com/',
    image: '/directory/covers/robot.svg',
    offerLabel: 'Official site',
    cta: 'Visit official site',
  },
];

export function highTicketToCatalogItem(item: HighTicketItem): CatalogItem {
  const href = (item.affiliateUrl && item.affiliateUrl.trim()) || item.fallbackUrl;
  const affiliate = Boolean(item.affiliateUrl && item.affiliateUrl.trim());
  return {
    id: item.id,
    title: item.title,
    blurb: item.blurb,
    sourceName: item.sourceName,
    href,
    rel: affiliate ? 'sponsored nofollow noopener' : 'noopener',
    affiliate,
    hideOnPaid: false,
    programId: '',
    category: item.category,
    alsoIn: item.alsoIn,
    image: item.image,
    imageKind: item.imageKind,
    priceLabel: 'See official site',
    offerLabel: item.offerLabel || 'Official site',
    ctaLabel: item.cta || 'Visit official site',
    groups: item.groups,
    kind: 'brand',
    origin: 'directory',
  };
}

export function highTicketCatalogItems(): CatalogItem[] {
  return highTicketItems.map(highTicketToCatalogItem);
}
