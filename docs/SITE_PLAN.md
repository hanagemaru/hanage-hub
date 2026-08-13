# hanage.app site plan

## Role of this repository

`hanage-hub` is the public entrance for games and small web apps made by hanagemaru. Each product remains in its own repository and is deployed independently.

## URL structure

| Purpose | URL |
| --- | --- |
| Hub site | `https://hanage.app/` |
| Games index | `https://hanage.app/games/` |
| Gradient Sweeper introduction | `https://hanage.app/games/gradient-sweeper/` |
| Gradient Sweeper game | `https://sweeper.hanage.app/` |

Future products should normally use another subdomain such as `tool-name.hanage.app`, while their introduction and help pages live under `hanage.app`.

## Design direction

- The games index uses a compact tile grid: two columns on mobile and four columns on larger screens.
- Only released or genuinely in-development products are shown; the grid is not padded with placeholder tiles.
- Each product has an introduction page on the hub before opening the separate app.
- The first release prioritizes fast loading, touch targets, readable Japanese text, and a simple storefront-like browse experience.

## Initial release

- Home, games index, product introduction, how-to-play, updates, about, privacy, terms, and contact pages
- Metadata, canonical URLs, `robots.txt`, and `sitemap.xml`
- No advertising script yet. Advertising and analytics are added only after the provider and consent requirements are decided.

## Deployment

The intended deployment target is Netlify. Connect this repository, deploy `main`, then configure `hanage.app` as the custom domain. Keep `sweeper.hanage.app` pointed at the Gradient Sweeper deployment.
