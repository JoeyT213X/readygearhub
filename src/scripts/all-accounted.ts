import { APP_FEATURES, STORAGE_KEYS } from '../lib/app-config';
import { bindInstallPrompt, registerSW } from '../lib/pwa';

const SCOPE = '/apps/all-accounted/';
const FREE_PEOPLE = 6;
const STATUSES = [
  { id: 'unknown', label: 'Not yet checked in' },
  { id: 'safe', label: 'Safe' },
  { id: 'enroute', label: 'En route' },
  { id: 'meeting', label: 'At the meeting point' },
  { id: 'shelter', label: 'Sheltering in place' },
  { id: 'help', label: 'Needs help' },
] as const;
type StatusId = (typeof STATUSES)[number]['id'];
type Person = { id: string; name: string; role: string; isPet: boolean };
type Point = { id: string; name: string; address: string };
type EventRec = {
  id: string;
  name: string;
  startedAt: number;
  endedAt: number | null;
  meetingPointId: string;
  statuses: Record<string, { status: StatusId; at: number; note: string }>;
};
type Store = { householdName: string; people: Person[]; meetingPoints: Point[]; events: EventRec[]; activeEventId: string | null };

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now().toString(36)}`;
}
function defaults(): Store {
  const p1 = { id: uid(), name: 'Adult 1', role: 'Adult', isPet: false };
  const p2 = { id: uid(), name: 'Adult 2', role: 'Adult', isPet: false };
  const point = { id: uid(), name: 'Home', address: '' };
  return { householdName: 'Our household', people: [p1, p2], meetingPoints: [point], events: [], activeEventId: null };
}
function load(): Store {
  try {
    return { ...defaults(), ...JSON.parse(localStorage.getItem(STORAGE_KEYS.allAccounted) || '') };
  } catch {
    return defaults();
  }
}
function save(store: Store) {
  try {
    localStorage.setItem(STORAGE_KEYS.allAccounted, JSON.stringify(store));
  } catch {
    /* ignore */
  }
}
function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c);
}
function fmtDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}
function initTabs() {
  const tabs = [...document.querySelectorAll<HTMLElement>('[role="tab"]')];
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => selectTab(tab.id));
  });
}
function selectTab(id: string) {
  document.querySelectorAll<HTMLElement>('[role="tab"]').forEach((t) => t.setAttribute('aria-selected', String(t.id === id)));
  document.querySelectorAll<HTMLElement>('[role="tabpanel"]').forEach((p) => {
    p.hidden = p.id !== document.getElementById(id)?.getAttribute('aria-controls');
  });
}
function activeEvent(store: Store) {
  return store.events.find((e) => e.id === store.activeEventId && !e.endedAt) || null;
}
function personStatus(ev: EventRec | null, id: string) {
  return ev?.statuses?.[id] || { status: 'unknown' as StatusId, at: 0, note: '' };
}
function label(id: StatusId) {
  return STATUSES.find((s) => s.id === id)?.label || id;
}

export function initAllAccounted() {
  registerSW(SCOPE);
  bindInstallPrompt(document.querySelector('#install-app'));
  initTabs();
  const store = load();

  function snapshotText() {
    const ev = activeEvent(store) || [...store.events].sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0))[0];
    const lines = ['ALL ACCOUNTED — household check-in snapshot', store.householdName || 'Household'];
    if (ev) {
      const point = store.meetingPoints.find((m) => m.id === ev.meetingPointId);
      lines.push(`${ev.name} · started ${fmtDate(ev.startedAt)}${ev.endedAt ? ` · closed ${fmtDate(ev.endedAt)}` : ' · OPEN'}`);
      if (point) lines.push(`Meeting point: ${[point.name, point.address].filter(Boolean).join(' — ')}`);
      lines.push('');
      store.people.forEach((p) => {
        const st = personStatus(ev, p.id);
        lines.push(`${p.name}${p.isPet ? ' (pet)' : ''} — ${label(st.status).toUpperCase()}${st.at ? ` (${fmtDate(st.at)})` : ''}${st.note ? ` · ${st.note}` : ''}`);
      });
    } else {
      lines.push('No check-in has been opened yet.');
      lines.push(`Household: ${store.people.map((p) => p.name).join(', ')}`);
    }
    lines.push('', 'This is a snapshot from one device, not live location and not a 911 alert.', 'If someone needs emergency help, call your local emergency number.');
    return lines.join('\n');
  }

  function render() {
    const ev = activeEvent(store);
    document.querySelector<HTMLElement>('#no-event')!.hidden = !!ev;
    document.querySelector<HTMLElement>('#event-board')!.hidden = !ev;
    document.querySelector('#snapshot')!.textContent = snapshotText();
    (document.querySelector('#house-form [name="household"]') as HTMLInputElement).value = store.householdName;
    const point = store.meetingPoints[0];
    if (point) {
      (document.querySelector('#point-form [name="name"]') as HTMLInputElement).value = point.name;
      (document.querySelector('#point-form [name="address"]') as HTMLInputElement).value = point.address;
    }
    const canAdd = (APP_FEATURES.proEnabled && APP_FEATURES.extraHousehold) || store.people.length < FREE_PEOPLE;
    document.querySelector<HTMLButtonElement>('#add-person')!.hidden = !canAdd;
    document.querySelector('#people-list')!.innerHTML = store.people
      .map((p) => `<li><div><strong>${escape(p.name)}</strong>${p.isPet ? ' (pet)' : ''}<div class="fine">${escape(p.role || '')}</div></div><div><button type="button" class="btn small ghost" data-edit="${p.id}">Edit</button> <button type="button" class="btn small ghost" data-del="${p.id}">Remove</button></div></li>`)
      .join('');
    if (!ev) {
      save(store);
      return;
    }
    const tally: Record<string, number> = { unknown: 0, safe: 0, enroute: 0, meeting: 0, shelter: 0, help: 0 };
    store.people.forEach((p) => {
      tally[personStatus(ev, p.id).status] += 1;
    });
    const help = tally.help || 0;
    const banner = document.querySelector<HTMLElement>('#help-banner')!;
    banner.hidden = help === 0;
    document.querySelector('#help-title')!.textContent = help === 1 ? 'Someone is marked as needing help' : `${help} people are marked as needing help`;
    const meet = store.meetingPoints.find((m) => m.id === ev.meetingPointId) || store.meetingPoints[0];
    document.querySelector('#event-name')!.textContent = ev.name;
    document.querySelector('#event-meta')!.textContent = `Started ${fmtDate(ev.startedAt)}`;
    document.querySelector('#event-point')!.textContent = meet ? `Meeting point: ${[meet.name, meet.address].filter(Boolean).join(' — ')}` : '';
    document.querySelector('#counts')!.innerHTML = STATUSES.map((s) => `<div><span class="n">${tally[s.id] || 0}</span><span class="l">${escape(s.label)}</span></div>`).join('');
    document.querySelector('#person-grid')!.innerHTML = store.people
      .map((p) => {
        const st = personStatus(ev, p.id);
        return `<button type="button" class="card person-card st-${st.status}" data-person="${p.id}"><strong>${escape(p.name)}${p.isPet ? ' (pet)' : ''}</strong>${p.role ? `<div class="fine">${escape(p.role)}</div>` : ''}<div class="st">${escape(label(st.status))}</div><div class="fine">${st.at ? `Updated ${fmtDate(st.at)}${st.note ? ` · ${escape(st.note)}` : ''}` : 'Tap to check in'}</div></button>`;
      })
      .join('');
    save(store);
  }

  document.querySelector('#open-event')!.addEventListener('click', () => {
    if (activeEvent(store)) return;
    const name = prompt('Name this check-in:', `Check-in ${new Date().toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`);
    if (name === null) return;
    const ev: EventRec = {
      id: uid(),
      name: name.trim() || 'Check-in',
      startedAt: Date.now(),
      endedAt: null,
      meetingPointId: store.meetingPoints[0]?.id || '',
      statuses: {},
    };
    store.events.push(ev);
    store.activeEventId = ev.id;
    render();
  });
  document.querySelector('#close-event')!.addEventListener('click', () => {
    const ev = activeEvent(store);
    if (!ev) return;
    ev.endedAt = Date.now();
    store.activeEventId = null;
    render();
  });
  document.querySelector('#goto-share')!.addEventListener('click', () => selectTab('tab-share'));
  document.querySelector('#person-grid')!.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-person]');
    const ev = activeEvent(store);
    if (!btn || !ev) return;
    const person = store.people.find((p) => p.id === btn.getAttribute('data-person'));
    if (!person) return;
    const choice = prompt(`Check in ${person.name}. Type: safe, enroute, meeting, shelter, help, or unknown`);
    if (choice === null) return;
    const key = choice.trim().toLowerCase() as StatusId;
    const status = STATUSES.some((s) => s.id === key) ? key : 'unknown';
    ev.statuses[person.id] = { status, at: Date.now(), note: '' };
    render();
  });
  document.querySelector('#copy-snapshot')!.addEventListener('click', async () => {
    const text = snapshotText();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      prompt('Copy this snapshot:', text);
    }
  });
  document.querySelector('#house-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    store.householdName = String(new FormData(e.target as HTMLFormElement).get('household') || 'Our household');
    render();
  });
  document.querySelector('#point-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    if (!store.meetingPoints[0]) store.meetingPoints[0] = { id: uid(), name: 'Home', address: '' };
    store.meetingPoints[0].name = String(fd.get('name') || 'Meeting point');
    store.meetingPoints[0].address = String(fd.get('address') || '');
    render();
  });
  document.querySelector('#add-person')!.addEventListener('click', () => {
    if (!(APP_FEATURES.proEnabled && APP_FEATURES.extraHousehold) && store.people.length >= FREE_PEOPLE) return;
    const name = prompt('Name:');
    if (!name) return;
    const isPet = confirm('OK if this is a pet, Cancel if this is a person.');
    store.people.push({ id: uid(), name: name.trim(), role: isPet ? 'Pet' : '', isPet });
    render();
  });
  document.querySelector('#people-list')!.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const del = t.getAttribute('data-del');
    const edit = t.getAttribute('data-edit');
    if (del) store.people = store.people.filter((p) => p.id !== del);
    if (edit) {
      const p = store.people.find((x) => x.id === edit);
      if (!p) return;
      const name = prompt('Name:', p.name);
      if (name === null) return;
      p.name = name.trim() || p.name;
    }
    render();
  });
  document.querySelector('#export-json')!.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' }));
    a.download = 'all-accounted-backup.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  const fileInput = document.querySelector<HTMLInputElement>('#import-file')!;
  document.querySelector('#import-json')!.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    fileInput.value = '';
    if (!file) return;
    file.text().then((text) => {
      const parsed = JSON.parse(text);
      if (!parsed?.people) throw new Error('Not an All Accounted backup');
      Object.assign(store, defaults(), parsed);
      render();
    }).catch(() => alert('Could not import that file.'));
  });

  render();
}
