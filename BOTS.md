# BOTS.md: How bots run ReadyGearHub

ReadyGearHub is a static Astro site. **All content lives in plain files.** Bots update the site by editing files, running a build check, and pushing to GitHub. Netlify rebuilds and publishes automatically on every push to `main`.

- Repo: https://github.com/JoeyT213X/readygearhub
- Live: https://readygearhub.com (fallback: https://readygearhub.netlify.app)
- Local working copy on the shared box: `/workspace/readygearhub`

## Ground rules (read first)

1. **Never invent facts.** No made-up prices, specs, star ratings, reviews, testimonials, or "we tested it" claims. Only state specs you saw on the manufacturer's official page, and attribute them ("per Anker…").
2. **No prices on the site.** Buttons say "Check current price."
3. **No Review/AggregateRating schema.** Ever.
4. **Banned items:** firearms, ammunition, weapons, weapon accessories. Knives only as multi-tools or utility tools.
5. **Fuel-burning gear** (heaters, stoves, generators) must mention following manufacturer ventilation instructions and using a CO alarm.
6. **Every listing needs a working official URL.** Run `npm run check-links` before pushing.
7. **Featured = paid.** Only set `featured: true` for a paid placement that the owner approved. Trending (`rank`) is editorial and never sold.
8. Human (Joseph) approves anything that spends money, signs up for programs, emails businesses, or posts publicly.

## File map

| What | Where |
|---|---|
| Listings (one file per product) | `src/content/items/<slug>.md` |
| Guides (articles) | `src/content/guides/<slug>.md` |
| Lanes / niches config | `src/data/lanes.json` |
| Site settings, current season, home hero text | `src/data/site.json` |
| Schema for listings and guides (field rules) | `src/content.config.ts` |
| Link checker | `scripts/check-links.mjs` (`npm run check-links`) |
| Pages and templates (rarely touched) | `src/pages/`, `src/components/`, `src/layouts/` |

The file name is the URL: `src/content/items/noco-boost-gb40.md` becomes `/gear/noco-boost-gb40/`. **Don't rename existing files**, because that breaks inbound links. If you must, add a redirect in `netlify.toml`.

## Listing fields (`src/content/items/*.md`)

```yaml
---
name: "NOCO Boost GB40 1000A Lithium Jump Starter"   # exact product name as on the brand site
brand: "NOCO"
lane: vehicle-emergency-kits        # primary lane slug; must exist in src/data/lanes.json
alsoIn: ["power-outage-kits"]       # extra lanes it shows up in (optional)
tags: ["jump starter", "battery"]   # free-form, lowercase
description: "1–2 sentence plain summary. No hype, no invented specs."
uses:                               # multi-purpose angles (2–4 bullets)
  - "Start a dead battery on a cold morning"
  - "Charge a phone from the jump pack"
officialUrl: "https://no.co/gb40"   # manufacturer product page (required, must resolve)
affiliateUrl: ""                    # fill in once an affiliate program approves us; the button then uses it with rel="sponsored"
rank: 1                             # trending position: 1 = hottest. 0 = not trending
featured: false                     # paid placement only (owner-approved)
season: ["winter", "all-season"]    # any of: winter, spring, summer, fall, hurricane, all-season
verified: "2026-11-15"              # date officialUrl was last checked
draft: false                        # true hides it without deleting
---

Body text: 1–3 short paragraphs on why it's useful. Attribute any spec to the manufacturer.
```

### Add a listing
1. Find the product on the **manufacturer's own site** and copy the exact name and URL.
2. Create `src/content/items/<brand>-<model>.md` (lowercase, hyphens) with the fields above.
3. `npm run check-links && npm run build`. The build fails if a field is wrong or the lane doesn't exist.
4. Commit and push (see Deploy).

