import { $, $$, esc, reducedMotion } from './dom.js';
import { upcoming } from '../data/nights.js';
import { venue, fullAddress, whatsappLink } from '../data/venue.js';
import { capacity, minimumSpend, sessions, spendFor, gbp } from '../data/hire.js';
import { seriesById, eventTimes, slug, longDate } from '../sections/nights.js';

const withTransition = (fn) => {
  if (document.startViewTransition && !reducedMotion()) document.startViewTransition(fn);
  else fn();
};

/* ---------- Mobile menu ---------- */
export function initMenu() {
  const panel = $('[data-menu]');
  const openBtn = $('[data-menu-open]');
  if (!panel || !openBtn) return;
  let lastFocus = null;

  const open = () => {
    lastFocus = document.activeElement;
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('is-open'));
    openBtn.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('menu-open');
    $('[data-menu-link]', panel)?.focus();
  };
  const close = (restore = true) => {
    panel.classList.remove('is-open');
    openBtn.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('menu-open');
    setTimeout(() => { panel.hidden = true; }, 320);
    if (restore) lastFocus?.focus();
  };

  openBtn.addEventListener('click', open);
  $('[data-menu-close]', panel).addEventListener('click', () => close());
  $$('a', panel).forEach((a) => a.addEventListener('click', () => close(false)));
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const f = $$('a, button', panel);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

/* ---------- Pressed-chip groups ---------- */
function chipGroup(buttons, attr, onPick) {
  buttons.forEach((b) => b.addEventListener('click', () => {
    buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    onPick(b.dataset[attr]);
  }));
}

/* ---------- Drinks menu ---------- */
export function initDrinks() {
  const items = $$('[data-menu-list] .menu-item');
  chipGroup($$('[data-menu-style]'), 'menuStyle', (style) => {
    withTransition(() => items.forEach((li) => { li.hidden = style !== 'all' && li.dataset.style !== style; }));
  });
  items.forEach((li, i) => { li.style.viewTransitionName = `drink-${i}`; });
}

/* ---------- Nights: genre filter and calendar files ---------- */
export function initNights() {
  const list = $('[data-events]');
  const count = $('[data-count]');
  const empty = $('[data-empty]');
  const more = $('[data-more]');
  const LIMIT = 5;
  if (list) {
    const rows = $$('.event', list);
    const state = { genre: 'all', expanded: false };
    rows.forEach((r, i) => { r.style.viewTransitionName = `night-${i}`; });

    const apply = () => {
      const matching = rows.filter((r) => state.genre === 'all' || r.dataset.genres.split(' ').includes(state.genre));
      const shown = state.expanded ? matching : matching.slice(0, LIMIT);
      rows.forEach((r) => { r.hidden = !shown.includes(r); });
      const n = matching.length;
      count.textContent = `${n} ${n === 1 ? 'night' : 'nights'}`;
      empty.hidden = n > 0;
      more.hidden = state.expanded || n <= LIMIT;
      more.textContent = `Show ${n - LIMIT} more ${n - LIMIT === 1 ? 'night' : 'nights'}`;
      return shown;
    };

    chipGroup($$('[data-genre]'), 'genre', (g) => {
      state.genre = g;
      withTransition(apply);
    });
    more.addEventListener('click', () => {
      state.expanded = true;
      withTransition(() => {
        const shown = apply();
        const first = shown[LIMIT] || shown[0];
        if (first) $('a', first)?.focus({ preventScroll: true });
      });
    });
    apply();
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-ics]');
    if (!btn) return;
    const ev = upcoming[Number(btn.dataset.ics)];
    if (!ev) return;
    downloadIcs(ev);
    const label = $('span', btn);
    const prev = label.textContent;
    label.textContent = 'Added';
    setTimeout(() => { label.textContent = prev; }, 2200);
  });
}

function downloadIcs(ev) {
  const s = seriesById[ev.series];
  const { start, end } = eventTimes(ev);
  const stamp = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}00`;
  const text = (v) => String(v).replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mezzanine//Nights//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${ev.date}-${ev.series}@mezzanineldn`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=Europe/London:${stamp(start)}`,
    `DTEND;TZID=Europe/London:${stamp(end)}`,
    `SUMMARY:${text(`${ev.title} at Mezzanine`)}`,
    `LOCATION:${text(`Mezzanine, ${fullAddress}`)}`,
    `DESCRIPTION:${text(`${s.tagline}\n${ev.lineup.join(' · ')}\n18+\nTickets: ${venue.tickets}`)}`,
    `URL:${venue.tickets}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `${slug(ev.title)}-${ev.date}.ics` });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------- Copy address ---------- */
