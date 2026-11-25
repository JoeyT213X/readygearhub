# Drones & Robotics catalog (Nov 25, 2026)

`python3 scripts/robotics-drones/gen.py [--verify]` rebuilds `src/data/robotics-drones.ts` from `selection.py`.
Raw source pulls kept beside it: `ri-products.json` (Robots International product JSON-LD), `autel-products.json` (shop.autelrobotics.com/products.json).

All four programs are PENDING. Every card is a plain official link with `affiliateUrl: ''` (TODO(affiliate)); programs are `ppcAllowed:false`
(hidden in paid-search sessions, also listed in `NO_PPC_PROGRAM_IDS` and the paid-guard test). Category lives only on /directory/ (not the home page).

## Still to add from RobotShop (identified, not yet listed)
robotshop.com sits behind a Cloudflare challenge for plain curl, so each RobotShop URL had to be opened and confirmed one by one (13 are in).
These are on RobotShop's Professional Robot Dogs / Security & Rescue collections and need their `/products/<handle>` confirmed before adding:
Unitree Go2-W Standard (U1), Plus (U2), Inspection (U5) wheeled; As2 PRO; A2-W; A2-W PRO; B2 and B2-W (with and without Nav Kit);
Deep Robotics Lynx M20 Pro; FX Aegis Pro / Ultra / Ultra-W / NAVI (and the large Mega and Hyper models); ATEAGO AT6 / AT6 Pro / MAT40 rescue-patrol dogs;
AgiBot D1 Pro / Ultra / Max; Dobot Rover X1 Explorer variants; Inspectorbots Minibot surveillance and inspection robot.
Skipped on purpose: EDU/dev editions, accessories and payload kits, kits and toys, humanoids, underwater/hobby drones, EOD robots, oil-spill systems.
Guessed handles that returned 404: Go2-W (US) variants, B2, FX Aegis Pro, Inspectorbots Minibot. Note Go2 AIR's handle ends in `-us`.

## Skipped for Autel / HOVERAir
Autel EVO Nano+ (sold out on the store Nov 25), all accessories, care plans, batteries and controllers. HOVERAir prices are not machine-readable, so cards say "See price".
