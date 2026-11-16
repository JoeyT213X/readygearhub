import { ALERTS_REFRESH_MS, DEFAULT_STATE, STORAGE_KEYS } from '../lib/app-config';
import { classifyEvent, lanesForEvent, SEVERITY_ORDER, URGENCY_ORDER, type LaneRef } from '../lib/alert-lanes';
import {
  fetchActiveAlerts,
  fetchCounties,
  formatLocalTime,
  lookupPoint,
  officialAlertHref,
  type CountyZone,
  type NwsAlert,
} from './nws';

type Saved = { state: string; zone: string };

function loadSaved(): Saved {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.alerts);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.state === 'string') {
        return { state: parsed.state, zone: typeof parsed.zone === 'string' ? parsed.zone : '' };
      }
    }
  } catch {
    /* ignore unreadable localStorage */
  }
  return { state: DEFAULT_STATE, zone: '' };
}

function saveSaved(state: string, zone: string) {
  try {
    localStorage.setItem(STORAGE_KEYS.alerts, JSON.stringify({ state, zone }));
  } catch {
    /* ignore quota / private mode */
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function severityClass(sev: string) {
  const k = sev.toLowerCase();
  if (k === 'extreme' || k === 'severe' || k === 'moderate' || k === 'minor') return `sev-${k}`;
  return 'sev-unknown';
}

function sortAlerts(alerts: NwsAlert[]) {
  return [...alerts].sort((a, b) => {
    const s = (SEVERITY_ORDER[a.severity] ?? 99) - (SEVERITY_ORDER[b.severity] ?? 99);
    if (s) return s;
    const u = (URGENCY_ORDER[a.urgency] ?? 99) - (URGENCY_ORDER[b.urgency] ?? 99);
    if (u) return u;
    const at = a.onset ? new Date(a.onset).getTime() : 0;
    const bt = b.onset ? new Date(b.onset).getTime() : 0;
    return at - bt;
  });
}

function lanePills(lanes: LaneRef[]) {
  if (!lanes.length) return '';
  return `<div class="related-lanes">${lanes
    .map((l) => `<a class="pill" href="/${l.slug}/">${escapeHtml(l.icon)} ${escapeHtml(l.name)}</a>`)
    .join('')}</div>`;
}

function renderAlert(alert: NwsAlert) {
  const desc = alert.description
    ? `<details><summary>Description</summary><p class="body-text">${escapeHtml(alert.description)}</p></details>`
    : '';
  const inst = alert.instruction
    ? `<details><summary>Instructions</summary><p class="body-text">${escapeHtml(alert.instruction)}</p></details>`
    : '';
  const href = officialAlertHref(alert);
  return `<article class="card alert-card">
    <header>
      <span class="pill ${severityClass(alert.severity)}">${escapeHtml(alert.severity)}</span>
      <span class="pill">Urgency: ${escapeHtml(alert.urgency)}</span>
      <span class="pill">Certainty: ${escapeHtml(alert.certainty)}</span>
    </header>
    <h2>${escapeHtml(alert.event)}</h2>
    ${alert.headline ? `<p>${escapeHtml(alert.headline)}</p>` : ''}
    <p class="meta-row"><strong>Area:</strong> ${escapeHtml(alert.areaDesc || 'Not specified')}</p>
    <p class="meta-row"><strong>Onset:</strong> ${escapeHtml(formatLocalTime(alert.onset))}</p>
    <p class="meta-row"><strong>Expires:</strong> ${escapeHtml(formatLocalTime(alert.expires))}</p>
    ${desc}${inst}
    <p class="meta-row"><a href="${escapeHtml(href)}" target="_blank" rel="noopener">View on weather.gov ↗</a></p>
    ${lanePills(lanesForEvent(alert.event))}
  </article>`;
}

export function initAlertsPage() {
  const stateEl = document.querySelector<HTMLSelectElement>('#alert-state');
  const countyEl = document.querySelector<HTMLSelectElement>('#alert-county');
  const winterEl = document.querySelector<HTMLInputElement>('#filter-winter');
  const severeEl = document.querySelector<HTMLInputElement>('#filter-severe');
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
    const winter = !!winterEl?.checked;
    const severe = !!severeEl?.checked;
    if (!winter && !severe) return allAlerts;
    return allAlerts.filter((a) => {
      const c = classifyEvent(a.event);
      return (winter && c.winter) || (severe && c.severe);
    });
  }

  function paint() {
    const filtered = sortAlerts(applyFilters());
    const winter = !!winterEl?.checked;
    const severe = !!severeEl?.checked;
    if (!allAlerts.length) {
      results.innerHTML = '';
      return;
    }
    if (!filtered.length) {
      const filterText = winter && severe ? 'winter or severe ' : winter ? 'winter ' : severe ? 'severe ' : '';
      results.innerHTML = '';
      setStatus(`No ${filterText}alerts for ${escapeHtml(placeLabel)} right now.`, 'empty');
      return;
    }
    setStatus(`Showing ${filtered.length} alert${filtered.length === 1 ? '' : 's'} for ${escapeHtml(placeLabel)}. Sorted by severity. Times are in your local time.`, '');
    results.innerHTML = filtered.map(renderAlert).join('');
  }

  function fillCounties(selected?: string) {
    const opts = [`<option value="">All counties in ${escapeHtml(stateEl.options[stateEl.selectedIndex]?.text || stateEl.value)}</option>`];
    for (const c of counties) {
      opts.push(`<option value="${escapeHtml(c.id)}"${c.id === selected ? ' selected' : ''}>${escapeHtml(c.name)} County</option>`);
    }
    countyEl.innerHTML = opts.join('');
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
      setStatus(
        `We couldn’t load alerts from the National Weather Service. Check <a href="https://www.weather.gov/" target="_blank" rel="noopener">weather.gov</a> for official information, then try again. In an emergency, call 911.`,
        'error',
      );
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
  winterEl?.addEventListener('change', paint);
  severeEl?.addEventListener('change', paint);

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
