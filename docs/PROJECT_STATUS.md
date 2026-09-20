# Project status

Last updated: 2026-09-20

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

### Visual design refresh (in production since 2026-09-12)

PR #23 (merge commit `9dcdde5`) landed the exterior change described under Design direction in `docs/SITE_PLAN.md`, and it was verified against the live site on 2026-09-12:

- Rounded corners and shadows are gone; `--radius` and `--shadow` no longer exist. The production stylesheet contains no `border-radius` and no `box-shadow`.
- Line weight carries meaning in three steps: `--frame` (3px) only on game artwork, `--rule` (1px) on containers for text, and nothing on pressable things, which are shown by colour alone.
- Body type is M PLUS 1p, self-hosted as subsets at `public/fonts/m-plus-1p-{400,700,900}.woff2`. No Google Fonts request is made. All three weights serve as `font/woff2` and are byte-identical to the files in the repository.
- The yellow 「公開中」 badge is gone. `GameText.status` is `string | null`, and a label is set only for something that is *not* published; both current games carry `null`.
- The subsets cover 821 codepoints against the 493 distinct characters the 20 published pages actually render, so no character falls back to another face mid-sentence. Re-check this headroom when adding page copy.

Three defects found during that verification were fixed the same day:

- The primary button and the blue link text failed WCAG AA. `--blue` was `#3878f2`, giving 4.09:1 for white on the button (16px/900, so the 4.5:1 threshold applies) and 3.71:1 for link text on `--paper`. It is now `#2b64d8`: 5.36:1 and 4.86:1.
- The language switch was a 16% white wash on the header, only 1.63:1 against it, so the control did not read as a surface. It is now a solid `--mark-ink` chip with `--ink` text at 14.86:1, which is also what "pressable things are shown by colour" asks for.
- Tile descriptions could drop a lone `ー` onto the last line at narrow widths. `.tileMeta p` now sets `line-break: strict` and `text-wrap: balance`.

Verification note: screenshots were taken against a local build of the same commit, because Chromium could not complete a TLS handshake through the session's egress proxy even after `hanage.app` itself became reachable by `curl`. That substitution is sound only because the production stylesheet hashed identically to the local build's, the font files matched by checksum, and the served HTML differed only by the AdSense and Cloudflare Analytics script tags. Check those three things before trusting the same shortcut again.

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

8. ~~Apply for AdSense once `hanage.app` serves the finished hub and the published games are in a stable, playable state.~~ **Requested on 2026-09-10, rejected on 2026-09-19 for 有用性の低いコンテンツ (low-value content). Re-application is blocked on content, not on anything technical.** The AdSense account existed from an earlier attempt and had been deactivated for inactivity, so it was reactivated rather than replaced — Google allows only one account per person, and a second one risks losing both. The site registered at the time was `gradient-minesweeper.web.app` (Gradient Sweeper, which this project decided not to publish); it was removed and `hanage.app` added in its place. Ownership was verified by Google on 2026-09-10 against the live site, which is the only end-to-end confirmation that PR #19's script is serving — at the time, the agent environment's egress policy blocked `hanage.app`; that restriction was lifted and production was checked directly on 2026-09-12 (see the design refresh section under Current state). **Putt cleared its own side on 2026-09-10**: its review-readiness milestone (P0-1 to P0-3 in the Putt repository's `RELEASE_PLAN.md` and `PROJECT_STATUS.md`) is met and device-verified, so nothing in Putt blocks listing it.
    The rejection named exactly the ground this item predicted, and nothing else. Ownership verification stayed green, so PR #19's script is confirmed working; the account is neither banned nor suspended, and the site can be resubmitted any number of times. The rejection does not identify individual pages. Thin catalog copy is a working hypothesis, not a confirmed cause; ordinary subdomains are managed with their parent domain in AdSense, so do not assume the games were excluded from review. The English pages are translations of the Japanese ones, so 22 pages read closer to 11. Measured against the content files, only the two how-to-play pages carry real body text: each game detail page is one or two sentences plus a spec table, `/updates/` is three one-line entries, and `/about/` is a few lines.
    Do not tick 「問題を修正しました」 and resubmit until the site has actually changed; an unchanged resubmission fails the same way and repeated ones are worth avoiding. Leave the AdSense script in place meanwhile — it is what the reviewer looks for. See item 18 under Next likely tasks for what to add before resubmitting.
    On approval, check whether **auto ads** are on before anything else. Left on, Google inserts ads on its own — ignoring the placement rules in `docs/ADVERTISING_POLICY.md` and each game's spec, and making the privacy policy's advertising paragraph false the moment one renders (item 8 under Next likely tasks). Turn it off, then place ads deliberately.
