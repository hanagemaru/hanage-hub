export type GameArtworkKind = "sweeper" | "putt";

/**
 * タイルと紹介ページに出す短いタグ。
 *
 * 枠は3つに固定し、意味も作品間で揃える。増やさない。
 * 遊べば分かること（ジャンル・言語・操作）と、あとで変わること
 * （ランキングの有無・開発状況）はここに書かない。更新漏れの原因になる。
 */
export type GameSpecs = {
  /** 料金 */
  price: string;
  /** 内容。1回の遊びの規模が分かる言葉にする */
  content: string;
  /** 対応する端末 */
  devices: string;
};

/** 紹介ページに並べる実画面。ファイルは public/shots/ に置く */
export type Screenshot = {
  src: string;
  alt: string;
};

export type Game = {
  /** URL とアートワークの識別子 */
  slug: string;
  title: string;
  /** タイトルの改行位置。紹介ページの大見出しで使う */
  titleLines: string[];
  subtitle: string;
  description: string;
  href: string;
  /** ゲーム本体のURL。GAME_URLS を参照する */
  playUrl: string;
  /** タイル左上のバッジ。空文字なら出さない */
  status: string;
  /** 本体を開くボタンの文言 */
  playLabel: string;
  specs: GameSpecs;
  /** 空配列なら実画面の欄そのものを出さない */
  shots: Screenshot[];
  artwork: GameArtworkKind;
  /** 不具合報告の宛先 */
  issuesUrl: string;
};

/**
 * ゲーム本体の公開URL。
 *
 * どちらも hanage.app のサブドメイン（Cloudflare Workers のカスタムドメイン）。
 * 配信先を変えるときはここだけを差し替える。
 * ハブ側の他のファイルは URL を直接持たない。
 */
export const GAME_URLS = {
  multicolorSweeper: "https://mcsweeper.hanage.app/",
  putt: "https://putt.hanage.app/",
} as const;

/** 運営者情報。about と contact はここを参照する */
export const OWNER = {
  /** 表に出す名前。Xの表示名・ハンドルと揃える */
  handle: "@hanageapp",
  social: { label: "X", handle: "@hanageapp", url: "https://x.com/hanageapp" },
  siteIssuesUrl: "https://github.com/hanagemaru/hanage-hub/issues",
} as const;

export const multicolorSweeper: Game = {
  slug: "multicolor-sweeper",
  title: "Multicolor Sweeper",
  titleLines: ["Multicolor", "Sweeper"],
  subtitle: "色つき爆弾のマインスイーパー",
  description: "爆弾に色がある9×9のマインスイーパー。数字も色ごとに分かれる。",
  href: "/games/multicolor-sweeper/",
  playUrl: GAME_URLS.multicolorSweeper,
  status: "公開中",
  playLabel: "ゲームを開く ↗",
  specs: {
    price: "無料",
    content: "9×9 タイムアタック",
    devices: "スマホ・PC",
  },
  shots: [
    { src: "/shots/mcs-board.jpg", alt: "色ごとに分かれた数字が並ぶ9×9の盤面" },
    { src: "/shots/mcs-blast.jpg", alt: "爆弾を開いた瞬間、マスが吹き飛ぶ画面" },
    { src: "/shots/mcs-review.jpg", alt: "決着後、爆弾の位置がすべて見える盤面" },
  ],
  artwork: "sweeper",
  issuesUrl: "https://github.com/hanagemaru/multicolor-sweeper/issues",
};

export const putt: Game = {
  slug: "putt",
  title: "Putt",
  titleLines: ["Putt"],
  subtitle: "傾斜を読むパッティング",
  description:
    "傾斜を読んでラインを決め、スワイプでパターを振る。振った速さが、そのまま球の強さになる。",
  href: "/games/putt/",
  playUrl: GAME_URLS.putt,
  status: "公開中",
  playLabel: "ゲームを開く ↗",
  specs: {
    price: "無料",
    content: "3コース × 9ホール",
    devices: "スマホ専用",
  },
  // UI調整中のため、実画面は撮り直してから載せる
  shots: [],
  artwork: "putt",
  issuesUrl: "https://github.com/hanagemaru/putt/issues",
};

/** タイル一覧に出す順番 */
export const games: Game[] = [multicolorSweeper, putt];

/** タグとして並べる順番。作品間で必ず同じ順にする */
export function specList(specs: GameSpecs): string[] {
  return [specs.price, specs.content, specs.devices];
}

export type UpdateKind = "GAME" | "UPDATE" | "SITE";

export type UpdateEntry = {
  /** YYYY-MM-DD */
  date: string;
  kind: UpdateKind;
  title: string;
  body: string;
};

/**
 * 更新情報。新しい順に並べて書く。
 * トップページの1件も更新情報ページも、ここだけを見る。
 */
export const updates: UpdateEntry[] = [
  {
    date: "2026-09-06",
    kind: "GAME",
    title: "Puttを公開しました",
    body: "傾斜を読んでラインを決めるパッティングゲーム。3コース × 各9ホール。",
  },
  {
    date: "2026-09-04",
    kind: "GAME",
    title: "Multicolor Sweeperを公開しました",
    body: "色つきの爆弾を探すマインスイーパー。オンラインランキングつき。",
  },
  {
    date: "2026-08-13",
    kind: "SITE",
    title: "hanage.appの制作を始めました",
    body: "自作ゲームとWebアプリをまとめる場所として制作開始。",
  },
];

/** 2026-09-06 → 2026.09.06 */
export function formatDate(date: string): string {
  return date.replaceAll("-", ".");
}