### Re-rank trending (daily trend bot)
- Ranking is just the `rank` number. The home page "Trending now" shows the top 9 ranked items, with items matching `site.json → currentSeason` first. Lane pages sort by rank, then name.
- To re-rank: set `rank: 1..N` on the hottest items and `rank: 0` on items that cooled off. Keep about 10–15 items ranked at a time, and keep numbers mostly unique.
- Signals to use: NWS winter storm, ice storm, and hurricane alerts; outage news; Google Trends; and brand or affiliate best-seller lists. Write a one-line reason in the commit message, for example `trend: ice storm warning TX/OK → heaters, CO alarms up`.

### Remove or pause a listing
Set `draft: true` (preferred, since it's reversible), or delete the file if the product is discontinued. Run `npm run check-links` weekly. A dead official URL means find the replacement model or draft the listing.

### Add affiliate links
When a program approves us, put the tracking link in `affiliateUrl`. Don't change `officialUrl`. The site automatically adds `rel="sponsored nofollow"`, and every page with item buttons already shows the disclosure line.

## Lanes / new niches (`src/data/lanes.json`)

Each lane is a JSON object. Adding one creates a new page at `/<slug>/`, a nav entry, and a home card, with no code changes.

```json
{ "slug": "emergency-water", "name": "Emergency Water", "icon": "💧",
  "season": ["all-season"], "order": 9, "active": true,
  "title": "SEO page title (55–65 chars)",
  "summary": "One-line card/meta summary.",
  "intro": "2–3 sentence intro paragraph at the top of the lane page." }
```

- `season` controls which home-page section a lane appears in. Lanes matching `currentSeason` show under "Winter lanes."
- `active: false` hides a lane. Don't leave items pointing at a hidden lane, because the build will error.
- Don't use a slug that collides with an existing page: `gear`, `guides`, `about`, `contact`, `privacy`, `affiliate-disclosure`, `get-featured`, `thanks`, `alerts`, `tools`, `apps`, `storm-tracker`, `widgets`.

## Season switch (`src/data/site.json`)

Change `currentSeason` (for example to `"hurricane"` around June 1) and update `hero` text and the CTA. Trending and the home lane order follow automatically.

## Guides (`src/content/guides/*.md`)

```yaml
---
title: "How to … (keyword-first, under ~65 chars)"
description: "150–160 char meta description."
lane: power-outage-kits            # optional, links the guide from that lane page
season: ["winter"]
published: 2026-11-15
updated: 2026-12-01                # set when you materially update
relatedItems: ["noco-boost-gb40"]  # item file names (no .md), shown as cards under the guide
---
Markdown body. Use H2s, checklists (- [ ]), and tables. Cite official sources (Ready.gov, CDC, NWS, FoodSafety.gov) for safety numbers.
```

Write for a real person in a real emergency: specific, plain, and safe. No filler, and no keyword stuffing.

## Deploy

```bash
cd /workspace/readygearhub
git pull --rebase            # another bot may have pushed
npm run check-links          # optional but recommended when URLs changed
npm run build                # must pass
git add -A
git commit -m "items: add <name> | trend: <reason> | guide: <title>"
git push origin main         # Netlify auto-builds and publishes in about 1 minute
```

If GitHub continuous deploy is ever disconnected, deploy manually:
```bash
export PATH=$HOME/.local/bin:$PATH
npm run build && netlify deploy --prod --dir=dist
```

## Forms

`/contact/` and `/get-featured/` use Netlify Forms. Submissions appear in the Netlify dashboard under the site's Forms tab (free plan: 100 per month). Bots may read and summarize them, but never reply to businesses without owner approval.

## Bot roles

- **Trend Scout (daily):** checks weather alerts, outage news, and trend data, then edits `rank` and the `site.json` hero, and pushes.
- **Listing Builder:** adds and verifies new products and lanes, and runs `check-links` weekly.
- **Guide Writer:** writes and refreshes guides tied to hot lanes.
- **Site Ops:** keeps the build green and handles redirects, performance, and the dependency updates in `package.json`.
