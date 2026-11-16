function escapeHtml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function daysUntil(dateStr: string) {
  const target = new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - start.getTime()) / 86400000);
}

export function initCountdownWidget() {
  const root = document.querySelector<HTMLElement>('#widget-countdown');
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const date = params.get('date') || '';
  const label = params.get('label') || 'Storm prep';
  const days = date ? daysUntil(date) : null;
  let headline = 'Choose a prep date to start this countdown.';
  if (days === null && date) headline = 'That date could not be read.';
  else if (days === 0) headline = 'Today is the date you chose.';
  else if (days !== null && days > 0) headline = `${days} day${days === 1 ? '' : 's'} left.`;
  else if (days !== null && days < 0) headline = `That date was ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago.`;

  root.innerHTML = `<div class="widget-card">
    <h1>${escapeHtml(label)}</h1>
    <p style="font-size:1.6rem;font-weight:800;margin:.2em 0">${escapeHtml(headline)}</p>
    ${date ? `<p class="fine">Target date: ${escapeHtml(date)}</p>` : ''}
    <p>Ready.gov recommends having water (one gallon per person per day for several days) and a several-day supply of non-perishable food, plus a radio, flashlight, and first aid kit. See <a href="https://www.ready.gov/kit" target="_blank" rel="noopener">Build A Kit</a>.</p>
    <p class="fine">This countdown is a reminder only. It is not an official forecast or alert. In an emergency, call 911.</p>
    <p class="widget-powered">Powered by <a href="https://readygearhub.com/" target="_top">ReadyGearHub</a></p>
  </div>`;
}
