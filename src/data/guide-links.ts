/**
 * Curated internal links for guides, driven from one place.
 *
 * - `directory`: Full Source Directory category slugs (/directory/<slug>/) that fit the guide.
 *   The guide page shows them as "Browse the directory", and each directory category page
 *   lists the guides that point to it ("Guides for this category"), so links run both ways.
 * - `readNext`: guide ids that go deeper on a related search intent (canonical pages first).
 * - `extras`: other useful internal pages (projects, doomsday hub, tools).
 * - `winterOptIn`: guides that show the winter checklist signup (MailerLite form stormReminders,
 *   slug PTvH32) at the top. Chosen from GA4 page views plus the canonical winter pillar; see
 *   /workspace/traffic/readygearhub/seo/keyword-url-map.md for the evidence.
 *
 * Rule: no partner links here. These are plain internal links to organic pages.
 */
export type GuideNav = {
  directory?: string[];
  readNext?: string[];
  extras?: { href: string; label: string }[];
};

export const guideNav: Record<string, GuideNav> = {
  'winter-storm-power-outage-prep-guide-south': {
    directory: ['power', 'water', 'food', 'outdoor', 'auto', 'fun', 'audio'],
    readNext: ['ice-storm-prep-checklist-south', 'power-outage-ice-storm-mississippi', 'emergency-food-storage', 'how-to-keep-pipes-from-freezing'],
    extras: [{ href: '/gear/#offline-entertainment', label: 'Offline entertainment for long outages: card games, downloaded music and audiobooks' }],
  },
  'ice-storm-prep-checklist-south': {
    directory: ['power', 'water', 'food', 'outdoor', 'fun', 'audio'],
    readNext: ['winter-storm-power-outage-prep-guide-south', 'emergency-food-storage', 'emergency-water-storage'],
    extras: [{ href: '/gear/#offline-entertainment', label: 'Offline entertainment for long outages: card games, downloaded music and audiobooks' }],
  },
  'ice-storm-survival-checklist-for-the-south': {
    // Merge candidate (301 to ice-storm-prep-checklist-south): no directory links, so it is not promoted.
    readNext: ['ice-storm-prep-checklist-south', 'winter-storm-power-outage-prep-guide-south'],
  },
  'power-outage-ice-storm-mississippi': {
    directory: ['power', 'water', 'food', 'outdoor', 'fun'],
    readNext: ['ice-storm-prep-checklist-south', 'emergency-food-storage', 'carbon-monoxide-safety-during-an-outage'],
    extras: [{ href: '/gear/#offline-entertainment', label: 'Offline entertainment for long outages: card games, downloaded music and audiobooks' }],
  },
  'winter-power-outage-checklist': {
    directory: ['power', 'food', 'outdoor', 'fun'],
    readNext: ['winter-storm-power-outage-prep-guide-south', 'emergency-food-storage', 'emergency-water-storage'],
    extras: [{ href: '/gear/#offline-entertainment', label: 'Offline entertainment for long outages: card games, downloaded music and audiobooks' }],
  },
  'how-to-stay-warm-without-power': {
    directory: ['outdoor', 'power', 'fun'],
    readNext: ['heat-one-room-safely-in-an-outage', 'carbon-monoxide-safety-during-an-outage', 'emergency-food-storage'],
    extras: [{ href: '/gear/#offline-entertainment', label: 'Offline entertainment for long outages: card games, downloaded music and audiobooks' }],
  },
  'heat-one-room-safely-in-an-outage': {
    directory: ['outdoor', 'power'],
    readNext: ['how-to-stay-warm-without-power', 'carbon-monoxide-safety-during-an-outage'],
  },
  'how-to-keep-pipes-from-freezing': {
    directory: ['tools', 'home'],
    readNext: ['winter-storm-power-outage-prep-guide-south', 'emergency-water-storage'],
  },
  'winter-storm-watch-vs-warning': {
    directory: ['tech', 'audio'],
    readNext: ['ice-storm-prep-checklist-south', 'winter-storm-power-outage-prep-guide-south'],
  },
  'winter-car-emergency-kit': {
    directory: ['auto', 'outdoor'],
    readNext: ['winter-storm-power-outage-prep-guide-south', 'emergency-food-storage'],
  },
  'winter-emergency-kit-for-elderly-parents': {
    directory: ['safety', 'power', 'food', 'fun'],
    readNext: ['winter-storm-power-outage-prep-guide-south', 'emergency-food-storage', 'storm-first-aid-kit'],
  },
  'carbon-monoxide-safety-during-an-outage': {
    directory: ['safety', 'power'],
    readNext: ['generator-vs-energy-reserve', 'heat-one-room-safely-in-an-outage'],
  },
  'emergency-food-storage': {
    directory: ['food', 'doomsday-prepper'],
    readNext: ['emergency-water-storage', 'hurricane-prep-guide-gulf-south', 'winter-storm-power-outage-prep-guide-south'],
    extras: [{ href: '/doomsday-prepper/', label: 'Doomsday Prepper: long-term food, shelter and power planning' }],
  },
  'emergency-water-storage': {
    directory: ['water', 'food'],
    readNext: ['emergency-food-storage', 'hurricane-prep-guide-gulf-south'],
    extras: [{ href: '/doomsday-prepper/projects/#wells', label: 'Planning a private well? Permits, guides and cost ranges' }],
  },
  'hurricane-prep-guide-gulf-south': {
    directory: ['power', 'water', 'food', 'safety', 'audio', 'drones-robotics', 'drones'],
    readNext: ['emergency-food-storage', 'emergency-water-storage', 'tornado-watch-vs-warning-mississippi'],
    extras: [{ href: '/doomsday-prepper/projects/#outbuildings-safe-rooms', label: 'Safe rooms and shelters: permits, guides and cost ranges' }],
  },
  'tornado-watch-vs-warning-mississippi': {
    directory: ['safety', 'audio'],
    readNext: ['hurricane-prep-guide-gulf-south', 'storm-first-aid-kit'],
    extras: [{ href: '/doomsday-prepper/projects/#outbuildings-safe-rooms', label: 'Safe rooms and storm shelters: permits, guides and cost ranges' }],
  },
  'storm-first-aid-kit': {
    directory: ['safety'],
    readNext: ['winter-emergency-kit-for-elderly-parents', 'emergency-water-storage'],
  },
  'generator-vs-energy-reserve': {
    directory: ['power', 'outdoor'],
    readNext: ['how-to-pick-an-energy-reserve', 'carbon-monoxide-safety-during-an-outage'],
    extras: [{ href: '/doomsday-prepper/projects/#solar-generators', label: 'Solar, batteries and generator hookups: permits and costs' }],
  },
  'how-to-pick-an-energy-reserve': {
    directory: ['power', 'outdoor'],
    readNext: ['generator-vs-energy-reserve', 'winter-power-outage-checklist'],
    extras: [{ href: '/doomsday-prepper/projects/#solar-generators', label: 'Solar, batteries and generator hookups: permits and costs' }],
  },
};

