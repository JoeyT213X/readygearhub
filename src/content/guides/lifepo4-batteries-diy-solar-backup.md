---
title: "LiFePO4 Batteries and DIY Solar Backup: A Beginner's Guide"
description: "What a LiFePO4 battery is, how to size one in plain math, and how a battery, charge controller, inverter and solar panel fit together for outage backup, plus when an all-in-one Energy Reserve is the simpler choice."
lane: off-grid-power
season: ["all-season", "hurricane", "winter"]
published: 2026-11-27
relatedItems: ["litime-12v-100ah-group24", "litime-12v-200ah-bluetooth", "litime-12v-50ah", "litime-30a-mppt", "litime-1000w-12v-inverter", "litime-2000w-12v-inverter-ats", "litime-12v-10a-charger", "litime-diy-solar-generator-kit", "bluetti-200w-solar-panel", "bluetti-ac180", "bougerv-12v-100ah-group24", "bougerv-100w-portable-solar-panel", "bougerv-200w-portable-solar-panel", "bougerv-sunflow-40a-mppt", "bougerv-2000w-12v-inverter"]
directory: power
siblings: ["how-to-pick-an-energy-reserve", "generator-vs-energy-reserve"]
draft: false
---

When the power goes out, a battery is the quiet way to keep the lights, phones, a router, a fan or a CPAP running. No fuel, no fumes, nothing to run outdoors. You can buy that as one box, which we call an **Energy Reserve**, or you can build your own setup from a battery, a charger and an inverter. This guide explains the DIY route in plain terms so you can decide which way fits you.

If you just want something that works out of the box, start with our [guide to picking an Energy Reserve](/guides/how-to-pick-an-energy-reserve/). If you are weighing fuel generators, see [generator vs. Energy Reserve](/guides/generator-vs-energy-reserve/).

## What "LiFePO4" means

LiFePO4 (lithium iron phosphate, often shortened to LFP) is a type of lithium battery chemistry. It is the chemistry used in many 12-volt "drop-in" batteries for RVs, boats and small solar setups, and in many Energy Reserves too.

Compared with the lead-acid batteries many people know from cars and boats, LiFePO4 batteries are lighter for the same capacity, and many makers rate them for more charge cycles. Each maker lists its own cycle rating, warranty and temperature limits on the product page, so check those for the exact model you are considering.

One thing that matters in the South: lithium batteries have limits on charging in the cold. Some makers sell self-heating versions for that reason. LiTime's [LiHeat 12V 100Ah Group 24](/gear/litime-12v-100ah-group24/) is one of those. BougeRV's [12V 100Ah Group 24 LiFePO4 battery](/gear/bougerv-12v-100ah-group24/) is another Group 24 option; BougeRV says charging on that model stops below 32°F. If your battery will live in an unheated shed, garage or RV, read the charging temperature range on the spec sheet before you buy.

## The four parts of a DIY battery backup

A basic DIY setup has four parts. Think of it like plumbing: the battery is the tank, and everything else moves energy in or out.

1. **The battery.** Stores the energy. Most beginner systems use 12 volts.
2. **A way to charge it.** A wall charger, a solar panel with a charge controller, a vehicle through a DC-to-DC charger, or all three.
3. **An inverter.** Turns the battery's 12-volt DC power into the 120-volt AC power your household plugs use.
4. **Safety parts.** Correctly sized cables, a fuse or breaker close to the battery, and a battery disconnect switch. Every maker's manual lists the sizes it calls for. Follow it.

### Charging options

- **Wall charger.** The simplest. A charger made for LiFePO4, like the [LiTime 12V 10A charger](/gear/litime-12v-10a-charger/), tops up the battery from an outlet before a storm.
- **Solar.** Panels connect to a **charge controller**, which manages how the battery charges. MPPT controllers, like the [LiTime 30A MPPT](/gear/litime-30a-mppt/) or the [BougeRV Sunflow 40A MPPT](/gear/bougerv-sunflow-40a-mppt/), are the common choice for small systems. Portable folding panels such as the [BLUETTI 200W panel](/gear/bluetti-200w-solar-panel/), or BougeRV's [100W](/gear/bougerv-100w-portable-solar-panel/) and [200W](/gear/bougerv-200w-portable-solar-panel/) portable panels, can be set out in the yard during an outage and stored the rest of the year.
- **Your vehicle.** A DC-to-DC charger charges a house battery from a running vehicle's alternator, which is handy in RVs and work trucks.

### Inverter options

Pick a **pure sine wave** inverter for electronics and anything with a motor. Size it for the biggest load you'll run at once, plus some room. The [LiTime 1000W inverter](/gear/litime-1000w-12v-inverter/) suits lights, phones, a router, a fan and a small TV. The [LiTime 2000W inverter with ATS](/gear/litime-2000w-12v-inverter-ats/) is built for bigger loads and includes an automatic transfer switch, which LiTime lists at 20 milliseconds, to swap a plugged-in load over to battery power when the grid drops. BougeRV's [2000W 12V pure sine wave inverter](/gear/bougerv-2000w-12v-inverter/) is another 2000W option, with Bluetooth monitoring; it does not include a transfer switch. Confirm continuous and surge ratings on each maker's page.

