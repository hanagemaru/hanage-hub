# デプロイ手順

## 現在の配信

- 本番: Cloudflare Workers（Static Assets）
  - https://hanage.app/
  - https://www.hanage.app/
  - https://hanage-hub.jibunnha.workers.dev/
- 旧配信: Netlify（https://hanage-hub.netlify.app/）。独自ドメインからは切り離し済みだが、停止・削除はまだ行っていない

GitHub Actionsの `Deploy` は、`main` へのpush時にリポジトリ変数 `CLOUDFLARE_DEPLOY` が `true` の場合に実行される。
2026-09-05に初回デプロイと本番ドメインの表示確認を完了した。

## 構成

- `next build`（`output: "export"`）が `out/` に静的サイトを書き出す
- `wrangler.jsonc` がその `out/` をStatic Assetsとして配る。Workerのコードは持たない
- `/games/` のようなURLは `out/games/index.html` が返る（`trailingSlash: true` に合わせた `html_handling`）
- 存在しないURLは `out/404.html` を返す

## Cloudflare切り替え状況

完了済み:

1. GitHub Repository secretsを登録
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
2. Repository variable `CLOUDFLARE_DEPLOY=true` を設定
3. Actionsから `Deploy` を手動実行し、Worker既定URLで表示確認
4. Cloudflare WorkersのCustom Domainとして `hanage.app` と `www.hanage.app` を追加
5. Netlify向けDNSレコードを削除し、両方の独自ドメインで表示確認

残作業:

1. Repository variable `HUB_SMOKE_URL` に `https://hanage.app/` を設定する
2. 一定期間問題がないことを確認後、Netlifyのビルドを停止する
3. ロールバック用にNetlifyを残す必要がなくなったら、`netlify.toml` の削除を別PRで行う

`www.hanage.app` は現在、同じWorkerへ直接接続している。必要になれば、Cloudflareのリダイレクトルールで `hanage.app` へ統一する。

## ロールバック

Cloudflare側で問題が起きた場合は、`CLOUDFLARE_DEPLOY` を `false` に戻し、Netlify側のビルド状態を確認したうえで、Netlify向けDNSレコードを再設定する。
旧DNS値は運用記録を確認し、推測で設定しない。
`netlify.toml` はロールバック不要と判断するまで残す。

## ローカル確認

```bash
npm ci
npm run lint
npm run build
npx wrangler dev
```

`npx wrangler dev` は `out/` を配信するので、先に `npm run build` を実行しておく。
