/**
 * Backup Power & Propane directory: curated from Destructicon's
 * /workspace/genlist/backup-power-list.md (Nov 27, 2026). Amazon titles
 * come from the Chrome checks in oA–oD and a1.out. No prices or ratings
 * are stored. Do not add a card whose page was not verified.
 */
import type { CatalogItem } from './full-catalog';
import { amazonProductUrl, resolveOutbound, isNoPpcProgram } from './affiliates';
import type { SourceCategoryId } from './source-directory';

export type BackupPowerSectionId =
  | 'generators'
  | 'transfer'
  | 'tanks'
  | 'hoses'
  | 'safety'
  | 'energy-reserve';

export const backupPowerSections: { id: BackupPowerSectionId; name: string; blurb: string }[] = [
  { id: 'generators', name: 'Generators', blurb: 'Portable, inverter, dual-fuel and tri-fuel generators. Always run them outdoors, at least 20 feet from windows, doors and attached garages (Ready.gov and CPSC).' },
  { id: 'transfer', name: 'Transfer switches & inlets', blurb: 'Listed transfer switches, inlet boxes, cords and manufacturer interlock kits. A licensed electrician should install anything that connects to house wiring. Never backfeed through a dryer or wall outlet.' },
  { id: 'tanks', name: 'Propane tanks', blurb: 'Refillable cylinders for dual-fuel generators, heaters and stoves. Store outdoors and upright. Larger or permanent tanks in Mississippi need an L.C. Gas installer and an installation report.' },
  { id: 'hoses', name: 'Hoses & regulators', blurb: 'Extension hoses, tees and regulators. Match the hose and regulator to the appliance’s fuel and pressure requirements, and check fittings for leaks with soapy water, not a flame.' },
  { id: 'safety', name: 'Outdoor safety', blurb: 'CO alarms, purpose-built running canopies and a pad to keep a generator off wet ground. A canopy is not a reason to move a generator closer than 20 feet to the house.' },
  { id: 'energy-reserve', name: 'Energy Reserve home-backup', blurb: 'Home-backup Energy Reserves and the transfer kits made for them. These stay indoors; fuel generators still stay outside. Follow each maker’s installation guidance and use a licensed electrician for a home hookup.' },
];

/**
 * Existing catalog cards to cross-list into this category (do not create a second card).
 * Value is the section they belong in.
 */
export const BACKUP_POWER_ALSO_IN: Record<string, BackupPowerSectionId> = {
  'amz-b0cpt83mtv': 'generators',
  'amz-b07g7ggfv6': 'generators',
  'amz-b076hq2thc': 'transfer',
  'kidde-kn-cob-lp2': 'safety',
  'bluetti-apex-300': 'energy-reserve',
  'bluetti-elite-300': 'energy-reserve',
  'bluetti-elite-200-v2': 'energy-reserve',
  'anker-solix-f3800-plus': 'energy-reserve',
  'ecoflow-delta-3-plus': 'energy-reserve',
  'allpowers-s2000-pro': 'energy-reserve',
  'allpowers-r2500-v2': 'energy-reserve',
};

const STOCK: Record<BackupPowerSectionId, string> = {
  generators: '/images/photos/portable-generator-960.webp',
  transfer: '/images/photos/stock-house-960.webp',
  tanks: '/images/photos/hero-campsite-960.webp',
  hoses: '/images/photos/hero-campsite-960.webp',
  safety: '/images/photos/stock-alarm-960.webp',
  'energy-reserve': '/images/photos/stock-power-station-960.webp',
};

type AmazonSpec = {
  id: string;
  asin: string;
  brand: string;
  title: string;
  blurb: string;
  section: BackupPowerSectionId;
  alsoIn?: SourceCategoryId[];
};

