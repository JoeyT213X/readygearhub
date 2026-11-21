# Prepper’s Picks

The home-page section and `/prepper-picks/` are driven by `src/data/prepper-picks.ts`.

## Adding or upgrading a card

1. To add a pick, append one object to `prepperPicks`. Set `featured: true` if it should also appear on the home teaser.
2. Every card must include `fallbackUrl` (the plain official product, category, or guide URL, or an internal path) and `affiliateUrl`.
3. Leave `affiliateUrl: null` until we have a **verified** tracked URL from a program we already use. Then paste that URL into `affiliateUrl` — that one field is enough to switch the card to a sponsored partner link.
4. If `affiliateUrl` is null but `programId` is a live approved program (for example BLUETTI’s existing CJ `{url}` template), `resolvePrepperPick()` will wrap `fallbackUrl` with that existing method. Do not invent tracking URLs or Rakuten/CJ patterns that are not already in `affiliates.ts`.
5. Do not invent prices or ratings. Cards say “See price” unless a verified in-repo price already exists (Payhip only today).
6. Use a self-hosted official photo when we have one (`imageKind: 'photo'`). Otherwise use a geometric SVG in `public/directory/covers/`. Never hotlink or use an unlicensed image.
7. Waterdrop, REDI, and Choice Home Warranty cards must keep a matching `programId` so the paid-session guard still hides them.

The TypeScript file header repeats these rules next to the types.