9. ~~Add visible `https://hanage.app/privacy/` links to each game.~~ Done: Multicolor Sweeper on 2026-09-05, Putt on 2026-09-09. Since 2026-09-10 both games build the URL from the in-game language (see item 13), so English players reach `/en/privacy/`.
10. Set up a certified consent management platform and publish `ads.txt`. Both wait on approval: `ads.txt` carries the publisher ID (place it at `public/ads.txt`, served at `/ads.txt`), and Funding Choices only lets an approved account author a message.
11. Define Multicolor Sweeper's game-specific ad timing, then implement H5 Games Ads in Multicolor Sweeper and Putt after the required approvals.

## Next likely tasks

1. Set repository variable `HUB_SMOKE_URL` to `https://hanage.app/` so future deployments verify the public URL.
2. Confirm that Cloudflare Web Analytics is recording page views for `hanage.app` (allow up to about 30 minutes after the first visit).
3. Verify the hub and Multicolor Sweeper on iPhone/iPad and confirm the PWA install/startup flow before public-release QA is closed.
4. ~~Add a Putt deletion path to the privacy policy's 保存期間・削除 section once Putt ships online rankings.~~ Done on 2026-09-08: the section now describes ranking-bearing titles in general instead of naming Multicolor Sweeper, so no edit is needed when Putt ships rankings.
5. ~~After the hub and published games pass release QA, apply for AdSense without waiting for every planned Putt feature.~~ Done on 2026-09-10; rejected on 2026-09-19 for low-value content. See Phase D item 8 and item 18 below.
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

17. The self-hosted fonts are served with `cache-control: public, max-age=0, must-revalidate`, so every page load revalidates them, and no `<link rel="preload">` is emitted for them. Neither is a regression and both are cheap to live with, but a long `max-age` on these immutable files plus a preload would remove the brief fallback flash that `font-display: swap` allows. Both are hosting-configuration changes and need the owner's approval first.

18. **Thicken `hanage.app` before resubmitting to AdSense** (Phase D item 8). The gap is original writing that lives on the reviewed domain, not page count, and not anything on the game subdomains. In rough order of weight:
    - **Development notes.** First-hand material no one else can write, and the strongest single asset here: rolling the ball without a physics engine, how swipe speed is measured (and why `swipe-test` exists), making the heightmap the one source of truth for both rendering and physics, why the bombs are coloured and what changes between three and four colours, why Gradient Sweeper was dropped and rebuilt. The source material is already in each repository's `TASKS.md`, `docs/spec.md`, and commit history.
    - **Strategy writing**, one level past the how-to-play pages: readable patterns in the coloured numbers, reading a slope, when the rough and the second cut matter.
    - `/updates/` currently holds three one-line entries. Give each a date and a few sentences of what actually changed.
    - `/about/` is a few lines. Who runs this, why, and on what terms.
    Practical constraints: do not change or remove any existing URL, add the new section under a fresh path, Japanese first with English translations following, and allow two to four weeks after publishing for Google to recrawl before ticking 「問題を修正しました」.

