import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { putt } from "@/lib/site";

export const metadata: Metadata = {
  title: "Puttの遊び方",
  description: "グリーンを読み、パターを振ってカップに沈める一人称パッティングPuttの遊び方。",
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
          <h2>モード</h2>
          <ul>
            <li><strong>通常ツアー：</strong>3つのコースから1つ選び、9ホールを回ります。</li>
            <li><strong>練習：</strong>1ホールを何度でも打ち直せます。</li>
          </ul>
        </article>

        <article className="contentCard">
          <h2>1打の流れ</h2>
          <ol className="stepList">
            <li>
              <span>1</span>
              <div>
                <strong>コースを見る</strong>
                <p>視点ボタンとコースマップで、傾斜とカップまでの形を確かめます。</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>狙いを決める</strong>
                <p>ボール後方と低い視点では、左右のスワイプで狙いを調整できます。</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>構える</strong>
                <p>画面をタップすると、パターを構えます。</p>
              </div>
            </li>
            <li>
              <span>4</span>
              <div>
                <strong>打つ</strong>
                <p>パターを右へ引いてから、左へ振り抜きます。振る速さが強さになります。</p>
              </div>
            </li>
          </ol>
        </article>

        <article className="contentCard">
          <h2>ルール</h2>
          <ul>
            <li>打数の合計で競います。芝の外に出ると転がりません。</li>
            <li>池とOBは1打罰。直前に打った位置から打ち直します。</li>
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
