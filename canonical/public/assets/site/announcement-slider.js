// Site-only progressive enhancement. Publication and media gates run in PHP.
(() => {
  'use strict';
  document.querySelectorAll('[data-announcement-slider]').forEach(root => {
    const slides = [...root.querySelectorAll('[data-announcement-slide]')];
    if (slides.length < 2) return;
    const stage = root.querySelector('.announcement-stage');
    const controls = root.querySelector('[data-announcement-controls]');
    const dots = [...root.querySelectorAll('[data-announcement-select]')];
    const playback = root.querySelector('[data-announcement-playback]');
    const status = root.querySelector('[data-announcement-status]');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0, timer, paused = false, hovered = root.matches(':hover'), focused = root.contains(document.activeElement), pointer;
    const schedule = () => {
      clearTimeout(timer);
      if (!paused && !hovered && !focused && !document.hidden && !motion.matches) {
        timer = setTimeout(() => select(index + 1, false), 6000);
      }
    };
    const select = (target, announce = true) => {
      const next = (target + slides.length) % slides.length;
      if (next !== index && slides[index].contains(document.activeElement)) stage.focus({preventScroll: true});
      index = next;
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === index);
        slide.inert = i !== index;
        slide.setAttribute('aria-hidden', String(i !== index));
        dots[i].setAttribute('aria-current', String(i === index));
      });
      // Automatic changes stay silent; manual navigation announces position.
      status.textContent = announce ? slides[index].getAttribute('aria-label') : '';
      schedule();
    };
    const updatePlayback = () => {
      playback.disabled = motion.matches;
      playback.textContent = motion.matches ? playback.dataset.reduced : paused ? playback.dataset.resume : playback.dataset.pause;
      schedule();
    };
    // All slides share a grid cell, reserving the tallest content before transitions.
    slides.forEach(slide => { slide.hidden = false; });
    controls.hidden = false;
    root.querySelectorAll('[data-announcement-step]').forEach(button => {
      button.addEventListener('click', () => select(index + Number(button.dataset.announcementStep)));
    });
    dots.forEach((button, i) => button.addEventListener('click', () => select(i)));
    playback.addEventListener('click', () => { paused = !paused; updatePlayback(); });
    root.addEventListener('mouseenter', () => { hovered = true; schedule(); });
    root.addEventListener('mouseleave', () => { hovered = false; schedule(); });
    root.addEventListener('focusin', () => { focused = true; schedule(); });
    root.addEventListener('focusout', event => { focused = root.contains(event.relatedTarget); schedule(); });
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', updatePlayback);
    window.addEventListener('pagehide', () => clearTimeout(timer));
    window.addEventListener('pageshow', schedule);
    root.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
      const rtl = getComputedStyle(root).direction === 'rtl';
      const targets = {ArrowLeft: index + (rtl ? 1 : -1), ArrowRight: index + (rtl ? -1 : 1), Home: 0, End: slides.length - 1};
      if (Object.hasOwn(targets, event.key)) { event.preventDefault(); select(targets[event.key]); }
    });
    stage.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch' && event.isPrimary) pointer = {id: event.pointerId, x: event.clientX, y: event.clientY};
    });
    stage.addEventListener('pointercancel', () => { pointer = null; });
    stage.addEventListener('pointerup', event => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
      pointer = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        const rtl = getComputedStyle(root).direction === 'rtl';
        select(index + ((dx < 0) !== rtl ? 1 : -1));
      }
    });
    select(0, false);
    updatePlayback();
  });
})();