19. **Start audience building on X now, ahead of any ad approval.** Decided on 2026-09-20; the reasoning, so it is not re-litigated:
    - The revenue "lost" by running unmonetised during the pre-approval window is negligible. Even an optimistic two months at 5,000 plays per month with two ad slots per play is roughly 20,000 impressions, about $100 gross at a $5 eCPM, so $45–90 after a 45–90% share — less than the X Ads budget it would take to reach that traffic. Traffic is an asset and impressions are a flow; buying the asset two months earlier is worth more than two months of flow.
    - AdSense does not use traffic volume as an approval criterion, and the game ad networks pay nothing below their minimum payout (GameMonetize: $30). Traffic is therefore a precondition for every monetisation path, not an alternative to approval. The two tracks are independent and neither should wait on the other.
    - Acquisition is a skill with a multi-week feedback loop. Learning it while impressions are worthless is cheaper than learning it after they have a price.
    - **Organic before paid**, as the 集客準備 section above already records. Paid promotion amplifies what already works, so it needs a post with organic traction to amplify and a retention signal to read. Both are missing until in-game event measurement lands (see that section: page views are not a proxy for plays).
    - **Paid acquisition must stay on X's own ad products.** Legitimate paid promotion to real users is allowed alongside AdSense; traffic exchanges, paid-per-click-to-site schemes and incentivised clicks are invalid traffic and risk the account.
    - Useful side effect: the material written to promote the games on X — development notes, design reasoning, per-update detail — is the same material item 18 asks for. Posting it to X first and copying it under a new path on `hanage.app` makes the second use nearly free, which is the cheapest available route through item 18.

20. **Ad networks other than AdSense are a live option for the games.** Researched on 2026-09-20 for the case where `hanage.app` stays thin. Neither is chosen; no SDK has been added, and `putt/CLAUDE.md` requires explicit approval before any new dependency.
    - **GameMonetize**: 45% to the developer, and 45% + 45% when the developer also owns the site the game is served from, which is the case here (`putt.hanage.app`, `mcsweeper.hanage.app`). NET 30 via PayPal or USDT, $30 minimum, balance carried forward. Per-game ID, a verify step, then a content manager activates the game.
    - **GameDistribution (Azerion)**: 33% to the developer in an equal three-way split, so 66% when also the publisher. Self-hosting is supported. Imposes response-time obligations on the developer.
    - Both are distribution catalogues first: SDK integration is mandatory and GameDistribution's developer licence is non-exclusive **with the right to sublicense**, so the game is syndicated to third-party portals. Lighter than the Poki/CrazyGames terms that were ruled out — own site and branding are kept, no exclusivity — but not free of them. Whether either can be used for own-site traffic only, and whether a preroll is mandatory, are unconfirmed and decide the question: a forced preroll conflicts with Putt's rule that ads show at the end of three holes and before a new game, never before play begins.
    - Figures come from search results; the agent environment cannot reach either vendor's site. Confirm on their own pages before signing up.
    - Item 8 applies to these too: the privacy policy's 「広告を配信していません」 paragraph becomes false when an ad renders from **any** network, and the disclosure must name the vendor actually in use.

Update this file whenever a major task is completed or a decision changes.

## 集客準備の更新（2026-09-20）

- Puttの遊び方を現行の4コースとランキングに合わせ、練習の進め方を日英で追記。
- Puttランキングの保存内容・打ち出し記録・削除導線を日英のプライバシーポリシーに反映。レート制限の削除は実装どおり「24時間超の行を次の登録時に削除」と記載（下書きの厳密な24時間破棄とは異なる）。
- 再審査前の内容改善と、Xでの無料集客・計測確認を並行する。有料集客の拡大は継続利用と広告収益を実測した後。
- 両ゲームの解析PR（Putt #85 / Sweeper #50）を本番ドメイン限定に修正。各サイトの `CF_BEACON_TOKEN` 設定・配信後の受信確認が必要。PVはプレイ開始・終了・再訪の指標ではなく、ゲーム内イベント計測は別途必要。
- X投稿そのもの・有料広告の購入・AdSense再申請はまだ行っていない。