export function initCopy() {
  $$('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
    const label = $('[data-copy-label]', btn);
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      label.textContent = 'Copied';
    } catch {
      label.textContent = btn.dataset.copy;
    }
    setTimeout(() => { label.textContent = 'Copy address'; }, 2400);
  }));
}

/* ---------- Capacity: 60 standing or 45 seated, drawn as dots ---------- */
export function initCapacity() {
  const svg = $('[data-cap-viz]');
  if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

  const standing = Array.from({ length: capacity.standing }, (_, i) => {
    const col = i % 12, row = Math.floor(i / 12);
    return [24 + col * 25 + (row % 2) * 12 + (rnd() - 0.5) * 8, 30 + row * 34 + (rnd() - 0.5) * 10];
  });
  const tables = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) tables.push([62 + c * 98, 38 + r * 62]);
  const seats = tables.flatMap(([tx, ty]) => Array.from({ length: 5 }, (_, k) => {
    const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
    return [tx + Math.cos(a) * 21, ty + Math.sin(a) * 21];
  }));

  const tableEls = tables.map(([x, y]) => {
    const t = document.createElementNS(NS, 'circle');
    t.setAttribute('r', '11');
    t.setAttribute('class', 'cap-table');
    t.style.transform = `translate(${x}px, ${y}px)`;
    svg.appendChild(t);
    return t;
  });
  const dots = standing.map((_, i) => {
    const d = document.createElementNS(NS, 'circle');
    d.setAttribute('r', '4.6');
    d.setAttribute('class', 'cap-dot');
    d.style.transitionDelay = `${(i % 15) * 14}ms`;
    svg.appendChild(d);
    return d;
  });

  const show = (mode) => {
    svg.dataset.mode = mode;
    dots.forEach((d, i) => {
      const seated = mode === 'seated';
      const [x, y] = seated ? (seats[i] || standing[i]) : standing[i];
      d.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      d.classList.toggle('is-off', seated && i >= capacity.seated);
    });
    tableEls.forEach((t) => t.classList.toggle('is-on', mode === 'seated'));
  };
  chipGroup($$('[data-cap]'), 'cap', show);
  show('standing');
}

/* ---------- Private hire enquiry ---------- */
const parseDate = (v) => {
  if (!v) return null;
  const [y, m, d] = v.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return Number.isNaN(dt.getTime()) ? null : dt;
};
const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const startOfToday = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };

