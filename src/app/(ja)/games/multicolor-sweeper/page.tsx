import type { Metadata } from "next";
import { GameView } from "@/components/pages/GameView";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { gameTitle, multicolorSweeper as game } from "@/lib/site";

const locale = "ja";
const text = getContent(locale).games[game.id];

export const metadata: Metadata = pageMetadata(locale, game.route, {
  title: gameTitle(game),
  description: text.metaDescription,
});

export default function GamePage() {
  return <GameView game={game} locale={locale} />;
}
