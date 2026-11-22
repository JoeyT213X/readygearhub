/**
 * Site-wide visitor ticker. Defers the request until after load, counts
 * at most once per browser per calendar day, and stays quiet on errors.
 */
const API = '/api/visitors';

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `rgh-visited-${y}-${m}-${day}`;
}

function shouldSkipCount(): boolean {
  try {
    const nav = navigator as Navigator & { webdriver?: boolean };
    if (nav.webdriver) return true;
    const ua = nav.userAgent || '';
    if (/HeadlessChrome|bot|crawler|spider|Playwright|Puppeteer/i.test(ua)) return true;
    const q = location.search || '';
    if (/[?&]gclid=TEST(?:&|$)/.test(q)) return true;
    if (/[?&]rgh-test=1(?:&|$)/.test(q)) return true;
    return false;
  } catch {
    return true;
  }
}

function alreadyCounted(): boolean {
  try {
    return localStorage.getItem(todayKey()) === '1';
  } catch {
    return true;
  }
}

function markCounted() {
  try {
    localStorage.setItem(todayKey(), '1');
  } catch {
    /* private mode or blocked storage — skip quietly */
  }
}

function formatCount(n: number): string {
  return n.toLocaleString('en-US');
}

async function refreshTicker() {
  const root = document.querySelector<HTMLElement>('[data-visitor-ticker]');
  const num = document.querySelector<HTMLElement>('[data-visitor-count]');
  if (!root || !num) return;

  const increment = !shouldSkipCount() && !alreadyCounted();
  const res = await fetch(API, {
    method: increment ? 'POST' : 'GET',
    headers: {
      Accept: 'application/json',
      ...(increment ? { 'Content-Type': 'application/json' } : {}),
    },
    credentials: 'same-origin',
    cache: 'no-store',
  });
  if (!res.ok) return;
  const data: unknown = await res.json();
  const count = data && typeof data === 'object' && 'count' in data ? Number((data as { count: unknown }).count) : NaN;
  if (!Number.isFinite(count) || count < 0) return;
  num.textContent = formatCount(count);
  root.classList.add('is-ready');
  if (increment) markCounted();
}

function start() {
  const run = () => {
    void refreshTicker().catch(() => {
      /* fail silently */
    });
  };
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback;
  if (typeof ric === 'function') ric(run, { timeout: 4000 });
  else setTimeout(run, 1200);
}

export function initVisitorTicker() {
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}

initVisitorTicker();
