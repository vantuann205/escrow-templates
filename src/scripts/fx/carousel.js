const AUTOPLAY_DELAY = 5000;

export function mount(section) {
  const viewport = section.querySelector('.changes-viewport');
  const track = section.querySelector('.changes-track');
  const cards = [...section.querySelectorAll('.changes-card')];
  if (!viewport || !track || cards.length < 2) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let focused = false;
  let touching = false;
  let userActive = false;
  let timer;
  let resumeTimer;
  let drag;

  const isInView = () => {
    const box = viewport.getBoundingClientRect();
    return box.bottom > 0 && box.top < innerHeight && box.right > 0 && box.left < innerWidth;
  };

  const updateEndSpace = () => {
    const style = getComputedStyle(viewport);
    const available = viewport.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    track.style.paddingInlineEnd = `${Math.max(0, available - cards[cards.length - 1].getBoundingClientRect().width)}px`;
  };

  const currentIndex = () => {
    const box = viewport.getBoundingClientRect();
    const style = getComputedStyle(viewport);
    const center = box.left + viewport.clientLeft + parseFloat(style.paddingLeft) + (viewport.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)) / 2;
    return cards.reduce((nearest, card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left + card.clientWidth / 2 - center);
      return distance <= nearest.distance ? { index, distance } : nearest;
    }, { index: 0, distance: Infinity }).index;
  };

  const goTo = (index) => {
    const box = viewport.getBoundingClientRect();
    const left = viewport.scrollLeft + cards[index].getBoundingClientRect().left - box.left - viewport.clientLeft;
    viewport.scrollTo({ left, behavior: motion.matches ? 'auto' : 'smooth' });
  };

  const schedule = () => {
    clearTimeout(timer);
    if (!isInView() || focused || touching || userActive || drag || motion.matches || document.hidden) return;
    timer = setTimeout(() => {
      goTo((currentIndex() + 1) % cards.length);
      schedule();
    }, AUTOPLAY_DELAY);
  };

  const pauseAfterInput = () => {
    userActive = true;
    schedule();
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { userActive = false; schedule(); }, 1200);
  };

  viewport.addEventListener('focusin', () => { focused = true; schedule(); });
  viewport.addEventListener('focusout', (event) => {
    if (!viewport.contains(event.relatedTarget)) { focused = false; schedule(); }
  });
  viewport.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey) pauseAfterInput();
  }, { passive: true });
  viewport.addEventListener('touchstart', () => { touching = true; schedule(); }, { passive: true });
  const endTouch = () => { touching = false; focused = false; schedule(); };
  viewport.addEventListener('touchend', endTouch, { passive: true });
  viewport.addEventListener('touchcancel', endTouch, { passive: true });

  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, scrollLeft: viewport.scrollLeft };
    schedule();
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener('pointermove', (event) => {
    if (drag?.id !== event.pointerId) return;
    viewport.scrollLeft = drag.scrollLeft + drag.x - event.clientX;
  });
  const endDrag = (event) => {
    if (drag?.id !== event.pointerId) return;
    drag = undefined;
    focused = false;
    viewport.classList.remove('is-dragging');
    schedule();
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  motion.addEventListener('change', schedule);
  document.addEventListener('visibilitychange', schedule);
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', () => { updateEndSpace(); schedule(); });
  updateEndSpace();
  schedule();
}
