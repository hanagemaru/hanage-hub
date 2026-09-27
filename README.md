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

## 文章の直し方

運営者が直す文章は、コードではなく `content/` の Markdown に置いています。

| ファイル | 出る場所 |
|---|---|
| `content/<言語>/notes/<slug>.md` | 制作ノート（`/notes/<slug>/`）。ファイル名がURLになる |
| `content/<言語>/games/<slug>.md` | ゲーム紹介ページの「作者のことば」 |
| `content/<言語>/about.md` | このサイトについて |

- 空行で段落が分かれます。段落の中の改行は、そのまま改行として表示されます（標準の Markdown と違う点）。
- 使える書き方は `## 見出し`、`- 箇条書き`、`**太字**`、`[文字](URL)`、`![説明](/path.jpg)` だけ。
- ノートの先頭の `---` の間には `title`、`date`（YYYY-MM-DD）、関係する作品があれば `game`（`putt` か `multicolorSweeper`）を書く。`description` を書かなければ、最初の段落が一覧の抜粋になる。
- ノートは日本語と英語の両方に同じファイル名で置く。片方だけだとビルドが落ちる。
- 漢字を足したら、下のフォントの手順でサブセットを作り直す。

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
