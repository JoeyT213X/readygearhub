/**
 * Real visitor counter for ReadyGearHub.
 * GET  /api/visitors — read the stored count (does not increment).
 * POST /api/visitors — increment once when the browser is a real visitor.
 * Count starts at 0. No seed, no third-party counters.
 */
import { getStore } from '@netlify/blobs';

const STORE = 'rgh-stats';
const KEY = 'visitor-count';

const BOT_UA =
  /bot\b|crawler|spider|crawling|headlesschrome|headless|playwright|puppeteer|phantomjs|slurp|wget|curl\/|httpclient|python-requests|python-urllib|axios\/|go-http|node-fetch|preview|monitor|lighthouse|pagespeed|gtmetrix|pingdom|uptimerobot|statuscake|chrome-lighthouse|facebookexternalhit|embedly|quora link preview|whatsapp|discordbot|slackbot|twitterbot|linkedinbot|telegrambot|applebot|bingbot|yandex|duckduckbot|semrush|ahrefs|mj12bot|dotbot/i;

const ALLOWED_HOSTS = new Set([
  'readygearhub.com',
  'www.readygearhub.com',
]);

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function hostOf(value) {
  if (!value) return '';
  try {
    return new URL(value).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function isAllowedSite(req, url) {
  const host = url.hostname.replace(/^www\./, '');
  if (ALLOWED_HOSTS.has(url.hostname) || ALLOWED_HOSTS.has(host) || host.endsWith('.netlify.app')) {
    return true;
  }
  const origin = hostOf(req.headers.get('origin') || '');
  const referer = hostOf(req.headers.get('referer') || '');
  const ok = (h) => h === 'readygearhub.com' || h.endsWith('.netlify.app');
  return ok(origin) || ok(referer);
}

function shouldSkipIncrement(req, url) {
  const ua = req.headers.get('user-agent') || '';
  if (!ua || BOT_UA.test(ua)) return true;
  if (url.searchParams.get('gclid') === 'TEST') return true;
  if (url.searchParams.get('rgh-test') === '1') return true;
  const referer = req.headers.get('referer') || '';
  try {
    const ref = referer ? new URL(referer) : null;
    if (ref && (ref.searchParams.get('gclid') === 'TEST' || ref.searchParams.get('rgh-test') === '1')) return true;
  } catch {
    /* ignore bad referer */
  }
  return false;
}

async function readCount(store) {
  const raw = await store.get(KEY, { type: 'text', consistency: 'strong' });
  const n = Number.parseInt(String(raw ?? '0'), 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export default async (req) => {
  const url = new URL(req.url);

  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: { 'Cache-Control': 'no-store' } });
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return json({ error: 'method' }, 405);
  }

  let store;
  try {
    store = getStore({ name: STORE, consistency: 'strong' });
  } catch (err) {
    return json({ error: 'unavailable' }, 503);
  }

  if (req.method === 'GET') {
    try {
      return json({ count: await readCount(store) });
    } catch {
      return json({ error: 'unavailable' }, 503);
    }
  }

  if (!isAllowedSite(req, url) || shouldSkipIncrement(req, url)) {
    try {
      return json({ count: await readCount(store), skipped: true });
    } catch {
      return json({ error: 'unavailable' }, 503);
    }
  }

  try {
    const next = (await readCount(store)) + 1;
    await store.set(KEY, String(next));
    return json({ count: next });
  } catch {
    return json({ error: 'unavailable' }, 503);
  }
};

export const config = {
  path: '/api/visitors',
};
