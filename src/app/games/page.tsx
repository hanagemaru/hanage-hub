import type { Metadata } from "next";
import { GameTile } from "@/components/GameTile";
import { PageHero } from "@/components/PageHero";
import { games } from "@/lib/site";

export const metadata: Metadata = {
  title: "ゲーム",
  description: "hanage.appで公開しているブラウザゲームの一覧です。",
  alternates: { canonical: "/games/" },
};

export default function GamesPage() {
  return (
    <main>
      <PageHero
        kicker="GAMES"
        title="ゲーム"
        description="ブラウザですぐに遊べる、ひと工夫あるゲームを公開しています。"
      />
      <section className="contentSection pageWidth" aria-label="ゲーム一覧">
        <div className="tileGrid">
          {games.map((game) => (
            <GameTile game={game} key={game.slug} />
          ))}
        </div>
      </section>
    </main>
  );
}
