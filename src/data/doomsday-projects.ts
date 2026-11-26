/**
 * Doomsday Prepper > Projects (Nov 25, 2026).
 * Permits, beginner guides and cost ranges for bigger build projects.
 * Rules: every dollar figure comes from a cited page, with its link beside it. No invented numbers. Where no source exists, say so.
 * Permit rules vary by county and state; official sources are linked, never summarized as law.
 */
export type ProjectSource = { label: string; url: string; note?: string };
export type CostRow = { size: 'Small' | 'Medium' | 'Large'; what: string; range?: string; sourceLabel?: string; sourceUrl?: string; note?: string };
export type Project = {
  id: string;
  name: string;
  intro: string;
  approvals: string[];
  sources: ProjectSource[];
  guide: { planning: string[]; siteChecks: string[]; hireVsDiy: string; timeline: string };
  costs: CostRow[];
};

export const callBeforeDig: ProjectSource = { label: '811: call before you dig', url: 'https://call811.com/', note: 'Free utility-locate request. Do this before any digging, including post holes. Wait times vary by state.' };
export const localGov: ProjectSource = { label: 'USA.gov: find your local government', url: 'https://www.usa.gov/local-governments', note: 'Start with your county or city building and planning department.' };

export const doomsdayProjects: Project[] = [
  {
    id: 'shelters', name: 'Bunkers and underground shelters',
    intro: 'Below-ground shelters are structures, so most counties treat them like any other build: plans, a permit and inspections. Storm shelters have their own standard; other bunker types are reviewed case by case.',
    approvals: [
      'Building permit and plan review (often with an engineer’s stamp for a buried structure).',
      'Zoning and setback review for the lot, and a grading or excavation permit for the dig.',
      'Electrical permit for lighting, ventilation fans and any generator or solar tie-in.',
      'Flood-zone check. FEMA’s P-320 notes that ICC 500 does not allow below-ground storm shelters in a mapped Special Flood Hazard Area.',
      'Septic or sewer, fuel storage and water hookups, if the shelter will have them, each have their own approvals.',
    ],
    sources: [
      { label: 'FEMA P-361: Safe Rooms for Tornadoes and Hurricanes', url: 'https://www.fema.gov/sites/default/files/documents/fema_p-361_safe-rooms-for-tornadoes-and-hurricanes_122024.pdf' },
      { label: 'FEMA P-320: Taking Shelter from the Storm', url: 'https://www.fema.gov/sites/default/files/documents/fema_rsl_fema-p-320-taking-shelter-from-the-storm_042025.pdf' },
      { label: 'FEMA safe room resources', url: 'https://www.fema.gov/emergency-managers/risk-management/building-science/safe-rooms/resources' },
      { label: 'ICC 500: Design and Construction of Storm Shelters (ICC)', url: 'https://shop.iccsafe.org/ansi-icc-500-2023-icc-nssa-standard-for-the-design-and-construction-of-storm-shelters.html' },
      { label: 'FEMA Flood Map Service Center', url: 'https://msc.fema.gov/portal/home' },
      { label: 'Atlas Survival Shelters: pricing and delivery times', url: 'https://atlassurvivalshelters.com/pricing/pricing-2025/' },
      { label: 'HomeGuide: cost to build a shop, bunker or shelter', url: 'https://homeguide.com/costs/cost-to-build-a-shop' },
      localGov, callBeforeDig,
    ],
    guide: {
      planning: ['Write down the job in one sentence: storm shelter, general shelter or long-stay bunker. The answer sets the standard, the size and the budget.', 'Ask your county building department what they require for a buried structure before you talk to any seller.', 'Ask each maker what the quote includes: freight, excavation, backfill, drainage, ventilation and power.'],
      siteChecks: ['Flood zone and groundwater depth.', 'Soil and rock. HomeGuide lists a geotechnical report at $1,000 to $5,000.', 'Truck and crane access to the spot, and distance to buried lines.', 'Call 811 before anyone digs.'],
      hireVsDiy: 'Buried structures fail in costly ways when drainage, anchoring or air supply are wrong. Most buyers hire the maker or a licensed contractor for excavation and installation. Kits and site-built safe rooms from FEMA P-320 plans can be a DIY-plus-contractor job where the county allows it.',
      timeline: 'Atlas lists 3 to 12 months of delivery time depending on shelter size on its pricing page. Add permit review and the dig on top of that.',
    },
    costs: [
      { size: 'Small', what: 'Safe room built into an existing home', range: '$3,000–$10,000', sourceLabel: 'HomeAdvisor', sourceUrl: 'https://www.homeadvisor.com/cost/safety-and-security/build-a-storm-shelter/', note: 'Same page lists in-ground storm shelters at $4,200–$30,000.' },
      { size: 'Medium', what: 'Basic underground bunker, 200–400 sq ft, installed', range: '$45,000–$70,000', sourceLabel: 'HomeGuide', sourceUrl: 'https://homeguide.com/costs/cost-to-build-a-shop', note: 'HomeGuide says large, fully equipped underground models can reach into the millions.' },
      { size: 'Large', what: 'Steel bunker, roughly 10 x 40 ft class, before freight and installation', range: 'Rising S Standard Shelters $72,900–$114,900; Atlas 10 x 40 $175,000–$300,000 (May 2025 list, since removed)', sourceLabel: 'Styrkholm comparison (third party, checked Nov 2, 2026)', sourceUrl: 'https://styrkholm.com/production/compare', note: 'Reported from the makers’ own lists, not from the makers directly. Atlas now quotes by request. Confirm with each maker.' },
    ],
  },
  {
    id: 'fencing-gates', name: 'Security fencing and gates',
    intro: 'A fence is the cheapest place to start. Height, material and gate type decide both the price and the approvals. Crash-rated barriers and bollards are sold by quote through makers and installers.',
    approvals: [
      'Fence or zoning permit, with height limits that are often lower in front yards.',
      'Boundary survey, so the fence goes on your land. A property survey is a common extra cost.',
      'HOA or architectural-committee approval, where covenants apply. Read your recorded covenants (CC&Rs); the county recorder usually holds them.',
      'Electrical permit for a gate opener, and the opener’s safety sensors installed to the maker’s instructions (UL 325 is the usual gate-operator safety standard).',
      'Separate rules often apply to electric fencing and to fence on or near a road right-of-way.',
    ],
    sources: [
      { label: 'NFPA 70: National Electrical Code', url: 'https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70' },
      { label: 'ICC: International Codes', url: 'https://codes.iccsafe.org/' },
      { label: 'Rafter: fence installation cost guide (permits, height)', url: 'https://raftercost.com/insights/fence-installation-cost-guide-2026' },
      localGov, callBeforeDig,
    ],
    guide: {
      planning: ['Mark the line on paper first: length, corners, gate spots and where power can reach.', 'Choose the job by threat level, not by looks: a tall privacy fence, a see-through ornamental steel fence and a crash-rated barrier do three different things.', 'Get three written quotes that spell out permits, survey, removal of the old fence and gates.'],
      siteChecks: ['Survey pins and easements.', 'Slope and rock, which add labor.', 'Where buried lines run. Call 811 before post holes.', 'Power and conduit route for a gate opener.'],
      hireVsDiy: 'Straight runs of wood, chain-link or panel fence are a common DIY job. Gate operators, crash-rated barriers and long security runs go to a licensed installer, because layout, footings and safety sensors matter.',
      timeline: 'Plan on permit and survey time first. Rafter notes that raising a fence from 6 ft to 8 ft adds 25% to 35% to the project.',
    },
    costs: [
      { size: 'Small', what: 'About 150 ft, 1/8 acre', range: 'average $3,500', sourceLabel: 'Angi', sourceUrl: 'https://www.angi.com/articles/how-much-does-fence-installation-cost.htm', note: 'Angi’s per-foot range is $6–$50; steel or aluminum runs $17–$90 per foot.' },
      { size: 'Medium', what: 'About 590 ft, 1/2 acre, plus one automatic gate', range: 'fence average $13,570; automatic gate $2,380–$8,000 (average $4,000)', sourceLabel: 'Angi: fence and Angi: automatic gates', sourceUrl: 'https://www.angi.com/articles/how-much-does-an-automatic-gate-cost.htm' },
      { size: 'Large', what: 'About 1,100 ft (1 acre) to 2,200 ft (2 acres)', range: 'averages $24,000 and $45,000', sourceLabel: 'Angi', sourceUrl: 'https://www.angi.com/articles/how-much-does-fence-installation-cost.htm', note: 'Crash-rated bollards and anti-ram barriers: no published prices found. Makers quote by request.' },
    ],
  },
  {
    id: 'wells', name: 'Water wells',
    intro: 'A private well is a long-term water supply, and it is regulated for a reason. Most states license drillers and require a permit before drilling.',
    approvals: [
      'Well permit from the state or county agency that governs drilling. Which agency varies by state.',
      'A licensed or registered driller, where your state requires one.',
      'Setback distances from septic fields, property lines and other wells.',
      'Water-quality testing after completion. EPA recommends owners test private wells; no federal rule requires it.',
    ],
    sources: [
      { label: 'EPA: Private drinking water wells', url: 'https://www.epa.gov/privatewells' },
      { label: 'NGWA: groundwater basics', url: 'https://www.ngwa.org/what-is-groundwater/' },
      { label: 'DrillerDB: well drilling contracts (timeline)', url: 'https://drillerdb.com/resources/well-owner/well-drilling-contracts' },
      localGov, callBeforeDig,
    ],
    guide: {
      planning: ['Ask neighbors and your county what depth and yield are typical.', 'Ask for a turnkey quote that lists drilling, casing, pump, tank, electrical, permit and testing.', 'Decide on backup power for the pump, since a well pump stops in an outage.'],
      siteChecks: ['Distance to septic and other contamination sources.', 'Truck access for a drill rig.', 'Power at the wellhead.', 'Call 811 before drilling.'],
      hireVsDiy: 'Hire a licensed driller. Drilling, casing and sealing are what keep contaminated water out of the well.',
      timeline: 'DrillerDB describes about five weeks from signing to final hookup, with drilling itself taking 1 to 3 days.',
    },
    costs: [
      { size: 'Small', what: 'Shallow well, 50–100 ft, soft soil, complete system', range: '$5,500–$10,000', sourceLabel: 'The Well Guide', sourceUrl: 'https://www.thewell.guide/cost-guides/well-drilling-cost' },
      { size: 'Medium', what: 'Standard residential well, 100–200 ft, complete system', range: '$7,000–$16,000', sourceLabel: 'The Well Guide', sourceUrl: 'https://www.thewell.guide/cost-guides/well-drilling-cost' },
      { size: 'Large', what: 'Deep well, 300–500 ft', range: '$16,000–$38,000', sourceLabel: 'The Well Guide', sourceUrl: 'https://www.thewell.guide/cost-guides/well-drilling-cost', note: 'Very deep or hard-rock wells (500 ft and up) run $26,000–$50,000+ on the same page.' },
    ],
  },
  {
    id: 'septic', name: 'Septic systems',
    intro: 'Septic is decided by soil. A percolation test tells you which system the regulator will accept, and that choice drives most of the cost.',
    approvals: [
      'Soil or percolation test, usually done by a licensed professional.',
      'Septic permit from the state or county health department, and inspections during install.',
      'A licensed installer, where your state requires one.',
      'Setbacks from wells, water, property lines and structures.',
    ],
    sources: [
      { label: 'EPA: Septic systems', url: 'https://www.epa.gov/septic' },
      localGov, callBeforeDig,
    ],
    guide: {
      planning: ['Start with the health department: they set the design rules for your soil.', 'Plan the system for the bedroom count of the finished property, not today’s.', 'Keep vehicles and buildings off the drain-field area.'],
      siteChecks: ['Perc test and soil evaluation.', 'Depth to groundwater and bedrock.', 'Slope and setbacks.', 'Call 811 before trenching.'],
      hireVsDiy: 'Hire a licensed septic installer. Many places do not allow owner-installed systems, and mistakes are expensive to dig up.',
      timeline: 'Testing and permit come first; the install itself is usually a matter of days once approved.',
    },
    costs: [
      { size: 'Small', what: 'Conventional (anaerobic) system', range: '$3,000–$8,000', sourceLabel: 'Angi', sourceUrl: 'https://www.angi.com/articles/what-does-it-cost-install-septic-system.htm', note: 'Perc tests add $700–$2,000 on the same page.' },
      { size: 'Medium', what: 'Aerobic treatment system', range: '$10,000–$20,000', sourceLabel: 'Angi', sourceUrl: 'https://www.angi.com/articles/what-does-it-cost-install-septic-system.htm' },
      { size: 'Large', what: 'Mound system, or engineered drip on a hard site', range: 'mound $10,000–$25,000; engineered drip $20,000–$38,000+', sourceLabel: 'SepticSage and Septic Cost Guide', sourceUrl: 'https://septiccostguide.com/septic-installation-cost/' },
    ],
  },
  {
    id: 'solar-generators', name: 'Solar, batteries and generator hookups',
    intro: 'Portable energy reserves plug in and need no permit. A transfer switch, a standby generator or a roof array is a permanent electrical job, and the electrical code and your utility both have a say.',
    approvals: [
      'Electrical permit and inspection, with work done to the National Electrical Code. NEC Article 702 covers optional standby systems, 705 interconnected power sources and 706 energy storage.',
      'A utility interconnection agreement for solar or batteries that connect to the grid.',
      'A gas-fitting or fuel permit for natural-gas or propane generators.',
      'Roof, structural and fire-code review for rooftop solar, and HOA approval where covenants apply.',
      'Generators run outdoors only, away from windows and doors, with a CO alarm inside, as the maker’s manual says.',
    ],
    sources: [
      { label: 'NFPA 70: National Electrical Code', url: 'https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70' },
      { label: 'EnergySage: solar cost data', url: 'https://www.energysage.com/local-data/solar-panel-cost/' },
      localGov, callBeforeDig,
    ],
    guide: {
      planning: ['List what must stay on in an outage and add up the watts. Our free sizer tools can help.', 'Choose the layer: portable energy reserve, transfer switch with a portable generator, or a whole-home battery or standby unit.', 'Get at least three installer quotes for anything wired into the panel.'],
      siteChecks: ['Electrical panel capacity and location.', 'Gas line size and distance for a standby generator.', 'Roof age, shade and orientation for solar.', 'Call 811 for trenching to a pad.'],
      hireVsDiy: 'Plug-in energy reserves and portable panels are DIY. Anything wired into the house panel belongs to a licensed electrician.',
      timeline: 'Permit and interconnection approvals often take longer than the install, which is usually days.',
    },
    costs: [
      { size: 'Small', what: 'Generator transfer switch installed', range: '$600–$2,500', sourceLabel: 'Angi', sourceUrl: 'https://www.angi.com/articles/cost-install-generator-transfer-switch.htm' },
      { size: 'Medium', what: 'Whole-house natural-gas standby generator, installed', range: '$8,000–$16,000', sourceLabel: 'Home Energy Planner', sourceUrl: 'https://homeenergyplanner.com/whole-house-generator-cost-installed/' },
      { size: 'Large', what: 'Typical 12 kW rooftop solar system, before incentives', range: '$27,526–$33,869 (average $31,135)', sourceLabel: 'EnergySage', sourceUrl: 'https://www.energysage.com/local-data/solar-panel-cost/', note: 'Standby installs with long gas runs, propane tanks or panel upgrades can reach $24,000 or more per Home Energy Planner. Portable energy reserve prices are on each maker’s page; none are quoted here.' },
    ],
  },
  {
    id: 'outbuildings-safe-rooms', name: 'Outbuildings and safe rooms',
    intro: 'A workshop, barn or safe room is an accessory structure. Counties usually set size triggers for permits, plus setbacks and use limits.',
    approvals: [
      'Building permit and zoning review for accessory structures, with setbacks and size or height limits.',
      'Foundation, framing and final inspections.',
      'Electrical and plumbing permits for any utilities run to the building.',
      'For safe rooms, FEMA P-320 gives prescriptive designs, and ICC 500 sets the storm-shelter standard that many building codes reference.',
      'HOA approval where covenants apply.',
    ],
    sources: [
      { label: 'FEMA P-320: Taking Shelter from the Storm (includes plans)', url: 'https://www.fema.gov/sites/default/files/documents/fema_rsl_fema-p-320-taking-shelter-from-the-storm_042025.pdf' },
      { label: 'FEMA P-361', url: 'https://www.fema.gov/sites/default/files/documents/fema_p-361_safe-rooms-for-tornadoes-and-hurricanes_122024.pdf' },
      { label: 'ICC: International Codes', url: 'https://codes.iccsafe.org/' },
      { label: 'FEMA building science FAQ: safe room costs', url: 'https://www.fema.gov/emergency-managers/risk-management/building-science/faq' },
      { label: 'Building America Solution Center: safe rooms and storm shelters (US DOE)', url: 'https://basc.pnnl.gov/resource-guides/safe-rooms-and-storm-shelters' },
      localGov, callBeforeDig,
    ],
    guide: {
      planning: ['Decide the building’s job first: storage, shop, shelter or all three.', 'Check setbacks and size limits with the county before choosing a size.', 'For a safe room, start from FEMA P-320 plans rather than a sketch.'],
      siteChecks: ['Level ground and drainage.', 'Distance from the nearest power.', 'Easements and setbacks.', 'Call 811 before digging footings.'],
      hireVsDiy: 'HomeGuide calls a prefab metal building kit installed DIY the cheapest route, if you have the skills and know the code. Safe rooms and anything with wiring or plumbing are better left to licensed builders.',
      timeline: 'HomeGuide: a small pole-barn style shop can go up in days; a large finished shop can take 6 to 12+ weeks.',
    },
    costs: [
      { size: 'Small', what: '10 x 20 ft outbuilding (200 sq ft)', range: 'prefab $4,000–$10,000; custom $10,000–$30,000', sourceLabel: 'HomeGuide', sourceUrl: 'https://homeguide.com/costs/cost-to-build-a-shop' },
      { size: 'Medium', what: '20 x 30 ft outbuilding (600 sq ft)', range: 'prefab $12,000–$30,000; custom $30,000–$90,000', sourceLabel: 'HomeGuide', sourceUrl: 'https://homeguide.com/costs/cost-to-build-a-shop', note: 'HomeGuide lists permits at about 0.5% to 2% of cost.' },
      { size: 'Large', what: '30 x 40 ft outbuilding (1,200 sq ft)', range: 'prefab $24,000–$60,000; custom $60,000–$180,000', sourceLabel: 'HomeGuide', sourceUrl: 'https://homeguide.com/costs/cost-to-build-a-shop', note: 'Site-built safe room added during new construction (FEMA, 2024 dollars, door assembly extra at about $2,500–$3,200): $12,700–$16,100 for 8 x 8 ft and $25,600–$34,500 for 14 x 14 ft. Retrofits cost more. Source: FEMA building science FAQ (https://www.fema.gov/emergency-managers/risk-management/building-science/faq).' },
    ],
  },
  {
    id: 'grading-excavation', name: 'Grading and excavation',
    intro: 'Moving earth sounds simple and has more rules than people expect: utility locates, erosion control and trench safety.',
    approvals: [
      'Grading or land-disturbance permit from the county or city for larger jobs.',
      'Erosion and sediment control. EPA’s construction stormwater program generally applies to sites that disturb one acre or more.',
      'Floodplain, wetland and drainage-easement checks before you change how water moves.',
      'Trench safety. OSHA requires protective systems for deeper trenches and has a free guide.',
      'Utility locate: call 811 first, every time.',
    ],
    sources: [
      callBeforeDig,
      { label: 'EPA: Construction stormwater', url: 'https://www.epa.gov/npdes/stormwater-discharges-construction-activities' },
      { label: 'OSHA: Trenching and excavation', url: 'https://www.osha.gov/trenching-excavation' },
      { label: 'FEMA Flood Map Service Center', url: 'https://msc.fema.gov/portal/home' },
      localGov,
    ],
    guide: {
      planning: ['Sketch the finished grade and where water will run.', 'Ask the contractor for an erosion-control plan and what is done with the dirt.', 'Get three quotes after an on-site visit; excavation prices depend on soil and rock.'],
      siteChecks: ['Buried utilities, marked after your 811 call.', 'Soil type and rock.', 'Drainage paths and neighbors’ land.', 'Slopes and access for equipment.'],
      hireVsDiy: 'Renting a mini excavator is possible, but utility strikes and trench collapses are the risks. For anything deeper than a few feet or near lines, hire an operator.',
      timeline: 'HomeGuide: 1 to 3 days for small jobs and 3+ weeks for large or rocky sites. Spring is usually the best season in snow country.',
    },
    costs: [
      { size: 'Small', what: 'Dirt pad for a driveway, patio or deck', range: '$1,000–$2,500', sourceLabel: 'HomeGuide', sourceUrl: 'https://homeguide.com/costs/excavation-cost', note: 'Typical contractor minimums run $500–$800.' },
      { size: 'Medium', what: 'Foundation pad or basement dig for new construction', range: '$1,500–$10,000', sourceLabel: 'HomeGuide', sourceUrl: 'https://homeguide.com/costs/excavation-cost', note: 'By volume: $2.50–$15 per cubic yard in ordinary soil.' },
      { size: 'Large', what: 'Rock or ledge removal', range: '$1,000–$20,000+', sourceLabel: 'HomeGuide', sourceUrl: 'https://homeguide.com/costs/excavation-cost', note: 'Jackhammered rock runs $50–$200+ per cubic yard.' },
    ],
  },
];
