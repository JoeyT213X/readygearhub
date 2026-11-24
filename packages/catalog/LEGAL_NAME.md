# Legal name — one edit

Confirmed 22 November 2026 (America/Chicago) from D&B DUNS and Mississippi
new-business records. The legal entity name is **OMEGA UCO SOLUTIONS, LLC**
(all caps, comma before LLC). Use that string verbatim wherever the legal
entity is named. Brand prose such as “Omega UCO Solutions” in ordinary
sentences may stay title-case.

Change it in one place:

```
packages/catalog/organization.ts  →  organization.legalName
```

Both ReadyGearHub and the company hub (`/workspace/omega-hub`) read that
value at build time. Rebuild both previews after the swap.

## Files that render or document the legal name

All of these are fed by `organization.legalName` at build time, except the
docs which mention the current legal name in prose.

### Source of truth
- `packages/catalog/organization.ts` — change `legalName` here only

### ReadyGearHub (reads the catalog)
- `src/data/site.ts` — assigns `site.legalName` from the catalog
- `src/layouts/Base.astro` — footer line “A site of {site.legalName}…”
- `src/pages/about.astro` — “ReadyGearHub is a site of {site.legalName}…”
- `src/pages/privacy.astro` — uses `site.legalName`
- `src/pages/contact.astro` — uses `site.legalName`
- `src/pages/refund-policy.astro` — uses `site.legalName`
- `src/pages/terms.astro` — uses `site.legalName`

`src/data/site.json` no longer stores `legalName`.

### Company hub (`/workspace/omega-hub`, reads the catalog at build)
- `build.mjs` — copies `organization.legalName` onto `site.legalName`, then
  uses it for titles, descriptions, about/privacy/terms/contact copy, and the footer
- `site.config.mjs` — identity fields are filled from the catalog; do not
  hardcode the LLC name there

### Documentation (prose; update if the legal name changes)
- `packages/catalog/README.md`
- `packages/catalog/LEGAL_NAME.md` (this file)
- `/workspace/omega-hub/README.md`
- `/workspace/omega-hub/IMAGE_CREDITS.md` (if the company name is mentioned)

The header wordmark “Omega UCO / Solutions” and `src/assets/mark.svg` title
use the short brand name (`organization.shortName` / “Omega UCO”), not the
legal name, and do not need to change unless the brand name changes too.
