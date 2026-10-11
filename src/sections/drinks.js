import { html, raw } from '../lib/dom.js';
import { photo } from '../lib/photo.js';
import { cocktails, menuStyles, boards, zeroWaste, cocktailRange, formatPrice } from '../data/menu.js';

const lemon = () => {
  const cx = 92, cy = 104, r = 66;
  const wedges = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    return `<path d="M${cx} ${cy}L${(cx + Math.cos(a) * (r - 13)).toFixed(1)} ${(cy + Math.sin(a) * (r - 13)).toFixed(1)}"/>`;
  }).join('');
  return raw(`<svg class="lemon" viewBox="0 0 340 210" role="img" aria-label="A halved lemon: juice, peel and husk all get used">
    <circle class="lemon-flesh" cx="${cx}" cy="${cy}" r="${r - 12}"/>
    <circle class="lemon-peel" cx="${cx}" cy="${cy}" r="${r}"/>
    <circle class="lemon-pith" cx="${cx}" cy="${cy}" r="${r - 12}"/>
    <g class="lemon-wedges">${wedges}</g>
    <circle class="lemon-core" cx="${cx}" cy="${cy}" r="5"/>
    <g class="lemon-leaders">
      <path d="M${cx + 18} ${cy - 22}C150 50 180 46 214 46"/>
      <path d="M${cx + r - 4} ${cy + 4}C175 104 190 104 214 104"/>
      <path d="M${cx + 40} ${cy + 48}C160 168 186 162 214 162"/>
    </g>
    <g class="lemon-dots">
      <circle cx="${cx + 18}" cy="${cy - 22}" r="4"/><circle cx="${cx + r - 4}" cy="${cy + 4}" r="4"/><circle cx="${cx + 40}" cy="${cy + 48}" r="4"/>
    </g>
    <g class="lemon-labels">
      ${zeroWaste.parts.map((p, i) => `<text x="224" y="${52 + i * 58}">${p}</text>`).join('')}
    </g>
  </svg>`);
};

export function drinks() {
  return html`
  <section class="drinks" id="drinks" data-level="M" data-level-name="Drinks">
    <div class="wrap">
      <header class="section-head">
        <p class="plaque" data-reveal>Drinks &amp; boards</p>
        <h2 class="display" data-reveal>Proper cocktails. <em>Fair prices.</em></h2>
        <p class="section-sub" data-reveal>Homemade cocktails from ${formatPrice(cocktailRange.from)} to ${formatPrice(cocktailRange.to)}, plus aperitivo boards to share.</p>
      </header>

      <div class="drinks-grid">
        <article class="menu-card" data-reveal aria-labelledby="menu-title">
          <div class="menu-card-head">
            <h3 id="menu-title">Cocktails</h3>
            <p class="menu-range">${formatPrice(cocktailRange.from)}–${formatPrice(cocktailRange.to)}</p>
          </div>
          <div class="menu-tabs" role="group" aria-label="Filter cocktails by style">
            ${menuStyles.map((s, i) => html`<button type="button" class="chip" aria-pressed="${i === 0}" data-menu-style="${s.id}">${s.label}</button>`)}
          </div>
          <ul class="menu-list" data-menu-list>
            ${cocktails.map((c) => html`<li class="menu-item" data-style="${c.style}">
              <p class="menu-item-line"><span class="menu-item-name">${c.name}</span><span class="menu-item-dots" aria-hidden="true"></span><span class="menu-item-price">${formatPrice(c.price)}</span></p>
              <p class="menu-item-spec">${c.spec}</p>
            </li>`)}
          </ul>
          <p class="menu-note">Sample menu of classics in our price range. Ask at the bar for what’s being made tonight.</p>
        </article>

        <div class="drinks-side">
        ${photo('cocktails', 'drinks-photo')}
        <aside class="zero" data-reveal>
          <p class="zero-kicker">Zero-waste bar</p>
          <h3 class="zero-title">${zeroWaste.title}</h3>
          ${lemon()}
          <p>${zeroWaste.body}</p>
        </aside>
        </div>
      </div>

      <div class="boards">
        <div class="boards-intro" data-reveal>
          <h3 class="boards-title">Aperitivo boards</h3>
          <p>Something to pick at between rounds. Built for sharing.</p>
        </div>
        ${photo('board', 'boards-photo')}
        <ul class="boards-list">
          ${boards.map((b) => html`<li class="board-card" data-reveal>
            <span class="board-name">${b.name}</span>
            <span class="board-price">${formatPrice(b.price)}</span>
          </li>`)}
        </ul>
      </div>
    </div>
  </section>`;
}
