// Photo slots. Drop a file with the matching name into /public/img and it
// fades in over the illustrated fallback; no code changes needed.

export const photos = {
  room: { file: 'room.jpg', alt: 'The bar upstairs at Mezzanine, warm and low-lit', art: 'room' },
  bar: { file: 'bar.jpg', alt: 'A Mezzanine bartender finishing a cocktail at the bar', art: 'bar' },
  decks: { file: 'decks.jpg', alt: 'A DJ playing at Mezzanine', art: 'decks' },
  cocktails: { file: 'cocktails.jpg', alt: 'Cocktails on the bar at Mezzanine', art: 'coupe' },
  board: { file: 'board.jpg', alt: 'An aperitivo board at Mezzanine', art: 'board' },
  hire: { file: 'hire.jpg', alt: 'Mezzanine set up for a private party', art: 'party' },
  stairs: { file: 'stairs.jpg', alt: 'The lit Mezzanine arrow sign on the red brick stairwell, with a guest heading up', art: 'room' },
};

export const photoUrl = (file) => `${import.meta.env.BASE_URL}img/${file}`;
