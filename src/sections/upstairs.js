import { html } from '../lib/dom.js';
import { photo } from '../lib/photo.js';

const values = [
  { title: 'Laid-back', text: 'Pull up a seat and stay a while.' },
  { title: 'Safe', text: 'A room where everyone should feel looked after.' },
  { title: 'Inclusive', text: 'Whoever you are, there’s space at the bar.' },
  { title: 'Independent', text: 'A platform for independent DJs and musicians.' },
];

export function upstairs() {
  return html`
  <section class="upstairs" id="upstairs" data-level="M" data-level-name="Upstairs">
    <div class="lamp lamp-a" aria-hidden="true"></div>
    <div class="lamp lamp-b" aria-hidden="true"></div>
    <div class="wrap">
      <p class="plaque" data-reveal>Upstairs</p>
      <h2 class="display upstairs-title" data-reveal>A home away from home, <em>just with more cocktails.</em></h2>

      <div class="upstairs-grid">
        <div class="upstairs-copy" data-reveal>
          <p class="lede">Mezzanine is a hidden gem inside Tooting Market. Go up the stairs and you’re in an intimate, cosy speakeasy, and the market below just slips away.</p>
          <p>It’s laid-back, safe and inclusive: somewhere to settle in with a proper drink, and a platform for the independent DJs and musicians who play here.</p>
        </div>
        <div class="upstairs-photos">
          ${photo('bar', 'photo-tall', 'The bar')}
          ${photo('room', 'photo-sq', 'The room')}
          ${photo('decks', 'photo-sq', 'The decks')}
        </div>
      </div>

      <ul class="values">
        ${values.map((v, i) => html`<li data-reveal style="--d:${i * 80}ms"><span class="values-num">0${i + 1}</span><h3>${v.title}</h3><p>${v.text}</p></li>`)}
      </ul>
    </div>
  </section>`;
}
