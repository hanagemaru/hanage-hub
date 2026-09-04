export type GameArtworkKind = "sweeper" | "putt";

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
  tags: string[];
  artwork: GameArtworkKind;
  /** 不具合報告の宛先 */
  issuesUrl: string;
};

/**
 * ゲーム本体の公開URL。
 *
 * hanage.app を Cloudflare のゾーンにしてカスタムドメインを割り当てたら、
 * ここだけを mcsweeper.hanage.app / putt.hanage.app へ差し替える。
 * ハブ側の他のファイルは URL を直接持たない。
 */
export const GAME_URLS = {
  multicolorSweeper: "https://multicolor-sweeper.jibunnha.workers.dev/",
  putt: "https://hanagemaru.github.io/putt/",
} as const;

export const multicolorSweeper: Game = {
  slug: "multicolor-sweeper",
  title: "Multicolor Sweeper",
  titleLines: ["Multicolor", "Sweeper"],
  subtitle: "色つき爆弾のマインスイーパー",
  description:
    "赤・青・緑（と黄）の爆弾が混ざった9×9のマインスイーパーです。数字は色ごとに分かれていて、運に頼らず論理だけで解ける盤面しか出てきません。",
  href: "/games/multicolor-sweeper/",
  playUrl: GAME_URLS.multicolorSweeper,
  status: "公開中",
  playLabel: "ゲームを開く ↗",
  tags: ["9×9", "パズル", "タイムアタック", "スマホ対応", "日本語 / English"],
  artwork: "sweeper",
  issuesUrl: "https://github.com/hanagemaru/multicolor-sweeper/issues",
};

export const putt: Game = {
  slug: "putt",
  title: "Putt",
  titleLines: ["Putt"],
  subtitle: "傾斜を読む一人称パッティング",
  description:
    "スマホを縦に持って遊ぶ一人称のパッティングゲームです。曲がりを教えてくれる予測線はありません。自分でグリーンを読み、スワイプの速さで転がす強さを決めます。",
  href: "/games/putt/",
  playUrl: GAME_URLS.putt,
  status: "まもなく公開",
  playLabel: "先行版で遊ぶ ↗",
  tags: ["9ホール", "ゴルフ", "縦画面", "スマホ専用"],
  artwork: "putt",
  issuesUrl: "https://github.com/hanagemaru/putt/issues",
};

/** タイル一覧に出す順番 */
export const games: Game[] = [multicolorSweeper, putt];
