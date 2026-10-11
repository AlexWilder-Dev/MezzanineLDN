import { html } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { photo } from '../lib/photo.js';
import { capacity, sessions, minimumSpend, features, review, occasions, gbp } from '../data/hire.js';
import { venue } from '../data/venue.js';

function spendTable() {
  return html`<div class="spend" data-reveal>
    <table class="spend-table">
      <caption>
        <span class="spend-caption-title">Minimum spend</span>
        <span class="spend-caption-note">Whole venue, exclusive hire. Tap a price to start an enquiry.</span>
      </caption>
      <thead><tr><th scope="col"><span class="sr-only">Day</span></th>${sessions.map((s) => html`<th scope="col">${s.label}</th>`)}</tr></thead>
      <tbody>
        ${minimumSpend.map((r) =>
          r.closed
            ? html`<tr class="spend-closed" data-days="${r.days.join(' ')}"><th scope="row">${r.label}</th><td colspan="${sessions.length}">Closed Sundays</td></tr>`
            : html`<tr data-days="${r.days.join(' ')}"><th scope="row">${r.label}</th>${sessions.map(
                (s) => html`<td><button type="button" class="spend-cell" data-pick-session="${s.id}" data-pick-days="${r.days.join(' ')}" aria-label="${r.label}, ${s.label.toLowerCase()}: ${gbp(r[s.id])} minimum spend">${gbp(r[s.id])}</button></td>`,
              )}</tr>`,
        )}
      </tbody>
    </table>
  </div>`;
}

function enquiryForm() {
  const today = new Date();
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return html`<form class="enquiry" novalidate data-enquiry>
    <div class="enquiry-head">
      <h3 class="enquiry-title" id="enquiry-title">Enquire about a date</h3>
      <p class="enquiry-sub">${venue.whatsapp.promise}</p>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="f-name">Your name</label>
        <input id="f-name" name="name" type="text" autocomplete="name" required>
        <p class="field-error" id="f-name-err" data-error-for="name"></p>
      </div>
      <div class="field">
        <label for="f-email">Email</label>
        <input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required>
        <p class="field-error" id="f-email-err" data-error-for="email"></p>
      </div>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="f-phone">Phone <span class="optional">optional</span></label>
        <input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel">
      </div>
      <div class="field">
        <label for="f-date">Date</label>
        <input id="f-date" name="date" type="date" min="${iso(today)}" required>
        <p class="field-error" id="f-date-err" data-error-for="date"></p>
      </div>
    </div>

    <fieldset class="field sessions">
      <legend>Session</legend>
      <div class="session-options">
        ${sessions.map((s, i) => html`<label class="session">
          <input type="radio" name="session" value="${s.id}" ${i === 1 ? 'checked' : ''}>
          <span class="session-body"><span class="session-name">${s.label}</span><span class="session-price" data-session-price="${s.id}">Pick a date</span></span>
        </label>`)}
      </div>
    </fieldset>

    <div class="field-row">
      <fieldset class="field guests">
        <legend>Guests</legend>
        <div class="guests-row">
          <input id="f-guests" name="guests" type="range" min="10" max="${capacity.standing}" step="1" value="30" aria-describedby="f-guests-note">
          <output for="f-guests" class="guests-out" data-guests-out>30</output>
        </div>
        <div class="toggle" role="radiogroup" aria-label="Layout">
          <label><input type="radio" name="layout" value="standing" checked><span>Standing</span></label>
          <label><input type="radio" name="layout" value="seated"><span>Seated</span></label>
        </div>
        <p class="field-note" id="f-guests-note" data-guests-note>Up to ${capacity.standing} standing or ${capacity.seated} seated.</p>
      </fieldset>
      <div class="field">
        <label for="f-occasion">Occasion</label>
        <select id="f-occasion" name="occasion">
          ${occasions.map((o) => html`<option>${o}</option>`)}
        </select>
        <label class="check"><input type="checkbox" name="dj"><span>We’re bringing our own DJ</span></label>
        <label class="check"><input type="checkbox" name="boards" checked><span>Interested in aperitivo boards</span></label>
      </div>
    </div>

    <div class="field">
      <label for="f-msg">Anything else? <span class="optional">optional</span></label>
      <textarea id="f-msg" name="message" rows="3" placeholder="Timings, theme, food, music…"></textarea>
    </div>

    <div class="estimate" data-estimate aria-live="polite">
      <span class="estimate-label">Minimum spend</span>
      <span class="estimate-value" data-estimate-value>Choose a date</span>
    </div>

    <button class="btn btn-primary btn-block" type="submit" data-submit>
      <span class="btn-label">Send enquiry</span><span class="spinner" aria-hidden="true"></span>
    </button>
    <p class="form-fineprint">Preview site: this form doesn’t send anywhere yet. For a real booking, message us on WhatsApp.</p>
  </form>

  <div class="enquiry-done" data-enquiry-done hidden tabindex="-1">
    <svg class="tick" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-16"/></svg>
    <h3 class="enquiry-title">Thanks, <span data-done-name></span>. We’ve got it.</h3>
    <p>${venue.whatsapp.promise} Here’s what you sent:</p>
    <dl class="done-summary" data-done-summary></dl>
    <div class="done-actions">
      <a class="btn btn-wa" href="${venue.whatsapp.url}" target="_blank" rel="noopener" data-done-wa>${icon('whatsapp')} Send it on WhatsApp too</a>
      <button class="btn btn-ghost" type="button" data-enquiry-reset>New enquiry</button>
    </div>
  </div>`;
}

