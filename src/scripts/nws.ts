/**
 * Client-side helpers for the official National Weather Service API
 * (https://api.weather.gov).
 *
 * NWS terms ask applications to send a descriptive User-Agent that identifies
 * the app and a contact. Browsers do not allow pages to set the User-Agent
 * header; the browser's own User-Agent is sent instead, which is acceptable
 * for this fully client-side tool. Server-side or curl checks should send:
 *   User-Agent: ReadyGearHub (https://readygearhub.com; info@omegaucosolutions.com)
 */
export const NWS_BASE = 'https://api.weather.gov';

export class NwsError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'NwsError';
    this.status = status;
  }
}

export async function nwsFetch(pathOrUrl: string, signal?: AbortSignal): Promise<any> {
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${NWS_BASE}${pathOrUrl}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/geo+json' },
    signal,
  });
  if (!res.ok) {
    throw new NwsError(`The National Weather Service API returned ${res.status}.`, res.status);
  }
  return res.json();
}

export type CountyZone = { id: string; name: string; state: string };

export async function fetchCounties(state: string, signal?: AbortSignal): Promise<CountyZone[]> {
  const data = await nwsFetch(`/zones?type=county&area=${encodeURIComponent(state)}`, signal);
  const features = Array.isArray(data?.features) ? data.features : [];
  const counties: CountyZone[] = features
    .map((f: any) => ({
      id: String(f?.properties?.id || '').toUpperCase(),
      name: String(f?.properties?.name || ''),
      state: String(f?.properties?.state || state),
    }))
    .filter((c: CountyZone) => c.id && c.name)
    .sort((a: CountyZone, b: CountyZone) => a.name.localeCompare(b.name));
  // Deduplicate zone ids if the API repeats any.
  const seen = new Set<string>();
  return counties.filter((c) => (seen.has(c.id) ? false : (seen.add(c.id), true)));
}

export type NwsAlert = {
  id: string;
  event: string;
  severity: string;
  urgency: string;
  certainty: string;
  areaDesc: string;
  onset: string | null;
  expires: string | null;
  ends: string | null;
  effective: string | null;
  headline: string | null;
  description: string | null;
  instruction: string | null;
  web: string | null;
};

export function normalizeAlert(feature: any): NwsAlert | null {
  const p = feature?.properties;
  if (!p) return null;
  return {
    id: String(p.id || feature.id || ''),
    event: String(p.event || 'Alert'),
    severity: String(p.severity || 'Unknown'),
    urgency: String(p.urgency || 'Unknown'),
    certainty: String(p.certainty || 'Unknown'),
    areaDesc: String(p.areaDesc || ''),
    onset: p.onset || p.effective || null,
    expires: p.expires || p.ends || null,
    ends: p.ends || null,
    effective: p.effective || null,
    headline: p.headline || null,
    description: p.description || null,
    instruction: p.instruction || null,
    web: p.web || null,
  };
}

export async function fetchActiveAlerts(opts: {
  state?: string;
  zone?: string;
  point?: { lat: number; lon: number };
  signal?: AbortSignal;
}): Promise<NwsAlert[]> {
  let path = '';
  if (opts.point) {
    const lat = opts.point.lat.toFixed(4);
    const lon = opts.point.lon.toFixed(4);
    path = `/alerts/active?point=${lat},${lon}`;
  } else if (opts.zone) {
    path = `/alerts/active?zone=${encodeURIComponent(opts.zone)}`;
  } else if (opts.state) {
    path = `/alerts/active?area=${encodeURIComponent(opts.state)}`;
  } else {
    throw new Error('A state, county zone, or point is required.');
  }
  const data = await nwsFetch(path, opts.signal);
  const features = Array.isArray(data?.features) ? data.features : [];
  return features.map(normalizeAlert).filter(Boolean) as NwsAlert[];
}

export async function lookupPoint(lat: number, lon: number, signal?: AbortSignal) {
  const data = await nwsFetch(`/points/${lat.toFixed(4)},${lon.toFixed(4)}`, signal);
  const countyUrl = String(data?.properties?.county || '');
  const countyId = countyUrl.split('/').pop() || '';
  const rel = data?.properties?.relativeLocation?.properties || {};
  return {
    countyId,
    countyUrl,
    city: String(rel.city || ''),
    state: String(rel.state || data?.properties?.relativeLocation?.properties?.state || ''),
    forecastOffice: data?.properties?.cwa || '',
  };
}

export function officialAlertHref(alert: NwsAlert): string {
  const web = (alert.web || '').trim();
  if (web && !/^https?:\/\/(www\.)?weather\.gov\/?$/i.test(web)) return web;
  return 'https://www.weather.gov/';
}

export function formatLocalTime(iso: string | null): string {
  if (!iso) return 'Not specified';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Not specified';
  return d.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}
