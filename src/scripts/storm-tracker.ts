import { ALERTS_REFRESH_MS, APP_FEATURES, DEFAULT_STATE, STORAGE_KEYS } from '../lib/app-config';
import { bindInstallPrompt, registerSW } from '../lib/pwa';
import { fetchActiveAlerts, fetchCounties, type NwsAlert } from './nws';
import {
  escapeHtml,
  fillCountySelect,
  NWS_UNAVAILABLE_HTML,
  renderAlertCard,
  sortAlerts,
} from './alert-render';
import { initOutageTimer } from './outage-timer';

const SCOPE = '/storm-tracker/';
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

type Store = { state?: string; zone?: string; place?: string; lastAlerts?: { alerts: NwsAlert[]; place: string; fetchedAt: number } };

function loadStore(): Store {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.stormTracker) || '') || {};
  } catch {
    return {};
  }
}

function saveStore(patch: Store) {
  const next = { ...loadStore(), ...patch };
  try {
    localStorage.setItem(STORAGE_KEYS.stormTracker, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
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

export function initStormTracker() {
  const stateEl = document.querySelector<HTMLSelectElement>('#alert-state');
  const countyEl = document.querySelector<HTMLSelectElement>('#alert-county');
  const results = document.querySelector<HTMLElement>('#alert-results');
  const status = document.querySelector<HTMLElement>('#alert-status');
  const offlineFlag = document.querySelector<HTMLElement>('#offline-flag');
  const checklist = document.querySelector<HTMLElement>('#checklist');
  if (!stateEl || !countyEl || !results || !status) return;

  const store = loadStore();
  if (store.state && [...stateEl.options].some((o) => o.value === store.state)) stateEl.value = store.state;

  async function loadCounties(preferred?: string) {
    countyEl!.disabled = true;
    try {
      const counties = await fetchCounties(stateEl!.value);
      const label = `All counties in ${stateEl!.options[stateEl!.selectedIndex]?.text || stateEl!.value}`;
      fillCountySelect(countyEl!, counties, preferred, label);
    } catch {
      fillCountySelect(countyEl!, [], '', 'All counties (could not load list)');
    } finally {
      countyEl!.disabled = false;
    }
  }

  function placeLabel() {
    const zone = countyEl!.value;
    if (zone) return `${countyEl!.selectedOptions[0]?.text || zone}, ${stateEl!.value}`;
    return stateEl!.options[stateEl!.selectedIndex]?.text || stateEl!.value;
  }

  function paint(alerts: NwsAlert[], place: string, meta: { offline: boolean; fetchedAt?: number }) {
    if (offlineFlag) {
      offlineFlag.hidden = !meta.offline;
      if (meta.offline && meta.fetchedAt) {
        offlineFlag.textContent = `Showing the last saved alerts from ${new Date(meta.fetchedAt).toLocaleString()} (offline or the live request failed). Official updates may be newer at weather.gov.`;
      }
    }
    if (!alerts.length) {
      status!.className = 'status-banner empty';
      status!.innerHTML = `No active alerts for ${escapeHtml(place)} right now.`;
      results!.innerHTML = '';
      return;
    }
    status!.className = 'status-line';
    status!.textContent = `Showing ${alerts.length} alert${alerts.length === 1 ? '' : 's'} for ${place}. Sorted by severity. Times are in your local time.`;
    results!.innerHTML = sortAlerts(alerts).map((a) => renderAlertCard(a)).join('');
  }

  async function loadAlerts() {
    const state = stateEl!.value || DEFAULT_STATE;
    const zone = countyEl!.value;
    const place = placeLabel();
    saveStore({ state, zone, place });
    status!.className = 'status-banner loading';
    status!.textContent = 'Loading official alerts from the National Weather Service…';
    try {
      const alerts = await fetchActiveAlerts({ state, zone: zone || undefined });
      saveStore({ lastAlerts: { alerts, place, fetchedAt: Date.now() } });
      paint(alerts, place, { offline: false, fetchedAt: Date.now() });
    } catch {
      const cached = loadStore().lastAlerts;
      if (cached?.alerts) {
        paint(cached.alerts, cached.place || place, { offline: true, fetchedAt: cached.fetchedAt });
      } else {
        if (offlineFlag) offlineFlag.hidden = true;
        status!.className = 'status-banner error';
        status!.innerHTML = NWS_UNAVAILABLE_HTML;
        results!.innerHTML = '';
      }
    }
  }

  stateEl.addEventListener('change', async () => {
    await loadCounties('');
    loadAlerts();
  });
  countyEl.addEventListener('change', loadAlerts);
  document.querySelector('#refresh')?.addEventListener('click', () => loadAlerts());

  initTabs();
  initOutageTimer();
  if (checklist) {
    checklist.innerHTML = CHECKLIST.map((t) => `<li><input type="checkbox" /><div>${t}</div></li>`).join('');
  }
  if (APP_FEATURES.proEnabled && APP_FEATURES.multiLocation) {
    document.querySelector('#pro-locations')?.removeAttribute('hidden');
  }
  bindInstallPrompt(document.querySelector('#install-app'));
  registerSW(SCOPE);

  loadCounties(store.zone).then(loadAlerts);
  setInterval(() => {
    if (document.visibilityState === 'visible') loadAlerts();
  }, ALERTS_REFRESH_MS);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') loadAlerts();
  });
}
