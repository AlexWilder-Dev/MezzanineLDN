import { $, reducedMotion } from './dom.js';
import { venue } from '../data/venue.js';

const ORIGIN = 'https://player.vimeo.com';

// Background venue video. The poster shows straight away; the player is
// added once the page has settled and only revealed when it's actually
// playing, so there's never a black box.
export function initHeroVideo() {
  const host = $('[data-hero-video]');
  const toggle = $('[data-video-toggle]');
  const hero = $('#top');
  if (!host) return;
  if (reducedMotion() || navigator.connection?.saveData) return;

  let iframe = null;
  let ready = false;
  let playing = false;
  let userPaused = false;

  const post = (method, value) => {
    if (!ready) return;
    iframe?.contentWindow?.postMessage(JSON.stringify(value === undefined ? { method } : { method, value }), ORIGIN);
  };

  const subscribe = () => {
    ready = true;
    post('addEventListener', 'play');
    post('addEventListener', 'pause');
    post('addEventListener', 'timeupdate');
  };

  const reveal = () => {
    if (!host.classList.contains('is-playing')) {
      host.classList.add('is-playing');
      if (toggle) toggle.hidden = false;
    }
    if (!playing) setPlaying(true);
  };

  const setPlaying = (on) => {
    playing = on;
    toggle?.setAttribute('aria-pressed', String(!on));
    toggle?.classList.toggle('is-paused', !on);
  };

  window.addEventListener('message', (e) => {
    if (e.origin !== ORIGIN || !iframe || e.source !== iframe.contentWindow) return;
    let d = e.data;
    if (typeof d === 'string') { try { d = JSON.parse(d); } catch { return; } }
    if (!d || typeof d !== 'object') return;
    if (d.event === 'ready') subscribe();
    if (d.event === 'play' || d.event === 'timeupdate') reveal();
    if (d.event === 'pause') setPlaying(false);
  });

  toggle?.addEventListener('click', () => {
    if (playing) { userPaused = true; post('pause'); setPlaying(false); }
    else { userPaused = false; post('play'); setPlaying(true); }
  });

  // Save battery once the hero is off screen.
  new IntersectionObserver(([e]) => {
    if (!iframe || userPaused) return;
    post(e.isIntersecting ? 'play' : 'pause');
  }).observe(hero);

  const load = () => {
    iframe = document.createElement('iframe');
    iframe.src = venue.heroVideo.src;
    iframe.title = 'Mezzanine venue video';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.setAttribute('tabindex', '-1');
    iframe.setAttribute('aria-hidden', 'true');
    // Nudge the player in case its `ready` message fired before we listened.
    iframe.addEventListener('load', () => {
      ready = true;
      post('ping');
      subscribe();
    }, { once: true });
    host.appendChild(iframe);
  };

  const later = () => ('requestIdleCallback' in window ? requestIdleCallback(load, { timeout: 1500 }) : setTimeout(load, 400));
  if (document.readyState === 'complete') later();
  else window.addEventListener('load', later, { once: true });
}

// Roller shutter that lifts on first visit, like the market opening up.
export function initShutter() {
  const el = $('[data-shutter]');
  if (!el) return;
  let seen = false;
  try { seen = sessionStorage.getItem('mz-shutter') === '1'; } catch { /* private mode */ }
  if (seen || reducedMotion()) { el.remove(); return; }
  try { sessionStorage.setItem('mz-shutter', '1'); } catch { /* ignore */ }
  document.documentElement.classList.add('is-opening');
  const lift = () => {
    el.classList.add('is-up');
    document.documentElement.classList.remove('is-opening');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 2000);
  };
  setTimeout(lift, 650);
}
