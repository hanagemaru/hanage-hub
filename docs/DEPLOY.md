# デプロイ手順

## 現在の配信

- 本番: Netlify（`main` を自動デプロイ、`https://hanage-hub.netlify.app/`）
- 予定: Cloudflare Workers（Static Assets）で `https://hanage.app/`

Cloudflare用の設定はこのリポジトリに入っているが、**まだ動いていない。**
GitHub Actionsの `Deploy` はリポジトリ変数 `CLOUDFLARE_DEPLOY` が `true` のときだけ実行される。

## 構成

- `next build`（`output: "export"`）が `out/` に静的サイトを書き出す
- `wrangler.jsonc` がその `out/` をStatic Assetsとして配る。Workerのコードは持たない
- `/games/` のようなURLは `out/games/index.html` が返る（`trailingSlash: true` に合わせた `html_handling`）
- 存在しないURLは `out/404.html` を返す

## Cloudflareへ切り替える手順

前提として `hanage.app` がCloudflareのゾーンになっていること。

1. GitHubの `hanagemaru/hanage-hub` に Repository secret を追加する
   - `CLOUDFLARE_API_TOKEN`（Workers Scripts: Edit を含むもの）
   - `CLOUDFLARE_ACCOUNT_ID`
2. Repository variable `CLOUDFLARE_DEPLOY` を `true` にする
3. Actions から `Deploy` を手動実行し、Workerの既定URL（`https://hanage-hub.<サブドメイン>.workers.dev/`）で表示を確認する
4. Cloudflare の Workers & Pages → `hanage-hub` → Settings → Domains & Routes で `hanage.app` を追加する
5. `https://hanage.app/` で全ページを確認する
6. Repository variable `HUB_SMOKE_URL` に `https://hanage.app/` を設定する（以降のデプロイで生存確認が走る）
7. Netlify のビルドを停止し、確認が済んだら `netlify.toml` を削除する

`www.hanage.app` を使う場合は、Cloudflareのリダイレクトルールで `hanage.app` へ寄せる。

## ロールバック

`CLOUDFLARE_DEPLOY` を `false` に戻し、Netlify のビルドを再開すれば元の配信に戻る。
`netlify.toml` を消すのは、Cloudflare側の確認が済んでからにする。

## ローカル確認

```bash
npm ci
npm run lint
npm run build
npx wrangler dev
```

`npx wrangler dev` は `out/` を配信するので、先に `npm run build` を実行しておく。
