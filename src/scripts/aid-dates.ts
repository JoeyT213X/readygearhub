import { APP_FEATURES, STORAGE_KEYS } from '../lib/app-config';
import { bindInstallPrompt, registerSW } from '../lib/pwa';

const SCOPE = '/apps/aid-dates/';
const FREE_KITS = 1;
const SOON_DAYS = 30;

type Kit = { id: string; name: string };
type Item = { id: string; kitId: string; name: string; expires: string; notes: string };
type Store = { kits: Kit[]; items: Item[]; activeKitId: string | null };

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now().toString(36)}`;
}
function defaults(): Store {
  const kit = { id: uid(), name: 'Home kit' };
  return { kits: [kit], items: [], activeKitId: kit.id };
}
function load(): Store {
  try {
    return { ...defaults(), ...JSON.parse(localStorage.getItem(STORAGE_KEYS.aidDates) || '') };
  } catch {
    return defaults();
  }
}
function save(store: Store) {
  try {
    localStorage.setItem(STORAGE_KEYS.aidDates, JSON.stringify(store));
  } catch {
    /* ignore */
  }
}
function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c);
}
function initTabs() {
  const tabs = [...document.querySelectorAll<HTMLElement>('[role="tab"]')];
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      document.querySelectorAll<HTMLElement>('[role="tabpanel"]').forEach((p) => {
        p.hidden = p.id !== tab.getAttribute('aria-controls');
      });
    });
  });
}
function daysLeft(expires: string) {
  return Math.ceil((Date.parse(expires + 'T00:00:00') - Date.now()) / 86400000);
}
function badge(expires: string) {
  const days = daysLeft(expires);
  if (!Number.isFinite(days)) return '<span class="badge-none">No date</span>';
  if (days < 0) return '<span class="badge-expired">Expired</span>';
  if (days <= SOON_DAYS) return '<span class="badge-soon">Soon</span>';
  return '<span class="badge-ok">OK</span>';
}

export function initAidDates() {
  registerSW(SCOPE);
  bindInstallPrompt(document.querySelector('#install-app'));
  initTabs();
  const store = load();
  if (!store.kits.length) Object.assign(store, defaults());
  if (!store.activeKitId) store.activeKitId = store.kits[0].id;
  const pro = APP_FEATURES.proEnabled && APP_FEATURES.extraKits;

  function kit() {
    return store.kits.find((k) => k.id === store.activeKitId) || store.kits[0];
  }
  function kitItems(id = kit().id) {
    return store.items.filter((i) => i.kitId === id).sort((a, b) => a.expires.localeCompare(b.expires));
  }

  function render() {
    const k = kit();
    const items = kitItems();
    const sw = document.querySelector<HTMLSelectElement>('#kit-switch')!;
    document.querySelector<HTMLElement>('#kit-switch-wrap')!.hidden = !pro || store.kits.length < 2;
    sw.innerHTML = store.kits.map((x) => `<option value="${escape(x.id)}" ${x.id === k.id ? 'selected' : ''}>${escape(x.name)}</option>`).join('');
    document.querySelector('#item-list')!.innerHTML = items.length
      ? items.map((i) => `<li><div><strong>${escape(i.name)}</strong><div class="fine">${i.expires}${i.notes ? ` · ${escape(i.notes)}` : ''}</div></div><div>${badge(i.expires)} <button type="button" class="btn small ghost" data-del="${i.id}">Remove</button></div></li>`).join('')
      : '<li class="fine">No items yet. Add supplies you own and the expiry date on the package.</li>';
    document.querySelector('#kit-list')!.innerHTML = store.kits
      .map((x) => `<li><div><strong>${escape(x.name)}</strong></div>${store.kits.length > 1 ? `<button type="button" class="btn small ghost" data-del-kit="${x.id}">Remove</button>` : ''}</li>`)
      .join('');
    document.querySelector<HTMLButtonElement>('#add-kit')!.hidden = !pro;
    document.querySelector<HTMLElement>('#export-actions')!.hidden = !pro;
    document.querySelector<HTMLElement>('#pro-note')!.hidden = pro;
    save(store);
  }

  document.querySelector('#kit-switch')!.addEventListener('change', (e) => {
    store.activeKitId = (e.target as HTMLSelectElement).value;
    render();
  });
  document.querySelector('#item-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    store.items.push({
      id: uid(),
      kitId: kit().id,
      name: String(fd.get('name') || '').trim() || 'Item',
      expires: String(fd.get('expires') || ''),
      notes: String(fd.get('notes') || ''),
    });
    (e.target as HTMLFormElement).reset();
    render();
  });
  document.querySelector('#item-list')!.addEventListener('click', (e) => {
    const id = (e.target as HTMLElement).getAttribute('data-del');
    if (!id) return;
    store.items = store.items.filter((i) => i.id !== id);
    render();
  });
  document.querySelector('#add-kit')!.addEventListener('click', () => {
    if (!pro || store.kits.length >= (pro ? Infinity : FREE_KITS)) return;
    const name = prompt('Kit or location name:', `Kit ${store.kits.length + 1}`);
    if (!name) return;
    const next = { id: uid(), name: name.trim() };
    store.kits.push(next);
    store.activeKitId = next.id;
    render();
  });
  document.querySelector('#kit-list')!.addEventListener('click', (e) => {
    const id = (e.target as HTMLElement).getAttribute('data-del-kit');
    if (!id || store.kits.length < 2) return;
    store.kits = store.kits.filter((k) => k.id !== id);
    store.items = store.items.filter((i) => i.kitId !== id);
    if (store.activeKitId === id) store.activeKitId = store.kits[0].id;
    render();
  });
  document.querySelector('#export-csv')!.addEventListener('click', () => {
    if (!pro) return;
    const rows = [['kit', 'item', 'expires', 'notes']];
    store.items.forEach((i) => {
      const k = store.kits.find((x) => x.id === i.kitId)?.name || '';
      rows.push([k, i.name, i.expires, i.notes]);
    });
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'aid-dates.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  document.querySelector('#print-list')!.addEventListener('click', () => {
    if (!pro) return;
    const rows = store.items
      .slice()
      .sort((a, b) => a.expires.localeCompare(b.expires))
      .map((i) => {
        const k = store.kits.find((x) => x.id === i.kitId)?.name || '';
        return `<tr><td>${escape(k)}</td><td>${escape(i.name)}</td><td>${escape(i.expires)}</td><td>${escape(i.notes)}</td></tr>`;
      })
      .join('');
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Aid Dates</title><style>body{font-family:system-ui;padding:24px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px;text-align:left}.note{font-size:.85rem;color:#444}</style></head><body><h1>Aid Dates</h1><p class="note">This is a list of dates you entered. It is not medical advice and has no dosing guidance.</p><table><thead><tr><th>Kit</th><th>Item</th><th>Expiry</th><th>Notes</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
    w.document.close();
    w.focus();
    w.print();
  });
  document.querySelector('#export-json')!.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' }));
    a.download = 'aid-dates-backup.json';
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
      if (!parsed?.kits) throw new Error('Not an Aid Dates backup');
      Object.assign(store, defaults(), parsed);
      render();
    }).catch(() => alert('Could not import that file.'));
  });

  render();
}
