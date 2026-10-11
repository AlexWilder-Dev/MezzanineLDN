import { html } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { venue, hours } from '../data/venue.js';

export function hero() {
  return html`
  <section class="hero" id="top" data-level="G" data-level-name="Market level">
    <div class="hero-media" aria-hidden="true">
      <div class="hero-poster" style="background-image:url('${venue.heroVideo.poster}')"></div>
      <div class="hero-video" data-hero-video></div>
      <div class="hero-tint"></div>
      <div class="hero-grille"></div>
    </div>

    <div class="hero-tubes" aria-hidden="true"><span></span><span></span></div>

    <div class="hero-inner wrap">
      <p class="hero-sign" aria-hidden="true">
        <span class="hero-sign-unit">Unit 4</span>
        <span class="hero-sign-up">Upstairs ${icon('arrowUp')}</span>
      </p>
      <div class="hero-copy">
        <p class="eyebrow eyebrow-market">Tooting Market · London SW17</p>
        <h1 class="hero-title"><span class="hero-title-word">Mezzanine</span><span class="sr-only">: cocktail bar and DJ venue upstairs in Tooting Market</span></h1>
        <p class="hero-lede">Homemade cocktails, aperitivo boards and independent DJs, hidden up the stairs in the middle of the market.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#nights">What’s on ${icon('arrowRight')}</a>
          <a class="btn btn-ghost" href="#hire">Hire the venue</a>
        </div>
        <ul class="hero-facts">
          <li><span class="pulse" aria-hidden="true"></span>${hours.short}</li>
          <li>${hours.late}</li>
          <li>${icon('train')}${venue.tube.station} · ${venue.tube.walk.toLowerCase()}</li>
        </ul>
      </div>
    </div>

    <a class="hero-cue" href="#stairs">
      <span class="hero-cue-steps" aria-hidden="true"><i></i><i></i><i></i></span>
      <span>Take the stairs</span>
    </a>
    <button class="video-toggle" type="button" data-video-toggle hidden aria-pressed="false">
      <span class="video-toggle-pause">${icon('pause')}<span class="sr-only">Pause background video</span></span>
      <span class="video-toggle-play">${icon('play')}<span class="sr-only">Play background video</span></span>
    </button>
  </section>

  <div class="shutter" aria-hidden="true" data-shutter>
    <div class="shutter-slats"></div>
    <p class="shutter-tag">Mezzanine <span>Unit 4 · up the stairs</span></p>
  </div>`;
}

export function climb() {
  const lines = [
    { at: '0.02 0.24', text: 'Somewhere in Tooting Market, there’s a staircase.' },
    { at: '0.28 0.50', text: 'Leave the market noise downstairs.' },
    { at: '0.54 0.76', text: 'Follow the warm light up…' },
    { at: '0.9 1.4', text: '…and forget you’re in a market.' },
  ];
  return html`
  <section class="climb" id="stairs" data-level="½" data-level-name="The stairs" aria-label="Up the stairs" data-climb>
    <div class="climb-sticky">
      <canvas class="climb-canvas" data-stair-canvas aria-hidden="true"></canvas>
      <div class="climb-lines">
        ${lines.map((l, i) => html`<p class="climb-line climb-line-${i}" data-at="${l.at}">${l.text}</p>`)}
      </div>
      <div class="climb-meter" aria-hidden="true">
        <span>Market</span>
        <span class="climb-meter-track"><span data-climb-fill></span></span>
        <span>Mezzanine</span>
      </div>
    </div>
  </section>`;
}
