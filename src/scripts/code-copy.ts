import '../styles/code.css';

document.addEventListener('click', async (e) => {
  const btn = (e.target as Element).closest<HTMLButtonElement>('.code-copy');
  if (!btn) return;

  const code = btn.closest('.code-frame')?.querySelector('pre code')?.textContent ?? '';
  try {
    await navigator.clipboard.writeText(code);
    btn.textContent = 'Copiado';
  } catch {
    btn.textContent = 'Erro';
  }
  setTimeout(() => (btn.textContent = 'Copiar'), 1200);
});
