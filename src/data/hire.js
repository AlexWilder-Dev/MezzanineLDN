// Private hire: capacity, minimum spend and what's included.

export const capacity = { seated: 45, standing: 60 };

export const sessions = [
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening', label: 'Evening' },
  { id: 'fullDay', label: 'Full day' },
];

// Minimum spend in GBP. `days` uses JS weekday numbers (0 = Sunday).
export const minimumSpend = [
  { label: 'Mon–Tue', days: [1, 2], afternoon: 300, evening: 500, fullDay: 700 },
  { label: 'Wed', days: [3], afternoon: 300, evening: 600, fullDay: 800 },
  { label: 'Thu', days: [4], afternoon: 400, evening: 600, fullDay: 900 },
  { label: 'Fri–Sat', days: [5, 6], afternoon: 600, evening: 1100, fullDay: 1500 },
  { label: 'Sun', days: [0], closed: true },
];

export const features = [
  { icon: 'clock', title: 'Licence to midnight', note: 'Extension available' },
  { icon: 'speaker', title: 'PA system', note: 'For sets and speeches' },
  { icon: 'decks', title: 'Bring your own DJ', note: 'Your music, your night' },
  { icon: 'projector', title: 'Projector', note: 'For slides and visuals' },
  { icon: 'access', title: 'Wheelchair accessible', note: '' },
  { icon: 'board', title: 'Food your way', note: 'In-house aperitivo boards, or bring your own' },
];

export const review = {
  quote: 'Great communication… The DJ was also very good',
  author: 'Scott S.',
  context: 'Party of 45',
};

export const occasions = ['Birthday', 'Work do', 'Launch or showcase', 'DJ night', 'Celebration', 'Something else'];

export function spendFor(date, sessionId) {
  if (!date) return null;
  const row = minimumSpend.find((r) => r.days.includes(date.getDay()));
  if (!row || row.closed) return { closed: true, row };
  return { closed: false, row, amount: sessionId ? row[sessionId] : null };
}

export const gbp = (n) => `£${n.toLocaleString('en-GB')}`;
