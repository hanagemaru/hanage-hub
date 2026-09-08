import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { OWNER } from "@/lib/site";

export const metadata: Metadata = {
  title: "このサイトについて",
  description: "hanage.appの運営者と公開内容について。",
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
          <p>{OWNER.name}（企画・開発・運営）</p>
          <p>
            連絡先は
            <Link className="textLink" href="/contact/">
              お問い合わせ
            </Link>
            ページに記載。
          </p>

          <h3>公開しているもの</h3>
          <p>
            hanage.app と、そのサブドメインで各作品を公開。ブラウザだけで動き、インストールもアカウント登録も不要。
          </p>
          <p>
            公開中の作品は
            <Link className="textLink" href="/games/">
              ゲーム
            </Link>
            ページに掲載。
          </p>

          <h3>制作について</h3>
          <p>
            既製のゲームエンジンやテンプレートは使わず、盤面の生成やボールの転がりといった中心の仕組みから自作。
          </p>

          <h3>料金</h3>
          <p>
            すべて無料。アプリ内購入や有料プランはなし。運営費用のため広告を掲載することがある。取り扱いは
            <Link className="textLink" href="/privacy/">
              プライバシーポリシー
            </Link>
            に記載。
          </p>
        </article>
      </section>
    </main>
  );
}