const AMAZON: AmazonSpec[] = [
  // Generators
  { id: 'champion-4000-dual-fuel-inverter', asin: 'B0D6SQR1L1', brand: 'Champion', title: 'Champion 4000-Watt Dual Fuel RV Ready Portable Inverter Generator', blurb: 'A Champion 4000-watt dual-fuel portable inverter generator, sold as RV ready, that can run on gasoline or propane.', section: 'generators', alsoIn: ['power'] },
  { id: 'westinghouse-4000-dual-fuel-inverter', asin: 'B0CQMK94H7', brand: 'Westinghouse', title: 'Westinghouse 4000 Peak Watt Super Quiet Dual Fuel Portable Inverter Generator', blurb: 'A Westinghouse 4000-watt dual-fuel portable inverter generator with remote electric start, sold to run on gasoline or propane.', section: 'generators', alsoIn: ['power'] },
  { id: 'westinghouse-5000-dual-fuel-inverter', asin: 'B09LR9WLLP', brand: 'Westinghouse', title: 'Westinghouse 5000 Peak Watt Super Quiet Dual Fuel Portable Inverter Generator', blurb: 'A Westinghouse 5000-watt dual-fuel portable inverter generator with remote electric start, sold to run on gasoline or propane. Confirm current availability on the product page.', section: 'generators', alsoIn: ['power'] },
  { id: 'generac-5200-dual-fuel-inverter', asin: 'B0DT7PQLPQ', brand: 'Generac', title: 'Generac 5,200 Watt Dual-Fuel Portable Inverter Generator, Outdoor Use', blurb: 'A Generac 5,200-watt dual-fuel portable inverter generator, listed for outdoor use, that can run on more than one fuel.', section: 'generators', alsoIn: ['power'] },
  { id: 'champion-5000-trifuel', asin: 'B0C9K71B7M', brand: 'Champion', title: 'Champion 5000-Watt Electric Start Tri Fuel Portable Generator', blurb: 'A Champion 5000-watt electric-start tri-fuel portable generator that can run on gasoline, propane or natural gas.', section: 'generators', alsoIn: ['power'] },
  { id: 'duromax-xp5500eh', asin: 'B01MR3N1YX', brand: 'DuroMax', title: 'DuroMax XP5500EH 5,500-Watt Dual Fuel Portable Generator', blurb: 'A DuroMax XP5500EH 5,500-watt dual-fuel portable generator, sold for RV and emergency use, that can run on gasoline or propane.', section: 'generators', alsoIn: ['power'] },
  { id: 'westinghouse-12500-trifuel', asin: 'B0BVGSFCPG', brand: 'Westinghouse', title: 'Westinghouse 12500 Peak Watt Tri-Fuel Home Backup Portable Generator', blurb: 'A Westinghouse 12,500-watt tri-fuel portable generator, sold as transfer-switch ready for home backup, that can run on gasoline, propane or natural gas.', section: 'generators', alsoIn: ['power'] },
  { id: 'champion-12500-trifuel', asin: 'B0DLPLDXFC', brand: 'Champion', title: 'Champion 12,500-Watt Electric Start Tri Fuel Home Backup Portable Generator', blurb: 'A Champion 12,500-watt electric-start tri-fuel portable generator, sold for home backup, that can run on gasoline, propane or natural gas.', section: 'generators', alsoIn: ['power'] },
  { id: 'anker-solix-smart-generator-5500', asin: 'B0GFLQ4JQJ', brand: 'Anker SOLIX', title: 'Anker SOLIX Smart Generator 5500', blurb: 'An Anker SOLIX Smart Generator 5500, listed as a fuel-powered companion for the E10 system. It is still a fuel generator: run it outdoors, far from the house, and follow Anker’s pairing instructions.', section: 'generators', alsoIn: ['power'] },

  // Transfer switches, inlets, cords, interlocks, surge
  { id: 'reliance-31406crk', asin: 'B012DHO4A4', brand: 'Reliance Controls', title: 'Reliance Controls 6-Circuit 30-Amp Generator Power Transfer Kit', blurb: 'A Reliance Controls 30-amp, 6-circuit surface-mount generator transfer kit. Have a licensed electrician install it so the utility and the generator cannot feed the panel at the same time.', section: 'transfer', alsoIn: ['power'] },
  { id: 'reliance-31410crk', asin: 'B000HS2L3O', brand: 'Reliance Controls', title: 'Reliance Controls 31410CRK Pro/Tran 10-Circuit 30 Amp Transfer Switch Kit', blurb: 'A Reliance Controls Pro/Tran 10-circuit, 30-amp generator transfer switch kit. A licensed electrician should install it. Never backfeed a panel by plugging a generator into a dryer or wall outlet.', section: 'transfer', alsoIn: ['power'] },
  { id: 'protran2-a510a', asin: 'B00YHMNAOK', brand: 'Reliance Controls', title: 'Reliance Controls A510A Pro/Tran2 50-Amp 10-Circuit Manual Transfer Switch', blurb: 'A Reliance Controls Pro/Tran2 50-amp, 10-circuit manual transfer switch with an optional power inlet, for generators that use a 14-50 connection. Have a licensed electrician install it.', section: 'transfer', alsoIn: ['power'] },
  { id: 'generac-homelink-30', asin: 'B00V4NDFZO', brand: 'Generac', title: 'Generac HomeLink 30 Amp Portable Generator Manual Transfer Switch', blurb: 'A Generac HomeLink 30-amp manual transfer switch for a portable generator, with an indoor pre-wired panel. Have a licensed electrician install it.', section: 'transfer', alsoIn: ['power'] },
  { id: 'champion-30a-mts', asin: 'B0C9KPSY3F', brand: 'Champion', title: 'Champion 30-Amp Indoor-Rated Manual Transfer Switch with 25-Foot Cord', blurb: 'A Champion 30-amp indoor-rated manual transfer switch, sold with a 25-foot generator cord and a weather-resistant inlet. Have a licensed electrician install the switch.', section: 'transfer', alsoIn: ['power'] },
  { id: 'square-d-homcgk2c', asin: 'B00CONE4MG', brand: 'Square D', title: 'Square D HOMCGK2C Homeline Generator Interlock Kit', blurb: 'The official Square D HOMCGK2C interlock kit for Homeline covers and a QOM2-frame main breaker. An interlock only works if it is the listed kit for your exact panel, installed by a licensed electrician.', section: 'transfer', alsoIn: ['power'] },
  { id: 'square-d-qocgk2c', asin: 'B00CONDIGO', brand: 'Square D', title: 'Square D QOCGK2C QO Generator Interlock Kit', blurb: 'The official Square D QOCGK2C interlock kit for QO covers and a QOM2-frame main breaker. Confirm the kit matches your panel before anyone opens it.', section: 'transfer', alsoIn: ['power'] },
  { id: 'eaton-brmikbr', asin: 'B00JV3ESD2', brand: 'Eaton', title: 'Eaton BRMIKBR Generator Interlock Kit, 100A–125A Type BR', blurb: 'The official Eaton BRMIKBR generator interlock kit for 100-amp to 125-amp Type BR load centers. Have a licensed electrician confirm the panel type and install it.', section: 'transfer', alsoIn: ['power'] },
  { id: 'siemens-ecsbpk02', asin: 'B005GLCCM2', brand: 'Siemens', title: 'Siemens ECSBPK02 Generator Standby Power Mechanical Interlock', blurb: 'The official Siemens ECSBPK02 mechanical interlock for generator standby use. Match the kit to the panel.', section: 'transfer', alsoIn: ['power'] },
  { id: 'reliance-pb30', asin: 'B000BQT47S', brand: 'Reliance Controls', title: 'Reliance Controls PB30 30-Amp NEMA 3R Power Inlet Box', blurb: 'A Reliance Controls PB30 30-amp NEMA 3R outdoor power inlet box, listed for portable generators up to 7,500 running watts.', section: 'transfer', alsoIn: ['power'] },
  { id: 'champion-30a-inlet', asin: 'B0DWC9RSX3', brand: 'Champion', title: 'Champion Power Equipment 30A 125/250V Power Inlet Box', blurb: 'A Champion 30-amp, 125/250-volt power inlet box for a portable generator hookup.', section: 'transfer', alsoIn: ['power'] },
  { id: 'reliance-50a-inlet', asin: 'B004HSO1JW', brand: 'Reliance Controls', title: 'Reliance Controls 50-Amp Non-Metallic Power Inlet Box', blurb: 'A Reliance Controls 50-amp non-metallic power inlet box for a larger portable-generator hookup.', section: 'transfer', alsoIn: ['power'] },
  { id: 'champion-50a-inlet', asin: 'B0DWCCPC1X', brand: 'Champion', title: 'Champion Power Equipment 50A 125/250V Power Inlet Box', blurb: 'A Champion 50-amp, 125/250-volt power inlet box for a portable generator hookup.', section: 'transfer', alsoIn: ['power'] },
  { id: 'champion-50a-30ft-cord', asin: 'B09L9MC2RZ', brand: 'Champion', title: 'Champion 30-Foot 50-Amp 125/250-Volt RV Generator Power Cord', blurb: 'A Champion 30-foot, 50-amp, 125/250-volt generator power cord (14-50P to SS2-50R). Use a cord and inlet with matching plugs, sized for the generator.', section: 'transfer', alsoIn: ['power'] },
  { id: 'nilight-25ft-50a-cord', asin: 'B0FWRDSC9R', brand: 'Nilight', title: 'Nilight 25-Foot 50 Amp Generator Extension Cord', blurb: 'A Nilight 25-foot, 50-amp generator extension cord, 14-50P to SS2-50R and CS6364. Confirm the plugs match your generator and inlet.', section: 'transfer', alsoIn: ['power'] },
  { id: 'l14-30p-t-blade-adapter', asin: 'B0DQWSZ4VP', brand: 'Generic', title: 'NEMA L14-30P to 5-15R/5-20R Generator Adapter', blurb: 'An L14-30P to 5-15R/5-20R T-blade adapter, so 120-volt plug-in loads can be run from a 30-amp generator outlet. This is for cord-and-plug loads on the generator, not a house hookup.', section: 'transfer', alsoIn: ['power'] },
  { id: 'leviton-type1-surge-panel', asin: 'B0CNTVSDXZ', brand: 'Leviton', title: 'Leviton Type 1 Residential Surge Protective Panel', blurb: 'A Leviton Type 1 whole-panel surge protector, 120/240-volt split-phase. Have a licensed electrician install it. Surge protection does not replace a transfer switch.', section: 'transfer', alsoIn: ['home'] },
  { id: 'siemens-fspd140', asin: 'B0BN6N3CZN', brand: 'Siemens', title: 'Siemens Boltshield FSPD140 Level 2 Whole House Surge Protector', blurb: 'A Siemens Boltshield FSPD140 Level 2 whole-house surge protection device for 120/240-volt service. Have a licensed electrician install it.', section: 'transfer', alsoIn: ['home'] },

  // Propane tanks
  { id: 'flame-king-20lb', asin: 'B000FIVGYQ', brand: 'Flame King', title: 'Flame King YSN-201 20-Pound Steel Propane Tank', blurb: 'A Flame King 20-pound steel propane cylinder with a Type 1 OPD valve. Keep cylinders outdoors and upright, and follow tank-distance rules for your size.', section: 'tanks', alsoIn: ['outdoor'] },
  { id: 'flame-king-30lb', asin: 'B08XYJ7YQV', brand: 'Flame King', title: 'Flame King YSN-301 30-Pound Steel Propane Tank', blurb: 'A Flame King 30-pound steel propane cylinder with a Type 1 overflow-protection valve, listed as DOT and TC compliant.', section: 'tanks', alsoIn: ['outdoor'] },
  { id: 'flame-king-40lb', asin: 'B004LZN5ES', brand: 'Flame King', title: 'Flame King YSN401 40-Pound Steel Propane Tank', blurb: 'A Flame King 40-pound steel propane cylinder with an overflow-protection valve.', section: 'tanks', alsoIn: ['outdoor'] },
  { id: 'flame-king-100lb', asin: 'B0BTRBT9WP', brand: 'Flame King', title: 'Flame King 100-Pound Multi-Valve Propane Tank', blurb: 'A Flame King 100-pound (23 gallon) multi-valve propane tank with a high-capacity filler. A tank this size is not a casual swap-out cylinder; in Mississippi a qualified L.C. Gas installer and an installation report may be required.', section: 'tanks', alsoIn: ['outdoor'] },

  // Hoses and regulators
  { id: 'champion-12ft-propane-hose', asin: 'B09VQ4F138', brand: 'Champion', title: 'Champion 12-Foot Propane Hose Extension Kit for Champion Generators', blurb: 'A Champion 12-foot propane hose extension kit, sold for Champion generators. Confirm it matches your generator’s propane inlet before you buy.', section: 'hoses', alsoIn: ['outdoor'] },
  { id: 'ggc-5ft-two-stage-regulator', asin: 'B0F9KJDXLW', brand: 'GGC', title: 'GGC 5-Foot Two-Stage Propane Regulator with Hose and Gauge', blurb: 'A GGC 5-foot two-stage propane regulator with hose and gauge, with a standard POL connection listed for 20- to 100-pound cylinders. Confirm the outlet matches your appliance.', section: 'hoses', alsoIn: ['outdoor'] },
  { id: 'propane-hose-20ft-38-flare', asin: 'B08BHQ8CK9', brand: 'Generic', title: '20-Foot High-Pressure Propane Hose, 3/8-Inch Female Flare Both Ends', blurb: 'A 20-foot high-pressure propane hose with 3/8-inch female flare fittings on both ends. Use only with a compatible regulator and appliance.', section: 'hoses', alsoIn: ['outdoor'] },
  { id: 'flame-king-y-splitter', asin: 'B089XDY3Z2', brand: 'Flame King', title: 'Flame King Propane Tank Y-Splitter with Valves', blurb: 'A Flame King two-way LP-gas Y-splitter with valves, for 20-pound propane cylinders.', section: 'hoses', alsoIn: ['outdoor'] },
  { id: 'camco-4port-tee', asin: 'B000NHPM76', brand: 'Camco', title: 'Camco RV Propane Brass 4-Port Tee, Acme and POL', blurb: 'A Camco brass 4-port propane tee for motorhomes with a permanent tank, with Acme and POL threads, for connecting an auxiliary cylinder.', section: 'hoses', alsoIn: ['outdoor'] },
  { id: 'flame-king-auto-changeover', asin: 'B00IZCNOS0', brand: 'Flame King', title: 'Flame King KT12ACR-2 Two-Stage Auto-Changeover Regulator', blurb: 'A Flame King two-stage auto-changeover LP regulator with two 12-inch pigtails, listed for RVs, vans and trailers.', section: 'hoses', alsoIn: ['outdoor'] },
  { id: 'camco-auto-changeover', asin: 'B0024ECBCA', brand: 'Camco', title: 'Camco Two-Stage Auto-Changeover Propane Regulator', blurb: 'A Camco two-stage auto-changeover propane regulator that switches from an empty cylinder to a full one. Match the regulator to your appliance and tank setup.', section: 'hoses', alsoIn: ['outdoor'] },
  { id: 'mopeka-pro-check', asin: 'B09J6MXJKT', brand: 'Mopeka', title: 'Mopeka Pro Check Bluetooth Propane Tank Sensor', blurb: 'A Mopeka Pro Check magnetic Bluetooth sensor for reading propane level, listed for tanks up to 250 gallons.', section: 'hoses', alsoIn: ['outdoor'] },
  { id: 'propane-tank-gauge-5-20lb', asin: 'B0BYZ5451S', brand: 'Generic', title: 'Propane Tank Gauge for 5- to 20-Pound Cylinders', blurb: 'A propane level gauge listed for 5- to 20-pound cylinders. A gauge is a convenience, not a leak test.', section: 'hoses', alsoIn: ['outdoor'] },
  { id: 'toptes-pt210s', asin: 'B0C73NQC73', brand: 'TopTes', title: 'TopTes PT210S Combustible-Gas Leak Detector', blurb: 'A TopTes PT210S combustible-gas leak detector with a 4-inch probe, sold for locating propane or natural-gas leaks. It does not replace a soapy-water check or a listed gas alarm.', section: 'hoses', alsoIn: ['safety'] },
  { id: 'kidde-co-and-gas', asin: 'B0G1CNQG7F', brand: 'Kidde', title: 'Kidde Carbon Monoxide and Explosive Gas Alarm, Plug-in with AA Battery, COPDLG', blurb: 'A Kidde plug-in alarm that listens for both carbon monoxide and explosive gas, with AA battery backup. It is a warning device, not a substitute for placing a generator outdoors.', section: 'safety', alsoIn: ['safety', 'home'] },

  // Outdoor safety
  { id: 'gentent-open-frame', asin: 'B0GFG7FLYP', brand: 'GenTent', title: 'GenTent Universal Open Frame Generator Tent, Gray', blurb: 'A GenTent universal canopy for open-frame portable generators, sold so a generator can run in rain or snow. Keep the generator at least 20 feet from the house; a canopy is not a reason to pull it closer.', section: 'safety', alsoIn: ['safety'] },
  { id: 'genarmor-running-cover', asin: 'B0DBQFWR1X', brand: 'GenArmor', title: 'GenArmor Generator Cover for Use While Running', blurb: 'A GenArmor cover sold for use while a portable generator is running. Follow the maker’s instructions and CPSC weather guidance. A cover does not change the 20-foot rule.', section: 'safety', alsoIn: ['safety'] },
  { id: 'champion-40065-wheel-kit', asin: 'B001QVQKJ2', brand: 'Champion', title: 'Champion 40065 Wheel Kit for 2800–4750-Watt Generators', blurb: 'A Champion 40065 wheel kit with a folding handle and never-flat tires, listed for 2800- to 4750-watt Champion generators. Confirm it fits your model.', section: 'safety', alsoIn: ['power'] },
  { id: 'westinghouse-wgen5300-wheel-kit', asin: 'B09QNYR81B', brand: 'Westinghouse', title: 'Westinghouse WGen5300 Wheel and Handle Kit', blurb: 'A Westinghouse never-flat wheel and handle kit listed for the WGen5300 series. Confirm it fits your model.', section: 'safety', alsoIn: ['power'] },
  { id: 'ground-rod-kit-8ft', asin: 'B0F1FN9BTS', brand: 'Generic', title: '8-Foot Copper-Bonded Ground Rod Kit', blurb: 'An 8-foot, 5/8-inch copper-bonded ground rod kit with a clamp. Grounding depends on how the generator is used; OSHA’s portable-generator fact sheet explains when a rod is required. Have a qualified electrician decide and install it.', section: 'safety', alsoIn: ['power'] },
  { id: 'kidde-plugin-battery-co', asin: 'B0G1C86M5S', brand: 'Kidde', title: 'Kidde Plug-in Carbon Monoxide Detector with AA Battery Backup, COPD', blurb: 'A Kidde plug-in carbon monoxide detector with AA battery backup, so it can keep working if household power drops.', section: 'safety', alsoIn: ['safety', 'home'] },
  { id: 'first-alert-plugin-co', asin: 'B000ND74XA', brand: 'First Alert', title: 'First Alert Plug-in Carbon Monoxide Alarm', blurb: 'A First Alert plug-in carbon monoxide alarm. Plug-in-only alarms stop working when the power is out, so you also need a battery-powered alarm or one with battery backup.', section: 'safety', alsoIn: ['safety', 'home'] },
  { id: 'master-lock-15ft-cable', asin: 'B000BD8IQ4', brand: 'Master Lock', title: 'Master Lock 15-Foot Steel Cable with Looped Ends', blurb: 'A Master Lock 15-foot steel cable with looped ends, often used to secure a generator or tank outdoors. It is a theft deterrent, not a substitute for safe placement.', section: 'safety', alsoIn: ['outdoor'] },
  { id: 'confer-equipment-pad', asin: 'B0FWLM4GXW', brand: 'Confer Plastics', title: 'Confer Plastics 24-by-36-Inch Equipment Pad', blurb: 'A Confer Plastics 24-by-36-inch equipment pad, sold as a base for pool equipment, generators and AC units, so a generator is not sitting in a puddle.', section: 'safety', alsoIn: ['safety'] },
  { id: 'sta-bil-16oz', asin: 'B000JJHNAW', brand: 'STA-BIL', title: 'STA-BIL Storage Fuel Stabilizer, 16 oz', blurb: 'A 16-ounce bottle of STA-BIL storage fuel stabilizer, sold for gasoline that will sit in a tank or can. Follow the label, and still run the generator outdoors.', section: 'safety', alsoIn: ['auto'] },

  // Energy Reserve home-backup (Amazon listings; official program cards are below or alsoIn)
  { id: 'anker-solix-f3000', asin: 'B0F8BC2LFS', brand: 'Anker SOLIX', title: 'Anker SOLIX F3000 Portable Power Station', blurb: 'An Anker SOLIX F3000 portable Energy Reserve, sold for home backup. Confirm current capacity and output on the product page. The battery stays indoors.', section: 'energy-reserve', alsoIn: ['power'] },
  { id: 'anker-solix-s5000-transfer-kit', asin: 'B0HJYYWKBC', brand: 'Anker SOLIX', title: 'Anker SOLIX S5000 with Transfer Switch Kit', blurb: 'An Anker SOLIX S5000 Energy Reserve sold with a transfer switch kit. Have a licensed electrician install the switch, and keep any fuel generator outdoors.', section: 'energy-reserve', alsoIn: ['power'] },
  { id: 'ecoflow-smart-home-panel-2', asin: 'B0D14H686R', brand: 'EcoFlow', title: 'EcoFlow Smart Home Panel 2', blurb: 'An EcoFlow Smart Home Panel 2, sold as a whole-home backup system hub. Have a licensed electrician install it and follow EcoFlow’s instructions for the system you own.', section: 'energy-reserve', alsoIn: ['power'] },
  { id: 'ecoflow-smart-home-panel-10', asin: 'B0HJZCWMCP', brand: 'EcoFlow', title: 'EcoFlow Smart Home Panel 10', blurb: 'An EcoFlow Smart Home Panel 10, a 120/240-volt 10-circuit sub-panel for home backup. Have a licensed electrician install it.', section: 'energy-reserve', alsoIn: ['power'] },
  { id: 'ecoflow-delta-3800-gen4', asin: 'B0HLVRNZDC', brand: 'EcoFlow', title: 'EcoFlow DELTA 3800 Gen4 Portable Power Station', blurb: 'An EcoFlow DELTA 3800 Gen4 portable Energy Reserve. The battery stays indoors. Confirm current capacity and output on the product page.', section: 'energy-reserve', alsoIn: ['power'] },
  { id: 'jackery-homepower-3600-plus', asin: 'B0FM8653F1', brand: 'Jackery', title: 'Jackery HomePower 3600 Plus Power Station', blurb: 'A Jackery HomePower 3600 Plus portable Energy Reserve. The battery stays indoors. Confirm current capacity and output on the product page.', section: 'energy-reserve', alsoIn: ['power'] },
];

