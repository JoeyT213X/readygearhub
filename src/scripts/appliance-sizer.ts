export type Appliance = {
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

export type ApplianceData = {
  source: { name: string; url: string; managementUrl: string };
  disclaimer: string;
  appliances: Appliance[];
};

export type SelectedAppliance = {
  id: string;
  name: string;
  qty: number;
  run: number;
  start: number;
  hours: number;
  requires240V: boolean;
};

export function hoursLabel(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) return '—';
  if (hours < 1) return `${Math.round(hours * 60)} minutes`;
  if (hours < 10) return `${hours.toFixed(1)} hours`;
  return `${Math.round(hours)} hours`;
}

export function renderApplianceList(list: HTMLElement, data: ApplianceData, opts: { includeHours?: boolean } = {}) {
  const groups = new Map<string, Appliance[]>();
  for (const a of data.appliances) {
    if (!groups.has(a.group)) groups.set(a.group, []);
    groups.get(a.group)!.push(a);
  }

  const html: string[] = [];
  const hoursCol = opts.includeHours ? '4fr 1fr 1fr 1fr 1fr' : '2fr 1fr 1fr 1fr';
  for (const [group, items] of groups) {
    html.push(`<section class="card"><h2>${group}</h2><div class="appliance-groups">`);
    for (const a of items) {
      const qty = a.qtyDefault ?? 1;
      html.push(`<div class="appliance-row" data-id="${a.id}">
        <input type="checkbox" id="on-${a.id}" ${a.defaultOn ? 'checked' : ''} aria-label="Include ${a.name}" />
        <div class="fields" style="grid-template-columns:${hoursCol}">
          <div>
            <p class="appliance-name"><label for="on-${a.id}">${a.name}</label></p>
            ${a.note ? `<p class="appliance-note">${a.note}</p>` : ''}
            ${a.requires240V ? '<p class="appliance-note">Often 240 V, per Honda.</p>' : ''}
          </div>
          <label class="mini">Qty <input type="number" min="0" step="1" value="${qty}" data-f="qty" /></label>
          <label class="mini">Running W <input type="number" min="0" step="1" value="${a.runningWatts}" data-f="run" /></label>
          <label class="mini">Starting W <input type="number" min="0" step="1" value="${a.startingWatts}" data-f="start" /></label>
          ${opts.includeHours ? '<label class="mini">Hours/day <input type="number" min="0" step="0.1" value="" placeholder="0" data-f="hours" /></label>' : ''}
        </div>
      </div>`);
    }
    html.push('</div></section>');
  }
  list.innerHTML = html.join('');
}

export function selectedAppliances(list: HTMLElement, data: ApplianceData): SelectedAppliance[] {
  const byId = Object.fromEntries(data.appliances.map((a) => [a.id, a]));
  const out: SelectedAppliance[] = [];
  for (const row of list.querySelectorAll<HTMLElement>('.appliance-row')) {
    const id = row.dataset.id!;
    const on = row.querySelector<HTMLInputElement>('input[type="checkbox"]')?.checked;
    const qty = Number(row.querySelector<HTMLInputElement>('[data-f="qty"]')?.value || 0);
    const run = Number(row.querySelector<HTMLInputElement>('[data-f="run"]')?.value || 0);
    const start = Number(row.querySelector<HTMLInputElement>('[data-f="start"]')?.value || 0);
    const hours = Number(row.querySelector<HTMLInputElement>('[data-f="hours"]')?.value || 0);
    if (on && qty > 0) out.push({ id, name: byId[id].name, qty, run, start, hours, requires240V: !!byId[id].requires240V });
  }
  return out;
}

export function runningWattsTotal(items: SelectedAppliance[]) {
  return items.reduce((s, i) => s + i.qty * i.run, 0);
}

/** Honda power-management approach: running total plus the largest single starting increment. */
export function startingWattsToPlan(items: SelectedAppliance[]) {
  const running = runningWattsTotal(items);
  let largestSpike = 0;
  for (const i of items) {
    const spike = Math.max(0, i.start - i.run);
    if (spike > largestSpike) largestSpike = spike;
  }
  return { running, starting: running + largestSpike, largestSpike };
}

export function dailyWattHours(items: SelectedAppliance[]) {
  return items.reduce((s, i) => s + i.qty * i.run * i.hours, 0);
}

/** Panel watts to cover a daily watt-hour load. lossesPct is user-entered; 0 means no losses applied. */
export function recommendedPanelWatts(dailyWh: number, peakSunHours: number, lossesPct: number) {
  const derate = 1 - lossesPct / 100;
  if (!(dailyWh > 0) || !(peakSunHours > 0) || !(derate > 0)) return null;
  return dailyWh / (peakSunHours * derate);
}

/** Nameplate battery watt-hours to hold a daily load for N days. usablePct is user-entered; 100 means the full rating. */
export function recommendedBatteryWh(dailyWh: number, days: number, usablePct: number) {
  const usable = usablePct / 100;
  if (!(dailyWh > 0) || !(days > 0) || !(usable > 0)) return null;
  return (dailyWh * days) / usable;
}
