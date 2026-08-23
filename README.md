# hanage-hub

`hanage.app` で公開する、個人制作ゲーム・Webアプリのハブサイトです。

## Current deployment

- Netlify project: `hanage-hub`
- Production branch: `main`
- Primary domain: https://hanage.app/ (custom domain connected, HTTPS via Let's Encrypt)
- Netlify default URL: https://hanage-hub.netlify.app/
- Gradient Sweeper: https://sweeper.hanage.app/

Changes merged into `main` are deployed automatically by Netlify. Pull requests receive Deploy Previews when Netlify creates them.

## Development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

Run both checks before merging:

```bash
npm run lint
npm run build
```

## Share images and icons

The Open Graph image (`src/app/opengraph-image.png`) and the app icons
(`src/app/icon.png`, `src/app/apple-icon.png`) are committed to the repository.
They are generated from `scripts/og/template.html`:

```bash
scripts/og/generate.sh
```

The script needs a Chromium/Chrome binary (set `CHROME=` to point at one) and
network access to fonts.googleapis.com. Re-run it only when the artwork changes.

## AI-assisted development

- New assistants and contributors should start with [docs/HANDOVER.md](./docs/HANDOVER.md).
- Codex reads [AGENTS.md](./AGENTS.md).
- Claude Code reads [CLAUDE.md](./CLAUDE.md), which imports the same shared instructions.
- Current decisions and handoff notes are recorded in [docs/PROJECT_STATUS.md](./docs/PROJECT_STATUS.md).
- The longer-term site structure is recorded in [docs/SITE_PLAN.md](./docs/SITE_PLAN.md).

The site is built with Next.js and TypeScript and exported as a static site for Netlify.
