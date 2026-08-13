import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "お問い合わせ",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <main>
      <PageHero kicker="CONTACT" title="お問い合わせ" description="不具合の報告や作品に関するご連絡はこちらからお願いします。" />
      <section className="contentSection pageWidth">
        <article className="contentCard">
          <h2>GitHubからお問い合わせください</h2>
          <p>Gradient Sweeperの不具合報告やご意見は、GitHubのIssuesで受け付けています。公開されて困る個人情報は記載しないでください。</p>
          <div className="buttonRow">
            <a className="buttonPrimary" href="https://github.com/hanagemaru/gradient-sweeper/issues" target="_blank" rel="noreferrer">GitHub Issuesを開く ↗</a>
          </div>
        </article>
      </section>
    </main>
  );
}
