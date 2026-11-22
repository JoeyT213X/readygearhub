import { isPpcAllowed, isProgramLive, programs, type Program } from './affiliates';

export type ProductSummary = {
  programId: string;
  name: string;
  network: Program['network'];
  status: Program['status'];
  live: boolean;
  ppcAllowed: boolean;
  itemIds: string[];
};

/** Compact product/program index both sites can read at build time. */
export function productSummaries(): ProductSummary[] {
  return programs
    .filter((p) => p.kind === 'product')
    .map((p) => ({
      programId: p.id,
      name: p.name,
      network: p.network,
      status: p.status,
      live: isProgramLive(p.id),
      ppcAllowed: isPpcAllowed(p.id),
      itemIds: [
        ...new Set([
          ...(p.items || []),
          ...Object.keys(p.itemLinks || {}),
          ...Object.keys(p.retailerUrls || {}),
        ]),
      ],
    }));
}
