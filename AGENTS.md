<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Hanage Hub project instructions

## Purpose

Hanage Hub is the public hub for independently developed games and web apps. The visual direction is a mobile-first, tile-based catalog inspired by the pre-renewal Nintendo store. Keep the presentation playful, simple, and easy to scan.

## Technical baseline

- Next.js 16 App Router, React 19, and TypeScript.
- Static export is enabled in `next.config.ts`.
- Netlify builds with `npm run build` and publishes `out`.
- `main` is the production branch.
- Production preview: https://hanage-hub.netlify.app/
- Planned primary domain: https://hanage.app/

Do not add server-only Next.js features unless the hosting/export strategy is intentionally changed.

## Working rules

1. Read `README.md`, `docs/PROJECT_STATUS.md`, and the relevant part of `docs/SITE_PLAN.md` before making structural changes.
2. Preserve the tile-based catalog direction and verify mobile layouts first.
3. Keep games and apps as separate projects; link to their public URLs from this hub.
4. Do not commit credentials, analytics secrets, advertising IDs, or Netlify tokens.
5. Do not change production domains, hosting settings, or monetization behavior without explicit user approval.
6. Keep documentation updated when deployment, URL structure, major design decisions, or the current development status changes.

## Required checks

Before proposing a merge, run:

```bash
npm run lint
npm run build
```

For visual changes, also check the home page and affected routes at mobile and desktop widths.
