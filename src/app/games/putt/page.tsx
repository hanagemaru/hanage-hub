import type { Metadata } from "next";
import Link from "next/link";
import { GameArtwork } from "@/components/GameArtwork";
import { putt } from "@/lib/site";

export const metadata: Metadata = {
  title: "Putt",
  description: putt.description,
  alternates: { canonical: "/games/putt/" },
};

export default function PuttPage() {
  return (
    <main>
      <section className="gameIntro pageWidth">
        <GameArtwork kind="putt" detail />
        <div className="gameIntroCopy">
          <p className="eyebrow">BROWSER GOLF GAME</p>
          <h1>Putt</h1>
          <p className="gameLead">{putt.description}</p>
          <div className="tagList" aria-label="ゲーム情報">
            {putt.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <div className="buttonRow">
            <a className="buttonPrimary" href={putt.playUrl} target="_blank" rel="noreferrer">
              {putt.playLabel}
            </a>
            <Link className="buttonSecondary" href="/games/putt/how-to-play/">
              遊び方を見る
            </Link>
          </div>
          <p className="noteText">仕上げの最中です。内容は公開までに変わることがあります。</p>
        </div>
      </section>

      <section className="contentSection pageWidth" aria-labelledby="features-title">
        <div className="sectionHeading">
          <div>
            <p className="sectionKicker">FEATURES</p>
            <h2 id="features-title">曲がりは、自分で読む。</h2>
          </div>
        </div>
        <div className="featureGrid">
          <article className="featureCard">
            <span className="featureNumber">01</span>
            <h3>予測線を出さない</h3>
            <p>どこへ曲がるかは、自分で読みます。</p>
          </article>
          <article className="featureCard">
            <span className="featureNumber">02</span>
            <h3>視点を変えて読む</h3>
            <p>後ろ、横、カップ側、そして真上から。</p>
          </article>
          <article className="featureCard">
            <span className="featureNumber">03</span>
            <h3>スワイプで打つ</h3>
            <p>滑らせた速さが、そのまま打つ強さです。</p>
          </article>
        </div>
      </section>
    </main>
  );
}
