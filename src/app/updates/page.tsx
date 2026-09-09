import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { formatDate, updates } from "@/lib/site";

export const metadata: Metadata = {
  title: "更新情報",
  description: "hanage.appと公開作品の更新情報。",
  alternates: { canonical: "/updates/" },
};

export default function UpdatesPage() {
  return (
    <main>
      <PageHero title="更新情報" description="サイトと公開作品の主な更新。" />
      <section className="contentSection pageWidth">
        <div className="updatesList">
          {updates.map((entry) => (
            <article className="updateItem" key={`${entry.date}-${entry.title}`}>
              <time dateTime={entry.date}>{formatDate(entry.date)}</time>
              <h2>{entry.title}</h2>
              <p>{entry.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
