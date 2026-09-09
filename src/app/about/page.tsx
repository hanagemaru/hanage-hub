import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { OWNER } from "@/lib/site";

export const metadata: Metadata = {
  title: "このサイトについて",
  description: "hanage.appの運営者について。",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <main>
      <PageHero
        title="このサイトについて"
        description="個人で制作したブラウザゲームとWebアプリを公開しているサイト。"
      />
      <section className="contentSection pageWidth">
        <article className="contentCard">
          <h2>運営者</h2>
          <p>{OWNER.handle} ／ 企画・開発・運営</p>
          <div className="buttonRow">
            <a className="buttonSecondary" href={OWNER.social.url} target="_blank" rel="noreferrer">
              {OWNER.social.label} {OWNER.social.handle} ↗
            </a>
            <Link className="buttonSecondary" href="/contact/">
              お問い合わせ
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
