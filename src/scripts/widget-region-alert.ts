import { fetchActiveAlerts, formatLocalTime, officialAlertHref, type NwsAlert } from './nws';
import {
  DEFAULT_REGION_SLUG,
  alertCoversRegion,
  regionBySlug,
  type WidgetRegion,
} from '../data/widget-regions';

function escapeHtml(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const WINTER_RE =
  /winter storm|winter weather|ice storm|blizzard|snow squall|lake effect snow|blowing snow|wind chill|extreme cold|cold weather|hard freeze|freeze warning|freeze watch|frost advisory|freezing rain|freezing drizzle|freezing fog|\bsleet\b|\bfreeze\b|\bfrost\b/i;

function isWinterAlert(alert: NwsAlert) {
  return WINTER_RE.test(alert.event);
}

function sortAlerts(alerts: NwsAlert[]) {
  const sev: Record<string, number> = { Extreme: 0, Severe: 1, Moderate: 2, Minor: 3, Unknown: 4 };
  return [...alerts].sort((a, b) => {
    const s = (sev[a.severity] ?? 99) - (sev[b.severity] ?? 99);
    if (s) return s;
    const at = a.onset ? new Date(a.onset).getTime() : 0;
    const bt = b.onset ? new Date(b.onset).getTime() : 0;
    return at - bt;
  });
}

/** One cited, evergreen winter-safety tip. Rotates by day so the same host does not always see one line. */
const TIPS = [
  {
    text: 'Never run a portable generator inside a home, basement, or garage. Use it outdoors, more than 20 feet from windows, doors, and vents, so carbon monoxide cannot drift indoors.',
    source: 'CDC',
    href: 'https://www.cdc.gov/carbon-monoxide/about/index.html',
  },
  {
    text: 'A winter storm kit should include water, food, a flashlight, extra batteries, a battery-powered or hand-crank radio, and a way to stay warm that is safe to use indoors.',
    source: 'Ready.gov',
    href: 'https://www.ready.gov/winter-weather',
  },
  {
    text: 'Letting a faucet drip during extremely cold weather can help keep pipes from freezing and bursting.',
    source: 'MEMA',
    href: 'https://www.msema.org/prepare/types-disasters/winter-weather',
  },
  {
    text: 'Check on neighbors, friends, and relatives — especially older adults and people who live alone — before and during a freeze or ice storm.',
    source: 'American Red Cross',
    href: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/winter-storm.html',
  },
];

function tipForToday() {
  const i = Math.floor(Date.now() / 86400000) % TIPS.length;
  return TIPS[i];
}

function attribution(ref: string) {
  const params = new URLSearchParams({ utm_source: 'widget', utm_medium: 'embed' });
  if (ref) params.set('utm_campaign', ref);
  const home = `https://readygearhub.com/${ref ? `?${params.toString()}` : ''}`;
  return `<p class="widget-powered">Storm alerts from <a href="https://www.weather.gov/" target="_top" rel="noopener">NWS</a> · Safety tips by <a href="${escapeHtml(home)}" target="_top" rel="nofollow noopener">ReadyGearHub</a></p>`;
}

function disclaimer() {
  return `<p class="widget-disclaimer">This box is informational and is not an official warning system. For official warnings, use Wireless Emergency Alerts, NOAA Weather Radio, or the <a href="https://www.msema.org/" target="_top" rel="noopener">MEMA</a> app. No warranty of timeliness. In an emergency, call 911.</p>`;
}

function tipHtml() {
  const tip = tipForToday();
  return `<p class="widget-tip"><strong>Safety tip:</strong> ${escapeHtml(tip.text)} <span class="fine">Source: <a href="${escapeHtml(tip.href)}" target="_top" rel="noopener">${escapeHtml(tip.source)}</a></span></p>`;
}

function renderAlert(alert: NwsAlert) {
  const href = officialAlertHref(alert);
  const onset = formatLocalTime(alert.onset);
  const ends = formatLocalTime(alert.ends || alert.expires);
  return `<li>
    <strong>${escapeHtml(alert.event)}</strong>
    <span class="fine"> · ${escapeHtml(alert.severity)}</span>
    <div class="fine">${escapeHtml(alert.areaDesc || 'Area not specified')}</div>
    <div class="fine">Starts ${escapeHtml(onset)} · Ends ${escapeHtml(ends)} · <a href="${escapeHtml(href)}" target="_top" rel="noopener">NWS alert</a></div>
  </li>`;
}

function card(title: string, body: string, ref: string) {
  return `<div class="widget-card">
    <h1>${escapeHtml(title)}</h1>
    ${body}
    ${tipHtml()}
    ${disclaimer()}
    ${attribution(ref)}
  </div>`;
}

export function initRegionAlertWidget() {
  const root = document.querySelector<HTMLElement>('#widget-region-alert');
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const region = regionBySlug(params.get('region')) || regionBySlug(DEFAULT_REGION_SLUG)!;
  const ref = (params.get('ref') || '').replace(/[^a-z0-9_-]/gi, '').slice(0, 40);

  (async () => {
    try {
      const all = sortAlerts((await fetchActiveAlerts({ state: 'MS' })).filter(isWinterAlert));
      const alerts = all.filter((a) => alertCoversRegion(a.areaDesc, region));
      render(root, region, alerts, ref);
    } catch {
      root.innerHTML = card(
        `Winter storm alerts for ${region.name}`,
        `<p>National Weather Service data is unavailable right now. Check <a href="https://www.weather.gov/" target="_top" rel="noopener">weather.gov</a> or local officials.</p>`,
        ref,
      );
    }
  })();
}

function render(root: HTMLElement, region: WidgetRegion, alerts: NwsAlert[], ref: string) {
  const title = `Winter storm alerts for ${region.name}`;
  if (!alerts.length) {
    root.innerHTML = card(
      title,
      `<p>No winter alerts right now for ${escapeHtml(region.shortLabel)}.</p>`,
      ref,
    );
    return;
  }
  const shown = alerts.slice(0, 4);
  const more = alerts.length > 4
    ? `<p class="fine">${alerts.length - 4} more active winter alert${alerts.length - 4 === 1 ? '' : 's'} — see the NWS links or weather.gov.</p>`
    : '';
  root.innerHTML = card(
    title,
    `<p>${alerts.length} active winter alert${alerts.length === 1 ? '' : 's'} for ${escapeHtml(region.shortLabel)}.</p><ul class="widget-alerts">${shown.map(renderAlert).join('')}</ul>${more}`,
    ref,
  );
}
