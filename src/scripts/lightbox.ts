import '../styles/lightbox.css';
import { onSwipe } from './swipe';

// qualquer [data-lightbox] e qualquer imagem do Markdown abre o lightbox
const SEL = '[data-lightbox], .prose img';
const groupOf = (el: HTMLElement) => el.dataset.lightbox ?? 'page';

let dlg: HTMLDialogElement;
let img: HTMLImageElement;
let count: HTMLElement;
let prev: HTMLButtonElement;
let next: HTMLButtonElement;
let items: HTMLElement[] = [];
let i = 0;

const icon = (d: string) =>
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;

function build() {
  dlg = document.createElement('dialog');
  dlg.className = 'lb';
  dlg.innerHTML = `
    <button class="lb-btn lb-close" aria-label="Fechar">${icon('M6 6l12 12M18 6L6 18')}</button>
    <button class="lb-btn lb-prev" aria-label="Anterior">${icon('M15 5l-7 7 7 7')}</button>
    <img class="lb-img" alt="" />
    <button class="lb-btn lb-next" aria-label="Seguinte">${icon('M9 5l7 7-7 7')}</button>
    <span class="lb-count"></span>`;
  document.body.append(dlg);

  img = dlg.querySelector('.lb-img')!;
  count = dlg.querySelector('.lb-count')!;
  prev = dlg.querySelector('.lb-prev')!;
  next = dlg.querySelector('.lb-next')!;

  prev.onclick = () => show(i - 1);
  next.onclick = () => show(i + 1);
  dlg.querySelector<HTMLButtonElement>('.lb-close')!.onclick = () => dlg.close();
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
  onSwipe(dlg, (d) => show(i + d));

  dlg.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    items[i]?.dispatchEvent(new CustomEvent('lightbox:close', { bubbles: true }));
  });
}

function show(n: number) {
  i = Math.min(items.length - 1, Math.max(0, n));
  const el = items[i] as HTMLImageElement;
  img.src = el.dataset.full || el.currentSrc || el.src;
  img.alt = el.alt || '';
  count.textContent = `${i + 1} / ${items.length}`;
  prev.disabled = i === 0;
  next.disabled = i === items.length - 1;
  dlg.classList.toggle('single', items.length < 2);
}

document.addEventListener('click', (e) => {
  const el = (e.target as Element).closest<HTMLElement>(SEL);
  if (!el || el.closest('a')) return; // imagens que são links não abrem
  if (!dlg) build();
  const group = groupOf(el);
  items = Array.from(document.querySelectorAll<HTMLElement>(SEL))
    .filter((x) => groupOf(x) === group);
  show(items.indexOf(el));
  document.documentElement.style.overflow = 'hidden'; // sem scroll por trás
  dlg.showModal();
});
