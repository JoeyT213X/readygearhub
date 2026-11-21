export function initSourceDirectoryFilters(root: ParentNode = document): void {
  const bar = root.querySelector<HTMLElement>('[data-source-filters]');
  if (!bar) return;
  const cards = () => [...root.querySelectorAll<HTMLElement>('.source-card')];
  const sections = () => [...root.querySelectorAll<HTMLElement>('[data-dir-section]')];
  const catBtns = [...bar.querySelectorAll<HTMLButtonElement>('[data-filter-cat]')];
  const srcBtns = [...bar.querySelectorAll<HTMLButtonElement>('[data-filter-src]')];
  const live = bar.querySelector<HTMLElement>('[data-filter-status]');
  const moreBtn = root.querySelector<HTMLButtonElement>('[data-load-more]');
  const pageSize = Number(bar.getAttribute('data-page-size') || '0') || 0;

  let cat = bar.getAttribute('data-current-cat') || 'all';
  let src = 'all';
  let shown = pageSize || Number.POSITIVE_INFINITY;

  function hashFilter(): string | null {
    if (typeof location === 'undefined') return null;
    const raw = decodeURIComponent(location.hash.replace(/^#/, ''));
    if (!raw) return null;
    if (catBtns.some((b) => b.getAttribute('data-filter-cat') === raw)) return raw;
    return null;
  }

  const fromHash = hashFilter();
  if (fromHash) cat = fromHash;

  function apply() {
    let matches = 0;
    let visible = 0;
    for (const card of cards()) {
      const c = card.getAttribute('data-category') || '';
      const also = (card.getAttribute('data-also') || '').split(/\s+/).filter(Boolean);
      const groups = (card.getAttribute('data-groups') || '').split(/\s+/).filter(Boolean);
      const s = card.getAttribute('data-source') || '';
      const trending = card.getAttribute('data-trending') === '1';
      const catOk =
        cat === 'all' ||
        (cat === 'trending' && trending) ||
        c === cat ||
        also.includes(cat) ||
        groups.includes(cat);
      const srcOk = src === 'all' || s === src;
      const match = catOk && srcOk;
      if (match) matches += 1;
      const show = match && matches <= shown;
      card.hidden = !show;
      if (show) visible += 1;
    }
    for (const sec of sections()) {
      const id = sec.getAttribute('data-dir-section') || '';
      const catOk = cat === 'all' || cat === 'trending' || id === cat;
      const hasCard = [...sec.querySelectorAll<HTMLElement>('.source-card')].some((el) => !el.hidden);
      const coming = sec.querySelector('.coming-soon-panel');
      const showComing = !!coming && (cat === 'all' || id === cat) && src === 'all';
      if (coming) (coming as HTMLElement).hidden = !showComing;
      sec.hidden = !(catOk && (hasCard || showComing));
    }
    catBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute('data-filter-cat') === cat)));
    srcBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute('data-filter-src') === src)));
    if (live) {
      const catLabel = catBtns.find((b) => b.getAttribute('data-filter-cat') === cat)?.textContent?.trim() || cat;
      const srcLabel = srcBtns.find((b) => b.getAttribute('data-filter-src') === src)?.textContent?.trim() || src;
      const extra = matches > visible ? ` · showing ${visible}` : '';
      live.textContent = `${matches} ${matches === 1 ? 'listing' : 'listings'} · ${catLabel} · ${srcLabel}${extra}`;
    }
    if (moreBtn) {
      const remaining = Math.max(0, matches - visible);
      moreBtn.hidden = remaining === 0;
      moreBtn.textContent = remaining > 0 ? `Load more (${remaining} left)` : 'Load more';
    }
  }

  bar.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest('button');
    if (!t || !bar.contains(t)) return;
    if (t.hasAttribute('data-filter-cat')) {
      cat = t.getAttribute('data-filter-cat') || 'all';
      shown = pageSize || Number.POSITIVE_INFINITY;
    }
    if (t.hasAttribute('data-filter-src')) {
      src = t.getAttribute('data-filter-src') || 'all';
      shown = pageSize || Number.POSITIVE_INFINITY;
    }
    apply();
  });

  moreBtn?.addEventListener('click', () => {
    shown += pageSize || 48;
    apply();
  });

  window.addEventListener('hashchange', () => {
    const next = hashFilter();
    if (next) {
      cat = next;
      shown = pageSize || Number.POSITIVE_INFINITY;
      apply();
      document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  apply();
  if (fromHash) {
    document.getElementById('listings')?.scrollIntoView({ block: 'start' });
  }
}
