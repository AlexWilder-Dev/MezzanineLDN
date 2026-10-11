// Venue facts, contact details and opening hours.
// Everything the site says about where and when lives here.

export const venue = {
  name: 'Mezzanine',
  handle: '@mezzanineldn',
  address: {
    unit: 'Unit 4, Tooting Market',
    street: '20 Totterdown St',
    city: 'London',
    postcode: 'SW17 8TA',
  },
  tube: {
    station: 'Tooting Broadway',
    line: 'Northern line',
    walk: 'Short walk',
  },
  whatsapp: {
    display: '+44 7534 819140',
    number: '447534819140',
    url: 'https://wa.me/447534819140',
    promise: 'We reply within 4 hours, always.',
  },
  socials: [
    { id: 'instagram', label: 'Instagram', handle: '@mezzanineldn', url: 'https://instagram.com/mezzanineldn' },
    { id: 'tiktok', label: 'TikTok', handle: '@mezzanineldn', url: 'https://tiktok.com/@mezzanineldn' },
  ],
  tickets: 'https://ra.co/clubs/234688',
  heroVideo: {
    src: 'https://player.vimeo.com/video/1113875902?autoplay=1&loop=1&autopause=0&muted=1&title=0&byline=0&portrait=0&controls=0&dnt=1',
    // A still from the same video, saved in /public/img. The video is portrait.
    poster: 'hero-poster.jpg',
    ratio: 1080 / 1917,
  },
};

// Opening hours. No fixed hours are published yet, so the site shows the
// summary line everywhere. Fill in `days` (0 = Sunday) once hours are set.
export const hours = {
  summary: 'Open every weekend · late on event nights',
  short: 'Open every weekend',
  late: 'Late on event nights',
  eventNights: '18+ · usually 7:30–9pm till 1:30–2am',
  days: null,
};

export const fullAddress = [venue.address.unit, venue.address.street, venue.address.city, venue.address.postcode].join(', ');

export const mapsLinks = {
  google: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Mezzanine, ${fullAddress}`)}`,
  apple: `https://maps.apple.com/?q=${encodeURIComponent('Mezzanine')}&address=${encodeURIComponent(fullAddress)}`,
};

export function whatsappLink(text = '') {
  return text ? `${venue.whatsapp.url}?text=${encodeURIComponent(text)}` : venue.whatsapp.url;
}
