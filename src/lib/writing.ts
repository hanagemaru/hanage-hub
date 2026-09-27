import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { locales, type Locale } from "./i18n";
import { parseMarkdown, plainText, type Block } from "./markdown";
import type { GameId } from "./site";

/**
 * `content/` に置いた文章を読む。ビルド時にだけ動く。
 *
 * 運営者が直接直す文章（制作ノート、ゲーム紹介の「作者のことば」、このサイトについて）は
 * コードから離して .md に置く。構成は次のとおり。
 *
 *   content/<言語>/notes/<slug>.md   制作ノート。ファイル名がURLになる
 *   content/<言語>/games/<slug>.md   ゲーム紹介ページの「作者のことば」
 *   content/<言語>/about.md          このサイトについて
 */
const CONTENT_DIR = path.join(process.cwd(), "content");

function read(locale: Locale, ...parts: string[]) {
  return parseMarkdown(readFileSync(path.join(CONTENT_DIR, locale, ...parts), "utf8"));
}

/** 英文の改行は空白でつなぐ。和文は詰める */
function lineJoin(locale: Locale) {
  return locale === "ja" ? "" : " ";
}

export type Note = {
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  /** 一覧と meta description に出す一文。書いていなければ本文の最初の段落 */
  description: string;
  /** 関係する作品。紹介ページからこのノートへリンクする */
  game: GameId | null;
  blocks: Block[];
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function readNote(locale: Locale, slug: string): Note {
  const { frontmatter, blocks } = read(locale, "notes", `${slug}.md`);
  const where = `content/${locale}/notes/${slug}.md`;

  if (!frontmatter.title) throw new Error(`${where}: title がない`);
  if (!DATE.test(frontmatter.date ?? "")) {
    throw new Error(`${where}: date は YYYY-MM-DD で書く（今は「${frontmatter.date ?? ""}」）`);
  }
  const game = frontmatter.game ? (frontmatter.game as GameId) : null;
  if (game && game !== "putt" && game !== "multicolorSweeper") {
    throw new Error(`${where}: game は putt か multicolorSweeper（今は「${game}」）`);
  }

  const firstParagraph = blocks.find((block) => block.kind === "paragraph");
  const description =
    frontmatter.description ||
    (firstParagraph?.kind === "paragraph" ? plainText(firstParagraph.children, lineJoin(locale)) : "");

  return { slug, title: frontmatter.title, date: frontmatter.date, description, game, blocks };
}

function noteSlugs(locale: Locale): string[] {
  return readdirSync(path.join(CONTENT_DIR, locale, "notes"))
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.slice(0, -3))
    .sort();
}

/**
 * 両方の言語に同じノートがあるか確かめる。
 *
 * 片方にしかないと、言語切替のリンクが404になる。気づきにくいので、ビルドを落とす。
 */
function assertSameNotes() {
  const [first, ...rest] = locales.map((locale) => ({ locale, slugs: noteSlugs(locale) }));
  for (const other of rest) {
    const missing = first.slugs.filter((slug) => !other.slugs.includes(slug));
    const extra = other.slugs.filter((slug) => !first.slugs.includes(slug));
    if (missing.length || extra.length) {
      throw new Error(
        `制作ノートが言語でそろっていない。${other.locale} に足りない: ${missing.join(", ") || "なし"}／` +
          `${other.locale} だけにある: ${extra.join(", ") || "なし"}`,
      );
    }
  }
  return first.slugs;
}

/** 新しい順 */
export function getNotes(locale: Locale): Note[] {
  return assertSameNotes()
    .map((slug) => readNote(locale, slug))
    .sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)));
}

export function getNote(locale: Locale, slug: string): Note {
  return readNote(locale, slug);
}

export function noteRoute(slug: string): string {
  return `/notes/${slug}/`;
}

/** ゲーム紹介ページの「作者のことば」と、そこからリンクする制作ノート */
export function getGameNote(locale: Locale, game: { id: GameId; slug: string }) {
  const { blocks } = read(locale, "games", `${game.slug}.md`);
  const note = getNotes(locale).find((entry) => entry.game === game.id) ?? null;
  return { blocks, note };
}

export function getAbout(locale: Locale): Block[] {
  return read(locale, "about.md").blocks;
}
