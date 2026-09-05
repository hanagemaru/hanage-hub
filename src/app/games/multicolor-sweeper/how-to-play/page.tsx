import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { multicolorSweeper } from "@/lib/site";

export const metadata: Metadata = {
  title: "Multicolor Sweeperの遊び方",
  description: "色つきの爆弾を、色ごとの数字から見つけるMulticolor Sweeperの遊び方。",
  alternates: { canonical: "/games/multicolor-sweeper/how-to-play/" },
};

export default function HowToPlayPage() {
  return (
    <main>
      <PageHero
        kicker="HOW TO PLAY"
        title="遊び方"
        description="基本はマインスイーパー。ただし爆弾に色があり、数字も色ごとに分かれています。"
      />
      <section className="contentSection pageWidth">
        <article className="contentCard">
          <h2>基本</h2>
          <ol className="stepList">
            <li>
              <span>1</span>
              <div>
                <strong>難易度と色数を選ぶ</strong>
                <p>15 / 20 / 25 BOMBS と、3色か4色。</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>好きなマスから開ける</strong>
                <p>最初のマスと周りの8マスは必ず安全です。</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>色ごとの数字を読む</strong>
                <p>隣接する8マスにある爆弾の数が、色ごとに出ます。</p>
              </div>
            </li>
            <li>
              <span>4</span>
              <div>
                <strong>爆弾のないマスを全部開ける</strong>
                <p>それでクリアです。</p>
              </div>
            </li>
          </ol>
        </article>

        <article className="contentCard">
          <h2>旗</h2>
          <p>マスの上で指を滑らせた方向で、旗の色が決まります。</p>
          <ul>
            <li><strong>左上：</strong>赤</li>
            <li><strong>右上：</strong>青</li>
            <li><strong>左下：</strong>緑</li>
            <li><strong>右下：</strong>黄（4色のみ）</li>
            <li><strong>上：</strong>色を決めない旗</li>
          </ul>
          <p>同じ旗をもう一度立てると外れます。</p>
        </article>

        <article className="contentCard">
          <h2>まとめて開ける</h2>
          <p>開いたマスをタップすると、周りの旗の数が合っていれば、旗のない隣のマスをまとめて開けます。旗が間違っていれば爆発します。</p>
        </article>

        <article className="contentCard">
          <h2>ランキング</h2>
          <p>クリアタイムは 15 / 20 / 25 BOMBS の3部門。名前は自己ベストを登録するときに決めます。</p>
          <div className="buttonRow">
            <Link className="buttonSecondary" href="/games/multicolor-sweeper/">
              ゲーム紹介へ戻る
            </Link>
            <a className="buttonPrimary" href={multicolorSweeper.playUrl} target="_blank" rel="noreferrer">
              {multicolorSweeper.playLabel}
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
