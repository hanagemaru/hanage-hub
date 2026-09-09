import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import type { InlineLink, LegalParagraph, LegalSection } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";

function InlineAnchor({ link, locale }: { link: InlineLink; locale: Locale }) {
  if ("route" in link) {
    return (
      <Link className="textLink" href={localePath(locale, link.route)}>
        {link.label}
      </Link>
    );
  }
  return (
    <a className="textLink" href={link.url} target="_blank" rel="noreferrer">
      {link.label}
    </a>
  );
}

function Paragraph({ value, locale }: { value: LegalParagraph; locale: Locale }) {
  if (typeof value === "string") return <p>{value}</p>;
  return (
    <p>
      {value.before}
      <InlineAnchor link={value.link} locale={locale} />
      {value.after}
    </p>
  );
}

/**
 * プライバシーポリシーと利用規約。
 *
 * どちらも「見出し＋段落（＋箇条書き）」の繰り返しなので、同じ組み方で出す。
 * 訳した版では、原文がどちらかを最初に断る。
 */
export function LegalView({
  locale,
  title,
  description,
  revision,
  sections,
  translationNote,
}: {
  locale: Locale;
  title: string;
  description: string;
  revision: string;
  sections: LegalSection[];
  translationNote?: string;
}) {
  return (
    <main>
      <PageHero title={title} description={description} />
      <section className="contentSection pageWidth">
        <article className="contentCard">
          <p>{revision}</p>
          {translationNote ? <p className="translationNote">{translationNote}</p> : null}
          {sections.map((section) => (
            <div key={section.heading}>
              <h3>{section.heading}</h3>
              {section.list ? (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.paragraphs.map((paragraph, index) => (
                <Paragraph key={index} locale={locale} value={paragraph} />
              ))}
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
