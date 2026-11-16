import {
  hoursLabel,
  renderApplianceList,
  selectedAppliances,
  startingWattsToPlan,
  type ApplianceData,
} from './appliance-sizer';

export function initPowerSizer(data: ApplianceData) {
  const list = document.querySelector<HTMLElement>('#appliance-list');
  const results = document.querySelector<HTMLElement>('#sizer-results');
  const capacityEl = document.querySelector<HTMLInputElement>('#capacity-wh');
  if (!list || !results || !capacityEl) return;

  renderApplianceList(list, data);

  function recalc() {
    const items = selectedAppliances(list!, data);
    const { running, starting, largestSpike } = startingWattsToPlan(items);
    const capacity = Number(capacityEl!.value || 0);
    const hours = running > 0 && capacity > 0 ? capacity / running : 0;
    const has240 = items.some((i) => i.requires240V);

    results!.innerHTML = `
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
