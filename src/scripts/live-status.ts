/**
 * Home-page live official status: NWS alerts, NHC tropical systems,
 * and official Mississippi outage / MEMA links.
 *
 * NWS is fetched in the browser from api.weather.gov (CORS allowed).
 * NHC CurrentStorms.json does not send Access-Control-Allow-Origin, so
 * we try the official URL first and fall back to a same-origin Netlify
 * proxy at /feeds/nhc-current-storms.json. No invented alerts or counts.
 */
import { fetchActiveAlerts, officialAlertHref, type NwsAlert } from './nws';
import { ALERTS_REFRESH_MS, DEFAULT_STATE } from '../lib/app-config';

const NHC_DIRECT = 'https://www.nhc.noaa.gov/CurrentStorms.json';
const NHC_PROXY = '/feeds/nhc-current-storms.json';
const STORAGE_KEY = 'rgh.live-status.state';

const CLASSIFICATION: Record<string, string> = {
  TD: 'Tropical Depression',
  STD: 'Subtropical Depression',
  TS: 'Tropical Storm',
  HU: 'Hurricane',
  STS: 'Subtropical Storm',
  PTC: 'Post-tropical Cyclone',
  TY: 'Typhoon',
  PC: 'Potential Tropical Cyclone',
};

type NhcStorm = {
  id?: string;
  name?: string;
  classification?: string;
  intensity?: number;
  pressure?: number;
  latitude?: string;
  longitude?: string;
  movementDir?: number;
  movementSpeed?: number;
  lastUpdate?: string;
  publicAdvisory?: { url?: string };
  forecastGraphics?: { url?: string };
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stamp(el: HTMLElement | null, date = new Date()) {
  if (!el) return;
  el.textContent = `Updated ${date.toLocaleString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })}`;
  el.dateTime = date.toISOString();
}

function setStatus(el: HTMLElement | null, text: string, kind: 'ok' | 'empty' | 'error' = 'ok') {
  if (!el) return;
  el.hidden = false;
  el.dataset.kind = kind;
  el.textContent = text;
}

function severityClass(severity: string): string {
  const s = severity.toLowerCase();
  if (s === 'extreme' || s === 'severe') return 'is-severe';
  if (s === 'moderate') return 'is-moderate';
  return '';
}

function renderAlerts(list: HTMLElement, status: HTMLElement, alerts: NwsAlert[], state: string) {
  list.replaceChildren();
  if (!alerts.length) {
    setStatus(
      status,
      `No active National Weather Service alerts for ${stateName(state)} right now.`,
      'empty',
    );
    list.hidden = true;
    return;
  }
  status.hidden = true;
  list.hidden = false;
  list.classList.toggle('is-ticker', alerts.length > 2);
  for (const alert of alerts.slice(0, 12)) {
    const href = officialAlertHref(alert);
    const li = document.createElement('li');
    li.className = `live-item ${severityClass(alert.severity)}`.trim();
    const areas = alert.areaDesc ? ` — ${alert.areaDesc}` : '';
    li.innerHTML = `<a href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(
      alert.event || 'Alert',
    )}</a><span>${escapeHtml((alert.headline || alert.areaDesc || 'Official NWS alert').slice(0, 180))}${
      areas && !alert.headline ? escapeHtml(areas) : ''
    }</span>`;
    list.appendChild(li);
  }
}

function stateName(code: string): string {
  const opt = document.querySelector<HTMLOptionElement>(`#live-state option[value="${CSS.escape(code)}"]`);
  return opt?.textContent?.trim() || code;
}

function compass(deg?: number): string {
  if (deg == null || Number.isNaN(deg)) return '';
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(((deg % 360) + 360) % 360 / 22.5) % 16];
}

function renderStorms(list: HTMLElement, status: HTMLElement, storms: NhcStorm[]) {
  list.replaceChildren();
  if (!storms.length) {
    setStatus(
      status,
      'No active tropical cyclones in the Atlantic or Eastern Pacific. Official status from the National Hurricane Center.',
      'empty',
    );
    list.hidden = true;
    return;
  }
  status.hidden = true;
  list.hidden = false;
  list.classList.toggle('is-ticker', storms.length > 2);
  for (const storm of storms) {
    const name = storm.name || 'Unnamed system';
    const kind = CLASSIFICATION[String(storm.classification || '').toUpperCase()] || 'Tropical system';
    const knots = typeof storm.intensity === 'number' ? storm.intensity : null;
    const mph = knots != null ? Math.round(knots * 1.15078) : null;
    const wind = mph != null ? `${mph} mph (${knots} kt)` : '';
    const move =
      storm.movementSpeed != null
        ? `Moving ${compass(storm.movementDir)} at ${storm.movementSpeed} mph`
        : '';
    const place = [storm.latitude, storm.longitude].filter(Boolean).join(', ');
    const href =
      storm.forecastGraphics?.url || storm.publicAdvisory?.url || 'https://www.nhc.noaa.gov/';
    const li = document.createElement('li');
    li.className = 'live-item';
    const bits = [kind, wind, place, move].filter(Boolean).join(' · ');
    li.innerHTML = `<a href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(
      name,
    )}</a><span>${escapeHtml(bits)}</span>`;
    list.appendChild(li);
  }
}

