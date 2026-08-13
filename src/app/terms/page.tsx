import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "利用規約",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <main>
      <PageHero kicker="TERMS" title="利用規約" description="hanage.appおよび掲載作品をご利用いただく際の条件です。" />
      <section className="contentSection pageWidth">
        <article className="contentCard">
          <p>制定日：2026年8月13日</p>
          <h3>サービスの利用</h3>
          <p>当サイトおよび掲載作品は、個人で楽しむ範囲で利用できます。法令に反する行為、サービスの運営を妨げる行為、他の利用者や第三者の権利を侵害する行為を禁止します。</p>
          <h3>知的財産権</h3>
          <p>当サイトの文章、画像、プログラムその他のコンテンツに関する権利は、各権利者に帰属します。許可なく転載、複製、再配布することはできません。</p>
          <h3>免責事項</h3>
          <p>当サイトは、掲載内容の正確性、完全性、継続的な提供を保証するものではありません。当サイトまたは掲載作品の利用により生じた損害について、法令で認められる範囲で責任を負いません。</p>
          <h3>変更・停止</h3>
          <p>事前の通知なく、サービス内容の変更、一時停止または終了を行う場合があります。本規約も必要に応じて改定します。</p>
        </article>
      </section>
    </main>
  );
}
