# Project status

Last updated: 2026-08-14

## Current state

- Repository: https://github.com/hanagemaru/hanage-hub
- Hosting: Netlify, connected to this GitHub repository
- Netlify project name: `hanage-hub`
- Production branch: `main`
- Primary domain: https://hanage.app/ — connected and live, set as Primary domain in Netlify
- Netlify default URL: https://hanage-hub.netlify.app/
- DNS (registrar: お名前.com):
  - `hanage.app` — A record → `75.2.60.5`
  - `www.hanage.app` — CNAME → `hanage-hub.netlify.app` (redirects to `hanage.app`)
- HTTPS: Let's Encrypt certificate issued for the custom domain
- Status: custom domain is connected and serving the site; detailed design and content can be refined later

## Decisions made

- Keep the hub in its own repository, separate from individual games.
- Use a tile-based catalog layout inspired by the pre-renewal Nintendo store.
- Design mobile-first while supporting tablet and desktop layouts.
- Host individual games separately and link to them from the hub.
- Planned URL structure:
  - Hub: `hanage.app`
  - Gradient Sweeper: `sweeper.hanage.app`
- Use GitHub pull requests and Netlify Deploy Previews for review before merging.
- Continue supporting both Codex and Claude Code through shared repository instructions.

## Implemented foundation

- Next.js and TypeScript static site
- Home and supporting routes
- Responsive tile-style catalog
- Netlify static export configuration
- SEO-oriented routes and metadata files
- Shared agent instructions via `AGENTS.md` and `CLAUDE.md`

## Next likely tasks

1. Register `hanage.app` with Google Search Console (domain property) and submit `sitemap.xml`.
2. Replace provisional copy, links, and artwork with final content.
3. Connect the Gradient Sweeper tile to its production URL when ready.
4. Verify the site on iPhone and iPad, then refine spacing and tile sizing.
5. Decide analytics, consent, advertising, and privacy details before monetization.

Update this file whenever a major task is completed or a decision changes.
