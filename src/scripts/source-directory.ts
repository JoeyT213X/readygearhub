export function initSourceDirectoryFilters(root: ParentNode = document): void {
  const bar = root.querySelector<HTMLElement>('[data-source-filters]');
  if (!bar) return;
  const cards = () => [...root.querySelectorAll<HTMLElement>('.source-card')];
  const sections = () => [...root.querySelectorAll<HTMLElement>('[data-dir-section]')];
  const catBtns = [...bar.querySelectorAll<HTMLButtonElement>('[data-filter-cat]')];
  const srcBtns = [...bar.querySelectorAll<HTMLButtonElement>('[data-filter-src]')];
  const live = bar.querySelector<HTMLElement>('[data-filter-status]');

  let cat = bar.getAttribute('data-current-cat') || 'all';
  let src = 'all';

  function apply() {
    let visible = 0;
    for (const card of cards()) {
      const c = card.getAttribute('data-category') || '';
      const also = (card.getAttribute('data-also') || '').split(/\s+/).filter(Boolean);
      const s = card.getAttribute('data-source') || '';
      const trending = card.getAttribute('data-trending') === '1';
      const catOk =
        cat === 'all' ||
        (cat === 'trending' && trending) ||
        c === cat ||
        also.includes(cat);
      const srcOk = src === 'all' || s === src;
      const show = catOk && srcOk;
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
      live.textContent = `${visible} ${visible === 1 ? 'listing' : 'listings'} · ${catLabel} · ${srcLabel}`;
    }
  }

  bar.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest('button');
    if (!t || !bar.contains(t)) return;
    if (t.hasAttribute('data-filter-cat')) cat = t.getAttribute('data-filter-cat') || 'all';
    if (t.hasAttribute('data-filter-src')) src = t.getAttribute('data-filter-src') || 'all';
    apply();
  });

  apply();
}
