import { html, raw } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { poster } from '../lib/posters.js';
import { series, upcoming, nightsInfo } from '../data/nights.js';
import { venue } from '../data/venue.js';

export const slug = (s) => s.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const seriesById = Object.fromEntries(series.map((s) => [s.id, s]));

export function eventTimes(e) {
  const start = new Date(`${e.date}T${e.start}:00`);
  const end = new Date(`${e.date}T${e.end}:00`);
  if (end <= start) end.setDate(end.getDate() + 1);
  return { start, end };
}

export const fmtTime = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 && h < 24 ? 'pm' : 'am';
  const h12 = h % 12 || 12;
  return `${h12}${m ? `:${String(m).padStart(2, '0')}` : ''}${suffix}`;
};

const dayFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short' });
const monFmt = new Intl.DateTimeFormat('en-GB', { month: 'short' });
const monthYearFmt = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });
export const longDate = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

export function upcomingEvents(now = new Date()) {
  return upcoming
    .map((e, i) => ({ ...e, index: i, s: seriesById[e.series], ...eventTimes(e) }))
    .filter((e) => e.end > now)
    .sort((a, b) => a.start - b.start);
}

const genresOf = (e) => e.genres || e.s.genres;

function seriesCard(s, next) {
  return html`<li class="poster" style="--accent:${s.accent}" data-reveal>
    <div class="poster-frame">
      ${raw(poster(s))}
      <div class="poster-body">
        <p class="poster-kicker">${s.kicker}</p>
        <h3 class="poster-name">${s.name}</h3>
        <p class="poster-tagline">${s.tagline}</p>
        <ul class="tags">${s.genres.map((g) => html`<li>${g}</li>`)}</ul>
        <p class="poster-next">
          ${next ? html`<span>Next</span> ${longDate.format(next.start)}` : html`<span>Next</span> Dates soon`}
          ${s.entry ? html` · ${s.entry}` : ''}
        </p>
      </div>
    </div>
  </li>`;
}

function eventRow(e) {
  const g = genresOf(e);
  return html`<li class="event" style="--accent:${e.s.accent}" data-genres="${g.map(slug).join(' ')}" data-month="${monthYearFmt.format(e.start)}">
    <time class="event-date" datetime="${e.date}">
      <span class="event-dow">${dayFmt.format(e.start)}</span>
      <span class="event-day">${e.start.getDate()}</span>
      <span class="event-mon">${monFmt.format(e.start)}</span>
    </time>
    <div class="event-main">
      <p class="event-series">${e.s.kicker}</p>
      <h4 class="event-title">${e.title}</h4>
      <p class="event-lineup">${e.lineup.join(' · ')}</p>
      <ul class="tags tags-small">${g.map((x) => html`<li>${x}</li>`)}</ul>
    </div>
    <p class="event-meta">
      <span>${fmtTime(e.start.toTimeString().slice(0, 5))}–${fmtTime(e.end.toTimeString().slice(0, 5))}</span>
      <span>${nightsInfo.age}</span>
      <span>${e.price || 'Tickets on RA'}</span>
    </p>
    <div class="event-actions">
      <a class="btn btn-small btn-primary" href="${venue.tickets}" target="_blank" rel="noopener">Tickets ${icon('arrowUpRight')}<span class="sr-only"> for ${e.title} on Resident Advisor (opens in a new tab)</span></a>
      <button class="btn btn-small btn-quiet" type="button" data-ics="${e.index}">${icon('calendar')}<span>Add to calendar</span></button>
    </div>
  </li>`;
}

export function nights() {
  const events = upcomingEvents();
  const genres = [...new Set(events.flatMap(genresOf))];
  const nextFor = (id) => events.find((e) => e.series === id);

  return html`
  <section class="nights" id="nights" data-level="M" data-level-name="Nights">
    <div class="wrap">
      <header class="section-head">
        <p class="plaque" data-reveal>Nights</p>
        <h2 class="display" data-reveal>Independent DJs, <em>up close.</em></h2>
        <p class="section-sub" data-reveal>Four recurring nights from independent promoters. ${nightsInfo.age}. ${nightsInfo.usualTimes}.</p>
      </header>

      <ul class="posters" aria-label="Recurring nights">
        ${series.map((s) => seriesCard(s, nextFor(s.id)))}
      </ul>

      <div class="listings" data-listings>
        <div class="listings-head">
          <h3 class="listings-title">Coming up</h3>
          ${nightsInfo.isSample ? html`<p class="sample-tag">Sample dates · live listings on RA</p>` : ''}
        </div>
        <div class="filters" role="group" aria-label="Filter by genre">
          <button type="button" class="chip" aria-pressed="true" data-genre="all">All</button>
          ${genres.map((g) => html`<button type="button" class="chip" aria-pressed="false" data-genre="${slug(g)}">${g}</button>`)}
        </div>
        <p class="listings-count" aria-live="polite" data-count>${events.length} nights</p>
        ${events.length
          ? html`<ol class="events" data-events>${events.map(eventRow)}</ol>`
          : html`<p class="events-empty">New dates are landing soon. Check Resident Advisor for the latest.</p>`}
        <button class="btn btn-quiet listings-toggle" type="button" data-more hidden></button>
        <p class="events-empty" data-empty hidden>Nothing in that genre right now. Try another, or check RA.</p>
        <a class="btn btn-ghost listings-more" href="${venue.tickets}" target="_blank" rel="noopener">All listings on Resident Advisor ${icon('arrowUpRight')}</a>
      </div>
    </div>
  </section>`;
}
