import { html, raw, $$ } from './dom.js';
import { art } from './art.js';
import { photos, photoUrl } from '../data/images.js';

export function photo(key, cls = '', caption = '') {
  const p = photos[key];
  return html`<figure class="photo ${cls}" data-photo>
    ${raw(art(p.art))}
    <img src="${photoUrl(p.file)}" alt="${p.alt}" loading="lazy" decoding="async">
    ${caption ? html`<figcaption>${caption}</figcaption>` : ''}
  </figure>`;
}

// Photos fade in over their illustration once loaded; missing files just
// leave the illustration in place.
export function initPhotos(root = document) {
  $$('[data-photo] img', root).forEach((img) => {
    const fig = img.closest('[data-photo]');
    const ok = () => fig.classList.add('has-photo');
    const fail = () => img.remove();
    if (img.complete) (img.naturalWidth ? ok() : fail());
    else {
      img.addEventListener('load', ok, { once: true });
      img.addEventListener('error', fail, { once: true });
    }
  });
}
