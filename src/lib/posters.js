// Generative poster art for each club series. Each one is a quiet nod to the
// name: liquid lines, ripples, a hush, light through a prism.

const W = 300, H = 380;

const liquid = (c) => {
  let d = '';
  for (let i = 0; i < 16; i++) {
    const y = 40 + i * 20;
    const amp = 10 + Math.sin(i * 0.7) * 8;
    d += `<path d="M-10 ${y} C 60 ${y - amp}, 110 ${y + amp}, 160 ${y} S 260 ${y - amp}, 320 ${y}" stroke="${c}" stroke-opacity="${(0.2 + (i % 5) * 0.14).toFixed(2)}" stroke-width="${i % 4 === 0 ? 2.4 : 1.2}" fill="none"/>`;
  }
  return d;
};

const ripple = (c) => {
  let d = '';
  for (let i = 1; i <= 13; i++) {
    d += `<circle cx="150" cy="250" r="${i * 17}" fill="none" stroke="${c}" stroke-opacity="${(1 - i / 15).toFixed(2)}" stroke-width="${i % 3 === 0 ? 2.4 : 1.1}"/>`;
  }
  return d + `<circle cx="150" cy="250" r="7" fill="${c}"/>`;
};

const quiet = (c) => {
  let d = '';
  for (let y = 0; y < 13; y++) {
    for (let x = 0; x < 10; x++) {
      const lit = (x * 7 + y * 3) % 11 === 0 || (x === 4 && y === 6) || (x === 5 && y === 6);
      d += `<circle cx="${30 + x * 27}" cy="${32 + y * 27}" r="${lit ? 6 : 2.2}" fill="${c}" fill-opacity="${lit ? 1 : 0.35}"/>`;
    }
  }
  return d;
};

const prism = (c) => {
  const cols = [c, '#f3e3c8', '#d79a92', '#8fb0bd', '#a8b88c'];
  let d = `<path d="M150 70 L226 210 L74 210 Z" fill="none" stroke="${c}" stroke-width="2"/>`;
  d += `<path d="M-10 170 L120 150" stroke="#f3e3c8" stroke-width="3"/>`;
  cols.forEach((col, i) => {
    d += `<path d="M178 150 L310 ${110 + i * 26}" stroke="${col}" stroke-width="${7 - i}" stroke-opacity=".85"/>`;
  });
  for (let i = 0; i < 7; i++) d += `<path d="M20 ${260 + i * 14} H${280 - i * 30}" stroke="${c}" stroke-opacity="${0.6 - i * 0.07}" stroke-width="1.2"/>`;
  return d;
};

const ART = { liquid, ripple, quiet, prism };

export function poster(series) {
  const fn = ART[series.art] || liquid;
  return `<svg class="poster-art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <defs><radialGradient id="pg-${series.id}" cx="50%" cy="30%" r="70%"><stop offset="0" stop-color="${series.accent}" stop-opacity=".22"/><stop offset="1" stop-color="${series.accent}" stop-opacity="0"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="#140706"/>
    <rect width="${W}" height="${H}" fill="url(#pg-${series.id})"/>
    ${fn(series.accent)}
  </svg>`;
}
