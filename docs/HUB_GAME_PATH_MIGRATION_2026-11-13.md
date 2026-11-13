# Puttをhanage.app配下で提供する検証計画

更新日: 2026-11-13

## 背景と目的

2026-11-13、hanage.appのAdSense審査は再び「有用性の低いコンテンツ」で否認された（運営者が管理画面で確認）。現状はハブ内でゲームを紹介し、Puttのプレイは別サブドメイン `putt.hanage.app` に遷移する。

**仮説:** ルートドメイン配下にゲーム本体を配置することは、ゲームが独自コンテンツであることをより直接的に示せる可能性がある。しかしGoogleがサブドメインを評価しなかった事実はなく、AdSense承認も保証しない。検索上のindexability・クロール状況は別途確認する。

製品上の目的は、作品が増えても「ハブで作品を探す→同じドメイン内で遊ぶ・使う」という導線を保ち、ゲームごとのコード・リポジトリ・デプロイを独立させること。

## ターゲット構造

| 種別 | 現行 | 検証案 |
| --- | --- | --- |
| ハブ | `hanage.app/` | 維持 |
| Putt紹介 | `hanage.app/games/putt/` | 維持 |
| Putt遊び方 | `hanage.app/games/putt/how-to-play/` | 維持 |
| Puttプレイ | `putt.hanage.app/` | `hanage.app/games/putt/play/` を追加（未公開） |
| Putt既存URL | `putt.hanage.app/` | 当面維持 |
| 将来の作品 | 個別サブドメイン | 作品ごとに独立Worker＋同ドメイン配下の専用パスを検討 |

GitHub構成は `hanage-hub` と `putt` を分離したまま。ハブのNext.jsは静的書き出しのまま。PuttはVite＋Cloudflare Workerを継続。

## フェーズ

### 0. 設計・リポジトリ準備

- 作業ブランチとPRを別々に作る。両リポジトリの`main`は変更しない。
- ハブは設計・導線の責任範囲、Puttは実装・API・PWAの責任範囲に分離。
- プレビューURLができる前に、本番Worker RouteやDNSを触らない。

### 1. 専用プレビュー環境

- Putt専用Worker `putt-hub-preview` を`workers.dev`に追加。既存 `putt` Workerとは別。
- `assets.base_path=/games/putt/play` をWrangler 4.148.0以上で利用。
- 本番D1のバインディングを一切持たせない。計測とランキングは無効化。
- previewだけnoindex。秘密情報を置かない（URLは公開アクセス可能）。
- 既存の `versions upload` プレビューは本番リソースを使うため、この検証には流用しない。

### 2. URLパス対応と検証

- Viteのベースパス、Service Worker/PWA manifestのscopeを `/games/putt/play/` に揃える。
- APIが `/games/putt/play/api/*` でも動作可能な経路を作り、従来の `/api/*` を維持。
- ランキングは検証Workerでは無効。書き込み拒否（D1未接続）を自動検証。
- CIでビルド、HTML/JS、manifest、SW、noindex、API healthを確認。
- 実機でiPhoneのタッチ操作・スクロール・全画面相当の動作を確認する。

プレビュー実装と検証の詳細: [putt/docs/hub-path-preview.md](https://github.com/hanagemaru/putt/blob/feature/hub-path-putt-20261113/docs/hub-path-preview.md)。

### 3. 本番公開（今回は実施しない）

- Cloudflare Zoneで`hanage.app/games/putt/play/*`にWorker Routeを割り当てる前に、既存のCustom Domainとの競合を試験する。
- 実ランキングD1とOriginチェック・認証・計測の新パスでの安全な動作を確認。
- サブドメインとルートドメインは別オリジン。localStorageにある名前・自己ベスト・認証情報を自動引き継ぎできないため移行仕様を先に決める。
- PWAオフラインやインストール、既存リンク、Canonical・サイトマップ、プライバシー案内を調整。
- ハブの「ゲームを開く」のリンクを新URLへ変えるのは、検証後の別PRにする。旧URLは維持し、切り戻し可能にする。

### 4. AdSense再審査（今回は実施しない）

- 新ルートのクロール/検索登録をSearch Consoleで確認。
- ページの独自性・実用性・広告ポリシーを再評価。
- 配置変更は審査通過の保証ではなく、他の不承認要因も残り得る。

## フェーズ0〜2の完了基準

- [x] リポジトリ運用・対象URL・切り戻し方針が文書化された
- [x] Putt専用Workerへの自動デプロイが成功（GitHub Actions 2026-11-13）
- [x] 新パスでHTML・JSをHTTP取得できる（ゲーム操作は実機未確認）
- [x] PWAとAPIの自動検証が成功（本番D1接続なし、書き込み拒否確認）
- [ ] iPhoneで主要操作を実機確認（利用者確認が必要）

**フェーズ2の自動検証まで達しても、本番公開は許可されない。**

## 検証記録（2026-11-13）

- Puttの検証用PR: https://github.com/hanagemaru/putt/pull/117
- プレビューURL: https://putt-hub-preview.jibunnha.workers.dev/games/putt/play/
- Cloudflare Worker `putt-hub-preview` へ別デプロイ成功。
- GitHub Actionsの成功実行: https://github.com/hanagemaru/putt/actions/runs/43437337388
- HTML、JS、PWAマニフェスト、Service Worker、noindex、API health、D1バインディング不在、書き込み拒否を検証。
- ゲーム操作の実機テストおよび本番へのCloudflare経路設定は**未実施**。
