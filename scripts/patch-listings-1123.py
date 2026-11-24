#!/usr/bin/env python3
"""Patch catalog TypeScript/markdown for listings-1123."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path("/workspace/rgh-listings")
ok = json.loads(Path("/tmp/listings-ok.json").read_text())
by_id = {i["id"]: i for i in ok}

# Attach widths from processed photos on disk
PHOTO = ROOT / "public/directory/photos"

def widths_for(id: str) -> list[int]:
    found = []
    for p in PHOTO.glob(f"{id}-*.webp"):
        try:
            found.append(int(p.stem.rsplit("-", 1)[1]))
        except ValueError:
            continue
    return sorted(set(found))

def defw(ws: list[int]) -> int:
    return 960 if 960 in ws else (ws[-1] if ws else 960)

# Extra items processed after the first batch
extras = [
  {
    "id": "harvest-right-countertop-360", "earn": False, "program": "harvest-right",
    "category": "home", "alsoIn": ["food"], "groups": ["home-water"], "sourceName": "Harvest Right",
    "title": "Harvest Right Countertop 360 freeze dryer",
    "blurb": "A home freeze dryer listed on Harvest Right’s official shop as the Countertop 360. See the official page for capacity, requirements, and the current price. We don’t have a partner program with this brand yet.",
    "url": "https://harvestright.com/products/countertop-freeze-dryer",
    "price": "$1,295.00 as of Nov 23, 2026", "offer": "Home freeze dryer", "cta": "Visit official site",
    "alt": "Harvest Right Countertop 360 freeze dryer",
    "credit": "Official product photo from harvestright.com (Shopify CDN files/countertop-freeze-dryer-black-right_9f651329-22aa-4c6d-8c6d-62f24185943e.jpg, store 1/0882/1030/9367), first image on the Countertop 360 product page, downloaded November 23, 2026. Image provided by Harvest Right.",
  },
  {
    "id": "milwaukee-2719-20", "earn": False, "program": None,
    "category": "tools", "alsoIn": [], "groups": ["outdoor-auto"], "sourceName": "Milwaukee Tool",
    "title": "Milwaukee M18 FUEL Hackzall (2719-20)",
    "blurb": "An M18 FUEL compact reciprocating saw listed on Milwaukee Tool’s official site as the Hackzall 2719-20 (tool only). See the official page for specs, kit options, and the current price. We don’t have a partner program with this brand yet.",
    "url": "https://www.milwaukeetool.com/products/details/m18-fuel-hackzall/2719-20",
    "price": "See price", "offer": "Reciprocating saw", "cta": "Visit official site",
    "alt": "Milwaukee M18 FUEL Hackzall 2719-20",
    "credit": "Official product photo from milwaukeetool.com (web-images/sc/1445526b274c4070bc5a18f734330b97), Open Graph image on the 2719-20 product page, downloaded November 23, 2026. Image provided by Milwaukee Tool.",
  },
  {
    "id": "toyota-rav4-2027", "earn": False, "program": None,
    "category": "vehicles", "alsoIn": ["auto"], "groups": ["outdoor-auto"], "sourceName": "Toyota",
    "title": "2027 Toyota RAV4",
    "blurb": "The current Toyota RAV4, listed on Toyota’s official US site as the 2027 RAV4. Configuration, trims, and pricing are on the official site. We don’t have a partner program with this brand yet.",
    "url": "https://www.toyota.com/vehicles/rav4/2027",
    "price": "See price", "offer": "SUV", "cta": "Visit official site",
    "alt": "2027 Toyota RAV4 Hybrid Limited AWD",
    "credit": "Official product photo from toyota.com (delivery.tcom.assetscs.toyota.com ... MY27_RAV4-Hybrid_US_Limited-AWD_4534_01L6_03_6K.png), Open Graph image on the 2027 RAV4 page, downloaded November 23, 2026. Image provided by Toyota.",
  },
  {
    "id": "toyota-tundra-2027", "earn": False, "program": None,
    "category": "vehicles", "alsoIn": ["auto"], "groups": ["outdoor-auto"], "sourceName": "Toyota",
    "title": "2027 Toyota Tundra",
    "blurb": "The current Toyota Tundra, listed on Toyota’s official US site as the 2027 Tundra. Configuration, trims, and pricing are on the official site. We don’t have a partner program with this brand yet.",
    "url": "https://www.toyota.com/vehicles/tundra/2027",
    "price": "See price", "offer": "Pickup truck", "cta": "Visit official site",
    "alt": "2027 Toyota Tundra SR5",
    "credit": "Official product photo from toyota.com (delivery.tcom.assetscs.toyota.com ... MY27_Tundra_US_SR5-Gas-4WD-CM-5ft_TH_8361_01G3_03_6K.png), Open Graph image on the 2027 Tundra page, downloaded November 23, 2026. Image provided by Toyota.",
  },
]

# Drop failed-only IDs if they snuck in; add extras
drop = {"dewalt-dcd771c2", "ford-f150-2027", "ford-bronco-2026"}
items = [i for i in ok if i["id"] not in drop]
for ex in extras:
    if ex["id"] not in by_id:
        items.append(ex)

for it in items:
    ws = widths_for(it["id"])
    if not ws:
        raise SystemExit(f"no photos for {it['id']}")
    it["widths"] = ws

print("items", len(items), "earn", sum(1 for i in items if i.get("earn")))
from collections import Counter
print("primary", dict(Counter(i["category"] for i in items)))

def ts(s: str) -> str:
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"

def also_line(it):
    also = it.get("alsoIn") or []
    return f"    alsoIn: {json.dumps(also)},\n" if also else ""

def source_block(it: dict) -> str:
    w = defw(it["widths"])
    return (
        "  {\n"
        f"    id: {ts(it['id'])},\n"
        f"    title: {ts(it['title'])},\n"
        f"    blurb: {ts(it['blurb'])},\n"
        f"    category: {ts(it['category'])},\n"
        + also_line(it) +
        f"    programId: {ts(it['program'])},\n"
        f"    sourceName: {ts(it['sourceName'])},\n"
        "    linkLevel: 'product',\n"
        f"    destination: {ts(it['url'])},\n"
        "    useItemLink: true,\n"
        f"    image: '/directory/photos/{it['id']}-{w}.webp',\n"
        "    imageKind: 'photo',\n"
        f"    offerLabel: {ts(it['offer'])},\n"
        f"    price: {ts(it['price'])},\n"
        f"    cta: {ts(it['cta'])},\n"
        "  },\n"
    )

def ht_block(it: dict) -> str:
    w = defw(it["widths"])
    return (
        "  {\n"
        f"    id: {ts(it['id'])},\n"
        f"    title: {ts(it['title'])},\n"
        f"    blurb: {ts(it['blurb'])},\n"
        f"    sourceName: {ts(it['sourceName'])},\n"
        f"    category: {ts(it['category'])},\n"
        + also_line(it) +
        f"    groups: {json.dumps(it['groups'])},\n"
        "    affiliateUrl: null,\n"
        f"    fallbackUrl: {ts(it['url'])},\n"
        f"    image: '/directory/photos/{it['id']}-{w}.webp',\n"
        "    imageKind: 'photo',\n"
        f"    offerLabel: {ts(it['offer'])},\n"
        f"    cta: {ts(it['cta'])},\n"
        f"    price: {ts(it['price'])},\n"
        "  },\n"
    )

earn = [i for i in items if i.get("earn")]
official = [i for i in items if not i.get("earn")]

# ---- source-directory.ts ----
sd = ROOT / "src/data/source-directory.ts"
text = sd.read_text()
needle = "  ...payhipItems(),\n];"
if needle not in text:
    raise SystemExit("sourceItems end not found")
insert = "  // ---- listings-1123: 2025–2026 bestsellers (earnable partner products) ----\n" + "".join(source_block(i) for i in earn)
sd.write_text(text.replace(needle, insert + needle, 1))
print("patched source-directory")

# ---- high-ticket.ts type + converter + items ----
ht = ROOT / "src/data/high-ticket.ts"
text = ht.read_text()
old = "  cta?: string;\n};"
new = "  cta?: string;\n  /** Verified official price, already dated, or 'See price'. */\n  price?: string;\n};"
if old not in text:
    raise SystemExit("HighTicketItem type end not found")
text = text.replace(old, new, 1)
old = "    priceLabel: 'See official site',"
new = "    priceLabel: item.price || 'See official site',"
if old not in text:
    raise SystemExit("priceLabel not found")
text = text.replace(old, new, 1)
# insert items before the array close that precedes highTicketToCatalogItem
idx = text.find("export function highTicketToCatalogItem")
if idx < 0:
    raise SystemExit("converter not found")
# find the ]; before that
close = text.rfind("];", 0, idx)
if close < 0:
    raise SystemExit("highTicketItems close not found")
block = "  // ---- listings-1123: 2025–2026 bestsellers (official pages, no program yet) ----\n" + "".join(ht_block(i) for i in official)
text = text[:close] + block + text[close:]
ht.write_text(text)
print("patched high-ticket", len(official), "official items")

# ---- affiliates.ts ----
aff = ROOT / "packages/catalog/affiliates.ts"
text = aff.read_text()

berkey_old = """  { id: 'berkey', name: 'TheBerkey.com', network: 'Refersion', status: 'approved', kind: 'product',
    officialUrl: 'https://theberkey.com/',
    link: 'https://theberkey.com/?rfsn=9422720.32fae8',
    note: 'Refersion 15%, 365-day cookie. Official retailer TheBerkey.com. Linked from /gear/ (water) and /gear/tech/ (water filters).' },"""
berkey_new = """  { id: 'berkey', name: 'TheBerkey.com', network: 'Refersion', status: 'approved', kind: 'product',
    officialUrl: 'https://theberkey.com/',
    link: 'https://theberkey.com/?rfsn=9422720.32fae8',
    items: ['berkey-shop', 'berkey-big-berkey', 'berkey-travel-berkey'],
    itemLinks: {
      'berkey-shop': 'https://theberkey.com/?rfsn=9422720.32fae8',
      'berkey-big-berkey': 'https://theberkey.com/products/big-berkey-water-filter?rfsn=9422720.32fae8',
      'berkey-travel-berkey': 'https://theberkey.com/products/travel-berkey-water-filter?rfsn=9422720.32fae8',
    },
    note: 'Refersion 15%, 365-day cookie. Official retailer TheBerkey.com. Linked from /gear/ (water) and /gear/tech/ (water filters).' },"""
if berkey_old not in text:
    raise SystemExit("berkey block not found")
text = text.replace(berkey_old, berkey_new, 1)

redi_old = """  { id: 'redi', name: 'REDI', network: 'GoAffPro', status: 'approved', kind: 'product', ppcAllowed: false,
    officialUrl: 'https://getredi.com/',
    link: 'https://getredi.com/?ref=JOSEPHTINDIGLIA',
    note: 'GoAffPro 10%, 30-day cookie. Emergency and readiness kits. Linked from /gear/ (kits).' },"""
redi_new = """  { id: 'redi', name: 'REDI', network: 'GoAffPro', status: 'approved', kind: 'product', ppcAllowed: false,
    officialUrl: 'https://getredi.com/',
    link: 'https://getredi.com/?ref=JOSEPHTINDIGLIA',
    items: ['redi-shop', 'redi-the-roadie', 'redi-roadie-plus', 'redi-roadie-pro', 'redi-trauma-pack'],
    itemLinks: {
      'redi-shop': 'https://getredi.com/?ref=JOSEPHTINDIGLIA',
      'redi-the-roadie': 'https://getredi.com/products/the-roadie?ref=JOSEPHTINDIGLIA',
      'redi-roadie-plus': 'https://getredi.com/products/roadie-plus?ref=JOSEPHTINDIGLIA',
      'redi-roadie-pro': 'https://getredi.com/products/roadie-pro?ref=JOSEPHTINDIGLIA',
      'redi-trauma-pack': 'https://getredi.com/products/trauma-kit?ref=JOSEPHTINDIGLIA',
    },
    note: 'GoAffPro 10%, 30-day cookie. Emergency and readiness kits. Linked from /gear/ (kits).' },"""
if redi_old not in text:
    raise SystemExit("redi block not found")
text = text.replace(redi_old, redi_new, 1)

# dji: ppcAllowed false + new items
dji_m = re.search(r"\{ id: 'dji',.*?tracking stays off until approved\.' \},", text, re.S)
if not dji_m:
    # try shorter
    dji_m = re.search(r"\{ id: 'dji',.*?\n  \},", text)
if not dji_m:
    raise SystemExit("dji block not found")
dji = dji_m.group(0)
if "ppcAllowed:" not in dji:
    dji = dji.replace("{ id: 'dji', name: 'DJI', network: 'Direct', status: 'pending', kind: 'product',",
                      "{ id: 'dji', name: 'DJI', network: 'Direct', status: 'pending', kind: 'product', ppcAllowed: false,")
for new_id in ["dji-matrice-5t", "dji-matrice-4-series", "dji-mavic-3-enterprise"]:
    if new_id not in dji:
        dji = dji.replace("'dji-inspire-3']", f"'dji-inspire-3', '{new_id}']")
text = text[:dji_m.start()] + dji + text[dji_m.end():]

# skydio items if present
if "id: 'skydio'" in text and "skydio-x10" not in text:
    text = re.sub(
        r"(\{ id: 'skydio',[^}]*items: \[[^\]]*)(\])",
        r"\1, 'skydio-x10'\2",
        text,
        count=1,
    )

# new no-PPC programs (do not add to NO_PPC_PROGRAM_IDS hardcoded list)
new_progs = """
  { id: 'aquatru', name: 'AquaTru', network: 'TBD', status: 'none', kind: 'product', ppcAllowed: false,
    officialUrl: 'https://aquatruwater.com/',
    items: ['aquatru-carafe'],
    note: 'No approved partner program yet. Official links stay plain. No brand-term paid search.' },
  { id: 'harvest-right', name: 'Harvest Right', network: 'TBD', status: 'none', kind: 'product', ppcAllowed: false,
    officialUrl: 'https://harvestright.com/',
    items: ['harvest-right-countertop-360'],
    note: 'No approved partner program yet. Official links stay plain. No brand-term paid search.' },
