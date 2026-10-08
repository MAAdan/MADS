/* mads.toggle.theme behaviour: every [data-theme-toggle] on the page switches between light and dark mode.
   The device setting applies until someone chooses; the choice is saved as 'ma-theme' (shared by miguel-adan.com
   and the MADS reference) and applied early by ThemeInit.astro. */
if (!window.__madsTheme) {
  window.__madsTheme = true;
  const KEY = 'ma-theme';
  const root = document.documentElement;
  const mq = matchMedia('(prefers-color-scheme: dark)');
  const toggles = () => document.querySelectorAll('[data-theme-toggle]');
  const effective = () => root.getAttribute('data-theme') || (mq.matches ? 'dark' : 'light');
  const sync = () => toggles().forEach(b => {
    const dark = effective() === 'dark';
    b.setAttribute('aria-checked', String(dark));
    const label = dark ? b.dataset.labelDark : b.dataset.labelLight;
    if (label) b.setAttribute('aria-label', label);
    else b.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
  });
  toggles().forEach(b => b.addEventListener('click', () => {
    const next = effective() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
    sync();
  }));
  try { mq.addEventListener('change', sync); } catch (e) {}
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  sync();
}
