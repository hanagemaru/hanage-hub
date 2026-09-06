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
| Multicolor Sweeper game | `https://mcsweeper.hanage.app/` |
| Putt introduction | `https://hanage.app/games/putt/` |
| Putt game | `https://putt.hanage.app/` |

All game URLs live in `src/lib/site.ts` (`GAME_URLS`) so moving a game to another host is a one-place change.

Future products should normally use another subdomain such as `tool-name.hanage.app`, while their introduction and help pages live under `hanage.app`.

## Design direction

- The games index uses a compact tile grid: two columns on mobile and four columns on larger screens.
- Only released or genuinely in-development products are shown; the grid is not padded with placeholder tiles.
- Each product has an introduction page on the hub before opening the separate app.
- The first release prioritizes fast loading, touch targets, readable Japanese text, and a simple storefront-like browse experience.

## Deployment

The hub deploys from `main` to Cloudflare Workers Static Assets. The Next.js static export is served from `out/`.

- Primary URL: `https://hanage.app/`
- Alias: `https://www.hanage.app/`
- Worker URL: `https://hanage-hub.jibunnha.workers.dev/`
- Multicolor Sweeper already runs on Cloudflare Workers with a D1 ranking database.
- Putt remains on GitHub Pages until its Cloudflare migration is completed.
- The former Netlify project is kept only as a temporary rollback target; its custom domains are detached.

## Advertising and privacy

The shared implementation policy is [`docs/ADVERTISING_POLICY.md`](./ADVERTISING_POLICY.md). It is the source of truth for rules shared by the hub and all first-party games. Each game specification keeps only its game-specific display timing and transitions.

- Planned providers: Google AdSense and H5 Games Ads.
- No advertising or external analytics script is present today.
- The public privacy notice is maintained at `https://hanage.app/privacy/`; each game must provide a visible link to it before advertising is enabled.
- AdSense approval, required consent management, `ads.txt`, privacy disclosure, and real-device QA are release gates for advertising.
