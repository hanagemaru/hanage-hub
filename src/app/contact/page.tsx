import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { games } from "@/lib/site";

export const metadata: Metadata = {
  title: "お問い合わせ",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        kicker="CONTACT"
        title="お問い合わせ"
        description="不具合の報告や作品に関するご連絡はこちらからお願いします。"
      />
      <section className="contentSection pageWidth">
        <article className="contentCard">
          <h2>GitHubからお問い合わせください</h2>
          <p>
            不具合の報告やご意見は、各作品のGitHub
            Issuesで受け付けています。公開されて困る個人情報は記載しないでください。
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
                {game.title}の報告 ↗
              </a>
            ))}
          </div>
          <h3>サイトについて</h3>
          <p>ページの表示崩れやリンク切れなど、サイト自体に関するご連絡はこちらへお願いします。</p>
          <div className="buttonRow">
            <a
              className="buttonPrimary"
              href="https://github.com/hanagemaru/hanage-hub/issues"
              target="_blank"
              rel="noreferrer"
            >
              サイトの報告 ↗
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
