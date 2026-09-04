# hanage.app site plan

## Role of this repository

`hanage-hub` is the public entrance for games and small web apps made by hanagemaru. Each product remains in its own repository and is deployed independently.

## Published products

| Product | Repository | Status |
| --- | --- | --- |
| Multicolor Sweeper | `hanagemaru/multicolor-sweeper` | 公開中 |
| Putt | `hanagemaru/putt` | 仕上げ中（先行版を公開） |

Gradient Sweeper is **not** published on this hub. Its pages and links were removed on 2026-09-04.

## URL structure

| Purpose | URL |
| --- | --- |
| Hub site | `https://hanage.app/` |
| Games index | `https://hanage.app/games/` |
| Multicolor Sweeper introduction | `https://hanage.app/games/multicolor-sweeper/` |
| Multicolor Sweeper game | `https://mcsweeper.hanage.app/` (planned) |
| Putt introduction | `https://hanage.app/games/putt/` |
| Putt game | `https://putt.hanage.app/` (planned) |

Until the custom domains are assigned, the hub links to the current deployment URLs. All game URLs live in `src/lib/site.ts` (`GAME_URLS`) so the switch is a one-place change.

Future products should normally use another subdomain such as `tool-name.hanage.app`, while their introduction and help pages live under `hanage.app`.

## Design direction

- The games index uses a compact tile grid: two columns on mobile and four columns on larger screens.
- Only released or genuinely in-development products are shown; the grid is not padded with placeholder tiles.
- Each product has an introduction page on the hub before opening the separate app.
- The first release prioritizes fast loading, touch targets, readable Japanese text, and a simple storefront-like browse experience.

## Deployment

The hub currently deploys to Netlify from `main`. The agreed direction is to move the hub, and the games, to Cloudflare:

- `hanage.app` becomes a Cloudflare zone, which is required before Workers custom domains can be assigned.
- The hub is served from Cloudflare Workers Static Assets (the Next.js static export is unchanged).
- Multicolor Sweeper already runs on Cloudflare Workers with a D1 ranking database.
- Putt moves off GitHub Pages when it needs its own ranking API.

Nothing in this repository has been switched yet. Hosting changes happen only after the domain is on Cloudflare.

## Advertising

- Planned providers: Google AdSense and H5 Games Ads (H5 Games Ads is enabled from within an approved AdSense account).
- Ads are shown at natural breaks inside the games, never during play.
- Before any ad code is added: AdSense approval, a certified consent management platform for EEA/UK visitors, `ads.txt` at the root of `hanage.app`, and a privacy policy update.
- No advertising or analytics script is present in this repository today.
