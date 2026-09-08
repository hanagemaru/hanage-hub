import type { Metadata } from "next";
import Link from "next/link";
import { GameArtwork } from "@/components/GameArtwork";
import { Screenshots } from "@/components/Screenshots";
import { putt as game, specList } from "@/lib/site";

export const metadata: Metadata = {
  title: "Putt",
  description: game.description,
  alternates: { canonical: "/games/putt/" },
};

export default function PuttPage() {
  return (
    <main>
      <section className="gameIntro pageWidth">
        <GameArtwork kind="putt" detail />
        <div className="gameIntroCopy">
          <h1>{game.titleLines[0]}</h1>
          <p className="gameLead">{game.description}</p>
          <div className="tagList" aria-label="ゲーム情報">
            {specList(game.specs).map((spec) => (
              <span className="tag" key={spec}>
                {spec}
              </span>
            ))}
          </div>
          <div className="buttonRow">
            <a className="buttonPrimary" href={game.playUrl} target="_blank" rel="noreferrer">
              {game.playLabel}
            </a>
            <Link className="buttonSecondary" href="/games/putt/how-to-play/">
              遊び方を見る
            </Link>
          </div>
          <Screenshots label="Puttの画面" shots={game.shots} />
        </div>
      </section>
    </main>
  );
}
