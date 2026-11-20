/**
 * ReadyGearHub directory data: brands, services and free resources.
 * Gear listings (src/content/items) are grouped into the same categories on /gear/.
 * Entries or listings with a `tech` group also appear on /gear/tech/.
 *
 * Rules:
 *  - `program` = id in src/data/affiliates.ts. Every commercial entry should have one so it
 *    is affiliate-ready. resolveOutbound() emits a tracked link only when that program is
 *    `approved` and has a tracking URL; otherwise the plain official URL is used (no
 *    sponsored label, no tracking). Flip a program in affiliates.ts — do not rewrite entries.
 *  - Government and free resources (NWS, FEMA, Ready.gov, MEMA, CDC, Red Cross, and similar)
 *    must NOT have a `program` field. They stay permanently plain.
 *  - No prices, ratings or invented numbers. Say what the offer is (paid plan, quote service, free public resource).
 */
import { resolveOutbound } from './affiliates';

export type CategoryId =
  | 'power' | 'water' | 'food' | 'kits' | 'first-aid' | 'lighting' | 'comms'
  | 'offline-entertainment' | 'home-protection' | 'insurance' | 'digital-safety' | 'more';

export type TechGroupId =
  | 'portable-power' | 'home-backup' | 'satcom' | 'weather-radios' | 'water-tech' | 'smart-sensors';

export const techGroups: { id: TechGroupId; name: string; icon: string; blurb: string; note?: string }[] = [
  { id: 'portable-power', name: 'Portable power stations & solar', icon: '🔋',
    blurb: 'A portable power station and a foldable solar panel can run lights, phones, a fridge, or medical devices like a CPAP when the grid is down. Compare the manufacturer\u2019s capacity and output figures with what you actually need to run, and follow the manual for charging and storage.' },
  { id: 'home-backup', name: 'Home backup batteries', icon: '🏠',
    blurb: 'Larger battery systems are meant to cover more of the house during a longer outage. Whole-home setups and transfer equipment often need a licensed electrician. Follow the manufacturer\u2019s installation instructions, and keep a working carbon monoxide alarm if you also use a fuel generator to recharge.' },
  { id: 'satcom', name: 'Satellite messengers & satellite access', icon: '📡',
    blurb: 'When cell towers fail after a storm, a satellite messenger or a portable satellite access device can still send a text or an SOS. These tools need a clear view of the sky and a paid satellite subscription. They do not replace 911 where regular phone service still works. Some places restrict satellite communicators; check local rules.' },
  { id: 'weather-radios', name: 'NOAA weather radios', icon: '📻',
    blurb: 'A NOAA weather radio can keep working when the power and your phone network do not, so you can still hear watches and warnings. Look for SAME location coding so you get alerts for your county, and keep spare batteries or a hand-crank option.' },
  { id: 'water-tech', name: 'Water filters & purifiers', icon: '💧',
    blurb: 'Stored water is the first line of defense. A filter or purifier is a backup if that supply runs out or you have to use another source. Each model treats different contaminants \u2014 read the manufacturer\u2019s page for what it does and does not remove.' },
  { id: 'smart-sensors', name: 'Smart leak, freeze & smoke/CO sensors', icon: '🚨',
    blurb: 'Leak, freeze, and smoke/CO sensors can alert you early, including when you are away from home. They add a layer of warning; they do not replace regularly tested smoke and carbon monoxide alarms required by code. Follow the manufacturer\u2019s placement instructions, and check whether a hub, app, or professional install is required.' },
];

export const categories: { id: CategoryId; name: string; icon: string; blurb: string; note?: string }[] = [
  { id: 'power', name: 'Power', icon: '🔋', blurb: 'Power stations, solar panels, generators and power banks.',
    note: 'Fuel-burning gear (generators, heaters, stoves) must be used outdoors or as the manufacturer directs, with a working carbon monoxide alarm in your home. Follow each maker\u2019s ventilation instructions.' },
  { id: 'water', name: 'Water', icon: '💧', blurb: 'Filters, purifiers, storage containers and water testing.' },
  { id: 'food', name: 'Food', icon: '🥫', blurb: 'Long-shelf-life food and food-safety guidance for outages.' },
  { id: 'kits', name: 'Emergency kits', icon: '🎒', blurb: 'Ready-made emergency and readiness kits.' },
  { id: 'first-aid', name: 'First Aid', icon: '🩹', blurb: 'First aid kits, supplies and training.',
    note: 'Information here is not professional medical advice. Take a first aid class and ask a clinician what belongs in your kit.' },
  { id: 'lighting', name: 'Lighting', icon: '🔦', blurb: 'Flashlights, headlamps and lanterns for outages.' },
  { id: 'comms', name: 'Comms & Radios', icon: '📻', blurb: 'Weather radios, satellite messengers, two-way radios and official alert sources.' },
  { id: 'offline-entertainment', name: 'Offline entertainment', icon: '🎧',
    blurb: 'Things that can still work when the power or your phone network is down: music and audiobooks you already downloaded, a battery-powered speaker, and physical card games or printed comics that need no electricity. Streaming apps and audiobook services are paid subscriptions. Offline listening only works if you download the titles while you still have a connection, and if your phone, tablet, or speaker still has battery.',
    note: 'Hand-crank and solar weather radios are listed under Comms & Radios and on the newest prep tech page. This section does not include sports cards or sports content. Marvel Unlimited, the old digital comics app, is not listed because Marvel is retiring that service.' },
  { id: 'home-protection', name: 'Home Protection & Warranties', icon: '🏠', blurb: 'Smoke and CO alarms, security, home warranties and repair help.',
    note: 'A home warranty is a paid plan with its own coverage limits and exclusions. Read the contract and compare plans before you sign.' },
  { id: 'insurance', name: 'Insurance', icon: '📄', blurb: 'Where to compare coverage, plus official consumer guidance. Insurance is a paid product.' },
  { id: 'digital-safety', name: 'Digital Safety', icon: '🔐', blurb: 'Password managers, VPNs, data-removal services and official security guidance.' },
  { id: 'more', name: 'Warmth, Vehicle, Tools & Retailers', icon: '🧰', blurb: 'Heating backup, cold-weather and vehicle gear, tools, and general retailers.' },
];

