# Project status

Last updated: 2026-09-05

## Current state

- Repository: https://github.com/hanagemaru/hanage-hub
- Hosting: Cloudflare Workers (Static Assets)
- Production branch: `main`
- Primary public URL: https://hanage.app/
- Additional custom domain: https://www.hanage.app/
- Worker URL: https://hanage-hub.jibunnha.workers.dev/
- Netlify project: `hanage-hub` remains available at https://hanage-hub.netlify.app/ for rollback; its custom domains are detached
- Cloudflare deployment: Repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are registered, and `CLOUDFLARE_DEPLOY=true`
- Status: the catalog lists Multicolor Sweeper and Putt. The hub is live on Cloudflare and was verified on the root, `www`, and `workers.dev` URLs on 2026-09-05

### Domain and DNS (updated 2026-09-05)

- `hanage.app` is registered at Onamae.com and is an active Cloudflare zone (Free plan).
- Nameservers were changed at the registrar to `cecelia.ns.cloudflare.com` / `dean.ns.cloudflare.com`.
  The domain registration itself stays at Onamae.com; only DNS moved.
- The old Netlify records were removed:
  - `hanage.app` A record pointing to `75.2.60.5`
  - `www.hanage.app` CNAME pointing to `hanage-hub.netlify.app`
- Cloudflare Workers Custom Domains now connect both `hanage.app` and `www.hanage.app` directly to the `hanage-hub` Worker.
- The `hanage.app` TXT `google-site-verification=...` record was kept for Search Console and AdSense.
- Two records were intentionally not carried over during Phase A: the `sweeper.hanage.app` CNAME and the Netlify
  subdomain ownership TXT. `sweeper.hanage.app` therefore no longer resolves.
- No API token values or account IDs are stored in repository files.

## Decisions made

- Keep the hub in its own repository, separate from individual games.
- Use a tile-based catalog layout inspired by the pre-renewal Nintendo store.
- Design mobile-first while supporting tablet and desktop layouts.
- Host individual games separately and link to them from the hub.
- **Publish Multicolor Sweeper and Putt. Do not publish Gradient Sweeper** (its pages, tile, and `sweeper.hanage.app` link were removed on 2026-09-04).
- **Host the hub and games on Cloudflare.** The hub moved to Cloudflare Workers Static Assets on 2026-09-05.
- **Monetize with Google AdSense and H5 Games Ads**, shown only at natural breaks inside the games. Shared rules are maintained in `docs/ADVERTISING_POLICY.md`; nothing is implemented yet.
- Keep every game URL in `src/lib/site.ts` (`GAME_URLS`) so custom domains are a one-place change.
- URL structure:
  - Hub: `hanage.app` (live)
  - Hub alias: `www.hanage.app` (live, directly attached to the same Worker)
  - Multicolor Sweeper: `mcsweeper.hanage.app` (not assigned yet)
  - Putt: `putt.hanage.app` (not assigned yet)
  - `sweeper.hanage.app` (earlier Gradient Sweeper plan) was retired on 2026-09-05 and no longer resolves
- Use GitHub pull requests for review. Netlify Deploy Previews may remain available until Netlify is retired.
- Continue supporting both Codex and Claude Code through shared repository instructions.

## Implemented foundation

- Next.js and TypeScript static site
- Home and supporting routes
- Responsive tile-style catalog with per-game artwork
- Introduction and how-to-play pages for Multicolor Sweeper and Putt
- Cloudflare Workers Static Assets production deployment
- GitHub Actions deployment from `main`
- SEO-oriented routes and metadata files
- Shared advertising and consent policy in `docs/ADVERTISING_POLICY.md`
- Public privacy policy covering current ranking data, hosting providers, deletion requests, and the fact that advertising is planned but not yet in use
- Multicolor Sweeper's settings screen links to `https://hanage.app/privacy/` and provides self-service deletion of its display name and online ranking records; the public privacy policy documents that flow
- Shared agent instructions via `AGENTS.md` and `CLAUDE.md`

## Migration and monetization plan

Phase A (owner, account work — nothing in this repository) — done on 2026-09-05

1. ~~Point `hanage.app` nameservers at Cloudflare.~~
2. ~~Give the Cloudflare API token Workers Scripts: Edit **and** Workers D1: Edit.~~

Phase B (hosting)

3. ~~Serve the hub from Cloudflare Workers Static Assets and attach `hanage.app`.~~ Done on 2026-09-05.
   `www.hanage.app` is also attached to the same Worker.
4. Attach `mcsweeper.hanage.app` to the Multicolor Sweeper Worker.
5. Move Putt off GitHub Pages to `putt.hanage.app`.
6. Update `GAME_URLS` and retire the Netlify deployment.

Phase C (hub content) — done on 2026-09-04

7. ~~Remove Gradient Sweeper, add Multicolor Sweeper and Putt, refresh privacy/terms/contact.~~

Phase D (advertising)

8. Apply for AdSense once `hanage.app` serves the finished hub.
9. Add visible `https://hanage.app/privacy/` links to each game. Multicolor Sweeper is complete as of 2026-09-05; Putt remains pending.
10. Set up a certified consent management platform and publish `ads.txt`.
11. Define Multicolor Sweeper's game-specific ad timing, then implement H5 Games Ads in Multicolor Sweeper and Putt.

## Next likely tasks

1. Set repository variable `HUB_SMOKE_URL` to `https://hanage.app/` so future deployments verify the public URL.
2. Assign `mcsweeper.hanage.app` to the Multicolor Sweeper Worker, then update `GAME_URLS` from the `workers.dev` URL to the custom domain.
3. Verify the hub and Multicolor Sweeper on iPhone/iPad and confirm the PWA install/startup flow before public-release QA is closed.
4. Move Putt off GitHub Pages to `putt.hanage.app`, then update `GAME_URLS` when its release build is ready.
5. Add the privacy-policy link to Putt before advertising is enabled there.
6. After a short rollback period, stop the Netlify build; remove `netlify.toml` in a separate PR once rollback is no longer needed.
7. Define Multicolor Sweeper's ad timing before any ad implementation.
8. Flip Putt's tile from `まもなく公開` to `公開中` when its release build ships.

Update this file whenever a major task is completed or a decision changes.
