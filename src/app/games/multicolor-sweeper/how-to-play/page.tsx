import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { multicolorSweeper } from "@/lib/site";

export const metadata: Metadata = {
  title: "Multicolor Sweeperの遊び方",
  description: "色つきの爆弾を、色ごとの数字から論理だけで見つけるMulticolor Sweeperの遊び方。",
  alternates: { canonical: "/games/multicolor-sweeper/how-to-play/" },
};

export default function HowToPlayPage() {
  return (
    <main>
      <PageHero
        kicker="HOW TO PLAY"
        title="Multicolor Sweeperの遊び方"
        description="基本はマインスイーパー。ただし爆弾に色があり、数字も色ごとに分かれています。"
      />
      <section className="contentSection pageWidth">
        <article className="contentCard">
          <h2>基本ルール</h2>
          <ol className="stepList">
            <li>
              <span>1</span>
              <div>
                <strong>難易度と色数を選ぶ</strong>
                <p>15 / 20 / 25 BOMBS と、3色 / 4色を選んで START します。</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>好きなマスから開ける</strong>
                <p>最初に選んだマスとその周囲8マスは必ず安全です。盤面は最初のタップの後に作られます。</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>色ごとの数字から推理する</strong>
                <p>開いたマスには、隣接する8マスにある爆弾の数が色ごとに表示されます。</p>
              </div>
            </li>
            <li>
              <span>4</span>
              <div>
                <strong>スワイプで旗を立てる</strong>
                <p>爆弾だと分かったマスは、スワイプの方向で色を選んで旗を立てます。</p>
              </div>
            </li>
          </ol>
          <p>爆弾のないマスをすべて開けばクリアです。タイマーは盤面ができた瞬間に動き始めます。</p>
        </article>

        <article className="contentCard">
          <h2>旗の立て方</h2>
          <p>マスの上で指を滑らせると、方向に応じた色の旗が立ちます。</p>
          <ul>
            <li><strong>左上：</strong>赤の旗</li>
            <li><strong>右上：</strong>青の旗</li>
            <li><strong>左下：</strong>緑の旗</li>
            <li><strong>右下：</strong>黄の旗（4色のときだけ）</li>
            <li><strong>上：</strong>色を決めない旗</li>
          </ul>
          <p>同じ旗をもう一度立てると外れます。別の色にすると、旗の色だけが変わります。</p>
        </article>

        <article className="contentCard">
          <h2>まとめて開ける（Chord）</h2>
          <p>開いているマスをタップすると、周囲の旗の数がそのマスの合計と一致している場合に、旗のない隣のマスをまとめて開けます。旗の位置が間違っていれば爆発するので、確信があるときに使います。</p>
        </article>

        <article className="contentCard">
          <h2>ランキング</h2>
          <p>クリアタイムは 15 / 20 / 25 BOMBS の3部門で登録できます。3色と4色は同じ部門に並び、一覧では色数が分かるように表示されます。</p>
          <p>プレイ前に名前を聞くことはしません。自己ベストを更新して登録するときに、はじめて名前を決めます。</p>
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
