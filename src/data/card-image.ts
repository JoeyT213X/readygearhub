/**
 * One place to pick the picture for a gear card or gear page.
 * 1. An official product photo from an affiliate-network feed or the brand (product-photos.ts).
 * 2. Otherwise a licensed stock photo (Unsplash or Pexels, self-hosted) chosen by category,
 *    always labeled "Representative photo" (stock-covers.ts).
 * Sources and licenses for every file: /IMAGE_CREDITS.md and /docs/image-manifest.json.
 */
import { productPhotoFor, photoBackdropClass } from './product-photos';
import { stockCoverFor, cover } from './stock-covers';

/** Licensed stock photos with an alternate shot, so a row of similar listings is not one repeated picture. */
const ALTERNATES: Record<string, string> = { 'stock-winter-boots': 'stock-winter-boots-2' };
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

export type CardImage = {
  src: string;
  srcset: string;
  alt: string;
  representative: boolean;
  backdrop: string;
};

type ItemLike = { id: string; data: { name: string; brand: string; lane: string; tags?: string[] } };

export function cardImageFor(item: ItemLike): CardImage | undefined {
  const d = item.data;
  const photo = productPhotoFor({ id: item.id });
  if (photo) {
    return {
      src: photo.src,
      srcset: photo.srcset,
      alt: photo.alt,
      representative: false,
      backdrop: photoBackdropClass({ id: item.id, name: d.name, brand: d.brand, tags: d.tags }),
    };
  }
  let stock = stockCoverFor({ id: item.id, title: d.name, sourceName: d.brand, kind: 'product' });
  if (!stock) return undefined;
  const alt = ALTERNATES[stock.key];
  if (alt && hash(item.id) % 2 === 1) stock = cover(alt);
  return { src: stock.src, srcset: stock.srcset, alt: stock.alt, representative: true, backdrop: '' };
}

type EntryLike = { id: string; name: string; category?: string };

/** Directory "official page" entries (brands, retailers, services) on /gear/ and /gear/tech/. */
export function entryImageFor(e: EntryLike): CardImage | undefined {
  const stock = stockCoverFor({ id: e.id, title: e.name, category: e.category, kind: 'product' });
  if (!stock) return undefined;
  return { src: stock.src, srcset: stock.srcset, alt: stock.alt, representative: true, backdrop: '' };
}
