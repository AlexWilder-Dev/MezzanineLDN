// Club nights. `series` are the recurring promoters; `upcoming` is the
// listings feed. Dates and lineups below are sample data — swap in the real
// listings from Resident Advisor when publishing.

export const series = [
  {
    id: 'grounded',
    name: 'Grounded',
    kicker: 'Numbered series',
    tagline: 'Liquid drum & bass and jungle, rolling all night.',
    genres: ['Drum & bass', 'Jungle'],
    entry: 'Around £3',
    art: 'liquid',
    accent: '#a8b88c',
  },
  {
    id: 'waves',
    name: 'Waves',
    kicker: 'UK club & bass',
    tagline: 'UK club sounds and bass weight, close to the speakers.',
    genres: ['UK club', 'Bass'],
    art: 'ripple',
    accent: '#8fb0bd',
  },
  {
    id: 'say-less',
    name: 'Say Less & Friends',
    kicker: 'Say Less & guests',
    tagline: 'Say Less hosts, friends take the decks.',
    genres: ['Various'],
    art: 'quiet',
    accent: '#d79a92',
  },
  {
    id: 'sng',
    name: 'Saturday Night Groove',
    promoter: 'Refracted Events',
    kicker: 'by Refracted Events',
    tagline: 'Drum & bass and garage to see Saturday out.',
    genres: ['Drum & bass', 'Garage'],
    art: 'prism',
    accent: '#e0a458',
  },
];

// date: YYYY-MM-DD · start/end: 24h local time (end may roll past midnight)
export const upcoming = [
  { date: '2026-10-16', series: 'grounded', title: 'Grounded 019', start: '20:00', end: '02:00', price: '£3', lineup: ['Grounded residents', 'Guest TBA'] },
  { date: '2026-10-17', series: 'sng', title: 'Saturday Night Groove', start: '21:00', end: '02:00', lineup: ['Refracted Events residents', 'Guest TBA'] },
  { date: '2026-10-23', series: 'waves', title: 'Waves', start: '20:00', end: '01:30', lineup: ['Waves residents', 'Guest TBA'] },
  { date: '2026-10-24', series: 'say-less', title: 'Say Less & Friends', start: '20:00', end: '02:00', lineup: ['Say Less', 'Friends TBA'] },
  { date: '2026-10-31', series: 'sng', title: 'Saturday Night Groove', start: '21:00', end: '02:00', lineup: ['Refracted Events residents'] },
  { date: '2026-11-06', series: 'grounded', title: 'Grounded 020', start: '20:00', end: '02:00', price: '£3', lineup: ['Grounded residents', 'Jungle special guest TBA'] },
  { date: '2026-11-14', series: 'waves', title: 'Waves', start: '19:30', end: '01:30', lineup: ['Waves residents', 'B2B set TBA'] },
  { date: '2026-11-20', series: 'say-less', title: 'Say Less & Friends', start: '20:00', end: '02:00', lineup: ['Say Less', 'Friends TBA'] },
  { date: '2026-11-28', series: 'sng', title: 'Saturday Night Groove', start: '21:00', end: '02:00', lineup: ['Refracted Events residents', 'Guest TBA'] },
  { date: '2026-12-04', series: 'grounded', title: 'Grounded 021', start: '20:00', end: '02:00', price: '£3', lineup: ['Grounded residents', 'Guest TBA'] },
  { date: '2026-12-12', series: 'waves', title: 'Waves', start: '20:00', end: '01:30', lineup: ['Waves residents'] },
  { date: '2026-12-18', series: 'say-less', title: 'Say Less & Friends', start: '20:00', end: '02:00', lineup: ['Say Less', 'Friends TBA'] },
  { date: '2026-12-19', series: 'sng', title: 'Saturday Night Groove', start: '21:00', end: '02:00', lineup: ['Refracted Events residents', 'Guest TBA'] },
];

export const nightsInfo = {
  age: '18+',
  usualTimes: 'Doors usually 7:30–9pm · till 1:30–2am',
  isSample: true,
};
