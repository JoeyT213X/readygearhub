import {
  dailyWattHours,
  recommendedBatteryWh,
  recommendedPanelWatts,
  renderApplianceList,
  selectedAppliances,
  type ApplianceData,
} from './appliance-sizer';

function num(el: HTMLInputElement | null) {
  const n = Number(el?.value);
  return Number.isFinite(n) ? n : 0;
}

function wattsLabel(n: number | null) {
  if (n == null) return '—';
  return `${Math.ceil(n).toLocaleString()} W`;
}

function whLabel(n: number | null) {
  if (n == null) return '—';
  return `${Math.ceil(n).toLocaleString()} Wh`;
}

export function initSolarSizer(data: ApplianceData) {
  const list = document.querySelector<HTMLElement>('#appliance-list');
  const results = document.querySelector<HTMLElement>('#sizer-results');
  const sunEl = document.querySelector<HTMLInputElement>('#peak-sun-hours');
  const lossEl = document.querySelector<HTMLInputElement>('#system-losses');
  const daysEl = document.querySelector<HTMLInputElement>('#backup-days');
  const usableEl = document.querySelector<HTMLInputElement>('#usable-pct');
  const batteryEl = document.querySelector<HTMLInputElement>('#capacity-wh');
  if (!list || !results || !sunEl || !lossEl || !daysEl || !usableEl || !batteryEl) return;

  renderApplianceList(list, data, { includeHours: true });

  function recalc() {
    const items = selectedAppliances(list!, data);
    const dailyWh = dailyWattHours(items);
    const sun = num(sunEl);
    const losses = num(lossEl);
    const days = num(daysEl);
    const usable = usableEl!.value === '' ? 100 : num(usableEl);
    const haveBattery = num(batteryEl);
    const panel = recommendedPanelWatts(dailyWh, sun, losses);
    const battery = recommendedBatteryWh(dailyWh, days, usable);
    const has240 = items.some((i) => i.requires240V);
    const missingHours = items.some((i) => !(i.hours > 0));

    let recharge = '—';
    if (haveBattery > 0 && panel && sun > 0) {
      const derate = 1 - losses / 100;
      const harvest = panel * sun * (derate > 0 ? derate : 0);
      recharge = harvest > 0 ? `${(haveBattery / harvest).toFixed(1)} days of those sun hours` : '—';
    }

    results!.innerHTML = `
      <div class="results-grid">
        <div><p class="fine">Daily load</p><p class="stat">${dailyWh > 0 ? `${Math.round(dailyWh).toLocaleString()} Wh` : '—'}</p></div>
        <div><p class="fine">Recommended panel array</p><p class="stat">${wattsLabel(panel)}</p></div>
        <div><p class="fine">Recommended battery</p><p class="stat">${whLabel(battery)}</p></div>
      </div>
      <p class="fine" style="margin-top:12px">Daily load = running watts × quantity × hours/day for each selected appliance (typical Honda wattages, which you can edit). Panel watts = daily Wh ÷ (peak sun hours × (1 − losses ÷ 100)). Battery Wh = daily Wh × days ÷ (usable % ÷ 100). ${losses === 0 ? 'Losses are currently 0% — real output is lower; enter a loss figure from your equipment or from a tool such as NREL PVWatts.' : `This result applies your ${losses}% losses input.`} ${usable === 100 ? 'Usable battery capacity is currently 100% of the nameplate rating — enter a lower figure if your manual says not to use the full rating.' : `This result treats ${usable}% of the battery rating as usable.`}</p>
      ${haveBattery > 0 ? `<p class="fine">The battery capacity you entered (${haveBattery.toLocaleString()} Wh) would take about ${recharge} to refill from the recommended array at the sun hours and losses you entered. That is a planning estimate, not a measurement.</p>` : ''}
      ${missingHours && items.length ? '<p class="fine">Enter hours/day for each selected appliance. Items with 0 hours do not add to the daily load.</p>' : ''}
      ${!(sun > 0) ? '<p class="fine">Enter peak sun hours for your location (from NREL PVWatts or the NREL solar resource maps) to size the array. This tool does not fill in a regional average.</p>' : ''}
      ${has240 ? '<p class="warn-240">One or more selected appliances is marked by Honda as often requiring 240 V. Many portable power stations cannot run 240 V loads — confirm your equipment and the appliance nameplate.</p>' : ''}
    `;
  }

  list.addEventListener('input', recalc);
  list.addEventListener('change', recalc);
  for (const el of [sunEl, lossEl, daysEl, usableEl, batteryEl]) el.addEventListener('input', recalc);
  recalc();
}
