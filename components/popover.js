/* mads.popover behaviour, shared by every page that uses Popover.astro (IdeasMenu, SettingsMenu):
   each round button shows and hides its card; only one card is open at a time; a card closes on a second press,
   a tap or click outside it, Esc (focus goes back to its button), when focus moves out of it, and when the page
   comes back from the browser's back/forward cache. */
if (!window.__madsPopover) {
  window.__madsPopover = true;
  const pops = [...document.querySelectorAll('[data-mads-popover]')]
    .map(wrap => ({ wrap, btn: wrap.querySelector('.mads-popover-button'), card: wrap.querySelector('.mads-popover-card') }))
    .filter(p => p.btn && p.card);
  const isOpen = p => p.card.classList.contains('is-open');
  const set = (p, open) => { p.card.classList.toggle('is-open', open); p.btn.setAttribute('aria-expanded', String(open)); };
  pops.forEach(p => {
    p.btn.addEventListener('click', () => { const open = !isOpen(p); pops.forEach(o => { if (o !== p) set(o, false); }); set(p, open); });
    p.wrap.addEventListener('focusout', e => { if (isOpen(p) && e.relatedTarget && !p.wrap.contains(e.relatedTarget)) set(p, false); });
  });
  document.addEventListener('pointerdown', e => pops.forEach(p => { if (isOpen(p) && !p.wrap.contains(e.target)) set(p, false); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') pops.forEach(p => { if (isOpen(p)) { set(p, false); p.btn.focus(); } }); });
  addEventListener('pageshow', e => { if (e.persisted) pops.forEach(p => set(p, false)); });
}
