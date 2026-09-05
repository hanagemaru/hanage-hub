import type { Metadata } from "next";
import Link from "next/link";
import { GameArtwork } from "@/components/GameArtwork";
import { multicolorSweeper } from "@/lib/site";

export const metadata: Metadata = {
  title: "Multicolor Sweeper",
  description: multicolorSweeper.description,
  alternates: { canonical: "/games/multicolor-sweeper/" },
};

export default function MulticolorSweeperPage() {
  return (
    <main>
      <section className="gameIntro pageWidth">
        <GameArtwork kind="sweeper" detail />
        <div className="gameIntroCopy">
          <p className="eyebrow">BROWSER PUZZLE GAME</p>
          <h1>
            Multicolor
            <br />
            Sweeper
          </h1>
          <p className="gameLead">{multicolorSweeper.description}</p>
          <div className="tagList" aria-label="ゲーム情報">
            {multicolorSweeper.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <div className="buttonRow">
            <a
              className="buttonPrimary"
              href={multicolorSweeper.playUrl}
              target="_blank"
              rel="noreferrer"
            >
              {multicolorSweeper.playLabel}
            </a>
            <Link className="buttonSecondary" href="/games/multicolor-sweeper/how-to-play/">
              遊び方を見る
            </Link>
          </div>
        </div>
      </section>

      <section className="contentSection pageWidth" aria-labelledby="features-title">
        <div className="sectionHeading">
          <div>
            <p className="sectionKicker">FEATURES</p>
            <h2 id="features-title">爆弾に色がついている。</h2>
          </div>
        </div>
        <div className="featureGrid">
          <article className="featureCard">
            <span className="featureNumber">01</span>
            <h3>色ごとの数字</h3>
            <p>隣にある爆弾の数が、色ごとに出ます。</p>
          </article>
          <article className="featureCard">
            <span className="featureNumber">02</span>
            <h3>運で負けない</h3>
            <p>最後まで論理で解ける盤面だけを出します。</p>
          </article>
          <article className="featureCard">
            <span className="featureNumber">03</span>
            <h3>タイムアタック</h3>
            <p>15 / 20 / 25 BOMBS。オンラインランキングあり。</p>
          </article>
        </div>
      </section>
    </main>
  );
}
