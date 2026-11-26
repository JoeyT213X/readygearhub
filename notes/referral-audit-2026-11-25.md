# ReadyGearHub referral-tracking audit — November 25, 2026 (America/Chicago)

Audit of every outbound partner/affiliate shop link on the built ReadyGearHub site. Tracking IDs used below already existed in `packages/catalog/affiliates.ts` or in our Rakuten catalog credits. No affiliate IDs were invented.

Checked after these fixes: Anker C1000 card rename, gear-page official buttons and winter-deals source citations wrapped with existing tracked templates, and Aquasana/Waterdrop product cards upgraded from homepage offer links to Rakuten deeplinks.

## Counts

| Class | Unique URLs | Notes |
| --- | ---: | --- |
| Tracked OK | 147 | Network click or brand ref/aff param, and the hop landed on the intended official page (or the intended merchant homepage / category page). Includes 6 REDI links that a title-keyword check first flagged as 404s; the live titles are the correct product and collection pages. |
| Tracked but the destination needs checking | 2 | Choice Home Warranty CJ click lands on `chwsavings.com` (the program landing), not choicehomewarranty.com. BLUETTI PV350D click was tracked and resolved to the live 350W panel page (`/products/350w-solar-panel`); the stored official URL was updated to match. |
| Plain (untracked) link to a brand we are approved with | 3 | Photo-credit source links on `/about/` to the Anker SOLIX, BLUETTI, and LiTime homepages. Left as official attributions, not shop buttons. |
| Plain (untracked) link to a brand we are not approved with | 353 unique shop-button URLs | Official manufacturer links for brands that are pending, dropped, or have no program. Left as is. |
| Unverifiable (store blocks bots) | 2 | NordVPN and NordPass CJ links reached the official `/special/` landing with affiliate parameters, then Cloudflare served a 403 “Just a moment…” challenge to this crawler. |

Unique tracked partner URLs crawled: **155**. Unique shop-button or sponsored outbound URLs reviewed in the build: **526**.

## Fixes made in this pass

1. **Anker C1000.** The listing slug stays `/gear/anker-solix-c1000x/` so existing links do not break. The visible name is now “Anker SOLIX C1000 Portable Power Station,” matching the live official page `ankersolix.com/c1000-camping-portable-power-station-pps`. No price is shown on the card. The buy and official-page buttons already used the Rakuten deeplink (MID 53552).
2. **Epic Water Filters.** All five product links still use `?ref=XJZEKTWOCV` and resolved to the matching Epic product pages. Left unchanged.
3. **Gear detail pages.** The sidebar “Official product page” button used the plain `officialUrl`. For approved programs it now uses the same tracked URL as the main buy button (`rel="sponsored nofollow noopener"`).
4. **Winter-deals source list.** Official-store citations for Anker, BLUETTI, Wuben, TideWe, and Bogs were plain. They now use the existing program templates (Rakuten deeplink, CJ `url=`, or Awin `ued=`). Amazon and editorial sources stay plain.
5. **Aquasana product cards.** Ten product cards (and a couple of related links) had been sending shoppers through the homepage or category offer link. They now use the standard Rakuten deeplink with MID **36667** and publisher id `j8aaZmp7txc` (already in the program note and the Rakuten product-catalog credits). Merchant, under-sink, and whole-house cards keep the portal-issued offer links, which correctly open the Aquasana homepage, under-sink category, and whole-house category.
6. **Waterdrop product cards.** Ten product cards had been sending shoppers to the Waterdrop homepage offer. They now use the Rakuten deeplink with MID **53950** (from our official product-catalog credits). The merchant shop card keeps offerid 1888875 and still opens the Waterdrop homepage, which is intended.
7. **BLUETTI 350W panel.** The CJ deep link for `bluetti-pv350d` redirected to `bluettipower.com/products/350w-solar-panel` (same product, current slug). The stored destination was updated to that URL.

## Tracked programs (approved) — result

All of these carry our tracking and, unless noted, resolved to the right official page:

