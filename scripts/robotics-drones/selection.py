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
# Faraday Future FX Aegis / FX Navi (US, California) — main robot listings.
RI_SEL=[13,14,15,16,17,19,20]
# Low-key fillers (non-listed Chinese robot dogs): Galileo C1/C1-W, PUDU D5/D5-W, MagicLab MagicDog, MirrorMe BPX Pro.
# Not 1260H / Entity List. No Unitree, Autel, Guo Xing, Topsky, Rotunbot, or Dagu. No explosion-proof or $0/OOS models.
RI_FILLER=[44,45,78,79,53,66]
AUTEL_SEL=[]
ROBOTSHOP=[]
# Deep Robotics Lite3 line from RobotShop (not on 1260H / Entity List). Bottom-of-page fillers only. Not the X30 Pro.
ROBOTSHOP_FILLER=[
 ('deep-robotics-lite3-basic-quadruped-robot','Deep Robotics Lite3 Basic Quadruped Robot',6600.00,'Special order','Deep Robotics Lite3 Basic, a four-legged robot listed on RobotShop. See the store page for specifications, availability, and shipping.'),
 ('deep-robotics-lite3-venture-quadruped-robot','Deep Robotics Lite3 Venture Quadruped Robot',7986.00,'Special order','Deep Robotics Lite3 Venture, a four-legged robot listed on RobotShop. See the store page for specifications, availability, and shipping.'),
 ('deep-robotics-lite3-pro-quadruped-robot','Deep Robotics Lite3 Pro Quadruped Robot',15290.00,'Special order','Deep Robotics Lite3 Pro, a four-legged robot listed on RobotShop. See the store page for specifications, availability, and shipping.'),
 ('deep-robotics-lite3-lidar-quadruped-robot','Deep Robotics Lite3 Lidar Quadruped Robot',22990.00,'Special order','Deep Robotics Lite3 Lidar, a four-legged robot listed on RobotShop. See the store page for specifications, availability, and shipping.'),
]
HOVER=[
 ('hoverair-x1-pro-promax','HOVERAir X1 PRO and PROMAX','https://hoverair.com/pages/x1-pro-and-promax','A small self-flying camera drone, with the PROMAX adding 8K video per HOVERAir. A way to get a quick look over a property or trail. It is a camera drone, not a search-and-rescue tool.'),
 ('hoverair-aqua','HOVERAir AQUA','https://hoverair.com/pages/aqua','HOVERAir describes the AQUA as a waterproof self-flying camera for water sports. Check the official page for the waterproof rating and limits before relying on it near water.'),
 ('hoverair-x1-smart','HOVERAir X1 Smart','https://hoverair.com/pages/x1-smart','A 99 g self-flying camera, per HOVERAir. A very light pocket option for casual aerial shots.'),
 ('hoverair-x1','HOVERAir X1','https://hoverair.com/pages/x1','The original pocket-size self-flying camera for hands-free shots. Check the official page for current availability.'),
]
