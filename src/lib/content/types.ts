import type { GameId, UpdateId } from "@/lib/site";

/**
 * 手順の1ステップ。番号は並び順から振るので持たない。
 */
export type Step = { title: string; body: string };

/** 見出しつきの箇条書き。「**左上：**赤」のような行 */
export type DefItem = { term: string; body: string };

/**
 * タイルと紹介ページに出す短いタグ。
 *
 * 枠は3つに固定し、意味も作品間・言語間で揃える。増やさない。
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

export type GameText = {
  /** タイルの1行説明 */
  subtitle: string;
  /** 紹介ページのリード */
  description: string;
  /**
   * タイル左上のバッジ。
   *
   * 公開できていないときにだけ文言を入れる（「準備中」など）。公開が既定なので、
   * 出せているものには何も付けない。全部に付くバッジは何も言っていないのと同じ。
   * null を明示させているのは、片方の言語だけ書き換える事故を防ぐため。
   */
  status: string | null;
  /** 本体を開くボタンの文言 */
  playLabel: string;
  specs: GameSpecs;
  /** 実画面の代替テキスト。`site.ts` の shots と同じ順・同じ数にする */
  shotAlts: string[];
  /** 実画面の並びにつける説明 */
  shotsLabel: string;
  metaDescription: string;
};

export type HowToPlayText = {
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  /** 見出しと中身の組。作品ごとに構成が違うので配列で持つ */
  sections: HowToSection[];
  backLabel: string;
};

export type HowToSection =
  | { heading: string; kind: "steps"; steps: Step[] }
  | { heading: string; kind: "defs"; intro?: string; items: DefItem[]; note?: string }
  | { heading: string; kind: "list"; items: string[] }
  | { heading: string; kind: "prose"; body: string };

/**
 * 文中のリンク。
 *
 * `route` はサイト内。言語の接頭辞は表示側でつけるので、ここには書かない。
 * `url` は外部。
 */
export type InlineLink =
  | { label: string; route: string }
  | { label: string; url: string };

/**
 * 法務ページの段落。
 *
 * 文中にリンクが要る段落だけ、前後の文とリンクに分けて持つ。
 * HTMLを文字列で書かせない（訳すときに壊れる）。
 */
export type LegalParagraph = string | { before: string; link: InlineLink; after: string };

/** 法務ページ。見出しと段落の並びで持つ */
export type LegalSection = { heading: string; paragraphs: LegalParagraph[]; list?: string[] };

export type Content = {
  /** <html lang> と OG locale */
  htmlLang: string;
  ogLocale: string;

  /** トップの見出し下。サイトを一言で言う */
  siteTagline: string;
  /** フッター用の、より短い一言 */
  footerTagline: string;
  /** <meta description> と OG。検索結果に出る */
  siteDescription: string;

  nav: {
    home: string;
    games: string;
    updates: string;
    about: string;
    privacy: string;
    terms: string;
    contact: string;
    /** もう一方の言語へ切り替えるリンクの文言。その言語自身の言葉で書く */
    otherLocaleLabel: string;
    mainNavLabel: string;
    footerNavLabel: string;
    brandHomeLabel: string;
  };

  home: {
    gamesHeading: string;
    gamesMore: string;
    updatesHeading: string;
    updatesMore: string;
  };

  gamesPage: { title: string; metaDescription: string; listLabel: string };

  gameDetail: {
    specsLabel: string;
    /** 紹介ページから遊び方へ渡すボタンの文言 */
    howToPlayLabel: string;
    /** 遊び方ページ自身の見出し */
    howToPlayTitle: string;
  };

  updatesPage: { title: string; description: string; metaDescription: string };

  aboutPage: {
    title: string;
    description: string;
    metaDescription: string;
    ownerHeading: string;
    ownerRole: string;
    contactLabel: string;
  };

  contactPage: {
    title: string;
    description: string;
    metaDescription: string;
    reachHeading: string;
    reachBody: string;
    bugsHeading: string;
    bugsBody: string;
    siteLabel: string;
  };

  privacyPage: {
    title: string;
    description: string;
    revision: string;
    sections: LegalSection[];
    /** 原文が日本語であることの断り。日本語版では空にする */
    translationNote?: string;
  };

  termsPage: {
    title: string;
    description: string;
    revision: string;
    sections: LegalSection[];
    translationNote?: string;
  };

  games: Record<GameId, GameText>;
  howToPlay: Record<GameId, HowToPlayText>;
  /** `updates` の id をすべて埋める。抜けるとビルドが落ちる */
  updates: Record<UpdateId, { title: string; body: string }>;
};
