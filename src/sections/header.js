import { html } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { logo } from '../lib/logo.js';
import { venue, hours, fullAddress } from '../data/venue.js';

export const navItems = [
  { href: '#upstairs', label: 'Upstairs' },
  { href: '#drinks', label: 'Drinks' },
  { href: '#nights', label: 'Nights' },
  { href: '#hire', label: 'Private hire' },
  { href: '#find', label: 'Find us' },
];

export const brand = (cls = '') => html`<a class="brand ${cls}" href="#top" aria-label="Mezzanine, back to the top">${logo('', '')}</a>`;

export function header() {
  return html`
  <header class="site-header" data-header>
    <div class="site-header-inner">
      ${brand()}
      <p class="level" aria-hidden="true">
        <span class="level-floor" data-level-floor>G</span>
        <span class="level-name" data-level-name>Market level</span>
      </p>
      <nav class="nav" aria-label="Main">
        <ul>${navItems.map((n) => html`<li><a href="${n.href}" data-nav="${n.href.slice(1)}">${n.label}</a></li>`)}</ul>
      </nav>
      <a class="btn btn-small btn-wa header-wa" href="${venue.whatsapp.url}" target="_blank" rel="noopener">${icon('whatsapp')}<span>WhatsApp</span></a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" data-menu-open>
        <span class="menu-btn-label">Menu</span>${icon('menu')}
      </button>
    </div>
  </header>

  <div class="menu-panel" id="menu" role="dialog" aria-modal="true" aria-label="Menu" hidden data-menu>
    <div class="menu-panel-top">
      ${brand()}
      <button class="menu-close" type="button" aria-label="Close menu" data-menu-close>${icon('close')}</button>
    </div>
    <nav aria-label="Menu">
      <ol class="menu-links">
        ${navItems.map((n, i) => html`<li style="--i:${i}"><a href="${n.href}" data-menu-link><span class="menu-num">0${i + 1}</span>${n.label}</a></li>`)}
      </ol>
    </nav>
    <div class="menu-foot">
      <p>${hours.summary}</p>
      <p>${fullAddress}</p>
      <a class="btn btn-wa" href="${venue.whatsapp.url}" target="_blank" rel="noopener">${icon('whatsapp')} Message us on WhatsApp</a>
    </div>
  </div>

  <div class="gauge" aria-hidden="true" data-gauge>
    <span class="gauge-label gauge-top">M</span>
    <span class="gauge-track"><span class="gauge-fill" data-gauge-fill></span><span class="gauge-dot" data-gauge-dot></span></span>
    <span class="gauge-label gauge-bottom">G</span>
  </div>`;
}

export function dock() {
  return html`
  <nav class="dock" aria-label="Quick links" data-dock>
    <a href="#nights">${icon('calendar')}<span>What’s on</span></a>
    <a href="#hire">${icon('people')}<span>Hire</span></a>
    <a class="dock-wa" href="${venue.whatsapp.url}" target="_blank" rel="noopener" aria-label="WhatsApp us">${icon('whatsapp')}<span>WhatsApp</span></a>
  </nav>`;
}
