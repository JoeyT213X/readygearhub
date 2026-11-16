import { classifyEvent, lanesForEvent, SEVERITY_ORDER, URGENCY_ORDER, type LaneRef } from '../lib/alert-lanes';
import { formatLocalTime, officialAlertHref, type CountyZone, type NwsAlert } from './nws';

export function escapeHtml(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function severityClass(sev: string) {
  const k = (sev || '').toLowerCase();
  if (k === 'extreme' || k === 'severe' || k === 'moderate' || k === 'minor') return `sev-${k}`;
  return 'sev-unknown';
}

export function sortAlerts(alerts: NwsAlert[]) {
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

export type AlertFilterFlags = {
  winter?: boolean;
  severe?: boolean;
  hurricane?: boolean;
  tornado?: boolean;
  flood?: boolean;
};

export function readAlertFilters(): AlertFilterFlags {
  const on = (id: string) => !!document.querySelector<HTMLInputElement>(id)?.checked;
  return {
    winter: on('#filter-winter'),
    severe: on('#filter-severe'),
    hurricane: on('#filter-hurricane'),
    tornado: on('#filter-tornado'),
    flood: on('#filter-flood'),
  };
}

export function anyFilterOn(f: AlertFilterFlags) {
  return !!(f.winter || f.severe || f.hurricane || f.tornado || f.flood);
}

export function matchesAlertFilters(alert: NwsAlert, f: AlertFilterFlags) {
  if (!anyFilterOn(f)) return true;
  const c = classifyEvent(alert.event);
  return (
    (!!f.winter && c.winter) ||
    (!!f.severe && c.severe) ||
    (!!f.hurricane && c.hurricane) ||
    (!!f.tornado && c.tornado) ||
    (!!f.flood && c.flood)
  );
}

export function filterLabel(f: AlertFilterFlags) {
  const names = [
    f.winter && 'winter',
    f.severe && 'severe',
    f.hurricane && 'hurricane or tropical',
    f.tornado && 'tornado',
    f.flood && 'flood',
  ].filter(Boolean) as string[];
  if (!names.length) return '';
  if (names.length === 1) return names[0] + ' ';
  return `${names.slice(0, -1).join(', ')} or ${names[names.length - 1]} `;
}

function lanePills(lanes: LaneRef[]) {
  if (!lanes.length) return '';
  return `<div class="related-lanes">${lanes
    .map((l) => `<a class="pill" href="/${escapeHtml(l.slug)}/">${escapeHtml(l.icon)} ${escapeHtml(l.name)}</a>`)
    .join('')}</div>`;
}

/** Full alert card used by /alerts/ and Storm Tracker. */
export function renderAlertCard(alert: NwsAlert, opts: { showLanes?: boolean; heading?: 'h2' | 'h3' } = {}) {
  const Heading = opts.heading ?? 'h2';
  const desc = alert.description
    ? `<details><summary>Description</summary><p class="body-text">${escapeHtml(alert.description)}</p></details>`
    : '';
  const inst = alert.instruction
    ? `<details><summary>Instructions</summary><p class="body-text">${escapeHtml(alert.instruction)}</p></details>`
    : '';
  const href = officialAlertHref(alert);
  const lanes = opts.showLanes === false ? '' : lanePills(lanesForEvent(alert.event));
  return `<article class="card alert-card">
    <header>
      <span class="pill ${severityClass(alert.severity)}">${escapeHtml(alert.severity)}</span>
      <span class="pill">Urgency: ${escapeHtml(alert.urgency)}</span>
      <span class="pill">Certainty: ${escapeHtml(alert.certainty)}</span>
    </header>
    <${Heading}>${escapeHtml(alert.event)}</${Heading}>
    ${alert.headline ? `<p>${escapeHtml(alert.headline)}</p>` : ''}
    <p class="meta-row"><strong>Area:</strong> ${escapeHtml(alert.areaDesc || 'Not specified')}</p>
    <p class="meta-row"><strong>Onset:</strong> ${escapeHtml(formatLocalTime(alert.onset))}</p>
    <p class="meta-row"><strong>Expires:</strong> ${escapeHtml(formatLocalTime(alert.expires))}</p>
    ${desc}${inst}
    <p class="meta-row"><a href="${escapeHtml(href)}" target="_blank" rel="noopener">View on weather.gov ↗</a></p>
    ${lanes}
  </article>`;
}

/** One-line item used by the compact embed badge. */
export function renderAlertCompactLine(alert: NwsAlert) {
  const href = officialAlertHref(alert);
  return `<li><strong>${escapeHtml(alert.event)}</strong> · ${escapeHtml(alert.severity)} · expires ${escapeHtml(formatLocalTime(alert.expires))} · <a href="${escapeHtml(href)}" target="_blank" rel="noopener">NWS</a></li>`;
}

export function fillCountySelect(
  select: HTMLSelectElement,
  counties: CountyZone[],
  selected = '',
  allLabel = 'All counties',
) {
  select.innerHTML = [`<option value="">${escapeHtml(allLabel)}</option>`]
    .concat(
      counties.map(
        (c) =>
          `<option value="${escapeHtml(c.id)}"${c.id === selected ? ' selected' : ''}>${escapeHtml(c.name)} County</option>`,
      ),
    )
    .join('');
}

export const NWS_UNAVAILABLE_HTML =
  `We couldn’t load alerts from the National Weather Service. Check <a href="https://www.weather.gov/" target="_blank" rel="noopener">weather.gov</a> for official information, then try again. In an emergency, call 911.`;
