# Project status

Last updated: 2026-08-23

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
- Google Search Console: `hanage.app` registered as a Domain property, ownership verified via a DNS TXT record at the domain root (2026-08-14); `sitemap.xml` submitted and processed successfully (9 pages detected)
- Netlify billing: free plan, credit-based. Deploy Previews and branch deploys cost 0 credits; a production deploy (merge to `main`) costs 15; bandwidth 20 per GB; web requests 2 per 10,000. The plan grants 300 credits per month with a hard limit. About 28 credits remained on 2026-08-23 — roughly one production deploy.
- Status: custom domain is connected and serving the site; detailed design and content can be refined later

## Decisions made

- Keep the hub in its own repository, separate from individual games.
- Use a tile-based catalog layout inspired by the pre-renewal Nintendo store.
- Design mobile-first while supporting tablet and desktop layouts.
- Host individual games separately and link to them from the hub.
- Planned URL structure:
  - Hub: `hanage.app`
  - Gradient Sweeper: `sweeper.hanage.app`
- Use GitHub pull requests and Netlify Deploy Previews for review before merging. Previews are free, so use them liberally; batch changes so that merges to `main` stay rare, and always confirm with the owner before merging.
- Continue supporting both Codex and Claude Code through shared repository instructions.
- Do not apply for AdSense (or any ad network) while the site still has provisional copy/artwork; apply only after content and design are finished, and after Search Console indexing is established.

## Implemented foundation

- Next.js and TypeScript static site
- Home and supporting routes
- Responsive tile-style catalog
- Netlify static export configuration
- SEO-oriented routes and metadata files
- Open Graph image and app icons, generated from `scripts/og/template.html` (see `scripts/og/generate.sh`)
- Shared agent instructions via `AGENTS.md` and `CLAUDE.md`, with `docs/HANDOVER.md` as the entry point for a new assistant or contributor

## Next likely tasks

1. Check Google Search Console indexing status a few days after the 2026-08-14 sitemap submission (pages discovered vs. actually indexed).
2. Replace provisional copy, links, and artwork with final content.
3. Connect the Gradient Sweeper tile to its production URL when ready.
4. Verify the site on iPhone and iPad, then refine spacing and tile sizing.
5. Decide analytics, consent, advertising, and privacy details before monetization (see AdSense timing decision above).

Update this file whenever a major task is completed or a decision changes.
