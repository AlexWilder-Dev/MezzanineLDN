import { html, raw } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { logo } from '../lib/logo.js';
import { photo } from '../lib/photo.js';
import { venue, hours, fullAddress, mapsLinks } from '../data/venue.js';
import { brand } from './header.js';

const routeMap = () =>
  raw(`<svg class="route" viewBox="0 0 400 310" role="img" aria-labelledby="route-title route-desc">
  <title id="route-title">How to find Mezzanine</title>
  <desc id="route-desc">From Tooting Broadway station on the Northern line, a short walk to Tooting Market, then up the stairs to Unit 4.</desc>
  <g class="route-line">
    <path d="M118 14V296"/>
    <path class="route-tick" d="M118 54h-12M118 246h-12"/>
  </g>
  <text x="100" y="58" text-anchor="end" class="route-dim">Tooting Bec</text>
  <text x="100" y="250" text-anchor="end" class="route-dim">Colliers Wood</text>
  <text x="100" y="146" text-anchor="end" class="route-strong">Tooting</text>
  <text x="100" y="164" text-anchor="end" class="route-strong">Broadway</text>
  <text x="128" y="292" class="route-dim route-small">Northern line</text>
  <circle class="route-station" cx="118" cy="150" r="10"/>
  <path class="route-walk" d="M134 150H236"/>
  <text x="185" y="138" text-anchor="middle" class="route-small route-accent">short walk</text>
  <g class="route-market">
    <path d="M236 112h144v120H236z"/>
    <path d="M236 112l14-14h116l14 14"/>
    <path class="route-awning" d="M236 112q9 10 18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0"/>
  </g>
  <text x="308" y="254" text-anchor="middle" class="route-strong route-small">Tooting Market</text>
  <path class="route-stairs" d="M252 218h14v-14h14v-14h14v-14h14v-14h14v-14h14"/>
  <circle class="route-glow" cx="356" cy="130" r="20"/>
  <circle class="route-here" cx="356" cy="130" r="6"/>
  <text x="308" y="52" text-anchor="middle" class="route-small route-accent">Unit 4 · upstairs</text>
  <text x="308" y="84" text-anchor="middle" class="route-brand">Mezzanine</text>
</svg>`);

export function find() {
  return html`
  <section class="find" id="find" data-level="M" data-level-name="Find us">
    <div class="wrap find-grid">
      <div class="find-info">
        <p class="plaque" data-reveal>Find us</p>
        <h2 class="display" data-reveal>Up the stairs <em>at Unit 4.</em></h2>

        <address class="address" data-reveal>
          <span>${venue.address.unit}</span>
          <span>${venue.address.street}</span>
          <span>${venue.address.city} ${venue.address.postcode}</span>
        </address>

        <div class="find-actions" data-reveal>
          <a class="btn btn-primary" href="${mapsLinks.google}" target="_blank" rel="noopener">${icon('pin')} Google Maps</a>
          <a class="btn btn-ghost" href="${mapsLinks.apple}" target="_blank" rel="noopener">Apple Maps</a>
          <button class="btn btn-quiet" type="button" data-copy="${fullAddress}">${icon('copy')}<span data-copy-label>Copy address</span></button>
        </div>

        <dl class="find-facts" data-reveal>
          <div><dt>${icon('train')} Tube</dt><dd>${venue.tube.station} (${venue.tube.line}), ${venue.tube.walk.toLowerCase()}</dd></div>
          <div><dt>${icon('clock')} Hours</dt><dd>${hours.summary}</dd></div>
          <div><dt>${icon('stairs')} Getting in</dt><dd>Inside Tooting Market. Find Unit 4, then follow the lit arrow up the stairs.</dd></div>
        </dl>
      </div>

      <div class="find-side">
        ${photo('stairs', 'find-photo', 'Follow the arrow')}
        <figure class="route-card" data-reveal>${routeMap()}</figure>
        <ul class="socials" data-reveal>
          ${venue.socials.map((s) => html`<li><a href="${s.url}" target="_blank" rel="noopener">${icon(s.id)}<span class="socials-label">${s.label}</span><span class="socials-handle">${s.handle}</span></a></li>`)}
          <li><a href="${venue.whatsapp.url}" target="_blank" rel="noopener">${icon('whatsapp')}<span class="socials-label">WhatsApp</span><span class="socials-handle">${venue.whatsapp.display}</span></a></li>
        </ul>
      </div>
    </div>
  </section>`;
}

export function footer() {
  return html`
  <footer class="site-footer">
    <div class="wrap">
      <p class="footer-word">${logo('', '')}</p>
      <div class="footer-grid">
        <div>
          <h2 class="footer-h">Visit</h2>
          <p>${venue.address.unit}<br>${venue.address.street}<br>${venue.address.city} ${venue.address.postcode}</p>
        </div>
        <div>
          <h2 class="footer-h">Hours</h2>
          <p>${hours.short}<br>${hours.late}<br>${hours.eventNights}</p>
        </div>
        <div>
          <h2 class="footer-h">Say hello</h2>
          <p><a href="${venue.whatsapp.url}" target="_blank" rel="noopener">WhatsApp ${venue.whatsapp.display}</a><br>${venue.whatsapp.promise}</p>
        </div>
        <div>
          <h2 class="footer-h">Follow</h2>
          <p>${venue.socials.map((s) => html`<a href="${s.url}" target="_blank" rel="noopener">${s.label} ${s.handle}</a><br>`)}</p>
        </div>
      </div>
      <div class="footer-base">
        ${brand('brand-small')}
        <a class="footer-down" href="#top">${icon('arrowUp')} Back down to the market</a>
      </div>
    </div>
  </footer>`;
}
