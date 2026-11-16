import { STORAGE_KEYS } from '../lib/app-config';

/** Official FoodSafety.gov / USDA durations, in milliseconds. */
const LIMITS = {
  fridge: 4 * 60 * 60 * 1000,
  freezerFull: 48 * 60 * 60 * 1000,
  freezerHalf: 24 * 60 * 60 * 1000,
} as const;

type Saved = { startIso: string };

function loadSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.outageTimer);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.startIso && !Number.isNaN(Date.parse(parsed.startIso))) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

function saveSaved(startIso: string) {
  try {
    localStorage.setItem(STORAGE_KEYS.outageTimer, JSON.stringify({ startIso }));
  } catch {
    /* ignore */
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return 'Time is up';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h >= 24) {
    const d = Math.floor(h / 24);
    const rh = h % 24;
    return `${d}d ${pad(rh)}:${pad(m)}:${pad(s)} left`;
  }
  return `${h}h ${pad(m)}m ${pad(s)}s left`;
}

function toLocalInputValue(d: Date) {
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function initOutageTimer() {
  const startEl = document.querySelector<HTMLInputElement>('#outage-start');
  const useNow = document.querySelector<HTMLButtonElement>('#outage-now');
  const resetBtn = document.querySelector<HTMLButtonElement>('#outage-reset');
  const cards = {
    fridge: document.querySelector<HTMLElement>('#timer-fridge'),
    freezerFull: document.querySelector<HTMLElement>('#timer-freezer-full'),
    freezerHalf: document.querySelector<HTMLElement>('#timer-freezer-half'),
  };
  if (!startEl || !cards.fridge || !cards.freezerFull || !cards.freezerHalf) return;

  const saved = loadSaved();
  startEl.value = toLocalInputValue(saved ? new Date(saved.startIso) : new Date());
  saveSaved(new Date(startEl.value).toISOString());

  function paint() {
    const start = new Date(startEl.value);
    if (Number.isNaN(start.getTime())) return;
    saveSaved(start.toISOString());
    const now = Date.now();
    const elapsed = now - start.getTime();
    const entries: [keyof typeof LIMITS, HTMLElement][] = [
      ['fridge', cards.fridge!],
      ['freezerFull', cards.freezerFull!],
      ['freezerHalf', cards.freezerHalf!],
    ];
    for (const [key, el] of entries) {
      const remaining = LIMITS[key] - elapsed;
      const timeEl = el.querySelector('.time');
      const stateEl = el.querySelector('.timer-state');
      if (timeEl) timeEl.textContent = formatRemaining(remaining);
      el.classList.toggle('expired', remaining <= 0);
      el.classList.toggle('ok', remaining > 0);
      if (stateEl) {
        stateEl.textContent = remaining <= 0
          ? 'This official window has ended. Use a thermometer and FoodSafety.gov guidance before eating food.'
          : 'This official window is still open if the door stayed closed and the food stayed at a safe temperature.';
      }
    }
  }

  startEl.addEventListener('change', paint);
  startEl.addEventListener('input', paint);
  useNow?.addEventListener('click', () => {
    startEl.value = toLocalInputValue(new Date());
    paint();
  });
  resetBtn?.addEventListener('click', () => {
    startEl.value = toLocalInputValue(new Date());
    paint();
  });

  paint();
  const t = window.setInterval(paint, 1000);
  window.addEventListener('pagehide', () => window.clearInterval(t));
}
