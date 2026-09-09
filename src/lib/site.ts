export type GameArtworkKind = "sweeper" | "putt";

/** 作品の識別子。文章側もこのキーで引く */
export type GameId = "multicolorSweeper" | "putt";

/**
 * 紹介ページに並べる実画面。ファイルは public/shots/ に置く。
 *
 * 代替テキストは言語ごとに変わるのでここには持たない。`screenshots()` で合わせる。
 */
export type ShotSource = {
  src: string;
  /** 読み込み前に場所を確保するための実寸。縦横比がずれると表示が飛ぶ */
  width: number;
  height: number;
};

export type Screenshot = ShotSource & { alt: string };

/**
 * 作品の、言語によって変わらない部分。
 *
 * 題名・説明・タグの文言は `content` 側にある。
 */
export type Game = {
  id: GameId;
  /** URL とアートワークの識別子 */
  slug: string;
  /** 題名の改行位置。紹介ページの大見出しで使う。題名自体は訳さない */
  titleLines: string[];
  /** 言語を含まないルート */
  route: string;
  howToPlayRoute: string;
  /** ゲーム本体のURL */
  playUrl: string;
  shots: ShotSource[];
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
  id: "multicolorSweeper",
  slug: "multicolor-sweeper",
  titleLines: ["Multicolor", "Sweeper"],
  route: "/games/multicolor-sweeper/",
  howToPlayRoute: "/games/multicolor-sweeper/how-to-play/",
  playUrl: GAME_URLS.multicolorSweeper,
  shots: [
    { src: "/shots/mcs-board.jpg", width: 720, height: 722 },
    { src: "/shots/mcs-blast.jpg", width: 720, height: 720 },
    { src: "/shots/mcs-review.jpg", width: 720, height: 722 },
  ],
  artwork: "sweeper",
  issuesUrl: "https://github.com/hanagemaru/multicolor-sweeper/issues",
};

export const putt: Game = {
  id: "putt",
  slug: "putt",
  titleLines: ["Putt"],
  route: "/games/putt/",
  howToPlayRoute: "/games/putt/how-to-play/",
  playUrl: GAME_URLS.putt,
  shots: [
    { src: "/shots/putt-aim.jpg", width: 333, height: 720 },
    { src: "/shots/putt-low.jpg", width: 333, height: 720 },
    { src: "/shots/putt-map.jpg", width: 333, height: 720 },
  ],
  artwork: "putt",
  issuesUrl: "https://github.com/hanagemaru/putt/issues",
};

/** タイル一覧に出す順番 */
export const games: Game[] = [multicolorSweeper, putt];

/** 題名。改行位置から組み立てるので、二重に持たない */
export function gameTitle(game: Game): string {
  return game.titleLines.join(" ");
}

export type UpdateKind = "GAME" | "UPDATE" | "SITE";

/**
 * 更新情報の識別子。
 *
 * 直和型にしてあるので、項目を足すと両方の言語に文章を書くまでビルドが通らない。
 * 片方の言語だけ更新される事故を防ぐための仕掛け。
 */
export type UpdateId = "putt-release" | "mcs-release" | "site-start";

/** 更新情報の、言語によって変わらない部分。文言は `content` 側 */
export type UpdateMeta = {
  /** 文章と対応づけるための識別子 */
  id: UpdateId;
  /** YYYY-MM-DD */
  date: string;
  kind: UpdateKind;
};

/**
 * 更新情報。新しい順に並べて書く。
 * トップページの1件も更新情報ページも、ここだけを見る。
 */
export const updates: UpdateMeta[] = [
  { id: "putt-release", date: "2026-09-06", kind: "GAME" },
  { id: "mcs-release", date: "2026-09-04", kind: "GAME" },
  { id: "site-start", date: "2026-08-13", kind: "SITE" },
];

/** 2026-09-06 → 2026.09.06 */
export function formatDate(date: string): string {
  return date.replaceAll("-", ".");
}