type OfficialSpec = {
  id: string;
  brand: string;
  title: string;
  blurb: string;
  section: BackupPowerSectionId;
  programId: string;
  destination: string;
  alsoIn?: SourceCategoryId[];
  offerLabel?: string;
  storeLevel?: boolean;
  image?: string;
};

const OFFICIAL: OfficialSpec[] = [
  { id: 'bluetti-apex-300-home-integration-kit', brand: 'BLUETTI', title: 'BLUETTI Apex 300 Home Integration Kit', blurb: 'BLUETTI’s official home integration kit for the Apex 300 Energy Reserve. Follow BLUETTI’s installation guidance and use a licensed electrician for a home hookup.', section: 'energy-reserve', programId: 'bluetti', destination: 'https://www.bluettipower.com/products/apex-300-home-integration-kit', alsoIn: ['power'], offerLabel: 'Home-backup kit', image: '/images/photos/stock-power-station-960.webp' },
  { id: 'anker-solix-f3800-10c-backup-kit', brand: 'Anker SOLIX', title: 'Anker SOLIX 10-Circuit Manual Transfer Switch for F3800', blurb: 'Anker SOLIX’s 10-circuit, 120/240-volt, 50-amp manual transfer switch, listed for the F3800 and for two F3800 Plus units. Have a licensed electrician install it.', section: 'energy-reserve', programId: 'anker-solix', destination: 'https://www.ankersolix.com/products/home-backup-kit-for-f3800-10c', alsoIn: ['power'], offerLabel: 'Home-backup kit', image: '/images/photos/stock-house-960.webp' },
  { id: 'allpowers-home-backup', brand: 'ALLPOWERS', title: 'ALLPOWERS home backup collection', blurb: 'ALLPOWERS’ official US home-backup collection of Energy Reserves and related gear. Check the current models and installation notes on the collection page.', section: 'energy-reserve', programId: 'allpowers', destination: 'https://iallpowers.com/collections/home-backup', alsoIn: ['power'], offerLabel: 'Official collection', storeLevel: true, image: '/images/photos/stock-power-station-960.webp' },
  { id: 'jackery-manual-transfer-switch', brand: 'Jackery', title: 'Jackery Manual Transfer Switch, 120V 30A', blurb: 'Jackery’s official 120-volt, 30-amp manual transfer switch page. Jackery’s affiliate program is still pending, so this is an official product page, not a tracked link. Have a licensed electrician install it.', section: 'energy-reserve', programId: '', destination: 'https://www.jackery.com/products/jackery-manual-transfer-switch', alsoIn: ['power'], offerLabel: 'Official page', image: '/images/photos/stock-house-960.webp' },
];

