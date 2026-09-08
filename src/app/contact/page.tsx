import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { OWNER, games } from "@/lib/site";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "hanage.appと公開作品についての連絡先。",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <main>
      <PageHero title="お問い合わせ" description="作品とサイトについての連絡先。" />
      <section className="contentSection pageWidth">
        <article className="contentCard">
          {OWNER.social ? (
            <>
              <h2>運営者に連絡する</h2>
              <p>作品とサイトについての連絡は、{OWNER.social.label}のアカウントへ。</p>
              <div className="buttonRow">
                <a
                  className="buttonPrimary"
                  href={OWNER.social.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {OWNER.social.handle} ↗
                </a>
              </div>
            </>
          ) : null}

          <h2>不具合を報告する</h2>
          <p>
            再現手順を添えて報告する場合は、GitHubのIssuesが確実。公開される場所なので、知られて困る情報は書かないこと。
          </p>
          <div className="buttonRow">
            {games.map((game) => (
              <a
                className="buttonSecondary"
                href={game.issuesUrl}
                key={game.slug}
                target="_blank"
                rel="noreferrer"
              >
                {game.title} ↗
              </a>
            ))}
            <a
              className="buttonSecondary"
              href={OWNER.siteIssuesUrl}
              target="_blank"
              rel="noreferrer"
            >
              サイト ↗
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
