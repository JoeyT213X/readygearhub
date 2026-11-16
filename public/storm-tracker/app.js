/**
 * ReadyGearHub Storm Tracker — standalone client app (scope /storm-tracker/).
 *
 * NWS terms ask for a descriptive User-Agent. Browsers cannot set that header;
 * the browser's own User-Agent is sent, which is acceptable for client-side use.
 */
const APP_FEATURES = {
  proEnabled: false,
  multiLocation: false,
  alertHistory: false,
  customThresholds: false,
};

const NWS = 'https://api.weather.gov';
const STORAGE = 'rgh-tools.storm-tracker';
const OUTAGE_KEY = 'rgh-tools.outage-timer';
const DEFAULT_STATE = 'MS';
const REFRESH_MS = 5 * 60 * 1000;
const STATES = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['PR','Puerto Rico'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],['VA','Virginia'],['VI','U.S. Virgin Islands'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming']
].filter((row) => row[0]);

const WINTER = ['winter storm','winter weather','ice storm','blizzard','snow squall','lake effect snow','blowing snow','wind chill','extreme cold','cold weather','hard freeze','freeze warning','freeze watch','frost advisory','freezing rain','freezing drizzle','freezing fog','sleet'];
const SEVERE = ['tornado','severe thunderstorm','severe weather','extreme wind','high wind','hurricane','typhoon','tropical storm','tropical depression','storm surge','flash flood','flood','debris flow','dust storm'];
const SEV_ORDER = { Extreme: 0, Severe: 1, Moderate: 2, Minor: 3, Unknown: 4 };

function classify(event) {
  const e = (event || '').toLowerCase();
  return {
    winter: WINTER.some((f) => e.includes(f)) || /\bfreeze\b/.test(e) || /\bfrost\b/.test(e),
    severe: SEVERE.some((f) => e.includes(f)),
  };
}

async function nwsFetch(path) {
  const res = await fetch(path.startsWith('http') ? path : NWS + path, { headers: { Accept: 'application/geo+json' } });
  if (!res.ok) throw new Error('NWS ' + res.status);
  return res.json();
}

function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORAGE) || '') || {}; } catch { return {}; }
}
function saveStore(patch) {
  const next = { ...loadStore(), ...patch };
  try { localStorage.setItem(STORAGE, JSON.stringify(next)); } catch { /* ignore */ }
  return next;
}

function escapeHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatLocal(iso) {
  if (!iso) return 'Not specified';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Not specified';
  return d.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
}

function normalize(feature) {
  const p = feature?.properties;
  if (!p) return null;
  return {
    id: p.id || '',
    event: p.event || 'Alert',
    severity: p.severity || 'Unknown',
    urgency: p.urgency || 'Unknown',
    certainty: p.certainty || 'Unknown',
    areaDesc: p.areaDesc || '',
    onset: p.onset || p.effective || null,
    expires: p.expires || p.ends || null,
    headline: p.headline || null,
    description: p.description || null,
    instruction: p.instruction || null,
    web: p.web || 'https://www.weather.gov/',
  };
}

const CHECKLIST = [
  'Water: one gallon per person per day for several days (Ready.gov)',
  'Non-perishable food for several days (Ready.gov)',
  'Battery-powered or hand crank radio and a NOAA Weather Radio (Ready.gov)',
  'Flashlight and extra batteries (Ready.gov)',
  'First aid kit (Ready.gov)',
  'Whistle, dust mask, sanitation supplies (Ready.gov)',
  'Cell phone with chargers and a backup battery (Ready.gov)',
  'Prescription medications if anyone in the household needs them (Ready.gov)',
];

function fillStates(select, current) {
  select.innerHTML = STATES.map(([code, name]) => `<option value="${code}"${code === current ? ' selected' : ''}>${name}</option>`).join('');
}

