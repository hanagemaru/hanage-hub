# Project status

Last updated: 2026-09-11

## Current state

- Repository: https://github.com/hanagemaru/hanage-hub
- Hosting: Cloudflare Workers (Static Assets)
- Production branch: `main`
- Primary public URL: https://hanage.app/
- Additional custom domain: https://www.hanage.app/
- Worker URL: https://hanage-hub.jibunnha.workers.dev/
- Netlify project: `hanage-hub` remains available at https://hanage-hub.netlify.app/ for rollback; its custom domains are detached
- Cloudflare deployment: Repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are registered, and `CLOUDFLARE_DEPLOY=true`
- Access analytics: Cloudflare Web Analytics (cookie-less), live since 2026-09-06. The site was added with **Manual setup** — automatic injection does not apply because the hub is served through a Workers custom domain. The beacon is rendered by `src/components/WebAnalytics.tsx` only when the build-time variable `NEXT_PUBLIC_CF_BEACON_TOKEN` is set, which `deploy.yml` fills from the repository variable `CF_BEACON_TOKEN`. That variable is set, and the first build carrying the beacon was the manual `Deploy` run on 2026-09-06. No token is stored in the repository.
- Status: the catalog lists Multicolor Sweeper and Putt. The hub is live on Cloudflare and was verified on the root, `www`, and `workers.dev` URLs on 2026-09-05
- Multicolor Sweeper is live at `https://mcsweeper.hanage.app/`; the custom domain was added to its Cloudflare Worker and verified on iPhone on 2026-09-05. hanage-hub PR #10 switched `GAME_URLS.multicolorSweeper` to this URL.
- Putt is live at `https://putt.hanage.app/`; its Cloudflare Worker (`putt.jibunnha.workers.dev`) was deployed and the custom domain verified on iPhone on 2026-09-06. `GAME_URLS.putt` now points at this URL. The Putt repository still deploys to GitHub Pages (`https://hanagemaru.github.io/putt/`) in parallel as a fallback; that workflow is retired only after a settling period.

### Domain and DNS (updated 2026-09-05)

- `hanage.app` is registered at Onamae.com and is an active Cloudflare zone (Free plan).
- Nameservers were changed at the registrar to `cecelia.ns.cloudflare.com` / `dean.ns.cloudflare.com`.
  The domain registration itself stays at Onamae.com; only DNS moved.
- The old Netlify records were removed:
  - `hanage.app` A record pointing to `75.2.60.5`
  - `www.hanage.app` CNAME pointing to `hanage-hub.netlify.app`
- Cloudflare Workers Custom Domains now connect both `hanage.app` and `www.hanage.app` directly to the `hanage-hub` Worker.
- `mcsweeper.hanage.app` is connected as a Custom Domain to the `multicolor-sweeper` Worker and is live.
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
  - Multicolor Sweeper: `mcsweeper.hanage.app` (live)
  - Putt: `putt.hanage.app` (live)
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
4. ~~Attach `mcsweeper.hanage.app` to the Multicolor Sweeper Worker and switch the hub link to it.~~ Done on 2026-09-05.
5. ~~Move Putt off GitHub Pages to `putt.hanage.app`.~~ Done on 2026-09-06.
6. ~~Update Putt's `GAME_URLS` entry when its custom domain is ready.~~ Done on 2026-09-06.
   Still pending: stop Putt's GitHub Pages workflow after its settling period, and retire the Netlify deployment after the rollback period.

Phase C (hub content) — done on 2026-09-04

7. ~~Remove Gradient Sweeper, add Multicolor Sweeper and Putt, refresh privacy/terms/contact.~~

Phase D (advertising)

8. ~~Apply for AdSense once `hanage.app` serves the finished hub and the published games are in a stable, playable state.~~ **Review requested on 2026-09-10; awaiting the result.** The AdSense account existed from an earlier attempt and had been deactivated for inactivity, so it was reactivated rather than replaced — Google allows only one account per person, and a second one risks losing both. The site registered at the time was `gradient-minesweeper.web.app` (Gradient Sweeper, which this project decided not to publish); it was removed and `hanage.app` added in its place. Ownership was verified by Google on 2026-09-10 against the live site, which is the only end-to-end confirmation that PR #19's script is serving — the agent environment's egress policy blocks `hanage.app`, so no session can check production directly. **Putt cleared its own side on 2026-09-10**: its review-readiness milestone (P0-1 to P0-3 in the Putt repository's `RELEASE_PLAN.md` and `PROJECT_STATUS.md`) is met and device-verified, so nothing in Putt blocks listing it.
    If the result is a rejection, the likeliest ground is thin content: the reviewed property is `hanage.app`, whose pages are a catalog, while the games themselves live on `putt.hanage.app` and `mcsweeper.hanage.app` and are not part of what is reviewed. The English pages are translations of the Japanese ones, so 22 pages read closer to 11 to a reviewer. Thickening `/updates/` and the how-to-play bodies is the response.
    If the result is approval, check whether **auto ads** are on before anything else. Left on, Google inserts ads on its own — ignoring the placement rules in `docs/ADVERTISING_POLICY.md` and each game's spec, and making the privacy policy's advertising paragraph false the moment one renders (item 8 under Next likely tasks). Turn it off, then place ads deliberately.