## Sizing it with plain math

You don't need special tools to size a small system. You need two numbers from each device: its watts and how many hours you want it to run.

**Step 1: Add up your daily watt-hours.** Watts × hours = watt-hours (Wh). For example:

| Device | Watts (from its label) | Hours per day | Watt-hours |
| --- | --- | --- | --- |
| LED lamp | 10 | 6 | 60 |
| Wi-Fi router | 12 | 24 | 288 |
| Box fan on low | 40 | 8 | 320 |
| Phone charging (2 phones) | 20 | 3 | 60 |
| **Total** | | | **728 Wh** |

These numbers are examples. Use the watts printed on your own devices, or measure them with a plug-in power meter.

**Step 2: Find the battery's watt-hours.** Volts × amp-hours = watt-hours. A battery rated 12.8 volts and 100 amp-hours stores about 1,280 Wh. A 200Ah battery stores about twice that.

**Step 3: Leave margin.** The inverter uses some power just being on, and you shouldn't plan to run any battery to absolutely empty. Many people plan to use about 80% of the rated capacity. Check what your battery maker recommends.

So for the example above (728 Wh a day), one 100Ah 12V battery covers about a day, with some room. Want two days without sun? Look at a 200Ah battery like the [LiTime 12V 200Ah](/gear/litime-12v-200ah-bluetooth/), or two 100Ah batteries wired the way the maker's manual describes.

**Step 4: Size the solar.** A panel's watt rating is what it makes in ideal sun. Real output is lower and changes with weather, angle and season. During a cloudy week after a storm, plan on much less. Solar stretches your battery; it rarely replaces a full charge every day in winter.

## DIY or an all-in-one Energy Reserve?

**An Energy Reserve** (for example the [BLUETTI AC180](/gear/bluetti-ac180/)) puts the battery, inverter, charger and solar controller in one box with outlets on the front. You plug in and go. It's the easiest choice for most households, renters, and anyone who doesn't want to wire anything.

**A DIY system** makes sense when:

- You want a larger battery bank than a portable unit offers for the money.
- You want to mount things permanently, like in an RV, a shed or a camper.
- You like tinkering and will read the manuals carefully.

There's also a middle path: kits that bundle matched parts, like the [LiTime DIY Solar Generator Kit](/gear/litime-diy-solar-generator-kit/), take much of the guesswork out of picking compatible parts. ALLPOWERS and Anker SOLIX also sell panels and Energy Reserves; see the [Energy Reserves & Prepper Power directory](/directory/power/).

## Safety rules that matter most

- **Never connect anything to your home's wiring yourself.** Feeding power into house circuits without a proper transfer switch or interlock installed by a licensed electrician can injure utility workers and damage equipment.
- **Fuse the battery.** A short circuit on a large battery can melt cables and start a fire. Use the fuse size the battery and inverter makers specify, as close to the battery as possible.
- **Use the right cable size.** Undersized cables get hot. Follow the inverter manual's cable chart for your cable length.
- **Mount and vent it as the manual says.** Keep batteries off wet floors, away from heat and secured so they can't tip.
- **Batteries are not generators.** A battery makes no fumes and is fine indoors. A fuel generator is different: [Ready.gov](https://www.ready.gov/power-outages) says generators and fuel should always be used outdoors and at least 20 feet away from windows, doors and attached garages, with working carbon monoxide alarms inside.
- **Plan for medical devices.** If someone in your home relies on a powered medical device, Ready.gov advises talking with your medical provider about a power outage plan.

## A simple starter plan

1. List the few things you truly need during an outage and add up their watt-hours.
2. Choose an Energy Reserve if you want plug-and-play, or a 100Ah to 200Ah LiFePO4 battery plus a matching inverter and charger if you want DIY.
3. Add a folding solar panel to stretch a multi-day outage.
4. Charge everything before storm season, and test your setup once by running your list for an evening.

## The bottom line

LiFePO4 batteries make quiet, indoor-safe backup power practical. Do the watt-hour math, match the parts, follow every manual's fuse and cable instructions, and leave anything that touches house wiring to a licensed electrician.

Keep going with [how to pick an Energy Reserve](/guides/how-to-pick-an-energy-reserve/) and [generator vs. Energy Reserve](/guides/generator-vs-energy-reserve/), or browse the [Energy Reserves & Prepper Power directory](/directory/power/).

*Sources: [Ready.gov power outages and generator safety](https://www.ready.gov/power-outages). Battery, inverter, charger and panel details come from each maker's official product page.*
