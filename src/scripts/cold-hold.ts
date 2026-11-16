import { APP_FEATURES, STORAGE_KEYS } from '../lib/app-config';
import { bindInstallPrompt, registerSW } from '../lib/pwa';

const SCOPE = '/apps/cold-hold/';
const FREE_LIMIT = 2;
const FRIDGE_F = 40;
const FREEZER_F = 0;

type Units = 'F' | 'C';
type Appliance = { id: string; name: string; type: 'fridge' | 'freezer'; fullness: 'full' | 'half' | 'unknown' };
type Reading = { id: string; applianceId: string; at: number; tempF: number; iceCrystals: boolean; notes: string; outageId: string | null };
type Outage = { id: string; startedAt: number; endedAt: number | null; notes: string };
type Store = { units: Units; appliances: Appliance[]; readings: Reading[]; outages: Outage[]; activeOutageId: string | null };

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now().toString(36)}`;
}
function defaults(): Store {
  return {
    units: 'F',
    appliances: [
      { id: uid(), name: 'Kitchen refrigerator', type: 'fridge', fullness: 'unknown' },
      { id: uid(), name: 'Kitchen freezer', type: 'freezer', fullness: 'full' },
    ],
    readings: [],
    outages: [],
    activeOutageId: null,
  };
}
function load(): Store {
  try {
    return { ...defaults(), ...JSON.parse(localStorage.getItem(STORAGE_KEYS.coldHold) || '') };
  } catch {
    return defaults();
  }
}
function save(store: Store) {
  try {
    localStorage.setItem(STORAGE_KEYS.coldHold, JSON.stringify(store));
  } catch {
    /* ignore */
  }
}
function toC(f: number) {
  return (f - 32) * 5 / 9;
}
function toF(c: number) {
  return c * 9 / 5 + 32;
}
function displayTemp(f: number, units: Units) {
  return units === 'C' ? `${fmt(toC(f))}°C` : `${fmt(f)}°F`;
}
function fmt(n: number, d = 1) {
  return n.toLocaleString(undefined, { maximumFractionDigits: d });
}
function fmtDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}
function fmtDuration(ms: number) {
  const totalMin = Math.max(0, Math.floor(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const s = Math.floor((Math.max(0, ms) % 60000) / 1000);
  if (h > 0) return `${h} h ${String(m).padStart(2, '0')} m`;
  if (m > 0) return `${m} m ${String(s).padStart(2, '0')} s`;
  return `${s} s`;
}
function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c);
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
function lastReading(store: Store, id: string) {
  return store.readings.filter((r) => r.applianceId === id).sort((a, b) => b.at - a.at)[0];
}
function statusText(app: Appliance, reading: Reading | undefined, units: Units) {
  if (!reading) return 'No reading yet. Use a thermometer, then log it.';
  const f = reading.tempF;
  if (app.type === 'fridge') {
    return f > FRIDGE_F
      ? `Above ${displayTemp(FRIDGE_F, units)} — official fridge storage target is 40°F (4.4°C) or below. This app does not decide if food is safe.`
      : `At or below ${displayTemp(FRIDGE_F, units)} (FDA refrigerator storage target).`;
  }
  if (f > FRIDGE_F) return `Above ${displayTemp(FRIDGE_F, units)}. FDA says if a freezer thermometer reads 40°F or below after power returns, food may be refrozen. This app does not decide for you.`;
  if (f > FREEZER_F) return `Above the usual 0°F (−18°C) freezer storage target, but at or below 40°F. Check official guidance and ice crystals in the food.`;
  return `At or below ${displayTemp(FREEZER_F, units)} (FDA freezer storage target).`;
}
function holdMs(app: Appliance) {
  if (app.type === 'fridge') return 4 * 3600000;
  if (app.fullness === 'half') return 24 * 3600000;
  if (app.fullness === 'full') return 48 * 3600000;
  return null;
}
function activeOutage(store: Store) {
  return store.outages.find((o) => o.id === store.activeOutageId && !o.endedAt) || null;
}

export function initColdHold() {
  registerSW(SCOPE);
  bindInstallPrompt(document.querySelector('#install-app'));
  initTabs();
  const store = load();
  const startBtn = document.querySelector<HTMLButtonElement>('#start-outage')!;
  const endBtn = document.querySelector<HTMLButtonElement>('#end-outage')!;
  const bar = document.querySelector('#outage-bar')!;
  const clock = document.querySelector('#outage-clock')!;
  const started = document.querySelector('#outage-started')!;

  function render() {
    const out = activeOutage(store);
    bar.hidden = !out;
    startBtn.hidden = !!out;
    endBtn.hidden = !out;
    if (out) {
      clock.textContent = fmtDuration(Date.now() - out.startedAt);
      started.textContent = `Started ${fmtDate(out.startedAt)}. Keep doors closed as much as possible.`;
    }
    document.querySelector('#appliance-grid')!.innerHTML = store.appliances
      .map((app) => {
        const last = lastReading(store, app.id);
        const cls = !last ? '' : last.tempF > FRIDGE_F ? 'expired' : 'ok';
        let hold = '';
        const windowMs = holdMs(app);
        if (out && windowMs) {
          const label = app.type === 'fridge' ? 'FDA: about 4 hours if the unopened refrigerator' : app.fullness === 'half' ? 'FDA: about 24 hours if a half-full, unopened freezer' : 'FDA: about 48 hours if a full, unopened freezer';
          const left = windowMs - (Date.now() - out.startedAt);
          hold = left >= 0
            ? `${label} — ${fmtDuration(left)} since you started this outage log.`
            : `${label} — that window has already passed on this timer. Still check a thermometer. Official text is a rule of thumb, not a guarantee.`;
        } else if (app.type === 'freezer' && app.fullness === 'unknown') {
          hold = 'Set whether this freezer is usually full or half full in Setup to compare against the FDA 48 / 24 hour figures.';
        }
        return `<article class="card timer-card ${cls}"><p class="fine">${app.type === 'fridge' ? 'Refrigerator' : 'Freezer'}</p><h2>${escape(app.name)}</h2><p class="temp-read">${last ? displayTemp(last.tempF, store.units) : '—'}</p><p class="fine">${last ? `Logged ${fmtDate(last.at)}` : 'No reading yet'}</p><p>${escape(statusText(app, last, store.units))}</p>${hold ? `<p class="fine">${escape(hold)}</p>` : ''}<p class="card-actions"><button type="button" class="btn small" data-log="${app.id}">Log reading</button></p></article>`;
      })
      .join('');
    const readings = [...store.readings].sort((a, b) => b.at - a.at);
    document.querySelector('#reading-list')!.innerHTML = readings.length
      ? readings.map((r) => {
          const name = store.appliances.find((a) => a.id === r.applianceId)?.name || 'Appliance';
          return `<li><div><strong>${escape(name)}</strong><div class="fine">${fmtDate(r.at)}${r.iceCrystals ? ' · ice crystals noted' : ''}${r.notes ? ` · ${escape(r.notes)}` : ''}</div></div><div>${escape(displayTemp(r.tempF, store.units))} <button type="button" class="btn small ghost" data-del-reading="${r.id}">Delete</button></div></li>`;
        }).join('')
      : '<li class="fine">No readings yet.</li>';
    const outs = [...store.outages].sort((a, b) => b.startedAt - a.startedAt);
    document.querySelector('#outage-list')!.innerHTML = outs.length
      ? outs.map((o) => `<li><div>${fmtDate(o.startedAt)}${o.endedAt ? '' : ' (active)'}</div><div class="fine">${fmtDuration((o.endedAt || Date.now()) - o.startedAt)}</div></li>`).join('')
      : '<li class="fine">No outages logged yet.</li>';
    const canAdd = APP_FEATURES.proEnabled && APP_FEATURES.extraAppliances || store.appliances.length < FREE_LIMIT;
    document.querySelector<HTMLButtonElement>('#add-appliance')!.hidden = !canAdd;
    document.querySelector('#appliance-list')!.innerHTML = store.appliances
      .map((a) => `<li><div><strong>${escape(a.name)}</strong><div class="fine">${a.type}${a.type === 'freezer' ? ` · ${a.fullness}` : ''}</div></div><div><button type="button" class="btn small ghost" data-edit="${a.id}">Edit</button></div></li>`)
      .join('');
    (document.querySelector('#units-form [name="units"]') as HTMLSelectElement).value = store.units;
    save(store);
  }

  function addReading(applianceId?: string) {
    const app = store.appliances.find((a) => a.id === applianceId) || store.appliances[0];
    if (!app) return;
    const raw = prompt(`Temperature of ${app.name} in °${store.units}:`);
    if (raw === null) return;
    let tempF = Number(raw);
    if (!Number.isFinite(tempF)) return;
    if (store.units === 'C') tempF = toF(tempF);
    const ice = app.type === 'freezer' && confirm('Does the food still have ice crystals? OK for yes, Cancel for no.');
    store.readings.push({
      id: uid(),
      applianceId: app.id,
      at: Date.now(),
      tempF,
      iceCrystals: !!ice,
      notes: '',
      outageId: store.activeOutageId,
    });
    render();
  }

  startBtn.addEventListener('click', () => {
    if (activeOutage(store)) return;
    const rec = { id: uid(), startedAt: Date.now(), endedAt: null, notes: '' };
    store.outages.push(rec);
    store.activeOutageId = rec.id;
    render();
  });
  endBtn.addEventListener('click', () => {
    const out = activeOutage(store);
    if (!out) return;
    out.endedAt = Date.now();
    store.activeOutageId = null;
    render();
  });
  document.querySelector('#log-temp')!.addEventListener('click', () => addReading());
  document.querySelector('#appliance-grid')!.addEventListener('click', (e) => {
    const id = (e.target as HTMLElement).getAttribute('data-log');
    if (id) addReading(id);
  });
  document.querySelector('#reading-list')!.addEventListener('click', (e) => {
    const id = (e.target as HTMLElement).getAttribute('data-del-reading');
    if (!id) return;
    store.readings = store.readings.filter((r) => r.id !== id);
    render();
  });
  document.querySelector('#units-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    store.units = new FormData(e.target as HTMLFormElement).get('units') === 'C' ? 'C' : 'F';
    render();
  });
  document.querySelector('#add-appliance')!.addEventListener('click', () => {
    if (!(APP_FEATURES.proEnabled && APP_FEATURES.extraAppliances) && store.appliances.length >= FREE_LIMIT) return;
    const name = prompt('Appliance name:') || 'Appliance';
    const type = confirm('OK for a freezer, Cancel for a refrigerator.') ? 'freezer' : 'fridge';
    const fullness = type === 'freezer' && confirm('Is this freezer usually full? OK for full, Cancel for half full.') ? 'full' : type === 'freezer' ? 'half' : 'unknown';
    store.appliances.push({ id: uid(), name, type, fullness });
    render();
  });
  document.querySelector('#appliance-list')!.addEventListener('click', (e) => {
    const id = (e.target as HTMLElement).getAttribute('data-edit');
    const app = store.appliances.find((a) => a.id === id);
    if (!app) return;
    const name = prompt('Name:', app.name);
    if (name === null) return;
    app.name = name.trim() || app.name;
    if (app.type === 'freezer') {
      const full = confirm('Is this freezer usually full? OK for full, Cancel for half full or not sure.');
      app.fullness = full ? 'full' : 'half';
    }
    render();
  });
  document.querySelector('#export-json')!.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' }));
    a.download = 'cold-hold-backup.json';
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
      if (!parsed?.appliances) throw new Error('Not a Cold Hold backup');
      Object.assign(store, defaults(), parsed);
      render();
    }).catch(() => alert('Could not import that file.'));
  });

  render();
  setInterval(() => {
    const out = activeOutage(store);
    if (out) clock.textContent = fmtDuration(Date.now() - out.startedAt);
  }, 1000);
}
