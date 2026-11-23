/**
 * Optional extra official photos and product URLs for Full Source Directory cards.
 *
 * When Joseph’s affiliate creative CSV lands at
 * `/workspace/rgh-redesign/directory-images/more/products.csv`, map each
 * validated, self-hosted image and (if applicable) official URL into this
 * list. Do not hotlink. Do not invent tracking links or prices.
 *
 * `officialUrl` is applied only when the matching listing already has a
 * program with an existing deep-link method (a CJ `{url}` template, a
 * Rakuten/buildLink template, or an `itemLinks` entry). If that wrap is not
 * possible, the official URL is ignored and the listing keeps its current link.
 */
export type CatalogExtra = {
  /** Existing source-directory, gear, or /gear/ directory entry id. */
  id: string;
  /** Self-hosted path such as `/directory/photos/example.webp`. */
  image?: string;
  imageKind?: 'photo' | 'banner' | 'logo';
  credit?: string;
  officialUrl?: string;
};

export const catalogExtras: CatalogExtra[] = [
  {
    id: 'anker-solix-c1000x',
    image: '/directory/photos/anker-solix-c1000x-960.webp',
    imageKind: 'photo',
    credit: 'Official Anker SOLIX product photo from Rakuten MID 53552, Nov 23, 2026.',
  },
];

export const catalogExtraById: Record<string, CatalogExtra> = Object.fromEntries(
  catalogExtras.map((e) => [e.id, e]),
);
