# Mezzanine

Pitch site for Mezzanine, the cocktail bar and DJ venue upstairs in Tooting Market. It's a static front end with mock data only: no CMS, no database, no payments. Forms validate and then show a success state; nothing gets sent.

The page tells the story of the walk upstairs. It opens at market level with the venue video, climbs a scroll-driven stairwell from cool fluorescent light into the warm bar, and then moves through Upstairs, Drinks & boards, Nights, Private hire and Find us.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173/mezzanine-site/
npm run build      # outputs to dist/
npm run preview    # http://localhost:4173/mezzanine-site/
```

Requires Node 20.19+ or 22.12+.

## Editing content

All content lives in `src/data/`:

| File | What's in it |
| --- | --- |
| `venue.js` | Address, Tube, WhatsApp, socials, ticket link, hero video, and the `hours` config object |
| `nights.js` | The four recurring series, plus the upcoming listings (sample dates and lineups) |
| `menu.js` | Cocktail list (sample classics), board prices, zero-waste copy |
| `hire.js` | Capacity, minimum-spend table, features, review |
| `images.js` | Photo slots and their alt text |

Past dates drop out of the listings automatically.

## Photos

Every photo slot has an illustrated fallback. To use real photos, drop JPGs with these names into `public/img/` and they fade in over the illustrations, with no code changes:

| File | Where it shows |
| --- | --- |
| `room.jpg` | Upstairs, large portrait tile |
| `bar.jpg` | Upstairs, small tile |
| `decks.jpg` | Upstairs, small tile |
| `cocktails.jpg` | Drinks, above the zero-waste panel |
| `board.jpg` | Aperitivo boards |
| `hire.jpg` | Private hire, next to capacity |

Around 1600px on the long edge is plenty.

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` builds on every push and publishes from the default branch. The base path comes from the repository name, so a repo called `mezzanine-site` serves at `https://<owner>.github.io/mezzanine-site/`.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Then re-run the workflow, or push to the default branch.

The site sets `noindex` because it's a preview. Remove that meta tag in `index.html` before going live.