- **BLUETTI** (CJ AID 16981946) — product deep links OK; 350W panel slug updated as above.
- **Anker SOLIX** (Rakuten MID 53552) — product deeplinks OK, including the C1000 page.
- **LiTime** (Awin mid 71451, aff 3160581) — `ued=` deep links OK.
- **TheBerkey.com** (Refersion `rfsn=9422720.32fae8`) — product and shop links OK.
- **Waterdrop** (Rakuten MID 53950 / offer 1888875) — product deeplinks OK; shop card is the homepage offer, by design.
- **REDI** (GoAffPro `ref=JOSEPHTINDIGLIA`) — product and shop links OK (Shopify pages returned 200 with the correct titles).
- **Choice Home Warranty** (CJ click-101929817-12337172) — tracked; lands on `chwsavings.com` (see edit-later).
- **ALLPOWERS** (CJ AID 17227114, `/type/dlg/` deep links) — product deep links OK; the program-level click opens the ALLPOWERS homepage, by design.
- **Surfshark** (CJ click-101929817-15438560) — tracked; lands on surfshark.com with CJ parameters.
- **Aquasana** (Rakuten MID 36667) — product deeplinks OK; verified offer links open the intended shop or category pages.
- **iSpring** (GoAffPro `ref=JOSEPHTINDIGLIA`) — product and shop links OK.
- **Epic Water Filters** (`ref=XJZEKTWOCV`) — all five product pages OK.
- **TideWe** (Awin mid 78182, aff 3160581) — `ued=` deep links OK.
- **Bogs** (Rakuten MID 37142) — deeplinks OK.
- **NordVPN** (CJ click-101929817-12814518) — tracked hop reached nordvpn.com/special with affiliate parameters; Cloudflare blocked the crawler (unverifiable).
- **NordPass** (CJ click-101929817-13868703) — same as NordVPN, on nordpass.com/special.
- **Wuben** (Awin mid 92053, aff 3160581) — product `ued=` links OK; the official-shop Awin link (no `ued`) opens the Wuben homepage, by design.

## Edit later

Confirm or finish when a person can open the dashboards or when a program is approved. Do not invent IDs.

1. **Choice Home Warranty.** In the CJ dashboard, confirm that `click-101929817-12337172` → `chwsavings.com` is the current approved landing. If CJ has issued a link that should open choicehomewarranty.com, swap it.
2. **NordVPN and NordPass.** Recheck the CJ special-offer landings in a real browser (Cloudflare blocked the bot). Confirm the pages still match the program.
3. **Epic Water Filters.** In the PMX dashboard, confirm that a click or test order on a `?ref=XJZEKTWOCV` deep link is credited. The issued PMX wrapper alone only opens the Epic homepage, which is why product cards use the ref on the official URL.
4. **About page photo credits.** The Anker SOLIX, BLUETTI, and LiTime homepage links in the image-credit list are official source attributions, not buy buttons. Leave them, or wrap them only if we decide credits may be affiliate links.
5. **Pending programs that already have official shop buttons on the site.** When approval comes in, attach the real network link or ref param and replace the plain official URL. Do not invent IDs. On the site today: Academy Sports, Sportsman’s Guide, Survival Frog, Legacy Food Storage, Olight, NITECORE, BTECH/Baofeng, ZOLEO, JBL, HOVERAir, RobotShop, Robots International, Elephant Robotics, Cobra, VEVOR, and Batteries Plus. Jackery, EcoFlow, Goal Zero, BioLite, Leatherman, and Coleman are also pending and already have plain official product links, even though those program records do not yet store an officialUrl.
6. **Brands with no approved program.** Leave the official manufacturer links as they are. Big examples on the site include Midland, Eton, Lodge, Sawyer, LifeStraw, ReadyWise, Mountain House, Augason Farms, Garmin, Honda generators, Milwaukee, Datrex, and many robotics or vehicle brands. Add tracking only after a real approval and a real affiliate ID.
7. **Amazon bestseller and editorial citations** on `/winter-deals/` stay plain. We do not have an Amazon Associates tracking link in use.

## Method

- Built the Astro site from `main` and collected every `https://` href in `dist/`.
- Treated a link as tracked if it used a known network host (CJ, Rakuten/Linksynergy, Awin) or a known brand param we already store (`rfsn=9422720.32fae8`, `ref=JOSEPHTINDIGLIA`, `ref=XJZEKTWOCV`).
- Followed each of the 155 unique tracked URLs with `curl` (browser user-agent, redirects on). Compared the final host and path to the destination encoded in `murl`, `ued`, `url`, or the CJ `/type/dlg/` path.
- Shop-button and `rel=sponsored` links that were not tracked were classified as approved-untracked (fix if a template exists) or unapproved (leave, list for later).

Raw crawl data: `/workspace/research/crawl-results.json`.
