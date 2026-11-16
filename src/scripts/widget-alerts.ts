import { fetchActiveAlerts, fetchCounties, formatLocalTime, officialAlertHref, type NwsAlert } from './nws';
import { SEVERITY_ORDER } from '../lib/alert-lanes';

function escapeHtml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

export function initAlertsWidget() {
  const root = document.querySelector<HTMLElement>('#widget-alerts');
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const state = (params.get('state') || 'MS').toUpperCase();
  const zone = (params.get('zone') || '').toUpperCase();

  (async () => {
    let place = state;
    try {
      if (zone) {
        const counties = await fetchCounties(state);
        const county = counties.find((c) => c.id === zone);
        place = county ? `${county.name} County, ${county.state}` : zone;
      }
      const alerts = (await fetchActiveAlerts({ state, zone: zone || undefined }))
        .sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9));
      render(root, place, alerts);
    } catch {
      root.innerHTML = `<div class="widget-card">
        <h1>Live weather alerts</h1>
        <p>We couldn’t load alerts. Check <a href="https://www.weather.gov/" target="_blank" rel="noopener">weather.gov</a>. In an emergency, call 911.</p>
        <p class="widget-powered">Powered by <a href="https://readygearhub.com/" target="_top">ReadyGearHub</a></p>
      </div>`;
    }
  })();
}

function render(root: HTMLElement, place: string, alerts: NwsAlert[]) {
  const items = alerts.slice(0, 5).map((a) => {
    const href = officialAlertHref(a);
    return `<li><strong>${escapeHtml(a.event)}</strong> · ${escapeHtml(a.severity)} · expires ${escapeHtml(formatLocalTime(a.expires))} · <a href="${escapeHtml(href)}" target="_blank" rel="noopener">NWS</a></li>`;
  }).join('');
  const more = alerts.length > 5 ? `<p class="fine">${alerts.length - 5} more — see weather.gov or ReadyGearHub.</p>` : '';
  const body = alerts.length
    ? `<p>${alerts.length} active alert${alerts.length === 1 ? '' : 's'} for ${escapeHtml(place)}.</p><ul>${items}</ul>${more}`
    : `<p>No active alerts for ${escapeHtml(place)} right now.</p>`;
  root.innerHTML = `<div class="widget-card">
    <h1>Live weather alerts</h1>
    <p class="fine">Official National Weather Service data. Not a replacement for official alerts. In an emergency, call 911.</p>
    ${body}
    <p class="widget-powered">Powered by <a href="https://readygearhub.com/" target="_top">ReadyGearHub</a></p>
  </div>`;
}
