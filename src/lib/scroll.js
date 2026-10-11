import { $, $$, clamp, range, smooth, reducedMotion } from './dom.js';
import { createStairwell } from './stairwell.js';

// Header state, floor indicator, section reveals and the stair climb.
export function initScroll() {
  const root = document.documentElement;
  const header = $('[data-header]');
  const floorEl = $('[data-level-floor]');
  const nameEl = $('[data-level-name]');
  const climbEl = $('[data-climb]');
  const climbFill = $('[data-climb-fill]');
  const lines = $$('.climb-line');
  const canvas = $('[data-stair-canvas]');
  const still = reducedMotion();

  let elevation = 0;
  let climbTarget = 0;
  let climbShown = -1;
  let climbVisible = false;
  let raf = 0;

  const stair = canvas ? createStairwell(canvas) : null;

  const setLevel = (floor, name) => {
    if (floorEl && floorEl.textContent !== floor) floorEl.textContent = floor;
    if (nameEl && nameEl.textContent !== name) nameEl.textContent = name;
  };

  const lineState = (p) => {
    lines.forEach((el) => {
      const [a, b] = el.dataset.at.split(' ').map(Number);
      const o = Math.min(smooth(range(p, a, a + 0.06)), 1 - smooth(range(p, b - 0.06, b)));
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translate3d(0, ${((1 - o) * (p < (a + b) / 2 ? 18 : -18)).toFixed(1)}px, 0)`;
    });
  };

  function measure() {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 24);
    if (!climbEl) return;
    const r = climbEl.getBoundingClientRect();
    const span = climbEl.offsetHeight - window.innerHeight;
    climbTarget = span > 0 ? clamp(-r.top / span) : r.top < 0 ? 1 : 0;
    elevation = r.top > 0 ? 0 : climbTarget;
    root.style.setProperty('--climb', elevation.toFixed(3));
    if (climbFill) climbFill.style.transform = `scaleX(${climbTarget.toFixed(3)})`;
  }

  function frame() {
    raf = 0;
    if (!stair || still) return;
    const d = climbTarget - climbShown;
    climbShown = Math.abs(d) < 0.0008 || climbShown < 0 ? climbTarget : climbShown + d * 0.22;
    if (climbVisible) {
      stair.draw(climbShown);
      lineState(climbShown);
    }
    if (climbShown !== climbTarget) raf = requestAnimationFrame(frame);
  }

  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

  window.addEventListener('scroll', () => { measure(); kick(); }, { passive: true });
  window.addEventListener('resize', () => {
    stair?.resize();
    measure();
    if (still && stair) stair.draw(0.4);
    climbShown = -1;
    kick();
  });

  if (climbEl && stair) {
    if (still) {
      climbEl.classList.add('is-still');
      requestAnimationFrame(() => { stair.resize(); stair.draw(0.4); });
      lines.forEach((el) => { el.style.opacity = 1; });
    } else {
      new IntersectionObserver(([e]) => {
        climbVisible = e.isIntersecting;
        if (climbVisible) { climbShown = -1; kick(); }
      }, { rootMargin: '100px 0px' }).observe(climbEl);
    }
    document.fonts?.ready.then(() => { climbShown = -1; still ? stair.draw(0.4) : kick(); });
  }

  // Which room are we in?
  const sections = $$('[data-level]');
  const navLinks = $$('[data-nav]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const s = e.target;
      setLevel(s.dataset.level === '½' ? '½' : s.dataset.level, s.dataset.levelName);
      root.dataset.room = s.id;
      navLinks.forEach((a) => {
        if (a.dataset.nav === s.id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -54% 0px' });
  sections.forEach((s) => io.observe(s));

  // Gentle reveals
  const reveals = $$('[data-reveal]');
  if (still || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const rio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => rio.observe(el));
  }

  // Quick-links dock: only once you're past the hero, and out of the way of forms and the footer.
  const dock = $('[data-dock]');
  if (dock) {
    const state = { pastHero: false, blocked: new Set() };
    const apply = () => dock.classList.toggle('is-shown', state.pastHero && state.blocked.size === 0);
    new IntersectionObserver(([e]) => { state.pastHero = !e.isIntersecting; apply(); }).observe($('#top'));
    const bio = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? state.blocked.add(e.target) : state.blocked.delete(e.target)));
      apply();
    });
    $$('[data-climb], .site-footer, [data-enquiry], [data-enquiry-done]').forEach((el) => bio.observe(el));
  }

  measure();
  kick();
}
