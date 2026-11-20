import { APP_FEATURES, FREE_LIMITS, STORAGE_KEYS } from '../lib/app-config';
import { bindInstallPrompt, registerSW } from '../lib/pwa';

const SCOPE = '/apps/collar-card/';
const FREE_PETS = FREE_LIMITS.collarCardPets;
const SOON_DAYS = 30;

type Pet = {
  id: string;
  name: string;
  species: string;
  microchip: string;
  vetName: string;
  vetPhone: string;
  meds: string;
  feeding: string;
  notes: string;
};
type KitItem = { id: string; petId: string; name: string; expires: string };
type Store = { pets: Pet[]; items: KitItem[]; activePetId: string | null };

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now().toString(36)}`;
}
function emptyPet(): Pet {
  return { id: uid(), name: '', species: '', microchip: '', vetName: '', vetPhone: '', meds: '', feeding: '', notes: '' };
}
function defaults(): Store {
  const pet = emptyPet();
  pet.name = 'My pet';
  return { pets: [pet], items: [], activePetId: pet.id };
}
function load(): Store {
  try {
    return { ...defaults(), ...JSON.parse(localStorage.getItem(STORAGE_KEYS.collarCard) || '') };
  } catch {
    return defaults();
  }
}
function save(store: Store) {
  try {
    localStorage.setItem(STORAGE_KEYS.collarCard, JSON.stringify(store));
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
function badge(expires: string) {
  if (!expires) return '<span class="badge-none">No date</span>';
  const days = Math.ceil((Date.parse(expires + 'T00:00:00') - Date.now()) / 86400000);
  if (!Number.isFinite(days)) return '<span class="badge-none">No date</span>';
  if (days < 0) return '<span class="badge-expired">Expired</span>';
  if (days <= SOON_DAYS) return '<span class="badge-soon">Soon</span>';
  return '<span class="badge-ok">OK</span>';
}

function cardText(pet: Pet, items: KitItem[]) {
  const lines = [
    'COLLAR CARD — pet emergency snapshot',
    pet.name || 'Unnamed pet',
    pet.species ? `Species: ${pet.species}` : '',
    pet.microchip ? `Microchip: ${pet.microchip}` : '',
    pet.vetName || pet.vetPhone ? `Veterinarian: ${[pet.vetName, pet.vetPhone].filter(Boolean).join(' · ')}` : '',
    pet.meds ? `Medications (names only): ${pet.meds}` : '',
    pet.feeding ? `Feeding notes: ${pet.feeding}` : '',
    pet.notes ? `Other notes: ${pet.notes}` : '',
    '',
    'Kit items (dates you entered):',
  ];
  if (!items.length) lines.push('None listed.');
  items.forEach((i) => lines.push(`${i.name}${i.expires ? ` — ${i.expires}` : ''}`));
  lines.push('', 'This is information the owner entered. It is not veterinary advice.', 'In an emergency, contact a veterinarian or a local emergency veterinary clinic.');
  return lines.filter((l, i) => l !== '' || lines[i + 1] !== '').join('\n');
}

export function initCollarCard() {
  registerSW(SCOPE);
  bindInstallPrompt(document.querySelector('#install-app'));
  initTabs();
  const store = load();
  if (!store.pets.length) Object.assign(store, defaults());
  if (!store.activePetId) store.activePetId = store.pets[0].id;
  const pro = APP_FEATURES.proEnabled && APP_FEATURES.extraPets;
  const form = document.querySelector<HTMLFormElement>('#profile-form')!;

  function pet() {
    return store.pets.find((p) => p.id === store.activePetId) || store.pets[0];
  }

  function render() {
    const p = pet();
    const fields = ['name', 'species', 'microchip', 'vetName', 'vetPhone', 'meds', 'feeding', 'notes'] as const;
    fields.forEach((k) => {
      (form.elements.namedItem(k) as HTMLInputElement).value = p[k] || '';
    });
    const sw = document.querySelector<HTMLSelectElement>('#pet-switch')!;
    document.querySelector<HTMLElement>('#pet-switch-wrap')!.hidden = !pro || store.pets.length < 2;
    sw.innerHTML = store.pets.map((x) => `<option value="${escape(x.id)}" ${x.id === p.id ? 'selected' : ''}>${escape(x.name || 'Unnamed pet')}</option>`).join('');
    document.querySelector<HTMLButtonElement>('#add-pet')!.hidden = !pro;
    const items = store.items.filter((i) => i.petId === p.id).sort((a, b) => (a.expires || '9999').localeCompare(b.expires || '9999'));
    document.querySelector('#kit-list')!.innerHTML = items.length
      ? items.map((i) => `<li><div><strong>${escape(i.name)}</strong><div class="fine">${i.expires || 'No expiry date'}</div></div><div>${badge(i.expires)} <button type="button" class="btn small ghost" data-del="${i.id}">Remove</button></div></li>`).join('')
      : '<li class="fine">No kit items yet. Add what you actually keep on hand.</li>';
    document.querySelector('#card-text')!.textContent = cardText(p, items);
    document.querySelector<HTMLElement>('#card-actions')!.hidden = !pro;
    document.querySelector<HTMLElement>('#pro-note')!.hidden = pro;
    save(store);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const p = pet();
    (['name', 'species', 'microchip', 'vetName', 'vetPhone', 'meds', 'feeding', 'notes'] as const).forEach((k) => {
      p[k] = String(fd.get(k) || '');
    });
    if (!p.name.trim()) p.name = 'My pet';
    render();
  });
  document.querySelector('#pet-switch')!.addEventListener('change', (e) => {
    store.activePetId = (e.target as HTMLSelectElement).value;
    render();
  });
  document.querySelector('#add-pet')!.addEventListener('click', () => {
    if (!pro) return;
    const next = emptyPet();
    next.name = `Pet ${store.pets.length + 1}`;
    store.pets.push(next);
    store.activePetId = next.id;
    render();
  });
  document.querySelector('#kit-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    store.items.push({
      id: uid(),
      petId: pet().id,
      name: String(fd.get('name') || '').trim() || 'Item',
      expires: String(fd.get('expires') || ''),
    });
    (e.target as HTMLFormElement).reset();
    render();
  });
  document.querySelector('#kit-list')!.addEventListener('click', (e) => {
    const id = (e.target as HTMLElement).getAttribute('data-del');
    if (!id) return;
    store.items = store.items.filter((i) => i.id !== id);
    render();
  });
  document.querySelector('#copy-card')!.addEventListener('click', async () => {
    if (!pro) return;
    const text = cardText(pet(), store.items.filter((i) => i.petId === pet().id));
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      prompt('Copy this card:', text);
    }
  });
  document.querySelector('#print-card')!.addEventListener('click', () => {
    if (!pro) return;
    const text = cardText(pet(), store.items.filter((i) => i.petId === pet().id));
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Collar Card</title><style>body{font-family:system-ui;padding:24px}pre{white-space:pre-wrap}</style></head><body><pre>${escape(text)}</pre></body></html>`);
    w.document.close();
    w.focus();
    w.print();
  });
  document.querySelector('#export-json')!.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' }));
    a.download = 'collar-card-backup.json';
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
      if (!parsed?.pets) throw new Error('Not a Collar Card backup');
      Object.assign(store, defaults(), parsed);
      render();
    }).catch(() => alert('Could not import that file.'));
  });

  render();
}