export function hire() {
  return html`
  <section class="hire" id="hire" data-level="M" data-level-name="Private hire">
    <div class="wrap">
      <header class="section-head">
        <p class="plaque plaque-light" data-reveal>Private hire</p>
        <h2 class="display" data-reveal>Have the whole place <em>to yourselves.</em></h2>
        <p class="section-sub" data-reveal>Birthdays, work dos, launches or your own DJ night. Book the whole venue, upstairs and out of sight.</p>
      </header>

      <div class="hire-top">
        <div class="capacity" data-reveal data-capacity>
          <div class="capacity-nums">
            <button type="button" class="capacity-num" aria-pressed="true" data-cap="standing"><span class="capacity-n">${capacity.standing}</span><span class="capacity-l">standing</span></button>
            <button type="button" class="capacity-num" aria-pressed="false" data-cap="seated"><span class="capacity-n">${capacity.seated}</span><span class="capacity-l">seated</span></button>
          </div>
          <svg class="capacity-viz" viewBox="0 0 320 200" aria-hidden="true" data-cap-viz></svg>
          <p class="capacity-note">The whole venue is yours, bar and all. Tap to switch layouts.</p>
        </div>
        ${photo('hire', 'hire-photo')}
      </div>

      ${spendTable()}

      <ul class="features">
        ${features.map((f, i) => html`<li class="feature" data-reveal style="--d:${i * 60}ms">${icon(f.icon)}<span class="feature-title">${f.title}</span>${f.note ? html`<span class="feature-note">${f.note}</span>` : ''}</li>`)}
      </ul>

      <figure class="review" data-reveal>
        <blockquote><p>“${review.quote}”</p></blockquote>
        <figcaption>${review.author} <span>· ${review.context}</span></figcaption>
      </figure>

      <div class="enquire" id="enquire">
        <div class="enquire-form" data-reveal>${enquiryForm()}</div>
        <aside class="enquire-wa" data-reveal>
          <p class="enquire-wa-kicker">Quicker on WhatsApp</p>
          <p class="enquire-wa-num">${venue.whatsapp.display}</p>
          <p>${venue.whatsapp.promise}</p>
          <a class="btn btn-wa btn-block" href="${venue.whatsapp.url}?text=${encodeURIComponent('Hi Mezzanine! I’d like to ask about private hire.')}" target="_blank" rel="noopener">${icon('whatsapp')} Chat about a booking</a>
        </aside>
      </div>
    </div>
  </section>`;
}
