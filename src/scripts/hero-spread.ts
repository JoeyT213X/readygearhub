/**
 * Gentle pointer parallax for the home hero collage.
 * Disabled when the user prefers reduced motion.
 */
function initHeroSpread() {
  const root = document.querySelector<HTMLElement>('.hero-spread');
  if (!root) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(min-width: 900px)').matches) return;

  const tiles = Array.from(root.querySelectorAll<HTMLElement>('.hero-cutout'));
  let frame = 0;

  const onMove = (event: PointerEvent) => {
    const box = root.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) return;
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      for (const tile of tiles) {
        const depth = Number(tile.dataset.depth || 0.04);
        tile.style.setProperty('--px', `${(-x * depth * 36).toFixed(2)}px`);
        tile.style.setProperty('--py', `${(-y * depth * 22).toFixed(2)}px`);
      }
    });
  };

  const onLeave = () => {
    for (const tile of tiles) {
      tile.style.setProperty('--px', '0px');
      tile.style.setProperty('--py', '0px');
    }
  };

  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerleave', onLeave);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroSpread, { once: true });
} else {
  initHeroSpread();
}
