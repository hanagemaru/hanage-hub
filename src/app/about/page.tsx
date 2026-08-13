import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "このサイトについて",
  description: "hanage.appについてご案内します。",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <main>
      <PageHero kicker="ABOUT" title="このサイトについて" description="hanage.appは、個人で制作したゲームやWebアプリを公開するサイトです。" />
      <section className="contentSection pageWidth">
        <article className="contentCard">
          <h2>小さくても、少し新しい体験を。</h2>
          <p>思いついた仕組みや遊びを、ブラウザですぐに触れられる形にして公開しています。</p>
          <p>短い時間でも遊べるゲームを中心に、今後は便利なWebアプリや実験的な作品も追加していく予定です。</p>
          <h3>掲載している作品について</h3>
          <p>各作品は個人で企画・開発しています。開発中の作品は、予告なく仕様やデザインを変更する場合があります。</p>
        </article>
      </section>
    </main>
  );
}
