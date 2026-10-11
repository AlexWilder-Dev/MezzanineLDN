import { defineConfig } from 'vite';

// GitHub Pages serves the site from /<repo-name>/. The deploy workflow sets
// BASE_PATH (and SITE_URL for absolute share links); locally the base
// defaults to /mezzanine-site/.
const base = process.env.BASE_PATH || '/mezzanine-site/';
const site = (process.env.SITE_URL || '').replace(/\/$/, '');

export default defineConfig({
  base,
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
  plugins: [
    {
      name: 'share-image-url',
      transformIndexHtml: (html) => html.replaceAll('__OG_IMAGE__', `${site}${base}og.jpg`),
    },
  ],
});
