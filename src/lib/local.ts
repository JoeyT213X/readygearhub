const modules = import.meta.glob('../data/local/*.json', { eager: true });

export type LocalSource = {
  name: string;
  url: string;
  verified: string;
  notes?: string;
  type?: string;
};

export type LocalUtility = {
  name: string;
  outageMapUrl: string;
  territorySource: { name: string; url: string; verified: string };
  notes?: string;
  verified: string;
};

export type LocalCounty = {
  slug: string;
  name: string;
  verified: string;
  emergencyManagement: {
    name: string;
    url: string;
    phone?: string;
    notes?: string;
  };
  warmingCoolingSources: LocalSource[];
  utilities: LocalUtility[];
};

export type LocalState = {
  slug: string;
  name: string;
  abbreviation: string;
  verified: string;
  intro: string;
  statewideSources: LocalSource[];
  counties: LocalCounty[];
};

function asState(mod: unknown): LocalState {
  const data = (mod as { default?: LocalState }).default ?? (mod as LocalState);
  if (!data?.slug || !data?.name || !Array.isArray(data.counties)) {
    throw new Error('Invalid local state JSON: each file in src/data/local/ must include slug, name, and counties.');
  }
  return data;
}

export const localStates: LocalState[] = Object.values(modules)
  .map(asState)
  .sort((a, b) => a.name.localeCompare(b.name));

export const localStateBySlug = (slug: string) => localStates.find((s) => s.slug === slug);

export const countyBySlug = (state: LocalState, slug: string) =>
  state.counties.find((c) => c.slug === slug);