async function fillCounties(select, state, current) {
  select.disabled = true;
  try {
    const data = await nwsFetch('/zones?type=county&area=' + encodeURIComponent(state));
    const counties = (data.features || []).map((f) => ({ id: f.properties.id, name: f.properties.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
    select.innerHTML = ['<option value="">All counties</option>'].concat(
      counties.map((c) => `<option value="${escapeHtml(c.id)}"${c.id === current ? ' selected' : ''}>${escapeHtml(c.name)} County</option>`),
    ).join('');
  } catch {
    select.innerHTML = '<option value="">All counties (could not load list)</option>';
  } finally {
    select.disabled = false;
  }
}

function renderAlerts(alerts, place, meta) {
  const box = document.querySelector('#alerts-out');
  const status = document.querySelector('#alerts-status');
  if (meta.offline && meta.fetchedAt) {
    document.querySelector('#offline-flag').hidden = false;
    document.querySelector('#offline-flag').textContent = 'Showing the last saved alerts from ' + new Date(meta.fetchedAt).toLocaleString() + ' (offline or the live request failed). Official updates may be newer at weather.gov.';
  } else {
    document.querySelector('#offline-flag').hidden = true;
  }
  if (!alerts.length) {
    status.className = 'status empty';
    status.innerHTML = `No active alerts for ${escapeHtml(place)} right now.`;
    box.innerHTML = '';
    return;
  }
  status.className = 'status';
  status.textContent = `${alerts.length} alert${alerts.length === 1 ? '' : 's'} for ${place}, sorted by severity.`;
  box.innerHTML = alerts.map((a) => {
    const sev = (a.severity || 'unknown').toLowerCase();
    const sevClass = ['extreme','severe','moderate','minor'].includes(sev) ? 'sev-' + sev : '';
    return `<article class="card alert">
      <span class="pill ${sevClass}">${escapeHtml(a.severity)}</span>
      <span class="pill">${escapeHtml(a.urgency)}</span>
      <span class="pill">${escapeHtml(a.certainty)}</span>
      <h3>${escapeHtml(a.event)}</h3>
      ${a.headline ? `<p>${escapeHtml(a.headline)}</p>` : ''}
      <p class="meta"><strong>Area:</strong> ${escapeHtml(a.areaDesc)}</p>
      <p class="meta"><strong>Onset:</strong> ${escapeHtml(formatLocal(a.onset))}</p>
      <p class="meta"><strong>Expires:</strong> ${escapeHtml(formatLocal(a.expires))}</p>
      ${a.description ? `<details><summary>Description</summary><p class="body">${escapeHtml(a.description)}</p></details>` : ''}
      ${a.instruction ? `<details><summary>Instructions</summary><p class="body">${escapeHtml(a.instruction)}</p></details>` : ''}
      <p class="meta"><a href="${escapeHtml(a.web && !/^https?:\/\/(www\.)?weather\.gov\/?$/i.test(a.web) ? a.web : 'https://www.weather.gov/')}" target="_blank" rel="noopener">View on weather.gov</a></p>
    </article>`;
  }).join('');
}

async function loadAlerts() {
  const state = document.querySelector('#st-state').value || DEFAULT_STATE;
  const zone = document.querySelector('#st-county').value;
  const place = zone
    ? (document.querySelector('#st-county').selectedOptions[0]?.text || zone) + ', ' + state
    : (document.querySelector('#st-state').selectedOptions[0]?.text || state);
  saveStore({ state, zone, place });
  document.querySelector('#alerts-status').className = 'status loading';
  document.querySelector('#alerts-status').textContent = 'Loading official alerts from the National Weather Service…';
  const path = zone ? `/alerts/active?zone=${encodeURIComponent(zone)}` : `/alerts/active?area=${encodeURIComponent(state)}`;
  try {
    const data = await nwsFetch(path);
    const alerts = (data.features || []).map(normalize).filter(Boolean)
      .sort((a, b) => (SEV_ORDER[a.severity] ?? 9) - (SEV_ORDER[b.severity] ?? 9));
    const payload = { alerts, place, fetchedAt: Date.now(), path };
    saveStore({ lastAlerts: payload });
    renderAlerts(alerts, place, { offline: false, fetchedAt: payload.fetchedAt });
  } catch {
    const cached = loadStore().lastAlerts;
    if (cached && cached.alerts) {
      renderAlerts(cached.alerts, cached.place || place, { offline: true, fetchedAt: cached.fetchedAt });
    } else {
      document.querySelector('#offline-flag').hidden = true;
      document.querySelector('#alerts-status').className = 'status error';
      document.querySelector('#alerts-status').innerHTML = 'We could not load alerts. Check <a href="https://www.weather.gov/">weather.gov</a>. In an emergency, call 911.';
      document.querySelector('#alerts-out').innerHTML = '';
    }
  }
}

const LIMITS = { fridge: 4*3600e3, freezerFull: 48*3600e3, freezerHalf: 24*3600e3 };

function toLocalInput(d) {
  return new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,16);
}

function formatRemain(ms) {
  if (ms <= 0) return 'Time is up';
  const s = Math.floor(ms/1000);
  const h = Math.floor(s/3600);
  const m = Math.floor((s%3600)/60);
  const sec = s%60;
  return `${h}h ${String(m).padStart(2,'0')}m ${String(sec).padStart(2,'0')}s left`;
}

function initTimer() {
  const startEl = document.querySelector('#outage-start');
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(OUTAGE_KEY) || ''); } catch { /* ignore */ }
  startEl.value = toLocalInput(saved?.startIso ? new Date(saved.startIso) : new Date());
  function paint() {
    const start = new Date(startEl.value);
    if (Number.isNaN(start.getTime())) return;
    try { localStorage.setItem(OUTAGE_KEY, JSON.stringify({ startIso: start.toISOString() })); } catch { /* ignore */ }
    const elapsed = Date.now() - start.getTime();
    for (const [id, limit] of [['t-fridge', LIMITS.fridge], ['t-full', LIMITS.freezerFull], ['t-half', LIMITS.freezerHalf]]) {
      const el = document.querySelector('#' + id);
      const remain = limit - elapsed;
      el.querySelector('.time').textContent = formatRemain(remain);
      el.classList.toggle('expired', remain <= 0);
      el.classList.toggle('ok', remain > 0);
    }
  }
  startEl.addEventListener('input', paint);
  document.querySelector('#outage-now').addEventListener('click', () => { startEl.value = toLocalInput(new Date()); paint(); });
  paint();
  setInterval(paint, 1000);
}

