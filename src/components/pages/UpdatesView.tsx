import { PageHero } from "@/components/PageHero";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { formatDate, updates } from "@/lib/site";

export function UpdatesView({ locale }: { locale: Locale }) {
  const t = getContent(locale);

  return (
    <main>
      <PageHero title={t.updatesPage.title} description={t.updatesPage.description} />
      <section className="contentSection pageWidth">
        <div className="updatesList">
          {updates.map((entry) => {
            const text = t.updates[entry.id];
            return (
              <article className="updateItem" key={entry.id}>
                <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                <h2>{text.title}</h2>
                <p>{text.body}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
