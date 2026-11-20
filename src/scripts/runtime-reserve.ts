import { STORAGE_KEYS } from '../lib/app-config';
import { bindInstallPrompt, registerSW } from '../lib/pwa';

const SCOPE = '/apps/runtime-reserve/';
const L_PER_GAL = 3.785411784;

type Units = 'gal' | 'L';
type Profile = 'eco' | 'typical' | 'heavy';
type Generator = {
  name: string;
  fuelType: string;
  tankGallons: number;
  tankLevelGallons: number;
  burnEco: number;
  burnTypical: number;
  burnHeavy: number;
  profile: Profile;
};
type Session = { id: string; startedAt: number; endedAt: number; hours: number; gallonsUsed: number; notes: string };
type Fill = { id: string; at: number; gallons: number; notes: string };
type Store = {
  units: Units;
  generator: Generator;
  sessions: Session[];
  fillUps: Fill[];
  activeRun: { startedAt: number } | null;
};

const defaultStore = (): Store => ({
  units: 'gal',
  generator: {
    name: 'Home generator',
    fuelType: 'gasoline',
    tankGallons: 5,
    tankLevelGallons: 5,
    burnEco: 0.25,
    burnTypical: 0.4,
    burnHeavy: 0.6,
    profile: 'typical',
  },
  sessions: [],
  fillUps: [],
  activeRun: null,
});

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now().toString(36)}`;
}

function load(): Store {
  try {
    return { ...defaultStore(), ...JSON.parse(localStorage.getItem(STORAGE_KEYS.runtimeReserve) || '') };
  } catch {
    return defaultStore();
  }
}

function save(store: Store) {
  try {
    localStorage.setItem(STORAGE_KEYS.runtimeReserve, JSON.stringify(store));
  } catch {
    /* ignore */
  }
}

function burn(g: Generator) {
  if (g.profile === 'eco') return g.burnEco;
  if (g.profile === 'heavy') return g.burnHeavy;
  return g.burnTypical;
}

function toDisplay(gal: number, units: Units) {
  return units === 'L' ? gal * L_PER_GAL : gal;
}
function toGal(value: number, units: Units) {
  return units === 'L' ? value / L_PER_GAL : value;
}
function fmt(n: number, d = 1) {
  return n.toLocaleString(undefined, { maximumFractionDigits: d });
}
function fmtHours(h: number) {
  if (!Number.isFinite(h) || h < 0) return '—';
  const min = Math.round(h * 60);
  const hr = Math.floor(min / 60);
  const m = min % 60;
  if (hr === 0) return `${m} min`;
  if (m === 0) return `${hr} h`;
  return `${hr} h ${m} m`;
}
function fmtDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function initTabs() {
  const tabs = [...document.querySelectorAll<HTMLElement>('[role="tab"]')];
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      document.querySelectorAll<HTMLElement>('[role="tabpanel"]').forEach((p) => {
        p.hidden = p.id !== tab.getAttribute('aria-controls');
      });
    });
  });
}

function listHtml(items: { title: string; side: string; sub?: string; id?: string; canDelete?: boolean }[]) {
  if (!items.length) return '<li class="fine">Nothing logged yet.</li>';
  return items
    .map(
      (i) =>
        `<li><div><strong>${escape(i.title)}</strong>${i.sub ? `<div class="fine">${escape(i.sub)}</div>` : ''}</div><div>${escape(i.side)}${i.canDelete && i.id ? ` <button type="button" class="btn small ghost" data-del="${escape(i.id)}">Delete</button>` : ''}</div></li>`,
    )
    .join('');
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c);
}

export function initRuntimeReserve() {
  registerSW(SCOPE);
  bindInstallPrompt(document.querySelector('#install-app'));
  initTabs();
  const store = load();

  const hoursEl = document.querySelector('#hours-left')!;
  const fuelMeta = document.querySelector('#fuel-meta')!;
  const tankMeta = document.querySelector('#tank-meta')!;
  const gauge = document.querySelector<HTMLElement>('#tank-gauge')!;
  const startBtn = document.querySelector<HTMLButtonElement>('#start-run')!;
  const stopBtn = document.querySelector<HTMLButtonElement>('#stop-run')!;
  const live = document.querySelector('#run-live')!;
  const unit = () => (store.units === 'L' ? 'L' : 'gal');

  function render() {
    const g = store.generator;
    const rate = burn(g);
    const hours = rate ? g.tankLevelGallons / rate : NaN;
    const pct = g.tankGallons ? Math.min(100, Math.max(0, (g.tankLevelGallons / g.tankGallons) * 100)) : 0;
    hoursEl.textContent = fmtHours(hours);
    fuelMeta.textContent = `${fmt(toDisplay(g.tankLevelGallons, store.units), 2)} ${unit()} on hand · ${fmt(toDisplay(rate, store.units), 2)} ${unit()}/hour (${g.profile} load)`;
    tankMeta.textContent = `Tank ${fmt(toDisplay(g.tankLevelGallons, store.units), 2)} of ${fmt(toDisplay(g.tankGallons, store.units), 2)} ${unit()}`;
    gauge.style.width = `${pct}%`;
    const running = !!store.activeRun;
    startBtn.hidden = running;
    stopBtn.hidden = !running;
    live.hidden = !running;
    const sessions = [...store.sessions].sort((a, b) => b.endedAt - a.endedAt);
    document.querySelector('#recent-runs')!.innerHTML = listHtml(
      sessions.slice(0, 5).map((s) => ({ title: fmtDate(s.endedAt), side: fmtHours(s.hours), sub: s.notes })),
    );
    document.querySelector('#all-runs')!.innerHTML = listHtml(
      sessions.map((s) => ({
        title: fmtDate(s.endedAt),
        side: fmtHours(s.hours),
        sub: `${fmt(toDisplay(s.gallonsUsed, store.units), 2)} ${unit()} used${s.notes ? ` · ${s.notes}` : ''}`,
        id: s.id,
        canDelete: true,
      })),
    );
    document.querySelector('#fill-list')!.innerHTML = listHtml(
      [...store.fillUps].sort((a, b) => b.at - a.at).map((f) => ({
        title: fmtDate(f.at),
        side: `${fmt(toDisplay(f.gallons, store.units), 2)} ${unit()}`,
        sub: f.notes,
      })),
    );
    const form = document.querySelector<HTMLFormElement>('#gen-form')!;
    const tankForm = document.querySelector<HTMLFormElement>('#tank-form')!;
    (form.elements.namedItem('name') as HTMLInputElement).value = g.name;
    (form.elements.namedItem('fuelType') as HTMLSelectElement).value = g.fuelType;
    (form.elements.namedItem('tank') as HTMLInputElement).value = String(round(toDisplay(g.tankGallons, store.units)));
    (form.elements.namedItem('profile') as HTMLSelectElement).value = g.profile;
    (form.elements.namedItem('burnEco') as HTMLInputElement).value = String(round(toDisplay(g.burnEco, store.units)));
    (form.elements.namedItem('burnTypical') as HTMLInputElement).value = String(round(toDisplay(g.burnTypical, store.units)));
    (form.elements.namedItem('burnHeavy') as HTMLInputElement).value = String(round(toDisplay(g.burnHeavy, store.units)));
    (form.elements.namedItem('units') as HTMLSelectElement).value = store.units;
    (tankForm.elements.namedItem('level') as HTMLInputElement).value = String(round(toDisplay(g.tankLevelGallons, store.units)));
    if (store.activeRun) tick();
    save(store);
  }

  function tick() {
    if (!store.activeRun) return;
    const h = (Date.now() - store.activeRun.startedAt) / 3600000;
    live.textContent = `Run in progress · elapsed ${fmtHours(h)}`;
  }

  function finishRun(hours: number, used: number | null, notes: string) {
    const gallons = used ?? burn(store.generator) * hours;
    store.generator.tankLevelGallons = Math.max(0, store.generator.tankLevelGallons - gallons);
    store.sessions.push({
      id: uid(),
      startedAt: Date.now() - hours * 3600000,
      endedAt: Date.now(),
      hours,
      gallonsUsed: gallons,
      notes,
    });
    store.activeRun = null;
    render();
  }

  startBtn.addEventListener('click', () => {
    if (store.activeRun) return;
    store.activeRun = { startedAt: Date.now() };
    render();
  });
  stopBtn.addEventListener('click', () => {
    if (!store.activeRun) return;
    const hours = Math.max(0, (Date.now() - store.activeRun.startedAt) / 3600000);
    const used = prompt(`Elapsed ${fmtHours(hours)}. Fuel used in ${unit()} (leave blank to estimate):`);
    if (used === null) return;
    const n = used.trim() === '' ? null : toGal(Number(used), store.units);
    finishRun(hours, n !== null && Number.isFinite(n) ? n : null, 'Run');
  });
  document.querySelector('#log-hours')!.addEventListener('click', () => {
    const raw = prompt(`Hours run:`);
    if (raw === null) return;
    const hours = Number(raw);
    if (!Number.isFinite(hours) || hours <= 0) return;
    const usedRaw = prompt(`Fuel used in ${unit()} (leave blank to estimate):`);
    if (usedRaw === null) return;
    const n = usedRaw.trim() === '' ? null : toGal(Number(usedRaw), store.units);
    finishRun(hours, n !== null && Number.isFinite(n) ? n : null, 'Manual log');
  });

  document.querySelector('#tank-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const level = toGal(Number(fd.get('level')), store.units);
    store.generator.tankLevelGallons = Math.min(store.generator.tankGallons, Math.max(0, level));
    render();
  });
  document.querySelector('#fill-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const amount = toGal(Number(fd.get('amount')), store.units);
    if (amount <= 0) return;
    store.generator.tankLevelGallons = Math.min(store.generator.tankGallons, store.generator.tankLevelGallons + amount);
    store.fillUps.push({ id: uid(), at: Date.now(), gallons: amount, notes: String(fd.get('notes') || '') });
    (e.target as HTMLFormElement).reset();
    render();
  });
  document.querySelector('#gen-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const nextUnits = (fd.get('units') === 'L' ? 'L' : 'gal') as Units;
    store.units = nextUnits;
    const g = store.generator;
    g.name = String(fd.get('name') || 'Generator');
    g.fuelType = String(fd.get('fuelType') || 'gasoline');
    g.tankGallons = toGal(Number(fd.get('tank')), nextUnits);
    g.profile = (fd.get('profile') as Profile) || 'typical';
    g.burnEco = toGal(Number(fd.get('burnEco')), nextUnits);
    g.burnTypical = toGal(Number(fd.get('burnTypical')), nextUnits);
    g.burnHeavy = toGal(Number(fd.get('burnHeavy')), nextUnits);
    if (g.tankLevelGallons > g.tankGallons) g.tankLevelGallons = g.tankGallons;
    render();
  });

  document.querySelector('#all-runs')!.addEventListener('click', (e) => {
    const id = (e.target as HTMLElement).getAttribute('data-del');
    if (!id) return;
    store.sessions = store.sessions.filter((s) => s.id !== id);
    render();
  });

  document.querySelector('#export-json')!.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' }));
    a.download = 'runtime-reserve-backup.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  const fileInput = document.querySelector<HTMLInputElement>('#import-file')!;
  document.querySelector('#import-json')!.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    fileInput.value = '';
    if (!file) return;
    file.text().then((text) => {
      const parsed = JSON.parse(text);
      if (!parsed?.generator) throw new Error('Not a Runtime Reserve backup');
      Object.assign(store, defaultStore(), parsed);
      render();
    }).catch(() => alert('Could not import that file.'));
  });

  render();
  setInterval(tick, 1000);
}

function round(n: number) {
  return Math.round(n * 1000) / 1000;
}
