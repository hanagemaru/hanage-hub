# hanage-hub

`hanage.app` で公開する、個人制作ゲーム・Webアプリのハブサイトです。

## Current deployment

- Hosting: Cloudflare Workers (Static Assets)
- Production branch: `main`
- Primary URL: https://hanage.app/
- Additional custom domain: https://www.hanage.app/
- Worker URL: https://hanage-hub.jibunnha.workers.dev/
- Netlify fallback: https://hanage-hub.netlify.app/ (custom domains detached; retirement pending)
- Multicolor Sweeper: https://mcsweeper.hanage.app/
- Putt: https://putt.hanage.app/

Game URLs are defined once in `src/lib/site.ts` (`GAME_URLS`). Update them there if a game moves to another host.

Changes merged into `main` are deployed automatically to Cloudflare when the repository variable `CLOUDFLARE_DEPLOY` is `true`.
Netlify remains temporarily available for rollback and may continue to provide Deploy Previews until it is retired.

Cloudflare Workers deployment is configured in `wrangler.jsonc` and `.github/workflows/deploy.yml`.
Operational details and remaining cleanup are in [docs/DEPLOY.md](./docs/DEPLOY.md).

## Development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Fonts

The site is set in M PLUS 1p (SIL Open Font License, see `public/fonts/OFL.txt`). The
files in `public/fonts/` are subsets holding only the characters the site actually
uses, plus all kana and ASCII, so each weight is about 65KB instead of about 670KB.
They are served from this domain — the site makes no request to Google Fonts.

**A kanji that is not in the subset falls back to the system font, so one sentence
can end up mixing two typefaces.** After adding or rewriting body text, rebuild the
subsets:

```bash
npm run build          # scripts/build-fonts.sh reads out/
bash scripts/build-fonts.sh
npm run build          # rebuild with the new subsets
```

The script needs `pyftsubset` (`pip install fonttools brotli`) and downloads the
original faces from the google/fonts repository.

## Checks

Run both checks before merging:

```bash
npm run lint
npm run build
```

## AI-assisted development

- Codex reads [AGENTS.md](./AGENTS.md).
- Claude Code reads [CLAUDE.md](./CLAUDE.md), which imports the same shared instructions.
- Current decisions and handoff notes are recorded in [docs/PROJECT_STATUS.md](./docs/PROJECT_STATUS.md).
- The longer-term site structure is recorded in [docs/SITE_PLAN.md](./docs/SITE_PLAN.md).

The site is built with Next.js and TypeScript and exported as a static site for Cloudflare Workers Static Assets.
