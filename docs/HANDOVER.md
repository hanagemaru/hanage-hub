# Handover guide

Start here if you are a new assistant, agent, or contributor picking up this
repository. It is written to be self-contained: everything needed to continue
the work is either on this page or linked from it.

Last updated: 2026-08-23

## Reading order

1. This file — the map of the project and the working agreement.
2. [`AGENTS.md`](../AGENTS.md) — the binding rules for anyone editing the code.
   `CLAUDE.md` only imports it, so both files always say the same thing.
3. [`docs/PROJECT_STATUS.md`](./PROJECT_STATUS.md) — what is live right now,
   which decisions are settled, and what the next tasks are. **This is the file
   to update when something changes.**
4. [`docs/SITE_PLAN.md`](./SITE_PLAN.md) — the intended URL structure and the
   longer-term design direction.
5. [`README.md`](../README.md) — build commands and deployment basics.

## What this project is

`hanage-hub` is the public entrance for games and small web apps made by
hanagemaru. It is a catalog, not an app platform: each product lives in its own
repository, is deployed separately, and is linked to from here. The look is a
mobile-first tile grid inspired by the pre-renewal Nintendo store.

Live at <https://hanage.app/>. Currently one product is listed:
Gradient Sweeper (<https://sweeper.hanage.app/>).

## Repository map

```
AGENTS.md              Binding instructions for AI assistants. CLAUDE.md imports it.
CLAUDE.md              One line: @AGENTS.md
README.md              Build commands, deployment, image regeneration
netlify.toml           Netlify build config: `npm run build`, publish `out`
next.config.ts         output: "export" + trailingSlash: true (static export)

docs/
  HANDOVER.md          This file
  PROJECT_STATUS.md    Current state, decisions, next tasks  ← keep updated
  SITE_PLAN.md         URL structure and design direction

src/app/               Next.js App Router. One directory per route.
  layout.tsx           Root layout, site-wide metadata (title, description, OGP)
  page.tsx             Home: hero, game tiles, latest update row
  globals.css          All styling. There is no CSS framework and no CSS modules.
  robots.ts            Generates /robots.txt
  sitemap.ts           Generates /sitemap.xml — add new routes here by hand
  favicon.ico          Browser tab icon
  icon.png             512x512 app icon      ┐ generated, see below
  apple-icon.png       180x180 iOS home icon ├ Next.js picks these up
  opengraph-image.png  1200x630 share card   ┘ automatically by filename
  opengraph-image.alt.txt  Alt text for the share card
  games/               Games index + per-game pages
  about/ contact/ privacy/ terms/ updates/   Static content pages

src/components/        Small presentational components, no state
  SiteHeader.tsx  SiteFooter.tsx  PageHero.tsx  GameTile.tsx  GradientArtwork.tsx

src/lib/site.ts        The product catalog data. Adding a game starts here.

scripts/og/            Share image + icon generator (see below)
  template.html        The artwork, as plain HTML/CSS
  generate.sh          Renders it to PNG with headless Chrome
  crop_png.py          Crops/downscales the screenshots (no dependencies)
```

## Local development

```bash
npm ci        # install (do not use `npm install` unless changing dependencies)
npm run dev   # http://localhost:3000
```

Before proposing a merge, both of these must pass:

```bash
npm run lint
npm run build
```

`npm run build` writes the static site to `out/`, which is what Netlify
publishes. `out/` and `.next/` are gitignored.

## Deployment and the credit budget

Netlify is connected to this GitHub repository. `main` is the production
branch: merging to `main` deploys to <https://hanage.app/>.

**Netlify is on the free plan and the credit balance is low. This shapes how
work is delivered.** As of 2026-08 Netlify bills in credits:

| Action | Cost |
| --- | --- |
| Deploy Preview (pull request), branch deploy | **0 credits — free and unlimited** |
| Production deploy (merge to `main`) | **15 credits** |
| Bandwidth | 20 credits per GB |
| Web requests | 2 credits per 10,000 |
| Failed build, rollback | 0 credits |

The free plan grants 300 credits per month with a hard limit and no overage.
As of 2026-08-23 roughly 28 credits remained in the cycle — about one
production deploy.

The practical rule that follows:

- **Use pull requests and Deploy Previews freely.** They cost nothing and are
  the right place to check a change on a real phone.
- **Batch changes and merge to `main` rarely.** Every merge costs 15 credits.
- **Never merge to `main` without asking the owner first.** This is a hard
  rule, not a courtesy.

## External services the owner operates

The owner does this work in a browser; an assistant cannot reach these. Guide
them one screen at a time — see the working agreement below.

- **Netlify** — hosting, custom domain, deploy history, credit balance.
  Project name `hanage-hub`.
- **お名前.com** — the registrar for `hanage.app`. DNS is configured there:
  `hanage.app` A record → `75.2.60.5`, `www.hanage.app` CNAME →
  `hanage-hub.netlify.app`.
- **Google Search Console** — `hanage.app` is registered as a Domain property,
  verified by a DNS TXT record. `sitemap.xml` was submitted on 2026-08-14.

Never commit credentials, tokens, analytics IDs, or advertising IDs. Never
change domains, hosting settings, or monetization behavior without explicit
approval from the owner.

## Working agreement with the owner

The owner does not write code. This changes how to work with them:

- **Go one step at a time and confirm before moving on.** Do not deliver a
  large batch of unexplained changes.
- **When they need to operate a browser UI** (Netlify, Search Console,
  お名前.com), explain **one screen at a time**. Do not dump the whole
  procedure in a single message.
- **Explain what a change does and why it matters**, not how it is implemented.
- **Ask before anything that costs money or is hard to undo** — merging to
  `main` above all.
- **Japanese is the working language for anything the owner reads.** That means
  conversation and **pull request titles and descriptions**, as well as the
  site's own copy. Code, commit messages, and these documents stay in English.
  A pull request is where the owner reviews the work, so write its description
  for them: what changed and why it matters, not how it is implemented.

## Regenerating the share image and icons

`src/app/opengraph-image.png`, `icon.png`, and `apple-icon.png` are committed,
so a normal build needs no extra tooling. They are generated from a single HTML
file:

```bash
scripts/og/generate.sh          # or: CHROME=/path/to/chrome scripts/og/generate.sh
```

Edit `scripts/og/template.html` and re-run. The script needs a Chromium or
Chrome binary and network access to fonts.googleapis.com (the template loads
Noto Sans JP). It works around two headless Chrome behaviors that are easy to
trip over again: the screenshot file is as tall as `--window-size` even though
only the shorter viewport is painted, and very small windows are refused — so
the 180px icon is rendered at 720px and scaled down by `crop_png.py`.

## Constraints and gotchas

- **Static export only.** `next.config.ts` sets `output: "export"`. Server
  Components that run at request time, Route Handlers, Middleware, Server
  Actions, and `next/image` optimization are unavailable. Do not add a feature
  that requires a Node server unless the hosting strategy is deliberately
  changed with the owner's approval.
- **`trailingSlash: true`.** Internal links must end with a slash
  (`/games/gradient-sweeper/`), and so must the entries in `sitemap.ts`.
- **`sitemap.ts` is a hand-maintained list.** A new route is not in the sitemap
  until it is added there.
- **The block at the top of `AGENTS.md` is generated.** `next dev` rewrites it
  between the `nextjs-agent-rules` markers. If it reappears as an uncommitted
  change, commit it with the rest of the work rather than reverting it.
- **All styling lives in `src/app/globals.css`.** Match the existing class
  naming rather than introducing a styling library.
- **Check mobile width first.** The design is mobile-first; desktop is the
  secondary case.

## Current state and what is next

See [`docs/PROJECT_STATUS.md`](./PROJECT_STATUS.md) — it is the single source
of truth for both, and is kept current. Update it whenever a major task is
completed, a decision changes, or the deployment setup changes.