function initTabs() {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      document.querySelectorAll('[role="tabpanel"]').forEach((p) => { p.hidden = p.id !== tab.getAttribute('aria-controls'); });
    });
  });
}

function initChecklist() {
  document.querySelector('#checklist').innerHTML = CHECKLIST.map((t) => `<li><input type="checkbox" /><span>${t}</span></li>`).join('');
}

async function registerSw() {
  if (!('serviceWorker' in navigator)) return;
  try {
    await navigator.serviceWorker.register('/storm-tracker/sw.js', { scope: '/storm-tracker/' });
  } catch (err) {
    console.warn('Storm Tracker service worker was not registered.', err);
  }
}

async function init() {
  const store = loadStore();
  const stateEl = document.querySelector('#st-state');
  const countyEl = document.querySelector('#st-county');
  fillStates(stateEl, store.state || DEFAULT_STATE);
  await fillCounties(countyEl, stateEl.value, store.zone || '');
  stateEl.addEventListener('change', async () => {
    await fillCounties(countyEl, stateEl.value, '');
    loadAlerts();
  });
  countyEl.addEventListener('change', loadAlerts);
  document.querySelector('#refresh').addEventListener('click', loadAlerts);
  if (APP_FEATURES.proEnabled && APP_FEATURES.multiLocation) {
    document.querySelector('#pro-locations')?.removeAttribute('hidden');
  }
  initTabs();
  initTimer();
  initChecklist();
  await loadAlerts();
  setInterval(() => { if (document.visibilityState === 'visible') loadAlerts(); }, REFRESH_MS);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') loadAlerts(); });
  registerSw();
}

init();