async function loadNhc(signal?: AbortSignal): Promise<NhcStorm[]> {
  const headers = { Accept: 'application/json' };
  let data: any = null;
  try {
    const res = await fetch(NHC_DIRECT, { headers, signal });
    if (res.ok) data = await res.json();
  } catch {
    // CORS or network. Try the same-origin proxy next.
  }
  if (!data) {
    const res = await fetch(NHC_PROXY, { headers, signal });
    if (!res.ok) throw new Error(`NHC feed returned ${res.status}`);
    data = await res.json();
  }
  return Array.isArray(data?.activeStorms) ? data.activeStorms : [];
}

export function initLiveStatus() {
  const root = document.getElementById('live-status');
  if (!root) return;

  const stateSelect = root.querySelector<HTMLSelectElement>('#live-state');
  const alertStatus = root.querySelector<HTMLElement>('#live-nws-status');
  const alertList = root.querySelector<HTMLElement>('#live-nws-list');
  const alertStamp = root.querySelector<HTMLTimeElement>('#live-nws-updated');
  const nhcStatus = root.querySelector<HTMLElement>('#live-nhc-status');
  const nhcList = root.querySelector<HTMLElement>('#live-nhc-list');
  const nhcStamp = root.querySelector<HTMLTimeElement>('#live-nhc-updated');
  const mapsStamp = root.querySelector<HTMLTimeElement>('#live-maps-updated');

  stamp(mapsStamp);

  let saved = DEFAULT_STATE;
  try {
    const fromStore = localStorage.getItem(STORAGE_KEY);
    if (fromStore && stateSelect?.querySelector(`option[value="${CSS.escape(fromStore)}"]`)) {
      saved = fromStore;
    }
  } catch {
    /* private mode */
  }
  if (stateSelect) stateSelect.value = saved;

  let timer: number | undefined;
  let controller: AbortController | undefined;

  async function refresh() {
    controller?.abort();
    controller = new AbortController();
    const signal = controller.signal;
    const state = (stateSelect?.value || DEFAULT_STATE).toUpperCase();
    try {
      localStorage.setItem(STORAGE_KEY, state);
    } catch {
      /* ignore */
    }

    if (alertStatus && alertList) {
      setStatus(alertStatus, 'Loading official National Weather Service alerts…', 'ok');
    }
    if (nhcStatus && !nhcList?.childElementCount) {
      setStatus(nhcStatus, 'Loading official National Hurricane Center status…', 'ok');
    }

    const nwsTask = fetchActiveAlerts({ state, signal })
      .then((alerts) => {
        if (!alertList || !alertStatus) return;
        renderAlerts(alertList, alertStatus, alerts, state);
        stamp(alertStamp);
      })
      .catch((err) => {
        if (signal.aborted) return;
        if (alertList) alertList.hidden = true;
        setStatus(
          alertStatus,
          'We could not load National Weather Service alerts just now. Official alerts are on weather.gov.',
          'error',
        );
        console.warn('NWS live status', err);
      });

    const nhcTask = loadNhc(signal)
      .then((storms) => {
        if (!nhcList || !nhcStatus) return;
        renderStorms(nhcList, nhcStatus, storms);
        stamp(nhcStamp);
      })
      .catch((err) => {
        if (signal.aborted) return;
        if (nhcList) nhcList.hidden = true;
        setStatus(
          nhcStatus,
          'We could not load the National Hurricane Center feed just now. Official tropical updates are on hurricanes.gov.',
          'error',
        );
        console.warn('NHC live status', err);
      });

    await Promise.allSettled([nwsTask, nhcTask]);
  }

  stateSelect?.addEventListener('change', () => {
    void refresh();
  });

  void refresh();
  timer = window.setInterval(() => void refresh(), ALERTS_REFRESH_MS);
  window.addEventListener('pagehide', () => {
    window.clearInterval(timer);
    controller?.abort();
  });
}
