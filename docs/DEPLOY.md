# デプロイ手順

## 現在の配信

- 本番: Cloudflare Workers（Static Assets）
  - https://hanage.app/
  - https://www.hanage.app/
  - https://hanage-hub.jibunnha.workers.dev/
- 旧配信: Netlify（https://hanage-hub.netlify.app/）。**もう使わない。** 独自ドメインからは2026-09-05に切り離し済みで、ビルドの停止とプロジェクト削除が残っている

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
2. Netlifyのビルドを停止し、プロジェクトを削除する
3. `netlify.toml` の削除を別PRで行う

`www.hanage.app` は現在、同じWorkerへ直接接続している。必要になれば、Cloudflareのリダイレクトルールで `hanage.app` へ統一する。

## アクセス解析（Cloudflare Web Analytics）

ページ単位のアクセス数と参照元は Cloudflare Web Analytics で取得する。
Cookieを使わないため同意バナーは不要だが、プライバシーポリシーの「アクセス解析」には記載済み。

サイトトークンは**リポジトリに置かない**。次の手順で設定する。

1. Cloudflareダッシュボード → Analytics & Logs → Web Analytics → Add a site
2. ホスト名に `hanage.app` を入れ、**Manual setup**（JS snippet）を選ぶ
3. 表示された `data-cf-beacon` の `token` の値をコピーする
4. GitHubの `hanagemaru/hanage-hub` → Settings → Secrets and variables → Actions → Variables タブ
   → New repository variable で `CF_BEACON_TOKEN` に貼り付ける
5. `main` へのpush（または `Deploy` の手動実行）で反映される

`CF_BEACON_TOKEN` が未設定のビルドではビーコンを出力しない。
ローカルの `npm run dev` / `npm run build` でも同様に出力されないので、開発中のアクセスは計上されない。
止めたいときは、リポジトリ変数 `CF_BEACON_TOKEN` を削除して再デプロイする。

## ロールバック

**Netlifyへ戻す道はもう使わない。** Cloudflare側で問題が起きた場合は、Cloudflare内で前のバージョンへ戻す。
`CLOUDFLARE_DEPLOY` を `false` にすれば新しいデプロイは止まるが、それだけでは公開中の版は戻らない。
**具体的な手順（Workersのバージョン一覧から戻す操作）は未確定。** 実際に一度試して、ここへ書く。
DNSは触らない。`netlify.toml` は削除するまで残っているが、ロールバック先ではない。

## ローカル確認

```bash
npm ci
npm run lint
npm run build
npx wrangler dev
```

`npx wrangler dev` は `out/` を配信するので、先に `npm run build` を実行しておく。
