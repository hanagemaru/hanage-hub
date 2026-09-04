import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "更新情報",
  description: "hanage.appと公開作品の更新情報です。",
  alternates: { canonical: "/updates/" },
};

export default function UpdatesPage() {
  return (
    <main>
      <PageHero
        kicker="UPDATES"
        title="更新情報"
        description="サイトと公開作品の主な更新をお知らせします。"
      />
      <section className="contentSection pageWidth">
        <div className="updatesList">
          <article className="updateItem">
            <time dateTime="2026-09-04">2026.09.04</time>
            <h2>Multicolor Sweeperを公開しました</h2>
            <p>
              色つきの爆弾を論理だけで見つけるマインスイーパー「Multicolor
              Sweeper」を公開しました。クリアタイムのオンラインランキングにも対応しています。
            </p>
          </article>
          <article className="updateItem">
            <time dateTime="2026-09-04">2026.09.04</time>
            <h2>Puttを掲載しました</h2>
            <p>
              傾斜を自分で読む一人称パッティングゲーム「Putt」の紹介ページを追加しました。現在は仕上げの最中で、先行版を試せます。
            </p>
          </article>
          <article className="updateItem">
            <time dateTime="2026-08-13">2026.08.13</time>
            <h2>hanage.appの制作を始めました</h2>
            <p>自作ゲームとWebアプリをまとめるハブサイトの制作を開始しました。</p>
          </article>
        </div>
      </section>
    </main>
  );
}
