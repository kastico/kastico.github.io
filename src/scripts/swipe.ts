export function onSwipe(el: HTMLElement, cb: (dir: 1 | -1) => void) {
  let sx = 0, sy = 0, multi = false;

  el.addEventListener('touchstart', (e) => {
    multi = e.touches.length > 1; // pinch
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, { passive: true });

  el.addEventListener('touchend', (e) => {
    // ignora pinch e arrastos com a página ampliada
    if (multi || (window.visualViewport?.scale ?? 1) > 1.05) return;
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) cb(dx < 0 ? 1 : -1);
  }, { passive: true });
}
