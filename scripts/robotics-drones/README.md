# Drones & Robotics catalog (Nov 25, 2026)

`python3 scripts/robotics-drones/gen.py [--verify]` rebuilds `src/data/robotics-drones.ts` from `selection.py`.

## Policy (America-first, Nov 25, 2026)
- Prefer US-based companies. Foreign brands only from US allies (NATO, Japan, South Korea, Australia, Taiwan, Israel, and similar) that do not conflict with that setup.
- Never list Unitree. Never list a brand on the DoD Section 1260H list, the BIS Entity List, or other US sanctions, or a Chinese state/military-linked robotics maker.
- Autel Robotics (Shenzhen) is on the June 10, 2026 1260H list (91 FR 35189). Program status is `dropped`. Do not relist.
- HOVERAir / Zero Zero Robotics (Shenzhen) is kept for now: the company is not named on 1260H or the Entity List. Foreign-produced UAS are on the FCC Covered List by place of production; do not promise the newest model. The FCC directed US sales of the Versa to cease after its camera authorization was set aside; the Versa card is not listed.

## Current listings
- Robots International (main): Faraday Future FX Aegis / FX Navi (US, California).
- HOVERAir: official model pages for X1, X1 Smart, X1 PRO/PROMAX, and AQUA (plain links, no machine-readable prices). Versa is omitted (FCC cease-sale).
- Fillers (bottom of /directory/drones-robotics/ only, `filler: true`): Deep Robotics Lite3 (RobotShop), Galileo C1 and C1-W, PUDU D5 and D5-W, MagicLab MagicDog, MirrorMe BPX Pro. Not on 1260H or the Entity List as of Nov 25, 2026. Not featured, not on the home page, no badges, paid-search hidden. Unitree, Autel, Guo Xing, Topsky, Rotunbot, and Dagu stay off.

Raw source pulls kept beside this file are historical. Selection is the source of truth for what is on the site.
