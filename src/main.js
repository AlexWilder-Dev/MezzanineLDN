import '@fontsource-variable/bodoni-moda/standard';
import '@fontsource-variable/bodoni-moda/standard-italic';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/big-shoulders-display';
import './styles/main.css';

import { mount } from './lib/dom.js';
import { header, dock } from './sections/header.js';
import { hero, climb } from './sections/hero.js';
import { upstairs } from './sections/upstairs.js';
import { drinks } from './sections/drinks.js';
import { nights } from './sections/nights.js';
import { hire } from './sections/hire.js';
import { find, footer } from './sections/find.js';

import { initPhotos } from './lib/photo.js';
import { initScroll } from './lib/scroll.js';
import { initHeroVideo, initShutter } from './lib/video.js';
import { initMenu, initDrinks, initNights, initCopy, initCapacity, initHire } from './lib/interactions.js';

mount('#app', [
  header(),
  '<main id="main">',
  hero(),
  climb(),
  upstairs(),
  drinks(),
  nights(),
  hire(),
  find(),
  '</main>',
  footer(),
  dock(),
].join(''));

initShutter();
initPhotos();
initMenu();
initDrinks();
initNights();
initCopy();
initCapacity();
initHire();
initScroll();
initHeroVideo();

document.documentElement.classList.add('is-ready');
