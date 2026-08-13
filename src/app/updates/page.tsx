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
      <PageHero kicker="UPDATES" title="更新情報" description="サイトと公開作品の主な更新をお知らせします。" />
      <section className="contentSection pageWidth">
        <div className="updatesList">
          <article className="updateItem">
            <time dateTime="2026-08-13">2026.08.13</time>
            <h2>hanage.appの制作を始めました</h2>
            <p>自作ゲームとWebアプリをまとめるハブサイトの制作を開始しました。</p>
          </article>
          <article className="updateItem">
            <time dateTime="2026-08-13">2026.08.13</time>
            <h2>Gradient Sweeperを掲載準備中です</h2>
            <p>色を手がかりに解くマインスイーパー「Gradient Sweeper」を開発しています。</p>
          </article>
        </div>
      </section>
    </main>
  );
}