export function initHire() {
  const form = $('[data-enquiry]');
  const done = $('[data-enquiry-done]');
  if (!form) return;
  const f = form.elements;
  const estimate = $('[data-estimate]');
  const estimateValue = $('[data-estimate-value]');
  const guestsOut = $('[data-guests-out]');
  const guestsNote = $('[data-guests-note]');
  const rows = $$('.spend-table tbody tr');
  let tried = false;

  const ranges = Object.fromEntries(sessions.map((s) => {
    const vals = minimumSpend.filter((r) => !r.closed).map((r) => r[s.id]);
    return [s.id, `${gbp(Math.min(...vals))}–${gbp(Math.max(...vals))}`];
  }));

  function update() {
    const date = parseDate(f.date.value);
    const session = f.session.value;
    const info = spendFor(date, session);
    $$('[data-session-price]', form).forEach((el) => {
      const id = el.dataset.sessionPrice;
      el.textContent = !info ? ranges[id] : info.closed ? 'Closed' : gbp(info.row[id]);
    });
    estimate.classList.toggle('is-warn', !!info?.closed);
    if (!info) estimateValue.textContent = 'Choose a date';
    else if (info.closed) estimateValue.textContent = 'We’re closed on Sundays';
    else estimateValue.textContent = `${gbp(info.amount)} · ${longDate.format(date)}, ${sessions.find((s) => s.id === session).label.toLowerCase()}`;

    rows.forEach((tr) => {
      const on = !!date && tr.dataset.days.split(' ').map(Number).includes(date.getDay());
      tr.classList.toggle('is-active', on);
      $$('[data-pick-session]', tr).forEach((b) => b.classList.toggle('is-picked', on && b.dataset.pickSession === session));
    });

    const seated = f.layout.value === 'seated';
    const max = seated ? capacity.seated : capacity.standing;
    f.guests.max = String(max);
    if (Number(f.guests.value) > max) f.guests.value = String(max);
    guestsOut.textContent = f.guests.value;
    f.guests.style.setProperty('--fill', `${((f.guests.value - f.guests.min) / (max - f.guests.min)) * 100}%`);
    guestsNote.textContent = seated
      ? `Seated works for up to ${capacity.seated}. Standing fits ${capacity.standing}.`
      : `Up to ${capacity.standing} standing or ${capacity.seated} seated.`;
    if (tried) validate();
  }

  const setError = (name, msg) => {
    const input = f[name];
    const err = $(`[data-error-for="${name}"]`, form);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) input.setAttribute('aria-describedby', err.id); else input.removeAttribute('aria-describedby');
    err.textContent = msg || '';
  };

  function validate() {
    const errors = {};
    if (!f.name.value.trim()) errors.name = 'Let us know who’s asking.';
    const email = f.email.value.trim();
    if (!email) errors.email = 'We need an email to reply to.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'That email doesn’t look quite right.';
    const date = parseDate(f.date.value);
    if (!date) errors.date = 'Pick a date for your event.';
    else if (date < startOfToday()) errors.date = 'That date has already been.';
    else if (date.getDay() === 0) errors.date = 'We’re closed on Sundays. Any other day works.';
    ['name', 'email', 'date'].forEach((k) => setError(k, errors[k]));
    return errors;
  }

  // Tap a price in the table: choose that session and the next matching day.
  $$('[data-pick-session]').forEach((b) => b.addEventListener('click', () => {
    const days = b.dataset.pickDays.split(' ').map(Number);
    const current = parseDate(f.date.value);
    if (!current || !days.includes(current.getDay()) || current < startOfToday()) {
      const d = startOfToday();
      d.setDate(d.getDate() + 1);
      while (!days.includes(d.getDay())) d.setDate(d.getDate() + 1);
      f.date.value = isoDate(d);
    }
    form.querySelector(`input[name="session"][value="${b.dataset.pickSession}"]`).checked = true;
    update();
    $('#enquire').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    estimate.classList.remove('is-flash');
    void estimate.offsetWidth;
    estimate.classList.add('is-flash');
  }));

  form.addEventListener('input', update);
  form.addEventListener('change', update);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    tried = true;
    const errors = validate();
    const first = ['name', 'email', 'date'].find((k) => errors[k]);
    if (first) { f[first].focus(); return; }

    const btn = $('[data-submit]', form);
    btn.classList.add('is-busy');
    btn.disabled = true;

    const date = parseDate(f.date.value);
    const session = sessions.find((s) => s.id === f.session.value);
    const info = spendFor(date, session.id);
    const extras = [f.dj.checked && 'Bringing our own DJ', f.boards.checked && 'Interested in aperitivo boards'].filter(Boolean);
    const summary = [
      ['Date', `${longDate.format(date)}, ${session.label.toLowerCase()}`],
      ['Guests', `${f.guests.value} ${f.layout.value}`],
      ['Occasion', f.occasion.value],
      ['Minimum spend', gbp(info.amount)],
      ...(extras.length ? [['Extras', extras.join(', ')]] : []),
      ...(f.message.value.trim() ? [['Notes', f.message.value.trim()]] : []),
    ];

    setTimeout(() => {
      $('[data-done-name]', done).textContent = f.name.value.trim().split(' ')[0];
      $('[data-done-summary]', done).innerHTML = summary.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
      const msg = `Hi Mezzanine! Private hire enquiry from ${f.name.value.trim()}:\n${summary.map(([k, v]) => `${k}: ${v}`).join('\n')}\nEmail: ${f.email.value.trim()}${f.phone.value.trim() ? `\nPhone: ${f.phone.value.trim()}` : ''}`;
      $('[data-done-wa]', done).href = whatsappLink(msg);
      form.hidden = true;
      done.hidden = false;
      btn.classList.remove('is-busy');
      btn.disabled = false;
      done.focus({ preventScroll: true });
      done.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
    }, 1100);
  });

  $('[data-enquiry-reset]', done)?.addEventListener('click', () => {
    form.reset();
    tried = false;
    ['name', 'email', 'date'].forEach((k) => setError(k, ''));
    done.hidden = true;
    form.hidden = false;
    update();
    f.name.focus();
  });

  update();
}
