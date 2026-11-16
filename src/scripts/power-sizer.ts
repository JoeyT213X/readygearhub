type Appliance = {
  id: string;
  name: string;
  group: string;
  runningWatts: number;
  startingWatts: number;
  runningRange?: number[];
  note?: string;
  requires240V?: boolean;
  defaultOn?: boolean;
  qtyDefault?: number;
};

type Data = {
  source: { name: string; url: string; managementUrl: string };
  disclaimer: string;
  appliances: Appliance[];
};

function hoursLabel(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) return '—';
  if (hours < 1) return `${Math.round(hours * 60)} minutes`;
  if (hours < 10) return `${hours.toFixed(1)} hours`;
  return `${Math.round(hours)} hours`;
}

export function initPowerSizer(data: Data) {
  const list = document.querySelector<HTMLElement>('#appliance-list');
  const results = document.querySelector<HTMLElement>('#sizer-results');
  const capacityEl = document.querySelector<HTMLInputElement>('#capacity-wh');
  if (!list || !results || !capacityEl) return;

  const groups = new Map<string, Appliance[]>();
  for (const a of data.appliances) {
    if (!groups.has(a.group)) groups.set(a.group, []);
    groups.get(a.group)!.push(a);
  }

  const html: string[] = [];
  for (const [group, items] of groups) {
    html.push(`<section class="card"><h2>${group}</h2><div class="appliance-groups">`);
    for (const a of items) {
      const qty = a.qtyDefault ?? 1;
      html.push(`<div class="appliance-row" data-id="${a.id}">
        <input type="checkbox" id="on-${a.id}" ${a.defaultOn ? 'checked' : ''} aria-label="Include ${a.name}" />
        <div class="fields">
          <div>
            <p class="appliance-name"><label for="on-${a.id}">${a.name}</label></p>
            ${a.note ? `<p class="appliance-note">${a.note}</p>` : ''}
            ${a.requires240V ? '<p class="appliance-note">Often 240 V, per Honda.</p>' : ''}
          </div>
          <label class="mini">Qty <input type="number" min="0" step="1" value="${qty}" data-f="qty" /></label>
          <label class="mini">Running W <input type="number" min="0" step="1" value="${a.runningWatts}" data-f="run" /></label>
          <label class="mini">Starting W <input type="number" min="0" step="1" value="${a.startingWatts}" data-f="start" /></label>
        </div>
      </div>`);
    }
    html.push('</div></section>');
  }
  list.innerHTML = html.join('');

  const byId = Object.fromEntries(data.appliances.map((a) => [a.id, a]));

  function selected() {
    const rows = [...list.querySelectorAll<HTMLElement>('.appliance-row')];
    const out: { name: string; qty: number; run: number; start: number; requires240V: boolean }[] = [];
    for (const row of rows) {
      const id = row.dataset.id!;
      const on = row.querySelector<HTMLInputElement>('input[type="checkbox"]')?.checked;
      const qty = Number(row.querySelector<HTMLInputElement>('[data-f="qty"]')?.value || 0);
      const run = Number(row.querySelector<HTMLInputElement>('[data-f="run"]')?.value || 0);
      const start = Number(row.querySelector<HTMLInputElement>('[data-f="start"]')?.value || 0);
      if (on && qty > 0) out.push({ name: byId[id].name, qty, run, start, requires240V: !!byId[id].requires240V });
    }
    return out;
  }

  function recalc() {
    const items = selected();
    const running = items.reduce((s, i) => s + i.qty * i.run, 0);
    // Honda power-management approach: running total + the largest single starting increment.
    let largestSpike = 0;
    for (const i of items) {
      const spike = Math.max(0, i.start - i.run);
      if (spike > largestSpike) largestSpike = spike;
    }
    const starting = running + largestSpike;
    const capacity = Number(capacityEl.value || 0);
    const hours = running > 0 && capacity > 0 ? capacity / running : 0;
    const has240 = items.some((i) => i.requires240V);

    results.innerHTML = `
      <div class="results-grid">
        <div><p class="fine">Total running watts</p><p class="stat">${running.toLocaleString()} W</p></div>
        <div><p class="fine">Starting watts to plan for</p><p class="stat">${starting.toLocaleString()} W</p></div>
        <div><p class="fine">Estimated runtime at ${capacity || 0} Wh</p><p class="stat">${hoursLabel(hours)}</p></div>
      </div>
      <p class="fine" style="margin-top:12px">Starting watts assume you stagger motor starts: all selected running watts, plus the single largest starting increment (${largestSpike.toLocaleString()} W). Honda explains this power-management approach in its <a href="${data.source.managementUrl}" style="color:#a9dcf7">generator size guide</a>. If several motors could start at once, you would need more.</p>
      <p class="fine">Runtime is a simple estimate: watt-hour capacity ÷ total running watts. Real runtime is shorter because of inverter losses, temperature, battery management, and loads that cycle. Check your power station or battery manual. This is not a measurement of a specific product.</p>
      ${has240 ? '<p class="warn-240">One or more selected appliances is marked by Honda as often requiring 240 V. Many portable generators and power stations cannot run 240 V loads — confirm your equipment and the appliance nameplate.</p>' : ''}
    `;
  }

  list.addEventListener('input', recalc);
  list.addEventListener('change', recalc);
  capacityEl.addEventListener('input', recalc);
  recalc();
}
