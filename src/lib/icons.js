import { raw } from './dom.js';

const P = {
  whatsapp:
    '<path d="M20.5 11.6a8.6 8.6 0 0 1-12.7 7.5L3.5 20.4l1.3-4.1a8.6 8.6 0 1 1 15.7-4.7z"/><path fill="currentColor" stroke="none" d="M9.1 7.9c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .5.6 1 1.4 1.8 2.4 2.3.2.1.4.1.5 0l.6-.7c.2-.2.4-.2.6-.1l1.7.8c.2.1.3.3.3.5v.5c0 .4-.2.7-.6.9-.6.3-1.4.4-2.1.2-2.2-.6-4-2.5-4.7-4.7-.2-.9-.1-1.7.3-2.4z"/>',
  instagram:
    '<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none"/>',
  tiktok: '<path d="M14.2 3.2v11.6a3.6 3.6 0 1 1-3.6-3.6"/><path d="M14.2 3.2c.4 2.5 2.1 4.2 4.8 4.4"/>',
  arrowUpRight: '<path d="M7 17 17 7M8.5 7H17v8.5"/>',
  arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
  ticket: '<path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h14a1.5 1.5 0 0 1 1.5 1.5V10a2 2 0 0 0 0 4v2.5A1.5 1.5 0 0 1 19 18H5a1.5 1.5 0 0 1-1.5-1.5V14a2 2 0 0 0 0-4z"/><path d="M14.5 6.5v11" stroke-dasharray="1.6 1.8"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  speaker: '<rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="14.5" r="3.2"/><circle cx="12" cy="7.3" r="1.3"/>',
  decks: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><circle cx="9.5" cy="12" r="4.5"/><circle cx="9.5" cy="12" r="1"/><path d="M17.5 7.5v6.5l-2 2"/>',
  projector: '<rect x="2.5" y="8" width="19" height="9" rx="2"/><circle cx="15.5" cy="12.5" r="2.6"/><path d="M6 11.5h4M6 18v1.5M18 18v1.5"/>',
  access: '<circle cx="12" cy="4.6" r="1.6"/><path d="M12 7.5v6h5l2 5"/><path d="M8.6 10.6a5.5 5.5 0 1 0 7.6 7.3"/>',
  board: '<path d="M4 9.5h13a3.5 3.5 0 0 1 0 7H4a1.5 1.5 0 0 1-1.5-1.5v-4A1.5 1.5 0 0 1 4 9.5z"/><path d="M20.4 13H22"/><circle cx="7.5" cy="13" r="1.4"/><circle cx="12" cy="13" r="1.4"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  train: '<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 10.5h14M9 17l-2.5 4M15 17l2.5 4"/><circle cx="9" cy="13.7" r=".6" fill="currentColor"/><circle cx="15" cy="13.7" r=".6" fill="currentColor"/>',
  walk: '<circle cx="13" cy="4.5" r="1.7"/><path d="m9 21 2.5-6.5 2.5 2.5V21M8 11.5l2-3.5 3.5 1 2 3h2.5M11.5 14.5l1-5.5"/>',
  stairs: '<path d="M3 20h4.5v-4.5H12V11h4.5V6.5H21"/>',
  copy: '<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M15.5 8.5V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5"/>',
  check: '<path d="m4.5 12.5 5 5 10-11"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>',
  pause: '<path d="M8 5.5v13M16 5.5v13" stroke-width="2.6"/>',
  share: '<path d="M12 15V3.5M7.5 8 12 3.5 16.5 8"/><path d="M5 12v7.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V12"/>',
  people: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.4a4.5 4.5 0 0 1 5 5.1"/>',
  chair: '<path d="M7 3.5v9h10v-9M5.5 12.5h13M7 12.5V21M17 12.5V21M7 17h10"/>',
};

export function icon(name, cls = '') {
  return raw(
    `<svg class="icon ${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[name] || ''}</svg>`,
  );
}

// Monogram: an M built from two flights of stairs meeting on a landing.
export const monogram = (cls = '') =>
  raw(
    `<svg class="monogram ${cls}" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M4 28V4h5v5h4.5v5h5V9H23V4h5v24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="miter" stroke-linecap="square"/></svg>`,
  );
