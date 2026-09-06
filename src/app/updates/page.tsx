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
            <p>色つきの爆弾を探すマインスイーパー。オンラインランキングつきです。</p>
          </article>
          <article className="updateItem">
            <time dateTime="2026-09-06">2026.09.06</time>
            <h2>Puttを公開しました</h2>
            <p>傾斜を自分で読む一人称パッティング。3コース × 9ホールで遊べます。</p>
          </article>
          <article className="updateItem">
            <time dateTime="2026-09-04">2026.09.04</time>
            <h2>Puttを掲載しました</h2>
            <p>傾斜を自分で読む一人称パッティング。先行版の試遊を始めました。</p>
          </article>
          <article className="updateItem">
            <time dateTime="2026-08-13">2026.08.13</time>
            <h2>hanage.appの制作を始めました</h2>
            <p>自作ゲームとWebアプリをまとめる場所を作り始めました。</p>
          </article>
        </div>
      </section>
    </main>
  );
}
