import { PageHero } from "@/components/PageHero";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { gameTitle, games, OWNER } from "@/lib/site";

export function ContactView({ locale }: { locale: Locale }) {
  const t = getContent(locale);

  return (
    <main>
      <PageHero title={t.contactPage.title} description={t.contactPage.description} />
      <section className="contentSection pageWidth">
        <article className="contentCard">
          <h2>{t.contactPage.reachHeading}</h2>
          <p>{t.contactPage.reachBody}</p>
          <div className="buttonRow">
            <a className="buttonPrimary" href={OWNER.social.url} target="_blank" rel="noreferrer">
              {OWNER.social.label} {OWNER.social.handle} ↗
            </a>
          </div>

          <h2>{t.contactPage.bugsHeading}</h2>
          <p>{t.contactPage.bugsBody}</p>
          <div className="buttonRow">
            {games.map((game) => (
              <a
                className="buttonSecondary"
                href={game.issuesUrl}
                key={game.slug}
                target="_blank"
                rel="noreferrer"
              >
                {gameTitle(game)} ↗
              </a>
            ))}
            <a
              className="buttonSecondary"
              href={OWNER.siteIssuesUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t.contactPage.siteLabel} ↗
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
