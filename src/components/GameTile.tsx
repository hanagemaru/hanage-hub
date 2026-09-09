import Link from "next/link";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { gameTitle, type Game } from "@/lib/site";
import { GameArtwork } from "./GameArtwork";

export function GameTile({ game, locale }: { game: Game; locale: Locale }) {
  const text = getContent(locale).games[game.id];

  return (
    <article className="gameTile">
      <Link className="gameTileLink" href={localePath(locale, game.route)}>
        <GameArtwork kind={game.artwork} status={text.status} />
        <div className="tileMeta">
          <h3>{gameTitle(game)}</h3>
          <p>{text.subtitle}</p>
        </div>
      </Link>
    </article>
  );
}
