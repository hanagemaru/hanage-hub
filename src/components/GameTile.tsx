import Link from "next/link";
import type { Game } from "@/lib/site";
import { GameArtwork } from "./GameArtwork";

export function GameTile({ game }: { game: Game }) {
  return (
    <article className="gameTile">
      <Link className="gameTileLink" href={game.href}>
        <GameArtwork kind={game.artwork} status={game.status} />
        <div className="tileMeta">
          <h3>{game.title}</h3>
          <p>{game.subtitle}</p>
        </div>
      </Link>
    </article>
  );
}
