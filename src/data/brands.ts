/**
 * Brand spotlight pages (/brands/{slug}/). Facts come from the partner program data
 * already recorded in this repo (network memo, official listing pages, source-directory).
 * No ratings, reviews, sales stats, or invented specs. Prices are shown only where we
 * recorded the price on the product page on a stated date.
 */
export type BrandPick = { id: string; why: string; check: string };
export type BrandFaq = { q: string; a: string };
export type BrandLink = { href: string; label: string; note?: string };

export type BrandPage = {
  slug: string;
  programId: string;
  /** Item id in affiliates.ts `itemLinks` (or program link) for the official-shop button. */
  shopItemId: string;
  officialUrl: string;
  name: string;
  title: string;
  lead: string;
  eyebrow: string;
  photo: string;
  photoNote: string;
  /** Official wordmark, if we have a sharp licensed logo. */
  logo?: string;
  /** Composed official-product hero key in /images/photos/{key}-{w}.webp */
  heroPhoto?: string;
  summary: string;
  goodFor: string[];
  lessIdeal: string[];
  picks: BrandPick[];
  priceNote: string;
  choose: { title: string; text: string }[];
  faq: BrandFaq[];
  related: BrandLink[];
  directories: BrandLink[];
  thanks: string;
  code?: string;
};