9. ~~Add visible `https://hanage.app/privacy/` links to each game.~~ Done: Multicolor Sweeper on 2026-09-05, Putt on 2026-09-09. Since 2026-09-10 both games build the URL from the in-game language (see item 13), so English players reach `/en/privacy/`.
10. Set up a certified consent management platform and publish `ads.txt`. Both wait on approval: `ads.txt` carries the publisher ID (place it at `public/ads.txt`, served at `/ads.txt`), and Funding Choices only lets an approved account author a message.
11. Define Multicolor Sweeper's game-specific ad timing, then implement H5 Games Ads in Multicolor Sweeper and Putt after the required approvals.

## Next likely tasks

1. Set repository variable `HUB_SMOKE_URL` to `https://hanage.app/` so future deployments verify the public URL.
2. Confirm that Cloudflare Web Analytics is recording page views for `hanage.app` (allow up to about 30 minutes after the first visit).
3. Verify the hub and Multicolor Sweeper on iPhone/iPad and confirm the PWA install/startup flow before public-release QA is closed.
4. ~~Add a Putt deletion path to the privacy policy's 保存期間・削除 section once Putt ships online rankings.~~ Done on 2026-09-08: the section now describes ranking-bearing titles in general instead of naming Multicolor Sweeper, so no edit is needed when Putt ships rankings.
5. ~~After the hub and published games pass release QA, apply for AdSense without waiting for every planned Putt feature.~~ Done on 2026-09-10: review requested, result pending. See Phase D item 8.
6. After a short rollback period, stop the Netlify build; remove `netlify.toml` in a separate PR once rollback is no longer needed.
7. Define Multicolor Sweeper's ad timing before any ad implementation.
8. On the day ads first serve, replace the privacy policy's 「本ページの最終更新時点で……広告を配信していません」 paragraph with the services actually in use. The sentence is accurate today and during review — the AdSense script has loaded on every page since 2026-09-10, but no ad unit renders — and becomes false the moment one does.
    Write the replacement so it does not need dating. The current wording is of the form 「as of now we do not do X, but we plan to」, which is guaranteed to go stale at an unpredictable moment and is why this item exists; `docs/ADVERTISING_POLICY.md` only ever required disclosure at introduction time, so the promise was never needed. Describe what the site does in terms that stay true whether or not an ad is currently rendering, and this item can be closed for good rather than re-armed.
9. ~~Decide the contact SNS handle, then fill `OWNER.social` in `src/lib/site.ts`.~~ Done on 2026-09-09: X `@hanageapp` (https://x.com/hanageapp).
10. Re-capture Putt screenshots after the next UI pass. The three now in `putt.shots` were re-taken on 2026-09-09 against `abf77d6` and are current, but Putt's UI is still being adjusted.
11. ~~Review the redrawn Multicolor Sweeper and Putt PWA icons on a device home screen.~~ Merged to `main` in both repositories on 2026-09-09; still worth a look on a real home screen.
12. The hub is bilingual as of 2026-09-09. English pages are under `/en/`; Japanese paths are unchanged. See the Languages section under URL structure in `docs/SITE_PLAN.md`.
13. Both games already ship Japanese and English in-game (`src/i18n.ts` in each). Two follow-ups once the hub's English pages are live:
    - ~~Putt's `HOW_TO_URL` and `PRIVACY_URL` (`src/entry.ts`) and Multicolor Sweeper's privacy link (`src/App.tsx`) point at the Japanese hub pages regardless of the in-game language.~~ Done on 2026-09-09: both games now build hub URLs from the in-game language through a single `hubUrl()` helper, so English sends players to `/en/`. Putt's `externalPageNote: '(Japanese)'` is gone.
    - ~~The three Putt screenshots in `putt.shots` predate PR #70.~~ Re-captured on 2026-09-09 from the current build (風の丘 HOLE 1/9, seed 553).
14. ~~Putt names the overhead view two ways: the button says 「マップ」/`MAP` while the notice says 「ホールマップ」/`Hole map`.~~ Settled on 2026-09-09: Putt uses 「マップ」/`MAP` everywhere, including source comments that said 「コースマップ」. The hub already used that word, so no hub copy changed.
15. ~~`putt.specs.content` is 「3コース × 9ホール」.~~ Changed on 2026-09-09 to 「9ホール ストロークプレー」/`9-hole stroke play`: it states the scale of one round and how you compete, and stays true when a fourth tour set is added to `TOUR_SETS`.
16. `howToPlay.putt` still says 「3つのコースから1つ選び、9ホールを回ります。」/"Pick one of three courses…". Same inventory count as item 15, in the how-to-play body rather than a spec tag. Left as-is for now; reword when a fourth tour set lands, or sooner if the sentence reads fine without the number.

Update this file whenever a major task is completed or a decision changes.
