import { ALERTS_REFRESH_MS, DEFAULT_STATE, STORAGE_KEYS } from '../lib/app-config';
import {
  fetchActiveAlerts,
  fetchCounties,
  lookupPoint,
  type CountyZone,
  type NwsAlert,
} from './nws';
import {
  escapeHtml,
  fillCountySelect,
  filterLabel,
  matchesAlertFilters,
  NWS_UNAVAILABLE_HTML,
  readAlertFilters,
  renderAlertCard,
  sortAlerts,
} from './alert-render';

export function initAlertsPage() {
  const stateEl = document.querySelector<HTMLSelectElement>('#alert-state');
  const countyEl = document.querySelector<HTMLSelectElement>('#alert-county');
  const locateBtn = document.querySelector<HTMLButtonElement>('#use-location');
  const results = document.querySelector<HTMLElement>('#alert-results');
  const status = document.querySelector<HTMLElement>('#alert-status');
  if (!stateEl || !countyEl || !results || !status) return;

  const saved = loadSaved();
  if ([...stateEl.options].some((o) => o.value === saved.state)) stateEl.value = saved.state;

  let counties: CountyZone[] = [];
  let allAlerts: NwsAlert[] = [];
  let placeLabel = '';
  let abort: AbortController | null = null;
  let locationMode = false;

  function setStatus(html: string, kind: '' | 'loading' | 'empty' | 'error') {
    status.className = kind ? `status-banner ${kind}` : 'status-line';
    status.innerHTML = html;
    status.hidden = !html;
  }

  function applyFilters(): NwsAlert[] {
    return allAlerts.filter((a) => matchesAlertFilters(a, readAlertFilters()));
  }

  function paint() {
    const filtered = sortAlerts(applyFilters());
    const filters = readAlertFilters();
    if (!allAlerts.length) {
      results.innerHTML = '';
      return;
    }
    if (!filtered.length) {
      results.innerHTML = '';
      setStatus(`No ${filterLabel(filters)}alerts for ${escapeHtml(placeLabel)} right now.`, 'empty');
      return;
    }
    setStatus(`Showing ${filtered.length} alert${filtered.length === 1 ? '' : 's'} for ${escapeHtml(placeLabel)}. Sorted by severity. Times are in your local time.`, '');
    results.innerHTML = filtered.map((a) => renderAlertCard(a)).join('');
  }

  function fillCounties(selected?: string) {
    const allLabel = `All counties in ${stateEl.options[stateEl.selectedIndex]?.text || stateEl.value}`;
    fillCountySelect(countyEl, counties, selected, allLabel);
  }

  async function loadCounties(state: string, preferredZone?: string) {
    countyEl.disabled = true;
    try {
      counties = await fetchCounties(state);
      fillCounties(preferredZone);
    } catch {
      counties = [];
      fillCounties('');
    } finally {
      countyEl.disabled = false;
    }
  }

  async function loadAlerts() {
    abort?.abort();
    abort = new AbortController();
    const signal = abort.signal;
    const state = stateEl.value || DEFAULT_STATE;
    const zone = countyEl.value;
    if (!locationMode) saveSaved(state, zone);
    const county = counties.find((c) => c.id === zone);
    placeLabel = county ? `${county.name} County, ${county.state}` : stateEl.options[stateEl.selectedIndex]?.text || state;
    setStatus('Loading official alerts from the National Weather Service…', 'loading');
    results.innerHTML = '';
    try {
      allAlerts = locationMode && (window as any).__rghPoint
        ? await fetchActiveAlerts({ point: (window as any).__rghPoint, signal })
        : await fetchActiveAlerts({ state, zone: zone || undefined, signal });
      if (!allAlerts.length) {
        setStatus(`No active alerts for ${escapeHtml(placeLabel)} right now.`, 'empty');
        results.innerHTML = '';
        return;
      }
      paint();
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      allAlerts = [];
      results.innerHTML = '';
      setStatus(NWS_UNAVAILABLE_HTML, 'error');
    }
  }

  stateEl.addEventListener('change', async () => {
    locationMode = false;
    await loadCounties(stateEl.value);
    await loadAlerts();
  });
  countyEl.addEventListener('change', () => {
    locationMode = false;
    loadAlerts();
  });
  document.querySelectorAll<HTMLInputElement>('#alert-controls input[type="checkbox"]').forEach((el) => {
    el.addEventListener('change', paint);
  });

  locateBtn?.addEventListener('click', () => {
    if (!navigator.geolocation) {
      setStatus('This browser does not support location. Pick a state and county instead, or use <a href="https://www.weather.gov/">weather.gov</a>.', 'error');
      return;
    }
    setStatus('Asking for your location. Coordinates are sent only to the National Weather Service, and only after you agree.', 'loading');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          (window as any).__rghPoint = { lat, lon };
          const info = await lookupPoint(lat, lon);
          locationMode = true;
          if (info.state && [...stateEl.options].some((o) => o.value === info.state)) {
            stateEl.value = info.state;
            await loadCounties(info.state, info.countyId);
          }
          if (info.city) placeLabel = `${info.city}${info.state ? ', ' + info.state : ''} (your location)`;
          saveSaved(stateEl.value, countyEl.value);
          await loadAlerts();
        } catch {
          setStatus('We got your location but could not look up alerts. Try a state and county, or visit <a href="https://www.weather.gov/">weather.gov</a>. In an emergency, call 911.', 'error');
        }
      },
      () => {
        setStatus('Location was not available. You can still pick a state and county. Official alerts are also at <a href="https://www.weather.gov/">weather.gov</a>.', 'error');
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 5 * 60 * 1000 },
    );
  });

  async function start() {
    await loadCounties(stateEl.value, saved.zone);
    await loadAlerts();
  }

  start();

  const refresh = () => {
    if (document.visibilityState === 'visible') loadAlerts();
  };
  const timer = window.setInterval(refresh, ALERTS_REFRESH_MS);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') loadAlerts();
  });
  window.addEventListener('pagehide', () => {
    window.clearInterval(timer);
    abort?.abort();
  });
}
