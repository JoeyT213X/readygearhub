/**
 * ReadyGearHub directory data: brands, services and free resources.
 * Gear listings (src/content/items) are grouped into the same categories on /gear/.
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
  | 'power' | 'water' | 'food' | 'first-aid' | 'lighting' | 'comms'
  | 'home-protection' | 'insurance' | 'digital-safety' | 'more';

export const categories: { id: CategoryId; name: string; icon: string; blurb: string; note?: string }[] = [
  { id: 'power', name: 'Power', icon: '🔋', blurb: 'Power stations, solar panels, generators and power banks.',
    note: 'Fuel-burning gear (generators, heaters, stoves) must be used outdoors or as the manufacturer directs, with a working carbon monoxide alarm in your home. Follow each maker\u2019s ventilation instructions.' },
  { id: 'water', name: 'Water', icon: '💧', blurb: 'Filters, purifiers, storage containers and water testing.' },
  { id: 'food', name: 'Food', icon: '🥫', blurb: 'Long-shelf-life food and food-safety guidance for outages.' },
  { id: 'first-aid', name: 'First Aid', icon: '🩹', blurb: 'First aid kits, supplies and training.',
    note: 'Information here is not professional medical advice. Take a first aid class and ask a clinician what belongs in your kit.' },
  { id: 'lighting', name: 'Lighting', icon: '🔦', blurb: 'Flashlights, headlamps and lanterns for outages.' },
  { id: 'comms', name: 'Comms & Radios', icon: '📻', blurb: 'Weather radios, satellite messengers, two-way radios and official alert sources.' },
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
  type: 'Brand' | 'Retailer' | 'Service' | 'Free resource';
  /** Official plain URL. */
  url: string;
  desc: string;
  /** Honest offer label shown on the card. */
  offer: string;
  /** affiliates.ts program id, if any. */
  program?: string;
};

const BRAND = 'Manufacturer site';
const GOV = 'Free public resource';
const PAID_SUB = 'Paid subscription';
const QUOTE = 'Quote or matching service; terms are set by the provider';

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
  { id: 'ready-power', name: 'Ready.gov: Power Outages', category: 'power', type: 'Free resource', url: 'https://www.ready.gov/power-outages', desc: 'Official guidance on preparing for and getting through a power outage.', offer: GOV },

  // ---------------- Water ----------------
  { id: 'lifestraw', name: 'LifeStraw', category: 'water', type: 'Brand', url: 'https://www.lifestraw.com/', desc: 'Portable water filters and purifiers.', offer: BRAND, program: 'lifestraw' },
  { id: 'grayl', name: 'GRAYL', category: 'water', type: 'Brand', url: 'https://grayl.com/', desc: 'Press-style water purifier bottles.', offer: BRAND, program: 'grayl' },
  { id: 'katadyn', name: 'Katadyn', category: 'water', type: 'Brand', url: 'https://katadyn.com/en-us/', desc: 'Backpacking and emergency water filters.', offer: BRAND, program: 'katadyn' },
  { id: 'sawyer', name: 'Sawyer', category: 'water', type: 'Brand', url: 'https://www.sawyer.com/', desc: 'Squeeze and mini water filters.', offer: BRAND, program: 'sawyer' },
  { id: 'berkey', name: 'The Berkey', category: 'water', type: 'Retailer', url: 'https://www.theberkey.com/', desc: 'Gravity-fed countertop water filter systems.', offer: 'Retailer site', program: 'berkey' },
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

export type ResolvedEntry = DirEntry & { href: string; affiliate: boolean; programId: string };

/** Resolve the outbound link through the shared helper. Free resources omit `program` and stay plain. */
export function resolveEntry(e: DirEntry): ResolvedEntry {
  const out = resolveOutbound(e.program, e.url);
  return { ...e, href: out.href, affiliate: out.affiliate, programId: out.programId };
}
