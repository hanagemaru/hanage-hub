# Putt新URLの本番公開ゲートと切り戻し

更新日: 2026-11-14
状態: **公開前の準備完了／本番変更は承認待ち**。本書のコマンドは実行手順であり、まだ実行していない。

## 検証した事実

- Cloudflare API実地監査で`hanage.app` Zoneはactive、Zone Worker Routesは0件。`hanage.app`と`www.hanage.app`は`hanage-hub`のCustom Domain、`putt.hanage.app`は既存`putt`のCustom Domain。
- 新URL `https://hanage.app/games/putt/play/`と同APIのhealthは現在404。既存`https://hanage.app/`と紹介`/games/putt/`は200。
- Cloudflare公式仕様によると、Routeは同ホストのCustom Domain Workerに先行でき、`assets.base_path`でサブパス配信が可能。
- Puttブランチの`wrangler.hub-production.jsonc`を用いて**デプロイなしのWrangler dry-run成功**。新Worker名`putt-hub`、Route`hanage.app/games/putt/play`と`hanage.app/games/putt/play/*`、既存D1`putt-ranking`、`assets.base_path=/games/putt/play`を含む。
- 本番D1`putt-ranking`を別の一時Workerにバインドし、既存`putt.hanage.app`の**匿名ランキング表示と4コース全て完全一致**。BEGINNER 35・STANDARD 16・ADVANCED 8・EXPERT 10。書き込みAPIを全拒否し、検証用Workerは削除成功。
- 新URLのゲーム/UI/PWAと旧URLの案内はモックで確認。旧・新APIの登録・名前変更・削除はローカル専用D1で実装検証済み。
- ハブのゲームリンクとsitemapはゲーム別の**公開許可ビルド変数**に連動。無効なら旧URL・新ゲームURLをsitemapに含めない。有効ならPuttだけ新URLへ切替え、存在しない`/en/games/putt/play/`を生成しない。
- 本番HTTP実測で`www.hanage.app/`と`www.hanage.app/games/putt/`は200（rootへの転送なし）、`www.hanage.app/games/putt/play/`は404。専用の`hanage-game-www-redirect`を試作し、**Puttのプレイパスだけ**を`hanage.app`へ302/no-store転送、他ページは対象外。自動テストとWrangler dry-runに成功。実Route未設置。
- **この段階で実際のhanage.app上にWorker Routeを登録したことはない**。ルーティングの本番HTTP結果とランキング新IDでの登録は未確認。

