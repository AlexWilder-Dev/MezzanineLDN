// Line-art scenes in brass on oxblood, used under every photo slot.
// They read as finished illustration on their own and sit behind the real
// photo once one is added.

let uid = 0;

const bokeh = (id, seed, n = 9) => {
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let out = '';
  for (let i = 0; i < n; i++) {
    const r = 10 + rnd() * 34;
    out += `<circle cx="${(rnd() * 400).toFixed(1)}" cy="${(rnd() * 300).toFixed(1)}" r="${r.toFixed(1)}" fill="url(#bk${id})" opacity="${(0.25 + rnd() * 0.5).toFixed(2)}"/>`;
  }
  return out;
};

// points along a sagging festoon line between (x0,y0) and (x1,y1)
const festoon = (x0, y0, x1, y1, sag, n) =>
  Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n;
    return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + Math.sin(Math.PI * t) * sag];
  });

const coupe = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})">
  <path d="M-42 0h84q-4 38-42 40-38-2-42-40z"/><path d="M-34 14h68" class="art-faint"/>
  <path d="M0 40v52M-26 96q26-9 52 0"/></g>`;

const scenes = {
  party: (id) => {
    const lines = [[-10, 40, 410, 70, 70, 9], [-10, 120, 410, 100, 60, 8]];
    return `
    <g class="art-line">
      ${lines.map(([a, b, c, d, sag]) => `<path d="M${a} ${b} Q200 ${(b + d) / 2 + sag * 2} ${c} ${d}" class="art-faint"/>`).join('')}
      ${coupe(160, 280, 16)}${coupe(240, 280, -16)}
      <path d="M200 270v-18M186 276l-10-10M214 276l10-10"/>
    </g>
    ${lines.map(([a, b, c, d, sag, n]) => festoon(a, b, c, d, sag, n).map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${(y + 9).toFixed(1)}" r="16" fill="url(#bk${id})"/><circle cx="${x.toFixed(1)}" cy="${(y + 9).toFixed(1)}" r="4.5" fill="#ffd9a0"/>`).join('')).join('')}`;
  },

  room: () => `
    <g class="art-line">
      <path d="M40 92h320M40 152h320M40 212h320"/>
      ${[52, 68, 80, 100, 114, 140, 158, 170, 196, 214, 236, 250, 270, 292, 304, 326, 340]
        .map((x, i) => {
          const h = [34, 26, 40, 30, 22, 38, 28, 34, 24, 40, 30, 26, 36, 22, 32, 40, 28][i];
          return `<path d="M${x} 92v-${h - 10}q0-6 4-8v-${Math.max(0, h * 0.18).toFixed(0)}h3v${Math.max(0, h * 0.18).toFixed(0)}q4 2 4 8v${h - 10}" />`;
        })
        .join('')}
      ${[56, 84, 120, 150, 182, 220, 248, 280, 310, 338]
        .map((x, i) => `<rect x="${x}" y="${152 - [26, 20, 30, 22, 28, 18, 30, 24, 20, 26][i]}" width="${[14, 18, 12, 16, 14, 20, 12, 16, 18, 12][i]}" height="${[26, 20, 30, 22, 28, 18, 30, 24, 20, 26][i]}" rx="3"/>`)
        .join('')}
      <path d="M20 300h360M28 300v170M372 300v170M20 318h360"/>
      <path d="M120 0v40M280 0v56"/>
      <path d="M100 40h40l-6-10h-28zM260 56h40l-6-10h-28z"/>
      <path d="M150 300c0-22 10-34 22-34h4c12 0 22 12 22 34" />
      <path d="M180 266v-26M168 240h24"/>
      <path d="M236 300v-38l18-14v52"/>
    </g>
    <ellipse class="art-glow" cx="120" cy="60" rx="90" ry="60"/>
    <ellipse class="art-glow" cx="280" cy="76" rx="90" ry="60"/>`,

  bar: () => `
    <g class="art-line">
      <path d="M150 140h70l-8 220h-54z"/>
      <path d="M150 140q35-22 70 0M162 118h46l4 22h-54z"/>
      <path d="M176 118v-16h18v16"/>
      <path d="M248 250h70M250 250l10 50h50l10-50M268 300v60M300 300v60M258 360h52"/>
      <circle cx="98" cy="320" r="44"/><circle cx="98" cy="320" r="36"/>
      ${Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return `<path d="M98 320L${(98 + Math.cos(a) * 34).toFixed(1)} ${(320 + Math.sin(a) * 34).toFixed(1)}"/>`;
      }).join('')}
      <path d="M40 400h330"/>
    </g>
    <ellipse class="art-glow" cx="200" cy="120" rx="140" ry="90"/>`,

  decks: () => `
    <g class="art-line">
      <rect x="44" y="110" width="312" height="300" rx="14"/>
      <circle cx="180" cy="260" r="118"/>
      ${[104, 92, 80, 68, 56, 44].map((r) => `<circle cx="180" cy="260" r="${r}" class="art-faint"/>`).join('')}
      <circle cx="180" cy="260" r="26"/><circle cx="180" cy="260" r="4"/>
      <path d="M320 140v150l-34 44-40-6"/>
      <circle cx="320" cy="140" r="12"/>
      <rect x="306" y="350" width="30" height="40" rx="4"/>
      <path d="M321 356v28" class="art-faint"/>
    </g>
    <ellipse class="art-glow" cx="180" cy="260" rx="160" ry="140"/>`,

  coupe: () => `
    <g class="art-line" transform="translate(0 -36)">
      <path d="M100 170h200q-6 86-100 92-94-6-100-92z"/>
      <path d="M118 196h164" class="art-faint"/>
      <path d="M200 262v112M150 380q50-16 100 0"/>
      <path d="M262 168c18-40 46-52 74-46"/>
      <path d="M262 168c10-26 34-40 64-38" class="art-faint"/>
    </g>
    <ellipse class="art-glow" cx="200" cy="180" rx="150" ry="100"/>`,

  board: () => `
    <g class="art-line">
      <path d="M60 170h236a54 54 0 0 1 0 108H60a20 20 0 0 1-20-20v-68a20 20 0 0 1 20-20z" transform="rotate(-8 200 224)"/>
      <path d="M350 214h30" transform="rotate(-8 200 224)"/>
      <g transform="rotate(-8 200 224)">
        <circle cx="96" cy="206" r="18"/><circle cx="96" cy="206" r="10" class="art-faint"/>
        <circle cx="136" cy="246" r="18"/><circle cx="136" cy="246" r="10" class="art-faint"/>
        <path d="M168 196l50 10-46 28z"/>
        <path d="M228 238q20-30 52-14"/><path d="M234 252q20-26 50-12"/>
        <circle cx="300" cy="200" r="7"/><circle cx="316" cy="212" r="7"/><circle cx="302" cy="222" r="7"/>
      </g>
    </g>
    <ellipse class="art-glow" cx="200" cy="230" rx="170" ry="110"/>`,
};

export function art(kind = 'room') {
  const id = ++uid;
  const scene = (scenes[kind] || scenes.room)(id);
  return `<svg class="art art-${kind}" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="bg${id}" cx="50%" cy="38%" r="75%">
        <stop offset="0" stop-color="#6b1410"/><stop offset=".55" stop-color="#3a0b09"/><stop offset="1" stop-color="#1a0605"/>
      </radialGradient>
      <radialGradient id="bk${id}"><stop offset="0" stop-color="#f2b766" stop-opacity=".55"/><stop offset="1" stop-color="#f2b766" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="400" height="500" fill="url(#bg${id})"/>
    ${bokeh(id, id * 97 + kind.length * 13)}
    ${scene}
  </svg>`;
}
