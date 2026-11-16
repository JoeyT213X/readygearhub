import lanesRaw from '../data/lanes.json';

export type LaneRef = { slug: string; name: string; icon: string };

const bySlug = Object.fromEntries(
  (lanesRaw as { slug: string; name: string; icon: string }[]).map((l) => [l.slug, { slug: l.slug, name: l.name, icon: l.icon }]),
);

/** Official-sounding NWS event name fragments. Used only to classify and to link existing lanes. */
const WINTER_FRAGMENTS = [
  'winter storm',
  'winter weather',
  'ice storm',
  'blizzard',
  'snow squall',
  'lake effect snow',
  'blowing snow',
  'wind chill',
  'extreme cold',
  'cold weather',
  'hard freeze',
  'freeze warning',
  'freeze watch',
  'frost advisory',
  'freezing rain',
  'freezing drizzle',
  'freezing fog',
  'sleet',
];

const SEVERE_FRAGMENTS = [
  'tornado',
  'severe thunderstorm',
  'severe weather',
  'extreme wind',
  'high wind',
  'hurricane',
  'typhoon',
  'tropical storm',
  'tropical depression',
  'storm surge',
  'flash flood',
  'flood',
  'debris flow',
  'dust storm',
];

function includesAny(event: string, fragments: string[]) {
  const e = event.toLowerCase();
  return fragments.some((f) => e.includes(f));
}

export function classifyEvent(event: string): { winter: boolean; severe: boolean } {
  const e = (event || '').toLowerCase();
  // "freeze" alone should still catch "Freeze Warning/Watch" after the longer phrases above.
  const winter = includesAny(e, WINTER_FRAGMENTS) || /\bfreeze\b/.test(e) || /\bfrost\b/.test(e);
  const severe = includesAny(e, SEVERE_FRAGMENTS);
  return { winter, severe };
}

function refs(slugs: string[]): LaneRef[] {
  const out: LaneRef[] = [];
  const seen = new Set<string>();
  for (const slug of slugs) {
    const lane = bySlug[slug];
    if (lane && !seen.has(slug)) {
      seen.add(slug);
      out.push(lane);
    }
  }
  return out;
}

/** Map an NWS event name to existing ReadyGearHub lane slugs only. Never invent products or lanes. */
export function lanesForEvent(event: string): LaneRef[] {
  const e = (event || '').toLowerCase();
  const { winter, severe } = classifyEvent(e);
  const slugs: string[] = [];

  if (winter) {
    slugs.push('winter-storm-prep');
    if (/(wind chill|extreme cold|cold weather|freeze|frost)/.test(e)) {
      slugs.push('home-heating-backup', 'cold-weather-gear');
    }
    if (/(blizzard|ice storm|winter storm|snow|sleet|freezing rain)/.test(e)) {
      slugs.push('vehicle-emergency-kits', 'power-outage-kits');
    } else {
      slugs.push('power-outage-kits');
    }
  }

  if (severe) {
    slugs.push('storm-hurricane-prep');
    if (/(hurricane|typhoon|tropical|storm surge|tornado|thunderstorm|high wind|extreme wind|flash flood|flood)/.test(e)) {
      slugs.push('power-outage-kits');
    }
  }

  return refs(slugs);
}

export const SEVERITY_ORDER: Record<string, number> = {
  Extreme: 0,
  Severe: 1,
  Moderate: 2,
  Minor: 3,
  Unknown: 4,
};

export const URGENCY_ORDER: Record<string, number> = {
  Immediate: 0,
  Expected: 1,
  Future: 2,
  Past: 3,
  Unknown: 4,
};