証拠：
- [Cloudflare Route監査・Wrangler dry-run](https://github.com/hanagemaru/putt/actions/runs/43594376873)
- [本番D1読み取り専用共用テスト・検証Worker削除](https://github.com/hanagemaru/putt/actions/runs/43595040164)
- [ハブの切替フラグOFF/ON両方のビルドテスト](https://github.com/hanagemaru/hanage-hub/actions/runs/43595585443)
- [www実HTTP監査](https://github.com/hanagemaru/hanage-hub/actions/runs/43596093123) と [wwwパス限定転送テスト・dry-run](https://github.com/hanagemaru/hanage-hub/actions/runs/43596320442)

## 本番公開の順番（本番に影響するため別途承認後）

1. **公開前の安全確認。** Putt/HubのPRレビューとマージ可否、Cloudflare Route再監査、既存Putt D1の保護状況とD1 Time Travel/復旧手段、公開済み旧URLのHTTP/PWAを記録する。本番D1の内容やスキーマはコピー・変更しない。
2. **新Workerを先行公開。** Putt側の配信ビルドで`PUTT_BASE=/games/putt/play/`・`VITE_RANKING_API_ENABLED=true`・`VITE_GAMEPLAY_ANALYTICS=true`を使用。Puttの`wrangler.hub-production.jsonc`で専用Worker`putt-hub`と**2つの新Route**だけを登録する（既存`putt`/ハブWorkerには触れない）。新Workerには本番の**同じD1 ID**をバインドする。GitHubのmainへのマージだけではこの配信は実行されない。
3. **新URLでの公開確認。** `/games/putt/play/`、アセット、Service Worker、manifest、`/games/putt/play/api/health`のDB/schema= true、実ランキング4コースの表示・旧URLとの一致、iPhone Safariで主要操作を確認。新しい匿名IDの登録・変更・削除試験を本番D1で行う場合は、試験用IDと削除手順を事前に明確にして承認を得る。勝手に本番ランキングへ書かない。
4. **wwwからの重複オリジンを防止。** 新Puttのroot URLを確認後、ハブの`wrangler.game-www-redirect.jsonc`を使用し`www.hanage.app/games/putt/play`と`www.hanage.app/games/putt/play/*`の**2つだけ**を`hanage-game-www-redirect`へRoute登録する。308の恒久キャッシュではなく、解除容易な302/no-storeで`hanage.app`へ転送。ほかのwwwサイトページは従来の`hanage-hub`が継続提供する。wwwの200/404実測と転送コードdry-runは済み、**実Route設定は未実施**。
5. **旧サイトへの告知。** 正常確認後にPuttリポジトリ変数`PUTT_HUB_PLAY_URL=https://hanage.app/games/putt/play/`を設定し、元の`putt` Workerを再配信。旧サイトは引き続きプレイ・登録可能で、トップに新URL案内と「ランキングは共通、個人IDと自己ベストは別管理」を表示する。**案内は新URL公開前には出さない。**
6. **ハブの導線を切替え。** ハブリポジトリ変数`PUTT_HUB_PLAY_ENABLED=true`（Sweeperは無効のまま）を設定し再ビルド・配信。作品詳細の「遊ぶ」ボタンを新URLへ変更し、`sitemap.xml`に`https://hanage.app/games/putt/play/`を追加。無効なら以前のURLへ戻る。
7. **SEO・PWA・継続監視。** `www.hanage.app`の新Puttだけは上述の302/no-store転送が実際に効くことを確認する。旧・新のPWAオフライン・起動・iPhone Safariツールバー、キャッシュ更新、Search ConsoleのURL検査、実際のアクセス・登録エラーを観察する。
8. **Sweeperへ展開。** Putt公開が安定してから、同じ条件でSweeper固有のWorker/D1/旧URL告知を検証・段階公開する。PuttとDBを混ぜない。

## ハブ内導線・SEOの公開ゲート（2026-11-14追記）

- Puttの新URLが本番で正常に配信される**前は**、ハブの`NEXT_PUBLIC_PUTT_HUB_PLAY_ENABLED`を有効にしない。既存の`putt.hanage.app`リンクと別タブ動作を維持する。
- 新URLが正常になったらフラグを`true`にしてハブを再ビルド。作品紹介ページの「遊ぶ」は`hanage.app/games/putt/play/`を**同じタブ**で開く（旧URLの間は従来どおり別タブ）。
- ゲームのトップメニューには「ゲーム紹介に戻る」「遊び方」のリンクを設置し、本番`hanage.app`同一オリジンでは同じタブで紹介・遊び方へ戻れるようにする。プレイ中の3D画面には不要なリンクを追加しない。
- 新PuttのHTMLは`canonical=https://hanage.app/games/putt/play/`を出力。旧Puttは`PUTT_HUB_PLAY_URL`を新URLに設定して再配信した時にのみcanonicalを新URLへ向ける。旧Puttのゲームやブックマーク利用は残す。
- `sitemap.xml`への新ゲームURL追加はハブのフラグと連動。新URLは言語依存しないため、存在しない`/en/games/putt/play/`は追加しない。
- **公開後の確認:** 新プレイURLのHTTP/PWA/ゲーム、ハブ紹介への戻りと遊び方、旧Putt・ランキングの維持、canonical/sitemap/内部リンクを確認。Search Consoleで新ゲームURLのインデックス状況を追う。
- Putt新URLのゲームプレイ中・ホーム画面起動後のSafariタブ/PWA遷移はiPhone実機で確認する（WebKit自動テストで全環境の挙動を保証しない）。
- これらは本番公開前の**PR上の実装・テスト**であり、現時点で本番に配信したものではない。

## 切り戻し

- 新URLに問題があればハブの`PUTT_HUB_PLAY_ENABLED`を無効にし、旧URLへ戻して再配信。
- 新WorkerのRoute`hanage.app/games/putt/play`と`hanage.app/games/putt/play/*`、およびwww転送用の同パス2Routeだけを解除する。**Zoneの他のCustom Domainやルートを削除しない**。
- 旧Workerは保持する。旧サイトの告知も`PUTT_HUB_PLAY_URL`を空に戻して再配信すれば非表示となる。
- D1を別DBへ切り替えたり復旧操作を自動で行ったりしない。旧・新の両Workerが同じD1に接続していた場合、新URLで行われた正当な変更を無差別に巻き戻してはいけない。
- **URL公開前にプレイヤーIDや秘密鍵を移動する機能は作らない。** 旧URLの記録は旧URLから引き続き利用できる。

## 残る判断

- 実際に`hanage.app/games/putt/play/`のCloudflare Routeを作成してよいか（本番への変更）。
- 本番D1で試験用匿名IDの登録/削除を許容するか（当初は読み取り・ゲーム起動確認だけでもよい）。
- `www.hanage.app`の新ゲームパスに限る302/no-store専用Routeを同時公開するか（安全な実装・dry-runは準備済み）。

現時点では上記の本番変更は**一つも実行していない**。
