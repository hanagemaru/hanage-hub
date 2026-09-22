# AdSense再申請前のコンテンツ方針

最終更新: 2026-09-22

## 目的

2026-09-19のAdSense審査で `hanage.app` が「有用性の低いコンテンツ」で却下されたため、
再申請前に、ハブ側へ独自性のある文章を追加する。

ただし、AdSense対策だけを目的に長文や一般的なSEO記事を量産しない。
hanage.appの簡潔な見た目と、ゲームをすぐ遊べる性格は維持する。

## 方針

- **攻略記事は作らない。**
- 長文化のための文章、一般論だけの記事、検索流入だけを狙った記事は作らない。
- 既存リポジトリに残っている試作・検証・設計判断を、一般の人にも読める短い**制作ノート**として出す。
- ゲーム紹介ページも、仕様表だけで終わらず「このゲーム固有の仕組み」が分かる短い説明を加える。
- `/updates/` はブログ化せず、ユーザーから見て意味のある大きな変更だけを短く記録する。
- `/about/` は自己紹介を長文化せず、何を作るサイトか、誰がどう作っているかを簡潔に説明する。
- 既存URLは変更・削除しない。新しいコンテンツは新規パスとして追加する。

## 追加候補

### 1. ゲーム紹介ページ

各ゲームに200〜300字程度を追加する。

**Putt**
- スワイプの振り抜く速さを球の強さに使っていること
- 傾斜、芝、ラフ、バンカー、池などが実際の転がりに影響すること
- 生成されたコースでも、プレイ不能にならないよう検証していること

**Multicolor Sweeper**
- 爆弾の色ごとに数字が分かれること
- 3色・4色とも、推測なしで解ける盤面だけを生成していること
- 色を無視して通常のマインスイーパーにすると論理で詰まる「color-essential」盤面を採用していること

### 2. 制作ノート

最初は4本程度。各600〜1,000字を目安とし、必要以上に伸ばさない。

#### Putt: スワイプをパットの強さにするまで

元資料:
- `putt/TASKS.md`
- `putt/swipe-test/`
- 関連コミット

扱う内容:
- スワイプ距離ではなく振り抜く速さを使う判断
- `getCoalescedEvents()` を含む入力計測
- インパクト直前40msを使った速度算出
- 専用検証ページを作り、iPhone実機で調整した経緯

#### Putt: 遊べるコースを自動生成する

元資料:
- `putt/docs/course-generator-v2.md`
- `putt/PROJECT_STATUS.md`
- 関連コミット

扱う内容:
- シードから同じコースを再現する仕組み
- 曲率からルートを作り、芝・ラフ・池・バンカー等を配置する考え方
- 「見た目は成立しているがカップ周辺で球が止まらない」ケースが実際に出たこと
- 自動検証を追加してプレイ不能なホールを弾くまでの経緯

#### Multicolor Sweeper: Gradient Sweeperから作り直した理由

元資料:
- `gradient-sweeper` の履歴
- `multicolor-sweeper-lab`
- `multicolor-sweeper`

扱う内容:
- Gradient Sweeperから、数字＋多色のゲームへ作り直した流れ
- 3色・4色の比較用Labを先に作ったこと
- 15/20/25爆弾で実測し、条件Cを製品版へ採用したこと

#### Multicolor Sweeper: 運任せにならない盤面を作る

元資料:
- `multicolor-sweeper-lab/SPEC.md`
- `multicolor-sweeper/SPEC.md`

扱う内容:
- 初手と周囲8マスを安全にする
- プレイヤーから見える情報だけを使うSolver
- 確率・ランダム手を使わないNo-Guess判定
- 3色・4色の両方でNo-Guess
- 多色である意味を残すcolor-essential条件

## `/updates/`

細かな修正履歴を全部並べず、ユーザーから見てゲームが変わった変更だけを残す。
1件2〜4文程度で十分。

候補:
- Puttのオンラインランキング公開
- Puttの4コースの見た目変更
- Puttのコース生成器v2への移行
- Multicolor SweeperのBGM追加
- Multicolor Sweeperのオンラインランキング公開
- 両ゲームの公開
- hanage.app公開・Cloudflare移行

