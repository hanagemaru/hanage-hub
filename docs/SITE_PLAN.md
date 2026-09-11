# hanage.app site plan

## Role of this repository

`hanage-hub` is the public entrance for games and small web apps made by hanagemaru. Each product remains in its own repository and is deployed independently.

## Published products

| Product | Repository | Status |
| --- | --- | --- |
| Multicolor Sweeper | `hanagemaru/multicolor-sweeper` | 公開中 |
| Putt | `hanagemaru/putt` | 公開中 |

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

### Languages

Japanese pages keep the paths above with no prefix. English pages sit under `/en/`
(`https://hanage.app/en/games/putt/`, and so on). The asymmetry is deliberate: the
Japanese URLs were published first, and moving them to `/ja/` would throw away the
links and search results they already have.

`src/lib/i18n.ts` owns the mapping. Do not build a localized path anywhere else.

Each language has its own root layout (`src/app/(ja)/layout.tsx` and
`src/app/(en)/layout.tsx`) so that `<html lang>` is correct per language. Route
groups do not appear in the URL, which is what keeps the Japanese paths unchanged.
Switching language is a full page load, because it crosses root layouts.

Page files under `src/app` hold only metadata and a locale; the markup lives in
`src/components/pages/`, shared by both languages. All wording lives in
`src/lib/content/ja.ts` and `src/lib/content/en.ts`, which must both satisfy the
`Content` type — so a new page, game, or update entry does not build until it has
text in both languages.

Future products should normally use another subdomain such as `tool-name.hanage.app`, while their introduction and help pages live under `hanage.app`.

## Design direction

- The games index uses a compact tile grid: two columns on mobile and four columns on larger screens.
- Only released or genuinely in-development products are shown; the grid is not padded with placeholder tiles.
- Each product has an introduction page on the hub before opening the separate app.
- The first release prioritizes fast loading, touch targets, readable Japanese text, and a simple storefront-like browse experience.
- Corners are square. Tiles, cards, buttons, badges, and tags carry no border radius. This keeps the hub away from a generic phone-OS look and matches the pixel artwork, whose square edges the old 18px radius was clipping.
- Depth comes from a single 3px ink frame (`--frame`), not from shadows or blur. Tiles, cards, buttons and the screenshot strip all use the same frame, so the catalog reads like shelf labels in a shop. There is no `--shadow` and no `--radius`; do not reintroduce either.
- The header is a solid ink bar with a light wordmark, and the footer sits under the same 3px rule.
- The site is set in M PLUS 1p at weights 400, 700 and 900 — those three only, so `font-weight` values in between do not silently round to a face that is not shipped. Its squared-off letterforms share a skeleton with the pixel artwork. Japanese and English pages use the same family, so switching language does not change the site's voice.
- Fonts are self-hosted as subsets under `public/fonts/`, never loaded from Google Fonts: no third-party request, and nothing to disclose in the privacy notice. See README.md for how to rebuild the subsets after adding text.

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
