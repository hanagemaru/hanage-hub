import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { notes, type NoteId } from "@/lib/site";

export function NoteView({ id, locale }: { id: NoteId; locale: Locale }) {
  const t = getContent(locale);
  const text = t.notes[id];
  const note = notes.find((entry) => entry.id === id);

  if (!note) {
    throw new Error(`Unknown note: ${id}`);
  }

  const gameRoute = note.gameId === "putt" ? "/games/putt/" : "/games/multicolor-sweeper/";

  return (
    <main>
      <PageHero title={text.title} description={text.summary} />
      <section className="contentSection pageWidth noteArticle">
        {text.sections.map((section) => (
          <article className="contentCard" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        ))}
        <div className="noteBack">
          <Link className="buttonSecondary" href={localePath(locale, gameRoute)}>
            ← {text.backLabel}
          </Link>
          <Link className="textLink" href={localePath(locale, "/notes/")}>
            {t.notesPage.title} →
          </Link>
        </div>
      </section>
    </main>
  );
}
