#!/usr/bin/env python3
"""Download official photos and patch catalog files for listings-1123."""
from __future__ import annotations

import json
import re
import ssl
import textwrap
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path("/workspace/rgh-listings")
SRC = Path("/workspace/rgh-official-images/listings-1123")
OUT = ROOT / "public/directory/photos"
SRC.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)
ITEMS = json.loads((ROOT / "notes/listings-1123-catalog.json").read_text())
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
CTX = ssl.create_default_context()
TARGET_WIDTHS = [480, 960, 1600]


def download(url: str, dest: Path) -> Path:
    if dest.exists() and dest.stat().st_size > 1000:
        return dest
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "image/avif,image/webp,image/*,*/*"})
    with urllib.request.urlopen(req, timeout=30, context=CTX) as r:
        data = r.read()
        ctype = (r.headers.get("content-type") or "").split(";")[0].strip()
    if not data:
        raise RuntimeError(f"empty {url}")
    # sniff
    ext = ".bin"
    if data[:3] == b"\xff\xd8\xff" or "jpeg" in ctype:
        ext = ".jpg"
    elif data[:8] == b"\x89PNG\r\n\x1a\n" or "png" in ctype:
        ext = ".png"
    elif data[:4] == b"RIFF" or "webp" in ctype:
        ext = ".webp"
    dest = dest.with_suffix(ext)
    dest.write_bytes(data)
    return dest


def flatten_white(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    return Image.alpha_composite(bg, im).convert("RGB")


def process(item: dict) -> list[int]:
    raw = download(item["img"], SRC / item["id"])
    im = flatten_white(Image.open(raw))
    w, h = im.size
    widths = [x for x in TARGET_WIDTHS if x < w] + [w]
    # unique, keep order
    seen = set()
    out_w = []
    for x in widths:
        if x not in seen:
            seen.add(x)
            out_w.append(x)
    for tw in out_w:
        if tw == w:
            frame = im
        else:
            nh = max(1, round(h * tw / w))
            frame = im.resize((tw, nh), Image.Resampling.LANCZOS)
        dest = OUT / f"{item['id']}-{tw}.webp"
        frame.save(dest, "WEBP", quality=85, method=6)
    item["widths"] = out_w
    item["src_w"] = w
    item["src_h"] = h
    item["raw"] = str(raw)
    return out_w


def ts_str(s: str) -> str:
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"


def source_item(it: dict) -> str:
    also = it.get("alsoIn") or []
    also_line = f"    alsoIn: {json.dumps(also)},\n" if also else ""
    dest = it["url"]
    return textwrap.dedent(f"""
      {{
        id: {ts_str(it['id'])},
        title: {ts_str(it['title'])},
        blurb: {ts_str(it['blurb'])},
        category: {ts_str(it['category'])},
    """) + also_line + textwrap.dedent(f"""
        programId: {ts_str(it['program'])},
        sourceName: {ts_str(it['sourceName'])},
        linkLevel: 'product',
        destination: {ts_str(dest)},
        useItemLink: true,
        image: '/directory/photos/{it['id']}-960.webp',
        imageKind: 'photo',
        offerLabel: {ts_str(it['offer'])},
        price: {ts_str(it['price'])},
        cta: {ts_str(it['cta'])},
      }},
    """)


def high_ticket_item(it: dict) -> str:
    also = it.get("alsoIn") or []
    also_line = f"    alsoIn: {json.dumps(also)},\n" if also else ""
    defw = 960 if 960 in it.get("widths", []) else (it.get("widths") or [960])[-1]
    return (
        "  {\n"
        f"    id: {ts_str(it['id'])},\n"
        f"    title: {ts_str(it['title'])},\n"
        f"    blurb: {ts_str(it['blurb'])},\n"
        f"    sourceName: {ts_str(it['sourceName'])},\n"
        f"    category: {ts_str(it['category'])},\n"
        + also_line +
        f"    groups: {json.dumps(it['groups'])},\n"
        "    affiliateUrl: null,\n"
        f"    fallbackUrl: {ts_str(it['url'])},\n"
        f"    image: '/directory/photos/{it['id']}-{defw}.webp',\n"
        "    imageKind: 'photo',\n"
        f"    offerLabel: {ts_str(it['offer'])},\n"
        f"    cta: {ts_str(it['cta'])},\n"
        f"    price: {ts_str(it['price'])},\n"
        "  },\n"
    )


def main():
    failed = []
    ok = []
    for it in ITEMS:
        try:
            process(it)
            print("OK", it["id"], it["widths"], it["src_w"], "x", it["src_h"])
            ok.append(it)
        except Exception as e:
            print("FAIL", it["id"], type(e).__name__, e)
            failed.append((it["id"], str(e)))
    Path("/tmp/listings-processed.json").write_text(json.dumps({"ok": [i["id"] for i in ok], "failed": failed, "items": ok}, indent=2, default=str))
    if failed:
        print("FAILED", failed)
    # continue to patch with successful items only
    ITEMS[:] = ok
    Path("/tmp/listings-ok.json").write_text(json.dumps(ok, indent=2, default=str))
    print("processed", len(ok), "failed", len(failed))


if __name__ == "__main__":
    main()
