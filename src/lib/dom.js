const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

// Marks a string as trusted markup so `html` won't escape it.
class Raw {
  constructor(s) { this.s = s; }
  toString() { return this.s; }
}
export const raw = (s) => new Raw(s);

const flat = (v) => {
  if (v == null || v === false) return '';
  if (Array.isArray(v)) return v.map(flat).join('');
  if (v instanceof Raw) return v.s;
  return esc(v);
};

// Tagged template: interpolations are escaped unless wrapped in raw() or
// produced by another html`` call.
export function html(strings, ...values) {
  let out = strings[0];
  values.forEach((v, i) => { out += flat(v) + strings[i + 1]; });
  return raw(out);
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function mount(target, markup) {
  const el = typeof target === 'string' ? $(target) : target;
  if (el) el.innerHTML = String(markup);
  return el;
}

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => t * t * (3 - 2 * t);
export const range = (v, a, b) => clamp((v - a) / (b - a));
