import type { Metadata } from "next";
import Link from "next/link";
import { GradientArtwork } from "@/components/GradientArtwork";
import { gradientSweeper } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gradient Sweeper",
  description: gradientSweeper.description,
  alternates: { canonical: "/games/gradient-sweeper/" },
};

export default function GradientSweeperPage() {
  return (
    <main>
      <section className="gameIntro pageWidth">
        <GradientArtwork detail />
        <div className="gameIntroCopy">
          <p className="eyebrow">BROWSER PUZZLE GAME</p>
          <h1>Gradient<br />Sweeper</h1>
          <p className="gameLead">{gradientSweeper.description}</p>
          <div className="tagList" aria-label="ゲーム情報">
            <span className="tag">9×9</span>
            <span className="tag">パズル</span>
            <span className="tag">スマホ対応</span>
            <span className="tag">日本語 / English</span>
          </div>
          <div className="buttonRow">
            <a className="buttonPrimary" href={gradientSweeper.playUrl} target="_blank" rel="noreferrer">
              ゲームを開く ↗
            </a>
            <Link className="buttonSecondary" href="/games/gradient-sweeper/how-to-play/">
              遊び方を見る
            </Link>
          </div>
        </div>
      </section>

      <section className="contentSection pageWidth" aria-labelledby="features-title">
        <div className="sectionHeading">
          <div>
            <p className="sectionKicker">FEATURES</p>
            <h2 id="features-title">数字ではなく、色を読む。</h2>
          </div>
        </div>
        <div className="featureGrid">
          <article className="featureCard">
            <span className="featureNumber">01</span>
            <h3>色がヒント</h3>
            <p>周囲にある赤と青の爆弾の比率が、セルの色として表れます。</p>
          </article>
          <article className="featureCard">
            <span className="featureNumber">02</span>
            <h3>2つの遊び方</h3>
            <p>じっくり進めるEndlessと、制限時間に挑むTime Attackを用意しています。</p>
          </article>
          <article className="featureCard">
            <span className="featureNumber">03</span>
            <h3>片手で操作</h3>
            <p>タップで開き、上スワイプでフラグ。スマートフォン向けの操作です。</p>
          </article>
        </div>
      </section>
    </main>
  );
}