"""
# insert before the last `] as const` or programs array close. Safer: after redi block we already replaced.
# Place after aquasana or ispring? After harvest insertion point: after the redi_new block is already in text.
# Insert just after the redi program we wrote.
if "id: 'aquatru'" not in text:
    text = text.replace(redi_new, redi_new + "\n" + new_progs, 1)

aff.write_text(text)
print("patched affiliates")

# ---- product-photos.ts ----
pp = ROOT / "src/data/product-photos.ts"
text = pp.read_text()
# extend water backdrop
text = text.replace(
    "if (item.category === 'water' || /ispring|aquasana|waterdrop|\\bberkey\\b|reverse osmosis|water filter|filtration/.test(hay)) return 'backdrop-water';",
    "if (item.category === 'water' || /ispring|aquasana|waterdrop|\\bberkey\\b|aquatru|clearly filtered|reverse osmosis|water filter|filtration/.test(hay)) return 'backdrop-water';",
)
entries_add = []
byid_add = []
for it in items:
    entries_add.append(f"  {ts(it['id'])}: {{ alt: {ts(it['alt'])}, widths: {it['widths']} }},")
    byid_add.append(f"  {ts(it['id'])}: {ts(it['id'])},")
# insert before the closing of ENTRIES `};` that precedes `const BY_ID`
e_idx = text.find("const BY_ID")
if e_idx < 0:
    raise SystemExit("BY_ID not found")
e_close = text.rfind("};", 0, e_idx)
text = text[:e_close] + "\n".join(entries_add) + "\n" + text[e_close:]
# BY_ID close before function build
b_idx = text.find("function build(")
if b_idx < 0:
    raise SystemExit("build not found")
b_close = text.rfind("};", 0, b_idx)
text = text[:b_close] + "\n".join(byid_add) + "\n" + text[b_close:]
pp.write_text(text)
print("patched product-photos")

# ---- HOME_SHOP_EXCLUDED ----
fc = ROOT / "src/data/full-catalog.ts"
text = fc.read_text()
m = re.search(r"const HOME_SHOP_EXCLUDED_IDS = new Set\(\[([\s\S]*?)\]\);", text)
if not m:
    raise SystemExit("HOME_SHOP_EXCLUDED not found")
ids = "\n".join(f"  {ts(i['id'])}," for i in items)
# insert before closing ]);  — the set ends with ]); 
old = m.group(0)
# add before the final ]
if old.rstrip().endswith("]);"):
    new = old[:-3].rstrip()
    if not new.endswith(","):
        new += ","
    new += "\n" + ids + "\n]);"
    text = text.replace(old, new, 1)
    fc.write_text(text)
    print("patched HOME_SHOP_EXCLUDED")
else:
    raise SystemExit("unexpected HOME_SHOP end")

# ---- IMAGE_CREDITS.md ----
cr = ROOT / "IMAGE_CREDITS.md"
credits = cr.read_text()
rows = []
for it in items:
    ws = it["widths"]
    wmax = max(ws)
    srcw = it.get("src_w")
    # src size if known
    rows.append(
        f"| `{it['id']}` | {it['title']} | {it['sourceName']} | {it['credit']} | Official catalog photo, flattened onto white for the card backdrop"
        + (f" (native {wmax} px used as the large srcset step, no upscaling)." if wmax else ".")
        + f" Image provided by {it['sourceName']}. |"
    )
if not credits.endswith("\n"):
    credits += "\n"
credits += "\n".join(rows) + "\n"
cr.write_text(credits)
print("patched IMAGE_CREDITS", len(rows), "rows")

# save final item list for report
Path("/tmp/listings-final.json").write_text(json.dumps(items, indent=2, default=str))
print("done")
