"""Curated selection for the Drones & Robotics directory category (Nov 25, 2026, America/Chicago).
Sources: Robots International = Product JSON-LD on each product page; Autel = shop.autelrobotics.com/products.json;
RobotShop = product pages + collection pages read Nov 25, 2026 (store is behind a Cloudflare challenge for plain curl);
HOVERAir = hoverair.com landing pages (no products.json; prices not published in machine-readable form, so none shown).
Policy (Nov 25, 2026): no Unitree; no brand on the DoD 1260H list, US Entity List/sanctions, or a Chinese state/military-linked robotics maker;
prefer US companies, and foreign brands only from US allies. Autel Robotics (1260H, Shenzhen) is dropped. HOVERAir (Zero Zero, Shenzhen) is kept for now:
it is not named on 1260H or the Entity List (report FCC Covered List separately). FX Aegis/Navi is Faraday Future, California.
Also skipped: parts, accessories, chassis, batteries, EDU/dev kits, toys, humanoids, agricultural drones, EOD, counter-drone, weaponized, $0/placeholder items."""
import json,re,os
HERE=os.path.dirname(os.path.abspath(__file__))
RI=json.load(open(os.path.join(HERE,'ri-products.json')))
AUTEL=json.load(open(os.path.join(HERE,'autel-products.json')))
# Faraday Future FX Aegis / FX Navi only (US, California). All Unitree and other Chinese-origin brands removed Nov 25, 2026.
RI_SEL=[13,14,15,16,17,19,20]
AUTEL_SEL=[]
# RobotShop: (handle, title, price, availability, short factual blurb)
ROBOTSHOP=[]
HOVER=[
 ('hoverair-x1-pro-promax','HOVERAir X1 PRO and PROMAX','https://hoverair.com/pages/x1-pro-and-promax','A small self-flying camera drone, with the PROMAX adding 8K video per HOVERAir. A way to get a quick look over a property or trail. It is a camera drone, not a search-and-rescue tool.'),
 ('hoverair-aqua','HOVERAir AQUA','https://hoverair.com/pages/aqua','HOVERAir describes the AQUA as a waterproof self-flying camera for water sports. Check the official page for the waterproof rating and limits before relying on it near water.'),
 ('hoverair-x1-smart','HOVERAir X1 Smart','https://hoverair.com/pages/x1-smart','A 99 g self-flying camera, per HOVERAir. A very light pocket option for casual aerial shots.'),
 ('hoverair-x1','HOVERAir X1','https://hoverair.com/pages/x1','The original pocket-size self-flying camera for hands-free shots. Check the official page for current availability.'),
 ('hoverair-versa','HOVERAir Versa','https://hoverair.com/pages/versa','A pocket camera that can also fly, aimed at vlogging. Check the official page for specs and local flying rules.'),
]