function amazonItem(p: AmazonSpec): CatalogItem {
  const sectionImage = p.section === 'safety' && /generator tent|gentent|genarmor|equipment pad|wheel kit/i.test(p.title + ' ' + p.id)
    ? '/images/photos/portable-generator-960.webp'
    : STOCK[p.section];
  return {
    id: p.id,
    title: p.title,
    blurb: p.blurb,
    sourceName: p.brand,
    href: amazonProductUrl(p.asin),
    rel: 'sponsored nofollow noopener',
    affiliate: true,
    hideOnPaid: true,
    programId: 'amazon',
    category: 'backup-power',
    alsoIn: p.alsoIn,
    section: p.section,
    image: sectionImage,
    imageKind: 'photo',
    priceLabel: 'See price',
    offerLabel: 'On Amazon',
    ctaLabel: 'Check listing',
    ctaKind: 'listing',
    groups: ['power-tech'],
    kind: 'partner',
    origin: 'directory',
  };
}

function officialItem(p: OfficialSpec): CatalogItem {
  const out = p.programId
    ? resolveOutbound(p.programId, p.destination, p.id)
    : { href: p.destination, affiliate: false, programId: '' };
  return {
    id: p.id,
    title: p.title,
    blurb: p.blurb,
    sourceName: p.brand,
    href: out.href,
    rel: out.affiliate ? 'sponsored nofollow noopener' : 'noopener',
    affiliate: out.affiliate,
    hideOnPaid: p.programId ? isNoPpcProgram(out.programId || p.programId) : false,
    programId: out.programId || p.programId || undefined,
    category: 'backup-power',
    alsoIn: p.alsoIn,
    section: p.section,
    image: p.image || STOCK[p.section],
    imageKind: 'photo',
    priceLabel: 'See price',
    offerLabel: p.offerLabel || 'Official page',
    ctaLabel: 'Check listing',
    ctaKind: 'listing',
    groups: ['power-tech'],
    kind: 'partner',
    origin: 'directory',
    storeLevel: p.storeLevel,
  };
}

export function backupPowerCatalogItems(): CatalogItem[] {
  return [...AMAZON.map(amazonItem), ...OFFICIAL.map(officialItem)];
}

export const BACKUP_POWER_AMAZON_ASINS: Record<string, string> = Object.fromEntries(AMAZON.map((p) => [p.id, p.asin]));
