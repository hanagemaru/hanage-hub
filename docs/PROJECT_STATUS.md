# Project status

Last updated: 2026-09-05

## Current state

- Repository: https://github.com/hanagemaru/hanage-hub
- Hosting: Netlify, connected to this GitHub repository
- Netlify project name: `hanage-hub`
- Production branch: `main`
- Current public URL: https://hanage-hub.netlify.app/
- Planned primary domain: https://hanage.app/
- Cloudflare: `hanage.app` is now a Cloudflare zone (Phase A finished by the owner). The API token has Workers D1 edit rights.
- Status: the catalog lists Multicolor Sweeper and Putt. The hub's Cloudflare deployment is prepared but switched off; Netlify still serves production.

## Decisions made

- Keep the hub in its own repository, separate from individual games.
- Use a tile-based catalog layout inspired by the pre-renewal Nintendo store.
- Design mobile-first while supporting tablet and desktop layouts.
- Host individual games separately and link to them from the hub.
- **Publish Multicolor Sweeper and Putt. Do not publish Gradient Sweeper** (its pages, tile, and `sweeper.hanage.app` link were removed on 2026-09-04).
- **Move the hub and the games to Cloudflare.** `hanage.app` must become a Cloudflare zone first; Workers custom domains depend on it.
- **Monetize with Google AdSense and H5 Games Ads**, shown only at natural breaks inside the games. Nothing is implemented yet.
- Keep every game URL in `src/lib/site.ts` (`GAME_URLS`) so custom domains are a one-place change.
- Use GitHub pull requests and Netlify Deploy Previews for review before merging.
- Continue supporting both Codex and Claude Code through shared repository instructions.

## Implemented foundation

- Next.js and TypeScript static site
- Home and supporting routes
- Responsive tile-style catalog with per-game artwork
- Introduction and how-to-play pages for Multicolor Sweeper and Putt
- Netlify static export configuration
- SEO-oriented routes and metadata files
- Privacy policy covering rankings, and stating that advertising is planned but not yet in use
- Shared agent instructions via `AGENTS.md` and `CLAUDE.md`

## Migration and monetization plan

Phase A (owner, account work — nothing in this repository) — done on 2026-09-05

1. ~~Point `hanage.app` nameservers at Cloudflare.~~
2. ~~Give the Cloudflare API token Workers Scripts: Edit **and** Workers D1: Edit.~~

Phase B (hosting)

3. Serve the hub from Cloudflare Workers Static Assets and attach `hanage.app`.
   `wrangler.jsonc`, `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, and `docs/DEPLOY.md`
   are in place. The deploy job is skipped until the repository variable `CLOUDFLARE_DEPLOY` is `true`,
   and the custom domain is attached from the Cloudflare dashboard.
4. Attach `mcsweeper.hanage.app` to the Multicolor Sweeper Worker.
5. Move Putt off GitHub Pages to `putt.hanage.app`.
6. Update `GAME_URLS` and retire the Netlify deployment.

Phase C (hub content) — done on 2026-09-04

7. ~~Remove Gradient Sweeper, add Multicolor Sweeper and Putt, refresh privacy/terms/contact.~~

Phase D (advertising)

8. Apply for AdSense once `hanage.app` serves the finished hub.
9. Set up a certified consent management platform and publish `ads.txt`.
10. Enable H5 Games Ads and implement breaks in Multicolor Sweeper, then Putt.

## Next likely tasks

1. Finish Phase B: add the Cloudflare secrets and variables to this repository, deploy, attach `hanage.app`, then retire Netlify.
2. Replace the interim game URLs with the `hanage.app` subdomains.
3. Verify the site on iPhone and iPad, then refine spacing and tile sizing.
4. Flip Putt's tile from `まもなく公開` to `公開中` when its release build ships.

Update this file whenever a major task is completed or a decision changes.
