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

## ゲーム本体の同一ドメイン配信（2026-11-14以降）

- `hanage.app/` と紹介・説明ページは従来の `hanage-hub` Workerが担当する。
- 公開済みPutt本体 `https://hanage.app/games/putt/play/` は別Worker `putt-hub` にゲーム専用のZone Worker Routeで割り当てる。ハブのルートWorkerをゲームのコードに置き換えない。
- `https://putt.hanage.app/` は既存Workerで継続し、新旧は同じ本番D1 `putt-ranking` を利用する。旧サイトのプレイヤーIDと新サイトのIDは別。
- `www.hanage.app/games/putt/play/*` は `hanage.app` へ302で転送し、端末内記録の二重化を防ぐ。ほかのwwwのページは従来どおり。
- Multicolor Sweeperの新しい同一ドメインパスは**未公開**。現行 `mcsweeper.hanage.app` を維持する。
- ハブの `GAME_URLS` とサイトマップはゲームごとの公開フラグで切替える。新Workerの本番HTTP・D1・PWAを確認する前にフラグを有効にしない。

公開状態と本番検証の証跡は [PROJECT_STATUS.md](PROJECT_STATUS.md)、旧URLを維持する共通運用は [GAME_URL_AND_PLAYER_MIGRATION_2026-11-14.md](GAME_URL_AND_PLAYER_MIGRATION_2026-11-14.md) を参照。

## 競走馬血統ならべの同一ドメイン公開（2026-11-15）

ゲーム本体は `horse-pedigree-hub` Workerが `hanage.app/games/horse-pedigree/play/*` のみ担当する。独立D1 `horse-pedigree-ranking` と本番の `RANKING_SECRET` を使用する。ゲーム用Worker/DBは2026-11-15に作成して本番E2E検証済み。ハブの紹介ページはゲームのHTTP検証が済んだ後に公開する。

本番結果・詳細は [HORSE_PEDIGREE_RELEASE_2026-11-15.md](HORSE_PEDIGREE_RELEASE_2026-11-15.md) を参照。Putt/Sweeperやハブ本体のWorkerとDBはそのまま利用する。

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