export type DirEntry = {
  id: string;
  name: string;
  category: CategoryId;
  type: 'Brand' | 'Retailer' | 'Service' | 'Free resource' | 'Product';
  /** Official plain URL. */
  url: string;
  desc: string;
  /** Honest offer label shown on the card. */
  offer: string;
  /** affiliates.ts program id, if any. */
  program?: string;
  /** If set, this entry also appears in the matching group on /gear/tech/. */
  tech?: TechGroupId;
  /** Optional button label. Defaults to a generic official-site label. */
  cta?: string;
};

const BRAND = 'Manufacturer site';
const GOV = 'Free public resource';
const PAID_SUB = 'Paid subscription';
const QUOTE = 'Quote or matching service; terms are set by the provider';
const MARKET = 'Marketplace; terms are set by the seller';

export const entries: DirEntry[] = [
  // ---------------- Power ----------------
  { id: 'ecoflow', name: 'EcoFlow', category: 'power', type: 'Brand', url: 'https://www.ecoflow.com/us', desc: 'Portable power stations and solar panels.', offer: BRAND, program: 'ecoflow' },
  { id: 'bluetti', name: 'BLUETTI', category: 'power', type: 'Brand', url: 'https://www.bluettipower.com/', desc: 'Portable power stations, solar panels and home backup systems. Program code AFF5OFF for 5% off at checkout, per BLUETTI.', offer: BRAND, program: 'bluetti' },
  { id: 'jackery', name: 'Jackery', category: 'power', type: 'Brand', url: 'https://www.jackery.com/', desc: 'Portable power stations and SolarSaga solar panels.', offer: BRAND, program: 'jackery' },
  { id: 'anker-solix', name: 'Anker SOLIX', category: 'power', type: 'Brand', url: 'https://www.ankersolix.com/', desc: 'Power stations and home energy storage from Anker.', offer: BRAND, program: 'anker-solix' },
  { id: 'goal-zero', name: 'Goal Zero', category: 'power', type: 'Brand', url: 'https://goalzero.com/', desc: 'Power stations, solar panels and lanterns.', offer: BRAND, program: 'goal-zero' },
  { id: 'renogy', name: 'Renogy', category: 'power', type: 'Brand', url: 'https://www.renogy.com/', desc: 'Solar panels, solar kits and off-grid components.', offer: BRAND, program: 'renogy' },
  { id: 'allpowers', name: 'ALLPOWERS', category: 'power', type: 'Brand', url: 'https://www.iallpowers.com/', desc: 'Portable power stations and solar panels. Program code ALLPOWERS26 for 10% off at checkout, per ALLPOWERS.', offer: BRAND, program: 'allpowers' },
  { id: 'pecron', name: 'PECRON', category: 'power', type: 'Brand', url: 'https://www.pecron.com/', desc: 'Portable power stations.', offer: BRAND, program: 'pecron' },
  { id: 'mighty-generators', name: 'Mighty Generators', category: 'power', type: 'Retailer', url: 'https://mightygenerators.com/', desc: 'Generator retailer.', offer: 'Retailer site', program: 'mighty-generators' },
  { id: 'honda-power', name: 'Honda Power Equipment', category: 'power', type: 'Brand', url: 'https://powerequipment.honda.com/generators', desc: 'Portable inverter generators. Run generators outdoors only, per the manual.', offer: BRAND, program: 'honda-power' },
  { id: 'generac', name: 'Generac', category: 'power', type: 'Brand', url: 'https://www.generac.com/', desc: 'Portable and home standby generators. Run generators outdoors only, per the manual.', offer: BRAND, program: 'generac' },
  { id: 'energysage', name: 'EnergySage', category: 'power', type: 'Service', url: 'https://www.energysage.com/', desc: 'Marketplace for comparing rooftop solar and battery installer quotes.', offer: QUOTE, program: 'energysage' },
  { id: 'ecoflow-delta-pro-ultra', name: 'EcoFlow DELTA Pro Ultra', category: 'power', type: 'Product', url: 'https://www.ecoflow.com/us/delta-pro-ultra', desc: 'A whole-home backup battery system from EcoFlow. The official page describes an expandable system that can be paired with EcoFlow\u2019s Smart Home Panel 2. Installation may require a licensed electrician; follow EcoFlow\u2019s instructions.', offer: BRAND, program: 'ecoflow', tech: 'home-backup' },
  { id: 'anker-solix-f3800', name: 'Anker SOLIX F3800', category: 'power', type: 'Product', url: 'https://www.ankersolix.com/f3800-pps', desc: 'A large portable power station from Anker SOLIX designed for home backup. Anker lists 6,000W output, 3.84 kWh of capacity, 120V/240V output, and optional expansion batteries. Follow Anker\u2019s installation guidance for home-backup accessories.', offer: BRAND, program: 'anker-solix', tech: 'home-backup' },
  { id: 'bluetti-apex-300', name: 'BLUETTI Apex 300 Home Battery Backup', category: 'power', type: 'Product', url: 'https://www.bluettipower.com/products/apex-300-home-battery-backup', desc: 'A home battery backup power station from BLUETTI. The official page lists 3,840W of output and 2,764.8Wh of capacity, with options to expand for longer outages. Follow BLUETTI\u2019s installation guidance.', offer: BRAND, program: 'bluetti', tech: 'home-backup' },
  { id: 'ready-power', name: 'Ready.gov: Power Outages', category: 'power', type: 'Free resource', url: 'https://www.ready.gov/power-outages', desc: 'Official guidance on preparing for and getting through a power outage.', offer: GOV },

  // ---------------- Water ----------------
  { id: 'lifestraw', name: 'LifeStraw', category: 'water', type: 'Brand', url: 'https://www.lifestraw.com/', desc: 'Portable water filters and purifiers.', offer: BRAND, program: 'lifestraw' },
  { id: 'grayl', name: 'GRAYL', category: 'water', type: 'Brand', url: 'https://grayl.com/', desc: 'Press-style water purifier bottles.', offer: BRAND, program: 'grayl' },
  { id: 'katadyn', name: 'Katadyn', category: 'water', type: 'Brand', url: 'https://katadyn.com/en-us/', desc: 'Backpacking and emergency water filters.', offer: BRAND, program: 'katadyn' },
  { id: 'sawyer', name: 'Sawyer', category: 'water', type: 'Brand', url: 'https://www.sawyer.com/', desc: 'Squeeze and mini water filters.', offer: BRAND, program: 'sawyer' },
  { id: 'berkey', name: 'The Berkey', category: 'water', type: 'Retailer', url: 'https://theberkey.com/', desc: 'Gravity-fed countertop water filter systems.', offer: 'Retailer site', program: 'berkey', tech: 'water-tech', cta: 'See Berkey filters' },
  { id: 'aquasana', name: 'Aquasana', category: 'water', type: 'Brand', url: 'https://www.aquasana.com/', desc: 'Home water filtration systems.', offer: BRAND, program: 'aquasana' },
  { id: 'tap-score', name: 'Tap Score', category: 'water', type: 'Service', url: 'https://www.mytapscore.com/', desc: 'Mail-in home water test kits that analyze a sample you send.', offer: 'Paid test kits', program: 'tap-score' },
  { id: 'ready-water', name: 'Ready.gov: Water', category: 'water', type: 'Free resource', url: 'https://www.ready.gov/water', desc: 'Official guidance on storing and treating emergency drinking water.', offer: GOV },
  { id: 'cdc-water', name: 'CDC: Water Emergencies', category: 'water', type: 'Free resource', url: 'https://www.cdc.gov/water-emergency/index.html', desc: 'CDC information on safe water during and after emergencies.', offer: GOV },

  // ---------------- Food ----------------
  { id: 'readywise', name: 'ReadyWise', category: 'food', type: 'Brand', url: 'https://readywise.com/', desc: 'Long-shelf-life emergency food kits and supplies.', offer: BRAND, program: 'readywise' },
  { id: 'mountain-house', name: 'Mountain House', category: 'food', type: 'Brand', url: 'https://mountainhouse.com/', desc: 'Freeze-dried meals and emergency food buckets.', offer: BRAND, program: 'mountain-house' },
  { id: 'legacy-food', name: 'Legacy Food Storage', category: 'food', type: 'Brand', url: 'https://legacyfoodstorage.com/', desc: 'Long-term food storage kits.', offer: BRAND, program: 'legacy-food' },
  { id: 'augason-farms', name: 'Augason Farms', category: 'food', type: 'Brand', url: 'https://augasonfarms.com/', desc: 'Emergency food and pantry staples.', offer: BRAND, program: 'augason-farms' },
  { id: 'ready-food', name: 'Ready.gov: Food', category: 'food', type: 'Free resource', url: 'https://www.ready.gov/food', desc: 'Official guidance on stocking and handling food for emergencies.', offer: GOV },
  { id: 'usda-outage-food', name: 'USDA FSIS: Keep Your Food Safe During Emergencies', category: 'food', type: 'Free resource', url: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/emergencies/keep-your-food-safe-during-emergencies', desc: 'Official USDA guidance on what to keep or discard after an outage.', offer: GOV },

  // ---------------- Emergency kits ----------------
  { id: 'redi', name: 'REDI', category: 'kits', type: 'Brand', url: 'https://getredi.com/', desc: 'Emergency and readiness kits.', offer: 'Retailer site', program: 'redi', cta: 'See REDI kits' },

  // ---------------- First aid ----------------
  { id: 'mymedic', name: 'MyMedic', category: 'first-aid', type: 'Brand', url: 'https://mymedic.com/', desc: 'First aid kits and medical supplies.', offer: BRAND, program: 'mymedic' },
  { id: 'amk', name: 'Adventure Medical Kits', category: 'first-aid', type: 'Brand', url: 'https://adventuremedicalkits.com/', desc: 'Outdoor and family first aid kits.', offer: BRAND, program: 'amk' },
  { id: 'first-aid-only', name: 'First Aid Only', category: 'first-aid', type: 'Brand', url: 'https://firstaidonly.com/', desc: 'First aid kits for home, work and vehicles.', offer: BRAND, program: 'first-aid-only' },
  { id: 'mira-safety', name: 'MIRA Safety', category: 'first-aid', type: 'Brand', url: 'https://www.mirasafety.com/', desc: 'Protective and safety equipment.', offer: BRAND, program: 'mira-safety' },
  { id: 'redcross-first-aid', name: 'American Red Cross: First Aid Training', category: 'first-aid', type: 'Service', url: 'https://www.redcross.org/take-a-class/first-aid', desc: 'Find first aid, CPR and AED classes. Class fees vary by course.', offer: 'Training classes (course fees may apply)' },
  { id: 'redcross-prepare', name: 'American Red Cross: How to Prepare', category: 'first-aid', type: 'Free resource', url: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies.html', desc: 'Preparedness guides and checklists from the Red Cross.', offer: 'Free public resource' },
  { id: 'ready-kit', name: 'Ready.gov: Build a Kit', category: 'first-aid', type: 'Free resource', url: 'https://www.ready.gov/kit', desc: 'Official emergency supply kit checklist, including first aid items.', offer: GOV },

  // ---------------- Lighting ----------------
  { id: 'fenix', name: 'Fenix Lighting', category: 'lighting', type: 'Brand', url: 'https://www.fenixlighting.com/', desc: 'Flashlights and headlamps.', offer: BRAND, program: 'fenix' },
  { id: 'olight', name: 'Olight USA', category: 'lighting', type: 'Brand', url: 'https://www.olightstore.com/', desc: 'Flashlights and EDC lighting.', offer: BRAND, program: 'olight' },
  { id: 'nitecore', name: 'NITECORE', category: 'lighting', type: 'Brand', url: 'https://www.nitecorestore.com/', desc: 'Flashlights, headlamps and power banks.', offer: BRAND, program: 'nitecore' },
  { id: 'petzl', name: 'Petzl', category: 'lighting', type: 'Brand', url: 'https://www.petzl.com/US/en', desc: 'Headlamps.', offer: BRAND, program: 'petzl' },
  { id: 'black-diamond', name: 'Black Diamond', category: 'lighting', type: 'Brand', url: 'https://www.blackdiamondequipment.com/', desc: 'Headlamps and lanterns.', offer: BRAND, program: 'black-diamond' },

  // ---------------- Comms & radios ----------------
  { id: 'midland', name: 'Midland Radio', category: 'comms', type: 'Brand', url: 'https://midlandusa.com/', desc: 'Weather alert radios and two-way radios.', offer: BRAND, program: 'midland' },
  { id: 'eton', name: 'Eton', category: 'comms', type: 'Brand', url: 'https://etoncorp.com/', desc: 'Hand-crank and solar emergency radios.', offer: BRAND, program: 'eton' },
  { id: 'garmin', name: 'Garmin inReach', category: 'comms', type: 'Brand', url: 'https://www.garmin.com/en-US/c/outdoor-recreation/satellite-communicators/', desc: 'Satellite communicators. A subscription plan is needed for satellite messaging; check the maker\u2019s plan terms.', offer: BRAND, program: 'garmin' },
  { id: 'garmin-inreach-messenger', name: 'Garmin inReach Messenger', category: 'comms', type: 'Product', url: 'https://www.garmin.com/en-US/p/793265/', desc: 'A compact satellite communicator for two-way messaging and SOS when you are outside cell coverage. A satellite subscription is required; check Garmin\u2019s plan terms.', offer: BRAND, program: 'garmin', tech: 'satcom' },
  { id: 'zoleo-satellite-communicator', name: 'ZOLEO Satellite Communicator', category: 'comms', type: 'Product', url: 'https://www.zoleo.com/en-us/product/zoleo-global-satellite-communicator', desc: 'A satellite communicator for two-way messaging, check-ins, and SOS beyond cell coverage, via the Iridium network. An active subscription is required, and the device needs a clear view of the sky.', offer: BRAND, program: 'zoleo', tech: 'satcom' },
  { id: 'iridium-go-exec', name: 'Iridium GO! exec', category: 'comms', type: 'Product', url: 'https://www.iridium.com/products/iridium-go-exec-portable-wireless-access-device', desc: 'A portable, battery-powered satellite Wi-Fi access device from Iridium. The official page says it can provide satellite connectivity for smartphones and laptops, with optional SOS monitoring. A satellite service plan is required.', offer: BRAND, program: 'iridium', tech: 'satcom' },
  { id: 'bluecosmo', name: 'BlueCosmo (ZOLEO)', category: 'comms', type: 'Retailer', url: 'https://www.bluecosmo.com/', desc: 'Satellite messenger devices and service plans. Satellite service is a paid plan.', offer: 'Retailer site', program: 'bluecosmo' },
  { id: 'btech', name: 'BTECH', category: 'comms', type: 'Brand', url: 'https://www.baofengtech.com/', desc: 'Two-way radios. Check FCC rules and licensing requirements before transmitting.', offer: BRAND, program: 'btech' },
  { id: 'acurite', name: 'AcuRite', category: 'comms', type: 'Brand', url: 'https://www.acurite.com/', desc: 'Home weather stations and thermometers.', offer: BRAND, program: 'acurite' },
  { id: 'nws', name: 'National Weather Service', category: 'comms', type: 'Free resource', url: 'https://www.weather.gov/', desc: 'Official forecasts, watches and warnings.', offer: GOV },
  { id: 'nwr', name: 'NOAA Weather Radio', category: 'comms', type: 'Free resource', url: 'https://www.weather.gov/nwr/', desc: 'National Weather Service information on all-hazards weather radio.', offer: GOV },
  { id: 'fema', name: 'FEMA', category: 'comms', type: 'Free resource', url: 'https://www.fema.gov/', desc: 'Federal disaster information, assistance and preparedness.', offer: GOV },
  { id: 'fema-app', name: 'FEMA Mobile App', category: 'comms', type: 'Free resource', url: 'https://www.fema.gov/about/news-multimedia/mobile-products', desc: 'FEMA\u2019s official mobile app and alert resources.', offer: GOV },
  { id: 'ready-gov', name: 'Ready.gov', category: 'comms', type: 'Free resource', url: 'https://www.ready.gov/', desc: 'Official preparedness hub for hazards, plans and kits.', offer: GOV },
  { id: 'ready-alerts', name: 'Ready.gov: Alerts and Warnings', category: 'comms', type: 'Free resource', url: 'https://www.ready.gov/alerts', desc: 'How emergency alerts reach you and how to sign up.', offer: GOV },
  { id: 'mema', name: 'MEMA (Mississippi Emergency Management Agency)', category: 'comms', type: 'Free resource', url: 'https://www.msema.org/', desc: 'Official Mississippi emergency management information.', offer: GOV },

  // ---------------- Home protection & warranties ----------------
  { id: 'choice-home-warranty', name: 'Choice Home Warranty', category: 'home-protection', type: 'Service', url: 'https://www.choicehomewarranty.com/', desc: 'Sells home warranty plans for major systems and appliances. A warranty is a paid plan; check the price and coverage terms before you sign up.', offer: 'Paid plan: check price and terms', program: 'choice-home-warranty' },
  { id: 'american-home-shield', name: 'American Home Shield', category: 'home-protection', type: 'Service', url: 'https://www.ahs.com/', desc: 'Sells home warranty plans. A warranty is a paid plan; check the price and coverage terms.', offer: 'Paid plan: check price and terms', program: 'american-home-shield' },
  { id: 'kidde', name: 'Kidde', category: 'home-protection', type: 'Brand', url: 'https://www.kidde.com/', desc: 'Smoke, carbon monoxide and fire extinguisher products.', offer: BRAND, program: 'kidde' },
  { id: 'ring', name: 'Ring', category: 'home-protection', type: 'Brand', url: 'https://ring.com/', desc: 'Doorbells, cameras and home security devices. Some features need a paid plan.', offer: BRAND, program: 'ring' },
  { id: 'flo-smart-water-monitor', name: 'Flo by Moen Smart Water Monitor and Shutoff', category: 'home-protection', type: 'Product', url: 'https://www.moen.com/products/900-001', desc: 'An in-line device that monitors household water flow, sends leak alerts, and can automatically shut off the supply, per Moen. The official page says it needs Wi-Fi and a nearby AC outlet, and recommends installation by a licensed plumber.', offer: BRAND, program: 'moen', tech: 'smart-sensors' },
  { id: 'yolink-water-leak-sensor-5', name: 'YoLink Water Leak Sensor 5', category: 'home-protection', type: 'Product', url: 'https://shop.yosmart.com/products/ys7986', desc: 'A water leak sensor from YoLink that can send app alerts. A YoLink hub is required for app alerts and is not included, per the official page. Automatic shutoff needs a compatible valve sold separately.', offer: BRAND, program: 'yolink', tech: 'smart-sensors' },
  { id: 'ring-flood-freeze-sensor', name: 'Ring Flood & Freeze Sensor', category: 'home-protection', type: 'Product', url: 'https://ring.com/products/flood-and-freeze-sensor', desc: 'A Ring sensor for standing water and freezing temperatures, with alerts on your phone. Check the official page for which Ring system or service it works with; some Ring features need a paid plan.', offer: BRAND, program: 'ring', tech: 'smart-sensors' },
  { id: 'kidde-smart-combo-smoke-co', name: 'Kidde Smart Combo Smoke + CO Alarm', category: 'home-protection', type: 'Product', url: 'https://www.kidde.com/products/smart/smart-combo-smoke-co-alarm-hardwired-aa-backup-battery', desc: 'A hardwired Kidde smoke and carbon monoxide alarm with AA backup batteries, Wi-Fi setup, and notifications in the Kidde app, per Kidde. Follow the manufacturer\u2019s placement instructions and local code.', offer: BRAND, program: 'kidde', tech: 'smart-sensors' },
  { id: 'cove', name: 'Cove Smart Home Security', category: 'home-protection', type: 'Service', url: 'https://www.covesmart.com/', desc: 'Home security systems with monitoring plans.', offer: 'Paid monitoring plans', program: 'cove' },
  { id: 'angi', name: 'Angi', category: 'home-protection', type: 'Service', url: 'https://www.angi.com/', desc: 'Find local contractors for repairs.', offer: QUOTE, program: 'angi' },
  { id: 'modernize', name: 'Modernize', category: 'home-protection', type: 'Service', url: 'https://modernize.com/', desc: 'Matches homeowners with local home-improvement contractors.', offer: QUOTE, program: 'modernize' },
  { id: 'networx', name: 'Networx', category: 'home-protection', type: 'Service', url: 'https://www.networx.com/', desc: 'Connects homeowners with local contractors.', offer: QUOTE, program: 'networx' },
  { id: 'leaffilter', name: 'LeafFilter', category: 'home-protection', type: 'Service', url: 'https://www.leaffilter.com/', desc: 'Gutter protection installation.', offer: 'Paid installation service', program: 'leaffilter' },
  { id: 'ready-home-fires', name: 'Ready.gov: Home Fires', category: 'home-protection', type: 'Free resource', url: 'https://www.ready.gov/home-fires', desc: 'Official home fire safety and smoke alarm guidance.', offer: GOV },

  // ---------------- Insurance ----------------
  { id: 'liberty-mutual', name: 'Liberty Mutual', category: 'insurance', type: 'Service', url: 'https://www.libertymutual.com/', desc: 'Home, auto and renters insurance. You can start a quote online; coverage is a paid policy.', offer: 'Insurance quote; policy is paid', program: 'liberty-mutual' },
  { id: 'hiscox', name: 'Hiscox Small Business Insurance', category: 'insurance', type: 'Service', url: 'https://www.hiscox.com/small-business-insurance', desc: 'Small-business insurance. You can start a quote online; coverage is a paid policy.', offer: 'Insurance quote; policy is paid', program: 'hiscox' },
  { id: 'axa-travel', name: 'AXA Travel Insurance', category: 'insurance', type: 'Service', url: 'https://www.axatravelinsurance.com/', desc: 'Travel insurance plans. Plans are paid; compare coverage terms.', offer: 'Paid plans', program: 'axa-insurance-usa' },
  { id: 'floodsmart', name: 'FloodSmart (NFIP)', category: 'insurance', type: 'Free resource', url: 'https://www.floodsmart.gov/', desc: 'Official National Flood Insurance Program information. Home policies usually do not cover flooding.', offer: GOV },
  { id: 'naic', name: 'NAIC: Consumer Insurance Information', category: 'insurance', type: 'Free resource', url: 'https://content.naic.org/consumer', desc: 'Consumer guides from the National Association of Insurance Commissioners.', offer: GOV },
  { id: 'mid', name: 'Mississippi Insurance Department', category: 'insurance', type: 'Free resource', url: 'https://www.mid.ms.gov/', desc: 'State insurance regulator with consumer help and complaint resources.', offer: GOV },
  { id: 'ready-floods', name: 'Ready.gov: Floods', category: 'insurance', type: 'Free resource', url: 'https://www.ready.gov/floods', desc: 'Official flood preparedness guidance.', offer: GOV },

  // ---------------- Digital safety ----------------
  { id: 'nordpass', name: 'NordPass', category: 'digital-safety', type: 'Service', url: 'https://nordpass.com/', desc: 'Password manager. Free and paid tiers may exist; check the provider\u2019s current plans.', offer: 'Password manager (see provider plans)', program: 'nordpass' },
  { id: 'nordvpn', name: 'NordVPN', category: 'digital-safety', type: 'Service', url: 'https://nordvpn.com/', desc: 'VPN service sold as a paid subscription.', offer: PAID_SUB, program: 'nordvpn' },
  { id: 'surfshark', name: 'Surfshark', category: 'digital-safety', type: 'Service', url: 'https://surfshark.com/', desc: 'VPN service sold as a paid subscription.', offer: PAID_SUB, program: 'surfshark' },
  { id: 'expressvpn', name: 'ExpressVPN', category: 'digital-safety', type: 'Service', url: 'https://www.expressvpn.com/', desc: 'VPN service sold as a paid subscription.', offer: PAID_SUB, program: 'expressvpn' },
  { id: 'cyberghost', name: 'CyberGhost', category: 'digital-safety', type: 'Service', url: 'https://www.cyberghostvpn.com/', desc: 'VPN service sold as a paid subscription.', offer: PAID_SUB, program: 'cyberghost' },
  { id: 'pia', name: 'Private Internet Access', category: 'digital-safety', type: 'Service', url: 'https://www.privateinternetaccess.com/', desc: 'VPN service sold as a paid subscription.', offer: PAID_SUB, program: 'private-internet-access' },
  { id: 'proton', name: 'Proton', category: 'digital-safety', type: 'Service', url: 'https://proton.me/', desc: 'Privacy-focused email, VPN, drive and password tools. Free and paid tiers may exist; check current plans.', offer: 'See provider plans', program: 'proton' },
  { id: 'roboform', name: 'RoboForm', category: 'digital-safety', type: 'Service', url: 'https://www.roboform.com/', desc: 'Password manager.', offer: 'See provider plans', program: 'roboform' },
  { id: '1password', name: '1Password', category: 'digital-safety', type: 'Service', url: 'https://1password.com/', desc: 'Password manager sold as a paid subscription.', offer: PAID_SUB, program: '1password' },
  { id: 'deleteme', name: 'DeleteMe', category: 'digital-safety', type: 'Service', url: 'https://joindeleteme.com/', desc: 'Personal data-removal service sold as a paid subscription.', offer: PAID_SUB, program: 'deleteme' },
  { id: 'incogni', name: 'Incogni', category: 'digital-safety', type: 'Service', url: 'https://incogni.com/', desc: 'Personal data-removal service sold as a paid subscription.', offer: PAID_SUB, program: 'incogni' },
  { id: 'monarch', name: 'Monarch', category: 'digital-safety', type: 'Service', url: 'https://www.monarchmoney.com/', desc: 'Personal finance and budgeting app; useful for tracking an emergency fund.', offer: 'See provider plans', program: 'monarch' },
  { id: 'cisa-sow', name: 'CISA: Secure Our World', category: 'digital-safety', type: 'Free resource', url: 'https://www.cisa.gov/secure-our-world/secure-yourself-your-family', desc: 'Official basic cybersecurity tips: passwords, updates, phishing, MFA.', offer: GOV },
  { id: 'identitytheft', name: 'IdentityTheft.gov', category: 'digital-safety', type: 'Free resource', url: 'https://www.identitytheft.gov/', desc: 'FTC\u2019s official site to report identity theft and get a recovery plan.', offer: GOV },

  // ---------------- Warmth, vehicle, tools & retailers ----------------
  { id: 'coleman', name: 'Coleman', category: 'more', type: 'Brand', url: 'https://www.coleman.com/', desc: 'Camping stoves, coolers and outdoor gear. Use fuel-burning stoves outdoors only.', offer: BRAND, program: 'coleman' },
  { id: 'yeti', name: 'YETI', category: 'more', type: 'Brand', url: 'https://www.yeti.com/', desc: 'Coolers and insulated drinkware.', offer: BRAND, program: 'yeti' },
  { id: 'carhartt', name: 'Carhartt', category: 'more', type: 'Brand', url: 'https://www.carhartt.com/', desc: 'Workwear and cold-weather clothing.', offer: BRAND, program: 'carhartt' },
  { id: 'hunter-boots', name: 'Hunter Boots', category: 'more', type: 'Brand', url: 'https://www.hunterboots.com/us/en_us/', desc: 'Rain and wet-weather boots.', offer: BRAND, program: 'hunter-boots' },
  { id: 'magid', name: 'Magid Glove & Safety', category: 'more', type: 'Brand', url: 'https://www.magidglove.com/', desc: 'Work gloves and safety gear.', offer: BRAND, program: 'magid' },
  { id: 'mro-supreme', name: 'MRO Supreme', category: 'more', type: 'Retailer', url: 'https://www.mrosupreme.com/', desc: 'Maintenance, repair and operations supplies and tools.', offer: 'Retailer site', program: 'mro-supreme' },
  { id: 'bass-pro', name: 'Bass Pro Shops', category: 'more', type: 'Retailer', url: 'https://www.basspro.com/c/camping', desc: 'Outdoor retailer with camping, cooking, lighting, and weather gear.', offer: 'Retailer site', program: 'bass-pro' },
  { id: 'cabelas', name: "Cabela's", category: 'more', type: 'Retailer', url: 'https://www.cabelas.com/c/camping', desc: 'Outdoor retailer with camping, cooking, lighting, and weather gear.', offer: 'Retailer site', program: 'cabelas' },
  { id: 'academy', name: 'Academy Sports + Outdoors', category: 'more', type: 'Retailer', url: 'https://www.academy.com/', desc: 'Outdoor retailer with camping, cooking, lighting, and weather gear.', offer: 'Retailer site', program: 'academy' },
  { id: 'sportsmans', name: "Sportsman's Warehouse", category: 'more', type: 'Retailer', url: 'https://www.sportsmans.com/camping-gear-supplies/c/cat100829', desc: 'Outdoor retailer with camping, cooking, lighting, and emergency gear.', offer: 'Retailer site', program: 'sportsmans' },
  { id: 'sportsmans-guide', name: "Sportsman's Guide", category: 'more', type: 'Retailer', url: 'https://www.sportsmansguide.com/department/camping?d=117', desc: 'Catalog retailer with camping, cooking, lighting, and outdoor gear.', offer: 'Retailer site', program: 'sportsmans-guide' },
  { id: 'dicks', name: "DICK'S Sporting Goods", category: 'more', type: 'Retailer', url: 'https://www.dickssportinggoods.com/c/camping-hiking-gear', desc: 'Retailer with camping, cooking, lighting, and outdoor gear.', offer: 'Retailer site', program: 'dicks' },
  { id: 'survival-frog', name: 'Survival Frog', category: 'more', type: 'Retailer', url: 'https://www.survivalfrog.com/collections/n-camping', desc: 'Camping, lighting, power, and emergency-prep gear.', offer: 'Retailer site', program: 'survival-frog' },
  { id: 'walmart', name: 'Walmart', category: 'more', type: 'Retailer', url: 'https://www.walmart.com/', desc: 'General retailer.', offer: 'Retailer site', program: 'walmart' },
  { id: 'home-depot', name: 'The Home Depot', category: 'more', type: 'Retailer', url: 'https://www.homedepot.com/', desc: 'Home improvement retailer.', offer: 'Retailer site', program: 'home-depot' },
  { id: 'ace-hardware', name: 'Ace Hardware', category: 'more', type: 'Retailer', url: 'https://www.acehardware.com/', desc: 'Hardware retailer.', offer: 'Retailer site', program: 'ace-hardware' },
  { id: 'amazon', name: 'Amazon', category: 'more', type: 'Retailer', url: 'https://www.amazon.com/', desc: 'General retailer.', offer: 'Retailer site', program: 'amazon' },

  // ---------------- Offline entertainment ----------------
  { id: 'audible', name: 'Audible', category: 'offline-entertainment', type: 'Service', url: 'https://www.audible.com/', desc: 'A paid audiobook and podcast service from Amazon. You can download titles to listen later, including when you do not have a signal, as long as your device still has battery.', offer: PAID_SUB, program: 'amazon' },
  { id: 'amazon-music', name: 'Amazon Music Unlimited', category: 'offline-entertainment', type: 'Service', url: 'https://www.amazon.com/music/unlimited', desc: 'A paid music streaming plan from Amazon. Amazon says you can download songs and albums to play offline. Download the music while you still have a connection, and keep your device charged.', offer: PAID_SUB, program: 'amazon' },
  { id: 'apple-music', name: 'Apple Music', category: 'offline-entertainment', type: 'Service', url: 'https://www.apple.com/apple-music/', desc: 'A paid music streaming plan from Apple. Apple says you can download music and playlists to play offline on a compatible device. Download the music while you still have a connection, and keep your device charged.', offer: PAID_SUB, program: 'apple-services' },
  { id: 'jbl-flip-7', name: 'JBL Flip 7', category: 'offline-entertainment', type: 'Product', url: 'https://www.jbl.com/FLIP-7.html', desc: 'A portable Bluetooth speaker from JBL with a rechargeable battery. JBL describes the Flip 7 as waterproof and drop-proof. Charge it while you have power if you want to use it during an outage.', offer: BRAND, program: 'jbl' },
  { id: 'sonos-roam-2', name: 'Sonos Roam 2', category: 'offline-entertainment', type: 'Product', url: 'https://www.sonos.com/en-us/shop/roam-2', desc: 'A portable Bluetooth speaker from Sonos with a rechargeable battery. Sonos describes Roam 2 as waterproof. It can also connect to Wi-Fi at home. Charge it while you have power if you want to use it during an outage.', offer: BRAND, program: 'sonos' },
  { id: 'skullcandy-session-360', name: 'Skullcandy Session 360', category: 'offline-entertainment', type: 'Product', url: 'https://www.skullcandy.com/products/session-360', desc: 'A portable Bluetooth speaker from Skullcandy with a rechargeable battery. Skullcandy describes it as a rugged, waterproof speaker. Charge it while you have power if you want to use it during an outage.', offer: BRAND, program: 'skullcandy' },
  { id: 'crutchfield', name: 'Crutchfield', category: 'offline-entertainment', type: 'Retailer', url: 'https://www.crutchfield.com/', desc: 'A specialty audio and electronics retailer that sells headphones, portable speakers, radios, and home audio gear. Check the product page for the current model and whether a speaker or radio runs on batteries.', offer: 'Retailer site', program: 'crutchfield' },
  { id: 'tcgplayer', name: 'TCGplayer', category: 'offline-entertainment', type: 'Retailer', url: 'https://www.tcgplayer.com/', desc: 'A marketplace for trading card games such as Pokémon and Magic: The Gathering. Cards and decks are physical, so they do not need power or a signal once you have them.', offer: MARKET, program: 'tcgplayer' },
  { id: 'ebay-collectible-card-games', name: 'eBay Collectible Card Games', category: 'offline-entertainment', type: 'Retailer', url: 'https://www.ebay.com/b/Collectible-Card-Games-Accessories/2536/bn_1852210', desc: "eBay's Collectible Card Games category, including games such as Pokémon and Magic: The Gathering. This is not eBay's sports-card category. Listings come from many sellers; check condition and seller terms before you buy.", offer: MARKET, program: 'ebay' },
  { id: 'ebay-non-sport-trading-cards', name: 'eBay Non-Sport Trading Cards', category: 'offline-entertainment', type: 'Retailer', url: 'https://www.ebay.com/t/Non-Sport-Trading-Card-Singles/183050/bn_2313580', desc: "eBay's Non-Sport Trading Card Singles category, for collectible cards that are not sports cards. Listings come from many sellers; check condition and seller terms before you buy.", offer: MARKET, program: 'ebay' },
  { id: 'pokemon-tcg', name: 'Pokémon Trading Card Game', category: 'offline-entertainment', type: 'Brand', url: 'https://www.pokemon.com/us/pokemon-tcg', desc: 'The official Pokémon Trading Card Game site, with current game information and official product news. The cards themselves are a physical game that needs no power.', offer: BRAND, program: 'pokemon-tcg' },
  { id: 'magic-the-gathering', name: 'Magic: The Gathering', category: 'offline-entertainment', type: 'Brand', url: 'https://magic.wizards.com/en/products', desc: 'The official Magic: The Gathering products site from Wizards of the Coast. Magic is a physical card game that needs no power once you have a deck.', offer: BRAND, program: 'wizards-mtg' },
  { id: 'marvel-comics', name: 'Marvel Comics', category: 'offline-entertainment', type: 'Brand', url: 'https://www.marvel.com/comics/', desc: "Marvel's official comics page for current issues and release information. Printed comics need no power to read. This is not a link to Marvel Unlimited, the digital subscription app Marvel is retiring.", offer: 'Official comics site', program: 'marvel' },
  { id: 'dc-shop-books', name: 'DC Shop Books & Comics', category: 'offline-entertainment', type: 'Retailer', url: 'https://shop.dc.com/collections/books', desc: 'The official DC Shop collection of comic books and graphic novels. Printed comics need no power to read.', offer: 'Official shop', program: 'dc-shop' },
  { id: 'amazon-comics', name: 'Amazon Comics & Graphic Novels', category: 'offline-entertainment', type: 'Retailer', url: 'https://www.amazon.com/comics', desc: "Amazon's Comics & Graphic Novels store, including print and some digital titles. Digital comics need a charged device; printed comics do not need power.", offer: 'Retailer site', program: 'amazon' },
];

/** Gear listing id -> category. Anything not listed falls into 'more'. */
const itemCategory: Record<string, CategoryId> = {};
const put = (cat: CategoryId, ids: string[]) => ids.forEach((i) => (itemCategory[i] = cat));
put('power', ['anker-prime-power-bank-20k-220w', 'anker-solix-c1000x', 'anker-solix-f2000', 'bluetti-200w-solar-panel', 'bluetti-ac180', 'bluetti-ac70',
  'ecoflow-400w-portable-solar-panel', 'ecoflow-delta-3-plus', 'ecoflow-river-3-plus', 'generac-iq3500', 'goal-zero-nomad-100-plus', 'goal-zero-nomad-50',
  'goal-zero-yeti-1500', 'honda-eu2200i', 'honda-eu3200i', 'jackery-explorer-1000-plus', 'jackery-explorer-300-v2', 'jackery-solarsaga-100-prime',
  'jackery-solarsaga-200', 'renogy-100w-12v-solar-kit']);
put('water', ['datrex-emergency-water-dx1000w', 'grayl-geopress-24oz', 'grayl-ultrapress-16-9oz', 'katadyn-befree-0-6l', 'lifestraw-family', 'lifestraw-personal',
  'lifestraw-straw-emergency-pack', 'reliance-aqua-tainer', 'reliance-jumbo-tainer-2', 'sawyer-mini-water-filter', 'sawyer-squeeze-water-filter', 'waterbob']);
put('food', ['augason-farms-30-day-1-person', 'mountain-house-classic-bucket', 'readywise-4-week-food-supply', 'readywise-5-day-survival-backpack', 'readywise-72-hour-food-kit']);
put('first-aid', ['amk-adventure-first-aid-family', 'amk-mountain-series-explorer', 'amk-mountain-series-hiker', 'amk-trauma-pak-quikclot', 'amk-ultralight-watertight-9',
  'first-aid-only-50-person-272', 'mymedic-myfak', 'philips-heartstart-onsite', 'sam-splint']);
put('lighting', ['biolite-alpenglow-500', 'black-diamond-spot-400', 'eton-blackout-buddy-h2o', 'fenix-hm65r-v2', 'goal-zero-lighthouse-600', 'petzl-actik-core']);
put('comms', ['eton-red-cross-frx2', 'garmin-inreach-mini-2', 'midland-er310-crank-radio', 'midland-wr400']);
put('home-protection', ['eton-blackout-buddy-co', 'kidde-kn-cob-lp2', 'kidde-pro-210']);

export const categoryForItem = (id: string): CategoryId => itemCategory[id] ?? 'more';

/** Gear listing id -> tech group for /gear/tech/. Listings not listed here stay off that page. */
const itemTech: Record<string, TechGroupId> = {};
const putTech = (group: TechGroupId, ids: string[]) => ids.forEach((i) => (itemTech[i] = group));
putTech('portable-power', [
  'ecoflow-delta-3-plus', 'ecoflow-river-3-plus', 'ecoflow-400w-portable-solar-panel',
  'jackery-explorer-1000-plus', 'bluetti-ac180', 'anker-solix-c1000x', 'goal-zero-yeti-1500',
]);
putTech('satcom', ['garmin-inreach-mini-2']);
putTech('weather-radios', ['midland-wr400', 'midland-er310-crank-radio', 'eton-red-cross-frx2']);
putTech('water-tech', ['grayl-geopress-24oz', 'lifestraw-family', 'sawyer-mini-water-filter', 'katadyn-befree-0-6l']);

export const techGroupForItem = (id: string): TechGroupId | undefined => itemTech[id];

export type ResolvedEntry = DirEntry & { href: string; affiliate: boolean; programId: string };

/** Resolve the outbound link through the shared helper. Free resources omit `program` and stay plain. */
export function resolveEntry(e: DirEntry): ResolvedEntry {
  const out = resolveOutbound(e.program, e.url);
  return { ...e, href: out.href, affiliate: out.affiliate, programId: out.programId };
}
