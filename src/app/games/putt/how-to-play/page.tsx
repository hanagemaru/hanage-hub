import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { putt } from "@/lib/site";

export const metadata: Metadata = {
  title: "Puttの遊び方",
  description: "グリーンを読み、スワイプで転がす一人称パッティングPuttの遊び方。",
  alternates: { canonical: "/games/putt/how-to-play/" },
};

export default function HowToPlayPage() {
  return (
    <main>
      <PageHero
        kicker="HOW TO PLAY"
        title="遊び方"
        description="スマホを縦に持って、少ない打数でカップに沈めます。"
      />
      <section className="contentSection pageWidth">
        <article className="contentCard">
          <h2>1打の流れ</h2>
          <ol className="stepList">
            <li>
              <span>1</span>
              <div>
                <strong>読む</strong>
                <p>視点を切り替えて、傾斜と距離を見ます。</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>向きを決める</strong>
                <p>ボールの後ろから、360°で狙いを合わせます。</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>打つ</strong>
                <p>画面を滑らせます。速いほど強く転がります。</p>
              </div>
            </li>
          </ol>
          <p>進むときは画面をタップ、切り替えるときはボタンです。</p>
        </article>

        <article className="contentCard">
          <h2>ルール</h2>
          <ul>
            <li>1ラウンド9ホール。打数の合計で競います。</li>
            <li>芝の外は転がりません。池とOBは1打罰です。</li>
            <li>中断しても、そのホールの頭から再開できます。</li>
          </ul>
          <div className="buttonRow">
            <Link className="buttonSecondary" href="/games/putt/">
              ゲーム紹介へ戻る
            </Link>
            <a className="buttonPrimary" href={putt.playUrl} target="_blank" rel="noreferrer">
              {putt.playLabel}
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
