# Project status

Last updated: 2026-09-05

## Current state

- Repository: https://github.com/hanagemaru/hanage-hub
- Hosting: Netlify, connected to this GitHub repository
- Netlify project name: `hanage-hub`
- Production branch: `main`
- Current public URL: https://hanage-hub.netlify.app/
- Planned primary domain: https://hanage.app/
- Status: initial hub site is deployed; detailed design and content can be refined later

### Domain and DNS (updated 2026-09-05)

- `hanage.app` is registered at Onamae.com and is now an active Cloudflare zone (Free plan).
- Nameservers were changed at the registrar to `cecelia.ns.cloudflare.com` / `dean.ns.cloudflare.com`.
  The domain registration itself stays at Onamae.com; only DNS moved.
- DNS records carried over to Cloudflare, all set to DNS only (grey cloud) because the origin is still Netlify:
  - `hanage.app` A record pointing at Netlify
  - `www.hanage.app` CNAME to `hanage-hub.netlify.app`
  - `hanage.app` TXT `google-site-verification=...` (keep this; it is needed for Search Console and AdSense)
- Two records were intentionally not carried over: the `sweeper.hanage.app` CNAME and the Netlify
  subdomain ownership TXT. `sweeper.hanage.app` therefore no longer resolves.
- Hosting still runs on Netlify. When the hub moves to Cloudflare, switch the A/CNAME records to
  proxied (orange cloud) at that point.
- The shared Cloudflare API token `github-actions-deploy (Workers + D1)` includes `Cloudflare Pages: Edit`,
  so no new token is needed to deploy this site from GitHub Actions to Cloudflare.

## Decisions made

- Keep the hub in its own repository, separate from individual games.
- Use a tile-based catalog layout inspired by the pre-renewal Nintendo store.
- Design mobile-first while supporting tablet and desktop layouts.
- Host individual games separately and link to them from the hub.
- Planned URL structure:
  - Hub: `hanage.app`
  - Multicolor Sweeper: `mcsweeper.hanage.app` (not assigned yet)
  - Putt: `putt.hanage.app` (not assigned yet)
  - `sweeper.hanage.app` (earlier Gradient Sweeper plan) was retired on 2026-09-05 and no longer resolves
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

1. Point `hanage.app` at this site. The Cloudflare zone is ready; what remains is choosing whether the
   hub stays on Netlify or moves to Cloudflare, then updating the DNS records accordingly.
2. Replace provisional copy, links, and artwork with final content.
3. Connect the Gradient Sweeper tile to its production URL when ready.
4. Verify the site on iPhone and iPad, then refine spacing and tile sizing.
5. Decide analytics, consent, advertising, and privacy details before monetization.

Update this file whenever a major task is completed or a decision changes.
