import kitsRaw from '../data/kits.json';

export type KitItemRef = { slug: string; reason: string };
export type Kit = {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  items: KitItemRef[];
};

export const kits: Kit[] = kitsRaw as Kit[];
export const kitBySlug = (slug: string) => kits.find((k) => k.slug === slug);
