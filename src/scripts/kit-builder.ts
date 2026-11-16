import { STORAGE_KEYS } from '../lib/app-config';
import { KIT_LINES, type KitLine } from '../data/kit-guidance';

export type Catalog = {
  items: Record<string, { name: string }>;
  lanes: Record<string, { name: string; icon: string }>;
  guides: Record<string, { title: string }>;
};

type State = {
  people: number;
  days: number;
  infants: number;
  pets: number;
  meds: boolean;
  vehicle: boolean;
};

const DEFAULT_STATE: State = { people: 2, days: 3, infants: 0, pets: 0, meds: false, vehicle: false };

function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.kitBuilder);
    if (!raw) return { ...DEFAULT_STATE };
    const p = JSON.parse(raw);
    return {
      people: Math.max(1, Number(p.people) || DEFAULT_STATE.people),
      days: Math.max(3, Number(p.days) || DEFAULT_STATE.days),
      infants: Math.max(0, Number(p.infants) || 0),
      pets: Math.max(0, Number(p.pets) || 0),
      meds: !!p.meds,
      vehicle: !!p.vehicle,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState(state: State) {
  try {
    localStorage.setItem(STORAGE_KEYS.kitBuilder, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function included(line: KitLine, state: State) {
  if (line.ifPets) return state.pets > 0;
  if (line.ifInfants) return state.infants > 0;
  if (line.ifMeds) return state.meds;
  if (line.ifVehicle) return state.vehicle;
  return line.always !== false;
}

function waterDetail(state: State) {
  const gallons = state.people * state.days * 1;
  return `For ${state.people} person${state.people === 1 ? '' : 's'} over ${state.days} days, that is ${gallons} gallon${gallons === 1 ? '' : 's'} (1 gallon per person per day). Ready.gov recommends one gallon per person per day for several days. This tool uses a 3-day minimum as a common Ready.gov baseline.`;
}

function foodDetail(state: State) {
  return `Plan a several-day supply of non-perishable food for ${state.people} person${state.people === 1 ? '' : 's'}. You asked for ${state.days} days. Ready.gov says “at least a several-day supply.”`;
}

function blanketDetail(state: State) {
  return `Ready.gov calls for a sleeping bag or warm blanket for each person — ${state.people} for this household.`;
}

function infantDetail(state: State) {
  return `Include formula, bottles, diapers, wipes, and diaper rash cream for ${state.infants} infant${state.infants === 1 ? '' : 's'}.`;
}

function petIntro(state: State) {
  return `You listed ${state.pets} pet${state.pets === 1 ? '' : 's'}. Guidance below is from Ready.gov’s pet preparedness page.`;
}

const SECTION_TITLES: Record<string, string> = {
  basic: 'Basic disaster supplies kit',
  additional: 'Additional supplies',
  pets: 'Pet supplies',
  vehicle: 'Car kit',
};

function linksHtml(line: KitLine, catalog: Catalog) {
  const parts: string[] = [];
  for (const slug of line.relatedLanes || []) {
    const lane = catalog.lanes[slug];
    if (lane) parts.push(`<a class="pill" href="/${slug}/">${lane.icon} ${lane.name}</a>`);
  }
  for (const slug of line.relatedItems || []) {
    const item = catalog.items[slug];
    if (item) parts.push(`<a class="pill" href="/gear/${slug}/">${item.name}</a>`);
  }
  for (const slug of line.relatedGuides || []) {
    const g = catalog.guides[slug];
    if (g) parts.push(`<a class="pill" href="/guides/${slug}/">${g.title}</a>`);
  }
  return parts.length ? `<div class="related-lanes">${parts.join('')}</div>` : '';
}

function detailFor(line: KitLine, state: State) {
  if (line.id === 'water') return waterDetail(state);
  if (line.id === 'food') return foodDetail(state);
  if (line.id === 'blankets') return blanketDetail(state);
  if (line.id === 'infant') return infantDetail(state);
  return line.detail || '';
}

export function initKitBuilder(catalog: Catalog) {
  const peopleEl = document.querySelector<HTMLInputElement>('#kit-people');
  const daysEl = document.querySelector<HTMLInputElement>('#kit-days');
  const infantsEl = document.querySelector<HTMLInputElement>('#kit-infants');
  const petsEl = document.querySelector<HTMLInputElement>('#kit-pets');
  const medsEl = document.querySelector<HTMLInputElement>('#kit-meds');
  const vehicleEl = document.querySelector<HTMLInputElement>('#kit-vehicle');
  const out = document.querySelector<HTMLElement>('#kit-output');
  const printBtn = document.querySelector<HTMLButtonElement>('#kit-print');
  if (!peopleEl || !daysEl || !infantsEl || !petsEl || !medsEl || !vehicleEl || !out) return;

  const saved = loadState();
  peopleEl.value = String(saved.people);
  daysEl.value = String(saved.days);
  infantsEl.value = String(saved.infants);
  petsEl.value = String(saved.pets);
  medsEl.checked = saved.meds;
  vehicleEl.checked = saved.vehicle;

  function read(): State {
    return {
      people: Math.max(1, Math.floor(Number(peopleEl!.value) || 1)),
      days: Math.max(3, Math.floor(Number(daysEl!.value) || 3)),
      infants: Math.max(0, Math.floor(Number(infantsEl!.value) || 0)),
      pets: Math.max(0, Math.floor(Number(petsEl!.value) || 0)),
      meds: medsEl!.checked,
      vehicle: vehicleEl!.checked,
    };
  }

  function paint() {
    const state = read();
    if (Number(peopleEl!.value) !== state.people) peopleEl!.value = String(state.people);
    if (Number(daysEl!.value) !== state.days) daysEl!.value = String(state.days);
    saveState(state);

    const sections = ['basic', 'additional', 'pets', 'vehicle'] as const;
    const chunks: string[] = [];
    chunks.push(`<p class="qty-callout">Household plan: ${state.people} people, ${state.days} days, ${state.people * state.days} gallons of water. ${state.infants ? state.infants + ' infant(s). ' : ''}${state.pets ? state.pets + ' pet(s). ' : ''}${state.meds ? 'Includes medication items. ' : ''}${state.vehicle ? 'Includes a car kit. ' : ''}</p>`);
    if (state.pets) chunks.push(`<p class="fine">${petIntro(state)}</p>`);

    for (const section of sections) {
      const lines = KIT_LINES.filter((l) => l.section === section && included(l, state));
      if (!lines.length) continue;
      chunks.push(`<h2>${SECTION_TITLES[section]}</h2><ul class="checklist">`);
      for (const line of lines) {
        const detail = detailFor(line, state);
        chunks.push(`<li>
          <input type="checkbox" />
          <div>
            <strong>${line.label}</strong>
            ${detail ? `<p class="fine">${detail}</p>` : ''}
            ${linksHtml(line, catalog)}
          </div>
        </li>`);
      }
      chunks.push('</ul>');
    }
    chunks.push(`<h2>Maintaining your kit</h2>
      <ul>
        <li>Keep canned food in a cool, dry place.</li>
        <li>Store boxed food in tightly closed plastic or metal containers.</li>
        <li>Replace expired items as needed.</li>
        <li>Re-think your needs every year and update your kit as your family’s needs change.</li>
      </ul>
      <p class="fine">Source: <a href="https://www.ready.gov/kit">Ready.gov, Build A Kit</a>${state.pets ? ' and <a href="https://www.ready.gov/pets">Prepare Your Pets for Disasters</a>' : ''}. Linked products are existing ReadyGearHub listings, not a required shopping list and not official endorsements.</p>`);
    out.innerHTML = chunks.join('');
  }

  for (const el of [peopleEl, daysEl, infantsEl, petsEl, medsEl, vehicleEl]) {
    el.addEventListener('input', paint);
    el.addEventListener('change', paint);
  }
  printBtn?.addEventListener('click', () => window.print());
  paint();
}
