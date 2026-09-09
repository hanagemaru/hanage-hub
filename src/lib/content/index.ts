import type { Locale } from "@/lib/i18n";
import type { Game, Screenshot } from "@/lib/site";
import { ja } from "./ja";
import { en } from "./en";
import type { Content, GameText } from "./types";

export type {
  Content,
  DefItem,
  GameSpecs,
  GameText,
  HowToPlayText,
  HowToSection,
  InlineLink,
  LegalParagraph,
  LegalSection,
  Step,
} from "./types";

const byLocale: Record<Locale, Content> = { ja, en };

export function getContent(locale: Locale): Content {
  return byLocale[locale];
}

/**
 * 実画面に代替テキストを合わせる。
 *
 * 枚数がずれていればビルドを落とす。片方の言語だけ代替テキストを足し忘れると
 * 「alt が空の画像が出る」という気づきにくい壊れ方をするので、静かに通さない。
 */
export function screenshots(game: Game, text: GameText): Screenshot[] {
  if (game.shots.length !== text.shotAlts.length) {
    throw new Error(
      `${game.slug}: 実画面が${game.shots.length}枚に対して代替テキストが${text.shotAlts.length}件しかない`,
    );
  }
  return game.shots.map((shot, index) => ({ ...shot, alt: text.shotAlts[index] }));
}

/** タグとして並べる順番。作品間・言語間で必ず同じ順にする */
export function specList(specs: GameText["specs"]): string[] {
  return [specs.price, specs.content, specs.devices];
}
