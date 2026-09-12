import type { Content } from "./types";

export const ja: Content = {
  htmlLang: "ja",
  ogLocale: "ja_JP",

  siteTagline: "ゲームやアプリを公開しています",
  footerTagline: "ゲームやアプリを公開しています",
  siteDescription: "個人制作のブラウザゲームとWebアプリを公開しています。インストール不要・無料。",

  nav: {
    home: "ホーム",
    games: "ゲーム",
    updates: "更新情報",
    about: "このサイトについて",
    privacy: "プライバシー",
    terms: "利用規約",
    contact: "お問い合わせ",
    otherLocaleLabel: "English",
    mainNavLabel: "メインナビゲーション",
    footerNavLabel: "フッターナビゲーション",
    brandHomeLabel: "hanage.app トップページ",
  },

  home: {
    gamesHeading: "ゲーム",
    gamesMore: "すべて見る",
    updatesHeading: "更新情報",
    updatesMore: "一覧を見る",
  },

  gamesPage: {
    title: "ゲーム",
    metaDescription: "hanage.appで公開しているブラウザゲームの一覧。",
    listLabel: "ゲーム一覧",
  },

  gameDetail: {
    specsLabel: "ゲーム情報",
    howToPlayLabel: "遊び方を見る",
    howToPlayTitle: "遊び方",
  },

  updatesPage: {
    title: "更新情報",
    description: "サイトと公開作品の主な更新。",
    metaDescription: "hanage.appと公開作品の更新情報。",
  },

  aboutPage: {
    title: "このサイトについて",
    description: "個人で制作したブラウザゲームとWebアプリを公開しているサイト。",
    metaDescription: "hanage.appの運営者について。",
    ownerHeading: "運営者",
    ownerRole: "企画・開発・運営",
    contactLabel: "お問い合わせ",
  },

  contactPage: {
    title: "お問い合わせ",
    description: "作品とサイトについての連絡先。",
    metaDescription: "hanage.appと公開作品についての連絡先。",
    reachHeading: "運営者に連絡する",
    reachBody: "作品とサイトについての連絡は、Xのアカウントへ。",
    bugsHeading: "不具合を報告する",
    bugsBody:
      "再現手順を添えて報告する場合は、GitHubのIssuesが確実。公開される場所なので、知られて困る情報は書かないこと。",
    siteLabel: "サイト",
  },

  privacyPage: {
    title: "プライバシーポリシー",
    description: "hanage.appおよび掲載作品における情報の取り扱いについてご案内します。",
    revision: "制定日：2026年8月13日／最終更新：2026年9月6日",
    sections: [
      {
        heading: "適用範囲",
        paragraphs: [
          "本方針は、hanage.appと、そこから案内する当方運営のゲームに適用します。各ゲームのサブドメインのほか、正式公開前のworkers.devやGitHub Pagesなどの暫定URLも含みます。別の方針が表示される外部サービスには、そのサービスの方針が適用されます。",
        ],
      },
      {
        heading: "取得する情報",
        list: [
          "サーバーのアクセスログ（IPアドレス、ブラウザの種類、アクセス日時など）",
          "設定や進行状況を端末内に保存するためのローカルストレージ等のデータ",
          "ランキングに記録を登録した場合の、表示名・記録・端末ごとの匿名ID",
          "不正な記録を検証するためのプレイ情報（盤面を再現する情報、初手位置、操作履歴、ゲーム内経過時間、ルールおよびアプリのバージョンなど）",
          "不正利用や過剰な送信を抑えるための、ネットワーク情報から作成したハッシュ化シグナル",
        ],
        paragraphs: [
          "ランキング用データベースには生のIPアドレスを保存しません。会員登録は不要で、氏名・住所・メールアドレス・SNSアカウントをお預かりすることはありません。",
        ],
      },
      {
        heading: "利用目的",
        paragraphs: [
          "取得した情報は、サービスの提供、設定や進行状況の保持、ランキングの運営、記録の検証、不正利用の防止、不具合の調査、品質改善に使用します。",
        ],
      },
      {
        heading: "ランキングについて",
        paragraphs: [
          "ランキングのある作品では、プレイ開始時に名前を求めません。記録を登録するときにはじめて表示名を決めます。表示名は他の利用者に公開されるため、本名や連絡先を入力しないでください。",
          "利用者の識別には、ログインを伴わない匿名IDと端末に保存するランダムな認証情報を使用します。サーバーには認証情報そのものではなく、そのハッシュ値を保存します。",
        ],
      },
      {
        heading: "外部サービスへの取扱いの委託",
        paragraphs: [
          "サイト、ゲーム、ランキングAPI、データベースの提供には、Cloudflare、GitHub Pages、Netlifyなどのホスティングサービスを、各作品の提供状況に応じて利用します。これらの事業者は、配信、セキュリティ確保、障害調査などのためにアクセス情報を処理する場合があります。",
        ],
      },
      {
        heading: "Cookie・広告",
        paragraphs: [
          "本ページの最終更新時点で、当サイトおよび掲載作品では広告を配信していません。今後、Google AdSenseおよびH5 Games Adsによる広告の導入を予定しています。導入した場合、Googleなどの広告配信事業者がCookie、ウェブビーコン、IPアドレス等を使用し、広告の配信や効果測定、利用者の興味に応じた広告の表示を行うことがあります。",
          "導入時には、実際に利用する広告サービスと情報の取り扱いを本ページに追記します。法令や広告事業者の要件により同意が必要な地域では、広告に関する処理の前に同意確認を行い、後から選択を変更できるようにします。",
          {
            before: "Googleによる情報の利用については、",
            link: { label: "Googleの説明", url: "https://policies.google.com/technologies/partner-sites?hl=ja" },
            after: "をご確認ください。",
          },
        ],
      },
      {
        heading: "アクセス解析",
        paragraphs: [
          "当サイトのページ表示状況を把握するために、Cloudflare Web Analyticsを利用しています。閲覧されたページ、参照元、ブラウザや端末の種類、おおまかな地域などの統計情報を取得します。",
          "このサービスはCookieやローカルストレージを使用せず、端末を横断して個人を追跡する識別子も作成しません。取得した情報から個人を特定することはありません。",
        ],
      },
      {
        heading: "保存期間・削除",
        paragraphs: [
          "ランキングの表示名と記録は、ランキング機能の提供に必要な期間保存します。アクセスログは各ホスティング事業者の設定や方針に従って保存されます。",
          "ランキングのある作品では、ゲーム内の設定画面から登録した表示名とランキング記録を削除できます。設定画面を利用できない場合や、削除について相談したい場合は、お問い合わせページからご連絡ください。",
        ],
      },
      {
        heading: "外部サイト",
        paragraphs: [
          "当サイトから移動した第三者運営の外部サイトでの情報の取り扱いについて、当サイトは責任を負いません。各サイトの方針をご確認ください。",
        ],
      },
      {
        heading: "方針の変更",
        paragraphs: [
          "法令やサービス内容の変更に応じて、本方針を改定することがあります。重要な変更は当サイト上でお知らせします。",
        ],
      },
      {
        heading: "お問い合わせ",
        paragraphs: [
          {
            before: "本方針に関するご連絡は",
            link: { label: "お問い合わせ", route: "/contact/" },
            after: "ページからお願いします。",
          },
        ],
      },
    ],
  },

  termsPage: {
    title: "利用規約",
    description: "hanage.appおよび掲載作品をご利用いただく際の条件です。",
    revision: "制定日：2026年8月13日／最終更新：2026年9月4日",
    sections: [
      {
        heading: "サービスの利用",
        paragraphs: [
          "当サイトおよび掲載作品は、個人で楽しむ範囲で利用できます。法令に反する行為、サービスの運営を妨げる行為、他の利用者や第三者の権利を侵害する行為を禁止します。",
        ],
      },
      {
        heading: "ランキング",
        paragraphs: [
          "ランキングのある作品では、通常のプレイで得た記録だけを登録してください。プログラムの改変や自動操作などで得た記録、他の利用者が不快に感じる表示名は、予告なく削除する場合があります。",
        ],
      },
      {
        heading: "知的財産権",
        paragraphs: [
          "当サイトの文章、画像、プログラムその他のコンテンツに関する権利は、各権利者に帰属します。許可なく転載、複製、再配布することはできません。",
        ],
      },
      {
        heading: "免責事項",
        paragraphs: [
          "当サイトは、掲載内容の正確性、完全性、継続的な提供を保証するものではありません。当サイトまたは掲載作品の利用により生じた損害について、法令で認められる範囲で責任を負いません。",
        ],
      },
      {
        heading: "変更・停止",
        paragraphs: [
          "事前の通知なく、サービス内容の変更、一時停止または終了を行う場合があります。本規約も必要に応じて改定します。",
        ],
      },
    ],
  },

  games: {
    multicolorSweeper: {
      subtitle: "色つき爆弾のマインスイーパー",
      description: "爆弾に色がある9×9のマインスイーパー。数字も色ごとに分かれる。",
      status: null,
      playLabel: "ゲームを開く ↗",
      specs: { price: "無料", content: "9×9 タイムアタック", devices: "スマホ・PC" },
      shotAlts: [
        "色ごとに分かれた数字が並ぶ9×9の盤面",
        "爆弾を開いた瞬間、マスが吹き飛ぶ画面",
        "決着後、爆弾の位置がすべて見える盤面",
      ],
      shotsLabel: "Multicolor Sweeperの画面",
      metaDescription: "爆弾に色がある9×9のマインスイーパー。数字も色ごとに分かれる。",
    },
    putt: {
      subtitle: "傾斜を読むパッティング",
      description:
        "傾斜を読んでラインを決め、スワイプでパターを振る。振った速さが、そのまま球の強さになる。",
      status: null,
      playLabel: "ゲームを開く ↗",
      specs: { price: "無料", content: "9ホール ストロークプレー", devices: "スマホ専用" },
      shotAlts: [
        "ボール後方から見たグリーンとカップ",
        "低い視点から傾斜を読む画面",
        "真上から見たマップ",
      ],
      shotsLabel: "Puttの画面",
      metaDescription:
        "傾斜を読んでラインを決め、スワイプでパターを振る。振った速さが、そのまま球の強さになる。",
    },
  },

  howToPlay: {
    multicolorSweeper: {
      metaTitle: "Multicolor Sweeperの遊び方",
      metaDescription: "色つきの爆弾を、色ごとの数字から見つけるMulticolor Sweeperの遊び方。",
      heroDescription: "基本はマインスイーパー。ただし爆弾に色があり、数字も色ごとに分かれています。",
      backLabel: "ゲーム紹介へ戻る",
      sections: [
        {
          heading: "基本",
          kind: "steps",
          steps: [
            { title: "難易度と色数を選ぶ", body: "15 / 20 / 25 BOMBS と、3色か4色。" },
            { title: "好きなマスから開ける", body: "最初のマスと周りの8マスは必ず安全です。" },
            { title: "色ごとの数字を読む", body: "隣接する8マスにある爆弾の数が、色ごとに出ます。" },
            { title: "爆弾のないマスを全部開ける", body: "それでクリアです。" },
          ],
        },
        {
          heading: "旗",
          kind: "defs",
          intro: "マスの上で指を滑らせた方向で、旗の色が決まります。",
          items: [
            { term: "左上：", body: "赤" },
            { term: "右上：", body: "青" },
            { term: "左下：", body: "緑" },
            { term: "右下：", body: "黄（4色のみ）" },
            { term: "上：", body: "色を決めない旗" },
          ],
          note: "同じ旗をもう一度立てると外れます。",
        },
        {
          heading: "まとめて開ける",
          kind: "prose",
          body: "開いたマスをタップすると、周りの旗の数が合っていれば、旗のない隣のマスをまとめて開けます。旗が間違っていれば爆発します。",
        },
        {
          heading: "ランキング",
          kind: "prose",
          body: "クリアタイムは 15 / 20 / 25 BOMBS の3部門。名前は自己ベストを登録するときに決めます。",
        },
      ],
    },
    putt: {
      metaTitle: "Puttの遊び方",
      metaDescription: "グリーンを読み、パターを振ってカップに沈めるPuttの遊び方。",
      heroDescription: "スマホを縦に持って、少ない打数でカップに沈めます。",
      backLabel: "ゲーム紹介へ戻る",
      sections: [
        {
          heading: "モード",
          kind: "defs",
          items: [
            { term: "通常ツアー：", body: "3つのコースから1つ選び、9ホールを回ります。" },
            {
              term: "練習：",
              body: "1ホールを何度でも打ち直せます。コース変更で別のホールに差し替えられます。",
            },
          ],
        },
        {
          heading: "1打の流れ",
          kind: "steps",
          steps: [
            {
              title: "コースを見る",
              body: "視点ボタンとマップで、傾斜とカップまでの形を確かめます。",
            },
            {
              title: "狙いを決める",
              body: "ボール後方と低い視点では、左右のスワイプで狙いを調整できます。",
            },
            { title: "構える", body: "画面をタップすると、パターを構えます。" },
            {
              title: "打つ",
              body: "パターを右へ引いてから、左へ振り抜きます。振る速さが強さになります。",
            },
          ],
        },
        {
          heading: "パター",
          kind: "prose",
          body: "トップの「パターを選ぶ」から、ピン型・L字・マレット・ネオマレットを選べます。見た目だけの違いで、打ちやすさは変わりません。",
        },
        {
          heading: "ルール",
          kind: "list",
          items: [
            "打数の合計で競います。ラフやセカンドカットに入ると転がりが重くなります。",
            "池とOBは1罰打。直前に打った位置から打ち直します。",
            "通常ツアーは中断しても、そのホールの頭から再開できます。練習の途中経過は残りません。",
          ],
        },
      ],
    },
  },

  updates: {
    "putt-release": {
      title: "Puttを公開しました",
      body: "傾斜を読んでラインを決めるパッティングゲーム。3コース × 各9ホール。",
    },
    "mcs-release": {
      title: "Multicolor Sweeperを公開しました",
      body: "色つきの爆弾を探すマインスイーパー。オンラインランキングつき。",
    },
    "site-start": {
      title: "hanage.appの制作を始めました",
      body: "自作ゲームとWebアプリをまとめる場所として制作開始。",
    },
  },
};
