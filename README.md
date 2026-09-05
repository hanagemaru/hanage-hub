# hanage-hub

`hanage.app` で公開する、個人制作ゲーム・Webアプリのハブサイトです。

## Current deployment

- Hosting: Cloudflare Workers (Static Assets)
- Production branch: `main`
- Primary URL: https://hanage.app/
- Additional custom domain: https://www.hanage.app/
- Worker URL: https://hanage-hub.jibunnha.workers.dev/
- Netlify fallback: https://hanage-hub.netlify.app/ (custom domains detached; retirement pending)
- Multicolor Sweeper: https://multicolor-sweeper.jibunnha.workers.dev/ (planned: https://mcsweeper.hanage.app/)
- Putt: https://hanagemaru.github.io/putt/ (planned: https://putt.hanage.app/)

Game URLs are defined once in `src/lib/site.ts` (`GAME_URLS`). Update them there when the custom domains are assigned.

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
