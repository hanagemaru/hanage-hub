import Link from "next/link";
import { Markdown } from "@/components/Markdown";
import { PageHero } from "@/components/PageHero";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { OWNER } from "@/lib/site";
import { getAbout } from "@/lib/writing";

export function AboutView({ locale }: { locale: Locale }) {
  const t = getContent(locale);

  return (
    <main>
      <PageHero title={t.aboutPage.title} description={t.aboutPage.description} />
      <section className="contentSection pageWidth">
        <article className="contentCard">
          <h2>{t.aboutPage.bodyHeading}</h2>
          <div className="prose">
            <Markdown blocks={getAbout(locale)} />
          </div>
        </article>
        <article className="contentCard">
          <h2>{t.aboutPage.ownerHeading}</h2>
          <p>
            {OWNER.handle} ／ {t.aboutPage.ownerRole}
          </p>
          <div className="buttonRow">
            <a className="buttonSecondary" href={OWNER.social.url} target="_blank" rel="noreferrer">
              {OWNER.social.label} {OWNER.social.handle} ↗
            </a>
            <Link className="buttonSecondary" href={localePath(locale, "/contact/")}>
              {t.aboutPage.contactLabel}
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