export const brandPages: BrandPage[] = [
  {
    slug: 'anker-solix',
    programId: 'anker-solix',
    shopItemId: 'anker-solix',
    officialUrl: 'https://www.ankersolix.com/',
    name: 'Anker SOLIX',
    title: 'Anker SOLIX: portable solar panels, solar kits, and home backup',
    eyebrow: 'Brand spotlight',
    lead: 'Anker SOLIX is the home-energy line from Anker. Here is who it suits, which of its solar panels and power stations are worth a look, and how to choose without overbuying.',
    photo: 'hero-anker-solix',
    heroPhoto: 'hero-anker-solix',
    logo: '/directory/logos/anker-solix-logo.png',
    photoNote: 'Official Anker SOLIX product photos (the F3800 Plus, the PS400 panel, and the C2000 Gen 2 + 400W kit) from the Rakuten Anker SOLIX catalog (MID 53552), arranged on a plain background. Downloaded November 23, 2026.',
    summary: 'Anker SOLIX sells portable solar panels, solar-generator kits, and portable power stations for home backup. ReadyGearHub lists current models below. Prices, where shown, are what Anker listed on the product page on Nov 23, 2026.',
    goodFor: [
      'Anyone who already owns a portable power station and wants a foldable panel to recharge it when the grid is down (the PS100, PS200, and PS400 are panels, not stations).',
      'Households that want a ready-made solar-generator kit instead of matching a station and panel themselves (the C2000 Gen 2 + 400W kit).',
      'People planning for longer outages who need a large battery for home backup (the F3800 Plus, which Anker lists at 3,840Wh and 6,000W).',
      'Campers and RV owners who want one brand for both the panel and the battery.',
    ],
    lessIdeal: [
      'If you only need to keep phones and a router running, a smaller station or a power bank may cover it for less.',
      'Panels and stations from different brands do not always connect directly. Confirm connectors and input limits before you buy a panel on its own.',
      'Whole-home hookups can require a licensed electrician and a transfer setup. A portable station alone is not a whole-house system.',
    ],
    picks: [
      { id: 'anker-solix-ps100', why: 'The smallest of the three bifacial panels, listed by Anker as a 100W panel. A sensible first panel for a compact station or a camp setup.', check: 'Connector type and maximum solar input of your power station.' },
      { id: 'anker-solix-ps200', why: 'A mid-size bifacial portable panel, listed as the PS200, between the PS100 and the PS400.', check: 'Your station’s solar input limit, and whether this size is a better fit than the 100W or the larger PS400.' },
      { id: 'anker-solix-ps400', why: 'The larger bifacial portable panel. Worth a look if you want to recharge a bigger station faster on a sunny day.', check: 'Your station’s solar input limit, and whether you have the space to set up a larger panel safely outdoors.' },
      { id: 'anker-solix-c300x', why: 'A compact station Anker lists as the C300X, at 288Wh and 300W. A go-bag or everyday size for phones, lights, and other low-wattage devices.', check: 'Whether 300W covers the devices you actually plan to run, and the ports on Anker’s page.' },
      { id: 'anker-solix-c300-dc-60w-kit', why: 'A compact solar-generator kit pairing the C300 DC with a 60W solar panel, for a small off-grid or outage setup.', check: 'What is in the kit, the output type (this is a DC generator), and whether it covers the loads you have in mind.' },
      { id: 'anker-solix-c800x-100w-kit', why: 'A smaller solar-generator kit pairing the C800X power station with a 100W solar panel, if the C2000 Gen 2 kit is more than you need.', check: 'What is in the box and the station’s output on Anker’s page.' },
      { id: 'anker-solix-c1000x-gen2', why: 'A mid-size station Anker lists as the C1000 Gen 2, at 1,024Wh and 2,000W. A smaller step than the C2000 or F3800 Plus if you mainly need lights, a router, and a few small appliances.', check: 'Current capacity, output, and ports on Anker’s page, and whether this size covers the loads you actually plan to run.' },
      { id: 'anker-solix-c2000-gen2', why: 'The C2000 Gen 2 station on its own, listed at 2,048Wh and 2,400W, if you already have a panel or do not want the 400W kit.', check: 'What is in the box versus the kit listing, and the station’s current output and solar input on Anker’s page.' },
      { id: 'anker-solix-bp2000-gen2', why: 'An expansion battery Anker lists as the BP2000 (Gen 2), made for the C2000 Gen 2 when you want more run-time from the same station.', check: 'Compatibility with your C2000 Gen 2, and installation notes on Anker’s page. It is not a standalone power station.' },
      { id: 'anker-solix-c2000-gen2-400w-kit', why: 'A kit pairing the C2000 Gen 2 power station with a 400W solar panel, so the pieces are chosen to work together.', check: 'What is in the box and the station’s output on Anker’s page, and whether it covers the appliances you actually plan to run.' },
      { id: 'anker-solix-f3800-plus', why: 'The big one: a 3,840Wh, 6,000W power station for home backup. Anker positions it for longer outages and larger loads.', check: 'Installation guidance for any home-backup accessories, and whether you need this much capacity. A mid-size station is often enough.' },
      { id: 'anker-solix-bp3800', why: 'An expansion battery Anker lists as the BP3800, at 3,840Wh, for the F3800 series when you want more capacity for a longer outage.', check: 'Compatibility with your F3800 or F3800 Plus, and Anker’s installation guidance. It is not a standalone power station.' },
    ],
    priceNote: 'Prices are what Anker showed on each product page on Nov 23, 2026. They change, sometimes during sales, so confirm the current price on Anker’s page before you buy.',
    choose: [
      { title: 'Start with what must stay on', text: 'List the devices you cannot lose during an outage (router, phones, a CPAP, a small fridge) and their wattage. The free power sizer tool will total them.' },
      { title: 'Pick the battery first, then the panel', text: 'Capacity (watt-hours) decides how long things run. Output (watts) decides what can run at once. Choose the station for those two numbers, then add a panel that your station can accept.' },
      { title: 'Match the panel to the station', text: 'Check the station’s maximum solar input and connector. A panel that is rated for more than your station accepts will not charge it faster.' },
      { title: 'Plan for cloudy days', text: 'Solar only recharges when there is usable sun. Keep the station charged from the wall before a storm, and treat the panel as a top-up.' },
      { title: 'Decide whether you need home backup', text: 'A portable station powers cords you plug in. Powering circuits in the house is a different, larger project that may need a licensed electrician.' },
    ],
    faq: [
      { q: 'Are the PS100 and PS400 power stations?', a: 'No. They are portable solar panels. They recharge a compatible power station. The C2000 Gen 2 kit and the F3800 Plus are the power stations on this page.' },
      { q: 'What does “bifacial” mean?', a: 'A bifacial panel can collect light on both sides, not just the front. Real-world gains depend on how and where you set it up, so treat any number you see in marketing as a best case, not a promise.' },
      { q: 'Will these panels work with my current power station?', a: 'Maybe. Compare your station’s solar input range and connector with the panel’s output on Anker’s page. If you are unsure, ask Anker or the station’s maker before buying.' },
      { q: 'Can a solar-generator kit run my whole house?', a: 'No. A portable station runs what you plug into it. Whole-home backup needs the right equipment and, usually, a licensed electrician.' },
      { q: 'Is it safe to run a power station indoors?', a: 'Power stations make no exhaust, unlike gas generators, which must always run outdoors. Still follow the manual for ventilation, charging, and storage.' },
      { q: 'Does it cost more to buy through your links?', a: 'No. The price is the same. If you buy through our links, Anker pays ReadyGearHub a commission, which helps keep our guides and tools free.' },
    ],
    related: [
      { href: '/guides/generator-vs-power-station/', label: 'Inverter generator vs portable power station', note: 'How the two differ, with solar and safety' },
      { href: '/guides/how-to-pick-a-portable-power-station/', label: 'How to pick a portable power station', note: 'Watt-hours, watts, and sizing' },
      { href: '/guides/winter-storm-power-outage-prep-guide-south/', label: 'Winter storm and power outage prep guide', note: 'Backup power in context' },
      { href: '/tools/solar-sizer/', label: 'Solar & power station sizer', note: 'Free tool' },
    ],
    directories: [
      { href: '/directory/power/', label: 'Power & Energy directory' },
      { href: '/directory/outdoor/', label: 'Outdoor & Camping directory' },
      { href: '/home-backup-power-solar/', label: 'Home backup power & solar' },
      { href: '/off-grid-power/', label: 'Off-grid power' },
    ],
    thanks: 'Thank you for reading, and for supporting ReadyGearHub. If you use our links, it costs you nothing extra, and it helps us keep the guides and free tools going. We would rather you buy the right size than the biggest one, so use the sizer first.',
  },
  {
    slug: 'litime',
    programId: 'litime',
    shopItemId: 'litime',
    officialUrl: 'https://www.litime.com/',
    name: 'LiTime',
    title: 'LiTime: LiFePO4 batteries and DIY solar kits for RV, boat, and off-grid',
    eyebrow: 'Brand spotlight',
    lead: 'LiTime makes lithium batteries and solar gear for RVs, boats, and off-grid setups. Its batteries are components you install in a 12V or 24V system, not plug-and-play power stations. Here is how to tell if that fits you.',
    photo: 'hero-litime',
    heroPhoto: 'hero-litime',
    logo: '/directory/logos/litime-logo.png',
    photoNote: 'Official LiTime product photos (the LiHeat 24V 230Ah and 12V 100Ah Group 24 batteries, and the DIY solar generator kit) from the Awin LiTime product feed (advertiser 71451), arranged on a soft gradient background. Downloaded November 23, 2026.',
    summary: 'LiTime sells LiFePO4 (lithium iron phosphate) batteries, inverters, chargers, and a DIY solar generator kit. ReadyGearHub lists current products below. Prices, where shown, are from LiTime’s official Awin product feed on Nov 23, 2026, or from the product page on that date.',
    goodFor: [
      'RV and camper owners replacing or upgrading a 12V house battery (the 12V 100Ah Group 24).',
      'Off-grid cabins, vans, and larger RV setups that run on 24V (the 24V 230Ah).',
      'Anglers who want a lithium battery for a trolling motor (the 12V 100Ah TM).',
      'Hands-on people who like building a solar setup from parts and want a starting kit (the DIY solar generator kit).',
      'People adding an inverter, AC charger, or solar charge controller to a 12V battery bank they already have.',
    ],
    lessIdeal: [
      'If you want something you can plug a lamp into the moment it arrives, a portable power station is simpler. These batteries need a charger, wiring, and often an inverter or charge controller.',
      'A 24V battery needs 24V-compatible equipment. Do not mix it into a 12V system.',
      'If you have never wired a battery bank, plan to learn the basics or have a qualified installer check it, and follow LiTime’s instructions.',
    ],
    picks: [
      { id: 'litime-12v-100ah-group24', why: 'A 12V 100Ah battery in the common Group 24 size, listed by LiTime as a dual-mode self-heating model for cold-weather charging. A straightforward upgrade for many RV battery trays.', check: 'That your battery tray fits a Group 24, and how LiTime’s page describes the self-heating function and charging temperatures.' },
      { id: 'litime-24v-230ah', why: 'A larger 24V 230Ah self-heating battery for RV and off-grid systems that run at 24V.', check: 'That your inverter, charger, and loads are 24V, and the battery’s size and weight against your space.' },
      { id: 'litime-12v-100ah-trolling', why: 'A 12V 100Ah LiFePO4 battery with Bluetooth, listed for marine trolling motors.', check: 'Your trolling motor’s voltage and current draw, and the marine details on LiTime’s page.' },
      { id: 'litime-diy-solar-generator-kit', why: 'A DIY solar generator kit that LiTime lists as a complete power kit for camping, RV, and off-grid living.', check: 'Exactly what is included, and whether you are comfortable assembling and wiring it.' },
      { id: 'litime-12v-50ah', why: 'A compact 12V 50Ah battery, listed for RV, marine, and fish-finder use, when a 100Ah battery is more than you need.', check: 'Your load and run-time needs, and the pack size you actually want on LiTime’s page.' },
      { id: 'litime-12v-200ah-bluetooth', why: 'A larger 12V 200Ah Bluetooth battery for RV or marine house power, when you want more capacity than the 100Ah models.', check: 'The battery’s size and weight against your space, and charging details on LiTime’s page.' },
      { id: 'litime-2000w-12v-inverter-ats', why: 'A 2000W 12V pure sine inverter with a 20ms automatic transfer switch, listed for switching a load to battery power during an outage.', check: 'Installation guidance, your battery bank’s continuous output, and whether you need this much inverter capacity.' },
    ],
    priceNote: 'Prices are the sale prices LiTime showed on each product page on Nov 23, 2026. LiTime runs frequent promotions and prices change, so confirm the current price on its page.',
    choose: [
      { title: 'Know your system voltage', text: 'Most RVs and boats use 12V. Some larger systems use 24V. Everything in the bank, from batteries to charger to inverter, has to match.' },
      { title: 'Estimate the energy you need', text: 'Volts times amp-hours gives a rough watt-hour figure. By that math, 12V × 100Ah is about 1,200Wh and 24V × 230Ah is about 5,520Wh, before real-world losses.' },
      { title: 'Check the physical fit', text: 'Group 24 is a standard battery size. Measure your tray or compartment before you order.' },
      { title: 'Think about cold weather', text: 'If you charge in freezing temperatures, read how each battery’s self-heating works and what it needs. Lithium batteries generally should not be charged below freezing without protection.' },
      { title: 'Plan the rest of the system', text: 'You will need a compatible charger or charge controller, correct fuses and cable gauge, and an inverter if you want household outlets. Follow the maker’s instructions.' },
    ],
    faq: [
      { q: 'What does LiFePO4 mean?', a: 'It stands for lithium iron phosphate, a lithium battery chemistry commonly used for RV, marine, and solar storage. Check LiTime’s page for the cycle life and specifications it states.' },
      { q: 'Is this a portable power station?', a: 'No. These are batteries and a DIY kit. A portable power station has the charger, inverter, and outlets built in. These need to be installed in a larger system.' },
      { q: 'Can I use a 12V battery in a 24V system?', a: 'Not by itself. A 24V system needs 24V equipment. Some people wire two 12V batteries in series, but follow LiTime’s guidance and have the setup checked if unsure.' },
      { q: 'Will a lithium battery work with my RV charger?', a: 'Often, but not always. Older converters may not charge lithium batteries well. Check the converter’s manual or maker.' },
      { q: 'Why is there no solar panel on this page?', a: 'When we joined the program, LiTime’s search did not show a standalone solar panel, so the closest solar product we list is the DIY kit. We will add panels when there is one worth recommending.' },
      { q: 'Does it cost more to buy through your links?', a: 'No. The price is the same. If you buy through our links, LiTime pays ReadyGearHub a commission, which helps keep our guides and tools free.' },
    ],
    related: [
      { href: '/guides/generator-vs-power-station/', label: 'Inverter generator vs portable power station', note: 'Includes a note on RV and off-grid battery banks' },
      { href: '/guides/how-to-pick-a-portable-power-station/', label: 'How to pick a portable power station', note: 'Watt-hours and sizing basics' },
      { href: '/tools/solar-sizer/', label: 'Solar & power station sizer', note: 'Free tool' },
      { href: '/tools/power-sizer/', label: 'Generator & power-station sizer', note: 'Free tool' },
    ],
    directories: [
      { href: '/directory/power/', label: 'Power & Energy directory' },
      { href: '/directory/outdoor/', label: 'Outdoor & Camping directory' },
      { href: '/directory/auto/', label: 'Auto & Travel directory' },
      { href: '/off-grid-power/', label: 'Off-grid power' },
    ],
    thanks: 'Thank you for reading, and for supporting ReadyGearHub. If you use our links, it costs you nothing extra, and it helps us keep the guides and free tools going. Battery systems are worth doing carefully, so take your time with the checklist above.',
  },
  {
    slug: 'bluetti',
    programId: 'bluetti',
    shopItemId: 'bluetti',
    officialUrl: 'https://www.bluettipower.com/',
    name: 'BLUETTI',
    title: 'BLUETTI: portable power stations, solar panels, and home backup',
    eyebrow: 'Brand spotlight',
    lead: 'BLUETTI is the partner we link most, with the widest range on ReadyGearHub, from compact stations to home backup. Here is who each tier suits and how to choose.',
    photo: 'hero-bluetti-official',
    heroPhoto: 'hero-bluetti-official',
    photoNote: 'Official BLUETTI product photos (Elite 200 V2, AC180, and the SP200L 200W panel) from the CJ Affiliate product catalog, arranged on a plain background. Originally downloaded November 21, 2026; this arrangement was made November 23, 2026.',
    summary: 'We chose BLUETTI as the third spotlight because it is an approved partner with the most product coverage on the site: dozens of listings with official product photos, plus the gear pages and guides that already link to it. BLUETTI’s official shop has current prices, so this page does not show any.',
    goodFor: [
      'Households that want a mid-size, solar-ready power station for outage backup, camping, or van life (the AC70, AC180, and Elite 200 V2).',
      'People adding solar charging with a panel from the same brand (the 350W panel).',
      'Homes that want a larger backup system for longer outages (the Apex 300, which BLUETTI lists at 3,840W output and 2,764.8Wh).',
      'Anyone who wants a wide range in one place: the directory lists many more BLUETTI models and accessories.',
    ],
    lessIdeal: [
      'If you only need to charge a phone a few times, a power bank is cheaper and lighter.',
      'Larger systems and any home hookup may need a licensed electrician. Follow BLUETTI’s installation guidance.',
      'Compare watt-hours and output against what you actually plan to run. A bigger number is not always a better fit.',
    ],
    picks: [
      { id: 'bluetti-ac70', why: 'A compact LiFePO4 station that BLUETTI lists at 768Wh and 1,000W rated output. A good size for phones, lights, a router, and other low-to-mid wattage devices.', check: 'The wattage of anything you plan to run, especially medical devices, against BLUETTI’s current output ratings.' },
      { id: 'bluetti-ac180', why: 'A solar-ready portable power station for home backup, camping, and off-grid use, already in our gear listings.', check: 'Current capacity, output, and solar input on BLUETTI’s page.' },
      { id: 'bluetti-elite-200-v2', why: 'A mid-size station BLUETTI lists as a popular pick in its US shop.', check: 'Current specs and price on the official page.' },
      { id: 'bluetti-350w-solar', why: 'A 350W solar panel for recharging a compatible station when the grid is down.', check: 'Compatibility with your station and the panel’s connector and input limits.' },
      { id: 'bluetti-apex-300', why: 'A home battery backup system. BLUETTI lists 3,840W of output and 2,764.8Wh of capacity, with options to expand for longer outages.', check: 'Installation guidance, expansion options, and whether a licensed electrician is needed for your setup.' },
    ],
    priceNote: 'We do not publish BLUETTI prices because we have no verified, dated price list for them. Prices change often, so see the current price on BLUETTI’s product page.',
    code: 'Program code AFF5OFF for 5% off at checkout, per BLUETTI. Check BLUETTI’s page for the terms that apply when you buy.',
    choose: [
      { title: 'Add up your must-run devices', text: 'Total the watts of what you need running at once, then check the station’s rated output. Leave headroom for motors that draw more when they start.' },
      { title: 'Choose capacity for how long', text: 'Watt-hours tell you how long. Divide by your running watts for a rough hours estimate, then take off a margin for conversion losses.' },
      { title: 'Decide if you want solar', text: 'A panel recharges the station when the grid is down. Check the station’s solar input range before you pick a panel.' },
      { title: 'Indoor or outdoor use', text: 'Power stations make no exhaust and can be used indoors per their manuals. Gas generators never can. Keep either away from heat and water.' },
      { title: 'Decide if you need home backup', text: 'A portable station powers what you plug in. Powering circuits in the house is a different project that may need a licensed electrician.' },
    ],
    faq: [
      { q: 'Why did you pick BLUETTI for this spotlight?', a: 'It is our strongest approved partner by link coverage: more listings and official product photos than any other partner, plus existing gear pages and guides. Some other brands we list are not approved partners yet.' },
      { q: 'Is there a discount code?', a: 'BLUETTI’s program lists code AFF5OFF for 5% off at checkout. Terms are BLUETTI’s, so check their page when you order.' },
      { q: 'Which model should I start with?', a: 'For most outage plans, a compact or mid-size station is enough. Use the sizer tool to total your devices, then compare the AC70, AC180, and Elite 200 V2 on BLUETTI’s page.' },
      { q: 'Will the solar panel work with my station?', a: 'Check your station’s solar input range and connector against the panel’s output on BLUETTI’s page. If unsure, ask BLUETTI.' },
      { q: 'Can a portable station replace a gas generator?', a: 'For small, short loads, often yes, and with no exhaust. For long outages or heavy loads, some homes use both. Our generator vs power station guide covers the trade-offs.' },
      { q: 'Does it cost more to buy through your links?', a: 'No. The price is the same. If you buy through our links, BLUETTI pays ReadyGearHub a commission, which helps keep our guides and tools free.' },
    ],
    related: [
      { href: '/guides/how-to-pick-a-portable-power-station/', label: 'How to pick a portable power station', note: 'Watt-hours, watts, and sizing' },
      { href: '/guides/generator-vs-power-station/', label: 'Inverter generator vs portable power station', note: 'How the two differ' },
      { href: '/guides/winter-storm-power-outage-prep-guide-south/', label: 'Winter storm and power outage prep guide', note: 'Backup power in context' },
      { href: '/tools/power-sizer/', label: 'Generator & power-station sizer', note: 'Free tool' },
    ],
    directories: [
      { href: '/directory/power/', label: 'Power & Energy directory' },
      { href: '/home-backup-power-solar/', label: 'Home backup power & solar' },
      { href: '/power-outage-kits/', label: 'Power outage kits' },
      { href: '/off-grid-power/', label: 'Off-grid power' },
    ],
    thanks: 'Thank you for reading, and for supporting ReadyGearHub. If you use our links, it costs you nothing extra, and it helps us keep the guides and free tools going. Please size your power station to what you need rather than the biggest number on the page.',
  },
];

export const brandBySlug = (slug: string) => brandPages.find((b) => b.slug === slug);
