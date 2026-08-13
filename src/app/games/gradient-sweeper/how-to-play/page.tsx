import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Gradient Sweeperの遊び方",
  description: "色を手がかりに赤と青の爆弾を見つけるGradient Sweeperの遊び方。",
  alternates: { canonical: "/games/gradient-sweeper/how-to-play/" },
};

export default function HowToPlayPage() {
  return (
    <main>
      <PageHero
        kicker="HOW TO PLAY"
        title="Gradient Sweeperの遊び方"
        description="基本はマインスイーパー。ただし、数字の代わりにセルの色から爆弾の位置を推理します。"
      />
      <section className="contentSection pageWidth">
        <article className="contentCard">
          <h2>基本ルール</h2>
          <ol className="stepList">
            <li><span>1</span><div><strong>セルをタップして開く</strong><p>爆弾のないセルをすべて開けばクリアです。</p></div></li>
            <li><span>2</span><div><strong>色から周囲を推理する</strong><p>開いたセルの色は、隣接する8マスにある赤・青の爆弾の比率を示します。</p></div></li>
            <li><span>3</span><div><strong>上スワイプでフラグ</strong><p>爆弾だと思うセルには、赤または青のフラグを立てます。</p></div></li>
          </ol>
        </article>
        <article className="contentCard">
          <h2>色の見かた</h2>
          <ul>
            <li><strong>赤系：</strong>周囲は赤い爆弾の割合が高めです。</li>
            <li><strong>青系：</strong>周囲は青い爆弾の割合が高めです。</li>
            <li><strong>紫系：</strong>赤と青の爆弾が混ざっています。</li>
          </ul>
          <p>色の濃さも手がかりになります。複数のセルを見比べて、爆弾の位置と色を絞り込みます。</p>
        </article>
        <article className="contentCard">
          <h2>ゲームモード</h2>
          <h3>Endless</h3>
          <p>残機を使いながら、連続で盤面クリアに挑みます。</p>
          <h3>Time Attack</h3>
          <p>10・20・30の難易度から選び、制限時間内のクリアを目指します。</p>
          <div className="buttonRow">
            <Link className="buttonSecondary" href="/games/gradient-sweeper/">ゲーム紹介へ戻る</Link>
            <a className="buttonPrimary" href="https://sweeper.hanage.app/" target="_blank" rel="noreferrer">ゲームを開く ↗</a>
          </div>
        </article>
      </section>
    </main>
  );
}
