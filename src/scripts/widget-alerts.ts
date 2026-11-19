import { fetchActiveAlerts, fetchCounties } from './nws';
import { escapeHtml, NWS_UNAVAILABLE_HTML, renderAlertCompactLine, sortAlerts } from './alert-render';

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
      const alerts = sortAlerts(await fetchActiveAlerts({ state, zone: zone || undefined }));
      render(root, place, alerts);
    } catch {
      root.innerHTML = `<div class="widget-card">
        <h1>Live weather alerts</h1>
        <p>${NWS_UNAVAILABLE_HTML}</p>
        <p class="widget-powered">Powered by <a href="https://readygearhub.com/" target="_top" rel="nofollow noopener">ReadyGearHub</a></p>
      </div>`;
    }
  })();
}

function render(root: HTMLElement, place: string, alerts: Awaited<ReturnType<typeof fetchActiveAlerts>>) {
  const items = alerts.slice(0, 5).map(renderAlertCompactLine).join('');
  const more = alerts.length > 5 ? `<p class="fine">${alerts.length - 5} more — see weather.gov or ReadyGearHub.</p>` : '';
  const body = alerts.length
    ? `<p>${alerts.length} active alert${alerts.length === 1 ? '' : 's'} for ${escapeHtml(place)}.</p><ul>${items}</ul>${more}`
    : `<p>No active alerts for ${escapeHtml(place)} right now.</p>`;
  root.innerHTML = `<div class="widget-card">
    <h1>Live weather alerts</h1>
    <p class="fine">Official National Weather Service data. Not a replacement for official alerts. In an emergency, call 911.</p>
    ${body}
    <p class="widget-powered">Powered by <a href="https://readygearhub.com/" target="_top" rel="nofollow noopener">ReadyGearHub</a></p>
  </div>`;
}
