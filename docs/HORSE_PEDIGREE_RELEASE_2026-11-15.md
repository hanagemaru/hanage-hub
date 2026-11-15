# 競走馬血統ならべ 本番公開（2026-11-15）

## 公開URL

- ゲーム本体： https://hanage.app/games/horse-pedigree/play/
- ゲーム紹介（日本語）： https://hanage.app/games/horse-pedigree/
- 遊び方（日本語）： https://hanage.app/games/horse-pedigree/how-to-play/
- 英語紹介： https://hanage.app/en/games/horse-pedigree/
- 英語の遊び方： https://hanage.app/en/games/horse-pedigree/how-to-play/

ゲームはPutt・Multicolor Sweeperと同じ独立したゲーム専用Worker方式。紹介ページの「遊ぶ」は別タブで開き、ゲーム内に紹介ページへ戻るリンクがある。ハブのトップ／ゲーム一覧／更新情報にも載せる。

## 完了した本番インフラ

- ゲーム実装： [family-tree-game PR #13](https://github.com/hanagemaru/-family-tree-game/pull/13) を main に squash-merge、main commit `99a8644daadc8469d67361aaf31b13297647ef35`
- デプロイジョブ： [Publish horse-pedigree game only #43700964775](https://github.com/hanagemaru/hanage-hub/actions/runs/43700964775) **成功**
- Cloudflare Worker： `horse-pedigree-hub`。ルートは `hanage.app/games/horse-pedigree/play` と `.../play/*` のみ。他ゲームやハブ本体のWorkerは変更していない
- D1：新規専用 `horse-pedigree-ranking`。ID `5272fcd6-f227-424d-b6f5-f3d5959c2206`。migration 0001 をremoteで適用
- Cloudflare Secret `RANKING_SECRET`：暗号学的乱数48バイトから生成し、上記Workerにだけ設定。値はGitHubソースやログに保存していない。再デプロイ時は既存値を変更しない
- 公開したゲームデータ：実在の競走馬872頭の生年、Wikimedia Commonsの利用条件を確認した写真371頭、12頭×3難易度のv6出題
- v6ランキング：得点 `horse-score-v2-v6-12x4`、匿名ID、専用D1、初級・中級・上級ごとに自己ベスト1件

## 本番で実際に行った検証

上記ジョブ内の `scripts/verify-horse-live.mjs` で以下をすべて実行し成功：

1. 本番の `index.html`、`src/app.js`、CSS、血統JSON、写真JSONがHTTP 200
2. `/api/health` とランキング参照APIが正常
3. 実際のv6初級問題で開始チケットを取得
4. 他Originからの記録送信を403で拒否
5. 改ざんした補正スコアを422で拒否
6. 署名チケット＋合法手札操作の記録を送信しランキング登録
7. テストプレイヤー・記録を削除し、ランキングから消えることまで確認
8. 既存Putt、Multicolor Sweeperの紹介URLがHTTP 200

**ゲーム本体・ハブサイトとも正式公開済み。** ハブPR #45をmainにマージし、[本番Deploy #43701766439](https://github.com/hanagemaru/hanage-hub/actions/runs/43701766439) が成功。日本語・英語の紹介/遊び方、ゲーム一覧とホーム、別タブで開くリンク、サイトマップ、www→apexリダイレクト、D1ヘルスチェックを本番HTTPで確認。既存Putt/Sweeperのリンクと旧サブドメインも正常。本番のログに `HORSE_HUB_LIVE_RELEASE_SUCCESS` と `HORSE_EXISTING_GAMES_UNCHANGED` を記録。初回デプロイでは検証コード内の正規表現の誤記で見かけ上の失敗となったが、サイト側はHTTP 200で配信できており、`24218a4c17d7032d664708ea73fc08bdff7020a7` で検証コードを修正して再実行した結果、全チェックが成功した。

## 運用と注意

- ハブのデプロイには既設のGitHub Actions Cloudflare secrets `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` を使う。ゲーム用Workflowは本番専用D1に限って作業する
- ゲームリリース用ワークフロー： `.github/workflows/publish-horse-pedigree.yml`。現状は安全のためゲームmainの公開時コミットに固定。以後のゲーム更新時はゲームのCI合格後、固定リビジョンを明示的に更新して再実行する
- Cloudflare D1は必ず `horse-pedigree-ranking` のみ。Putt/SweeperのDBには絶対にマイグレーションを適用しない
- `www.hanage.app/games/horse-pedigree/play/*` はゲーム用302リダイレクトWorkerでapexへ統一し、匿名IDの二重発行を防ぐ。ほかのwww URLには触れない
- ハブへの掲載は `NEXT_PUBLIC_HORSE_PEDIGREE_PLAY_ENABLED=true` をデプロイ時のみ設定。もしゲーム本体に重大障害が発生したら、ハブの公開フラグをfalseにしてハブを再デプロイすると「遊ぶ」の導線を非表示にできる
- 既存の写真371枚について個体の画像一致を全件目視確認したわけではない。ユーザーの方針により、Wikidata/Wikipediaの画像対応付けとCommonsライセンスの機械照合を採用した
