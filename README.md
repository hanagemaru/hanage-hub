# hanage-hub

`hanage.app` で公開する、個人制作ゲーム・Webアプリのハブサイトです。

## Current deployment

- Netlify project: `hanage-hub`
- Production branch: `main`
- Current URL: https://hanage-hub.netlify.app/
- Planned primary domain: https://hanage.app/
- Multicolor Sweeper: https://multicolor-sweeper.jibunnha.workers.dev/ (planned: https://mcsweeper.hanage.app/)
- Putt: https://hanagemaru.github.io/putt/ (planned: https://putt.hanage.app/)

Game URLs are defined once in `src/lib/site.ts` (`GAME_URLS`). Update them there when the custom domains are assigned.

Changes merged into `main` are deployed automatically by Netlify. Pull requests receive Deploy Previews when Netlify creates them.

A Cloudflare Workers deployment is prepared in `wrangler.jsonc` and `.github/workflows/deploy.yml`. It is skipped until the repository variable `CLOUDFLARE_DEPLOY` is set to `true`. The switch-over steps are in [docs/DEPLOY.md](./docs/DEPLOY.md).

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

The site is built with Next.js and TypeScript and exported as a static site for Netlify.
