import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { putt } from "@/lib/site";

export const metadata: Metadata = {
  title: "Puttの遊び方",
  description: "グリーンを読み、スワイプで転がす一人称パッティングゲームPuttの遊び方。",
  alternates: { canonical: "/games/putt/how-to-play/" },
};

export default function HowToPlayPage() {
  return (
    <main>
      <PageHero
        kicker="HOW TO PLAY"
        title="Puttの遊び方"
        description="スマホを縦に持ち、少ない打数でカップに沈めます。操作は「進むときは画面をタップ、切り替えるときはボタン」です。"
      />
      <section className="contentSection pageWidth">
        <article className="contentCard">
          <h2>1打の流れ</h2>
          <ol className="stepList">
            <li>
              <span>1</span>
              <div>
                <strong>グリーンを読む</strong>
                <p>視点を切り替えて、傾斜と残りの距離を確かめます。真上から見るマップでは、ホール全体の形が分かります。</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>向きを決める</strong>
                <p>ボールの後ろから狙う向きを360°調整します。表示されるのは打ち出す方向の短い線だけで、曲がった先は示されません。</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>スワイプして打つ</strong>
                <p>画面をタップしてストロークに入り、指を滑らせます。滑らせる速さが打つ強さになります。</p>
              </div>
            </li>
            <li>
              <span>4</span>
              <div>
                <strong>結果を見る</strong>
                <p>ボールが止まると、上から見た軌跡を確認できます。転がっている間に視点が切り替わることはありません。</p>
              </div>
            </li>
          </ol>
        </article>

        <article className="contentCard">
          <h2>コースとスコア</h2>
          <ul>
            <li>1ラウンドは9ホール。打数の合計を競うストロークプレーです。</li>
            <li>芝の外はラフとセカンドカット。奥に入るほど転がらなくなります。</li>
            <li>池とOBは1打罰で、直前に打った位置から打ち直します。</li>
            <li>1ホールで打ちすぎた場合は、そこで打ち切って次のホールへ進みます。</li>
          </ul>
          <p>ホームに戻るなどで中断しても、そのホールの頭から再開できます。</p>
        </article>

        <article className="contentCard">
          <h2>遊ぶときの前提</h2>
          <p>スマートフォンの縦画面専用です。横向きにする必要はありません。インストールも不要で、ブラウザで開けばそのまま遊べます。</p>
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
