export function mount(root) {
  const capsule = root.querySelector('.capsule');
  const links = root.querySelector('.links');
  const toggle = root.querySelector('.nav-toggle');
  const menu = root.querySelector('.menu');
  if (!capsule || !links || !toggle || !menu) return;

  let hovered = false;
  const update = () => {
    const collapsed = window.scrollY > 8 && !hovered && innerWidth >= 1200;
    root.classList.toggle('is-collapsed', collapsed);
    links.setAttribute('aria-hidden', String(collapsed));
    links.inert = collapsed;
  };
  const wideMouse = (e) => e.pointerType === 'mouse' && innerWidth >= 1200;
  capsule.addEventListener('pointerenter', (e) => { if (wideMouse(e)) { hovered = true; update(); } });
  capsule.addEventListener('pointerleave', (e) => { if (wideMouse(e)) { hovered = false; update(); } });
  addEventListener('scroll', update, { passive: true });

  const setOpen = (open) => {
    root.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
  };
  setOpen(false);
  const syncToggle = () => {
    toggle.tabIndex = innerWidth < 1200 ? 0 : -1;
    if (innerWidth >= 1200) setOpen(false);
    update();
  };
  syncToggle();
  addEventListener('resize', syncToggle);
  toggle.addEventListener('click', () => {
    if (innerWidth < 1200) setOpen(!root.classList.contains('is-open'));
  });
  root.querySelectorAll('.menu a, .logo').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('pointerdown', (e) => { if (!root.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}