現在の3件だけの一行更新よりは情報を増やすが、開発日誌にはしない。

## `/about/`

300〜500字程度を目安とする。

入れる内容:
- 個人制作のブラウザゲームとWebアプリを公開する場所であること
- インストール不要で遊べる作品を中心にしていること
- 企画、ルール、画面設計、試作、実機確認、公開後の調整まで行っていること
- 試作ページや検証用ツールを作ってから仕様を決めることが多いこと
- 運営者 `@hanageapp` と連絡先

「ゲームが好きで〜」のような一般的な自己紹介や、文字数を増やすための理念文は不要。

## 参考にした小規模ブラウザゲームサイト

2026-09-22時点の調査メモ。
**各サイトがAdSense利用を自ら記載していることと、AdSenseの審査通過・現在のアカウント状態・収益額が外部から確認できることは別。**
以下は「構成や収益化表記の参考」であり、審査通過を保証する成功事例として扱わない。

### BALANCE
- https://bodybalance.tech/
- https://bodybalance.tech/about
- 実質1ゲーム中心。
- AboutでGoogle AdSenseによる広告運営を明記。
- Aboutに、制作のきっかけ、物理調整、設計方針、技術構成、Daily Challengeのseed設計など、作者しか書けない内容がまとまっている。
- hanage.appの制作ノート方針に最も近い参考例。

### VOID STRIKER X
- https://voidstrike.space/
- 1ゲーム中心。
- 操作説明、ランキング、Privacy Policyを持つ。
- Privacy PolicyでGoogle AdSense参加を明記。
- 長いブログを持たなくても、ゲーム本体＋必要ページという構成自体は存在する。

### Grid Match
- https://gridmatch.fun/
- 1ゲーム中心。
- How to Play、Privacy Policy、Terms of Serviceを持つ。
- Privacy/TermsでGoogle AdSenseによる広告運営を明記。

### Corelume Tech / Vayu Games / Legitsauce
- https://www.corelumetech.in/
- https://vayugames.com/
- https://legitsauce.com/
- 複数のHTML5ゲームをまとめる小規模〜中規模サイトの参考。
- ゲーム説明、遊び方、制作記事などを組み合わせている。
- hanage.appでは、これらのように記事数を増やすこと自体を目的にはしない。

## 反例・注意点

ブラウザゲームがオリジナル作品であるだけでは、AdSenseの「有用性の低いコンテンツ」を回避できない例もある。

2026年のGoogle AdSense Communityには、以下のような投稿がある。

- Ascendle: オリジナルHTML5ゲームで、複数レベル、スコア、ゲームモード、統計、プレイ後分析まであるが「Low value content」等で却下されたと投稿。
  - https://support.google.com/adsense/thread/464299149/
- AlienFall: How to Play、FAQ、詳細なDevelopment log、Contact、Privacy、Termsまで用意したブラウザゲームでも「Low value content」で却下されたと投稿。
  - https://support.google.com/adsense/thread/465740031/
- ほかにも、HTML5ゲームやWebゲームで同様の却下報告が複数ある。

Communityの回答者はGoogle社員とは限らず、回答内容を公式ポリシーとして扱わない。
一方、Google公式にはH5 Games AdsというHTML5ゲーム向け広告製品があり、利用には承認済みAdSenseアカウントが必要とされている。

したがって、制作ノートやAboutを追加すれば必ず承認されるとは考えない。
今回の改善は、少なくとも現在の「ゲームへのリンク集＋短い紹介」に見えやすい状態から、
hanage.app自身に一次情報・独自文章を持たせるために行う。

## 実施順

1. ゲーム紹介ページを少し厚くする
2. 制作ノート4本を追加
3. `/updates/` を主要な更新で肉付け
4. `/about/` を簡潔に拡充
5. 公開・インデックス状況を確認
6. 十分に再クロールされてからAdSense再申請を検討

再申請時点では、公開後の経過日数だけで機械的に判断せず、Search Console等でGoogleが新しいページを認識しているかも確認する。