/** Guides that show the winter checklist signup at the top of the page. */
export const winterOptIn: Record<string, { heading: string; intro: string }> = {
  'emergency-food-storage': {
    heading: 'Free winter storm checklist, by email',
    intro: 'Food and water are step one of a winter storm plan. Leave your email for the free printable checklist and a few calm seasonal reminders.',
  },
  'emergency-water-storage': {
    heading: 'Free winter storm checklist, by email',
    intro: 'Water is step one of a winter storm plan. Leave your email for the free printable checklist and a few calm seasonal reminders.',
  },
  'how-to-stay-warm-without-power': {
    heading: 'Free winter storm checklist, by email',
    intro: 'Keep a one-page list of heat, light, food and water steps on the fridge. Leave your email for the printable and a few calm reminders each season.',
  },
  'winter-storm-power-outage-prep-guide-south': {
    heading: 'Prefer paper? Get the free winter checklist',
    intro: 'A printable, six-page version of the essentials, plus a calm reminder or two each season. Unsubscribe anytime.',
  },
  'how-to-keep-pipes-from-freezing': {
    heading: 'Free winter storm checklist, by email',
    intro: 'Pipes are one line on a longer list. Leave your email for the printable checklist and a few calm seasonal reminders.',
  },
};

/**
 * /gear/ sections (directory.ts category ids) that list related guides under the section heading.
 * Keeps category-to-guide links in data rather than in the page.
 */
export const gearSectionGuides: Record<string, string[]> = {
  'offline-entertainment': ['how-to-stay-warm-without-power', 'power-outage-ice-storm-mississippi', 'winter-power-outage-checklist', 'winter-emergency-kit-for-elderly-parents'],
};
