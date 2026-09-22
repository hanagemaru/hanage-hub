import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { notes } from "@/lib/site";

export function NotesView({ locale }: { locale: Locale }) {
  const t = getContent(locale);

  return (
    <main>
      <PageHero title={t.notesPage.title} description={t.notesPage.description} />
      <section className="contentSection pageWidth">
        <div className="noteList">
          {notes.map((note) => {
            const text = t.notes[note.id];
            return (
              <Link className="noteListItem" href={localePath(locale, note.route)} key={note.id}>
                <span>{t.games[note.gameId].subtitle}</span>
                <h2>{text.title}</h2>
                <p>{text.summary}</p>
                <b aria-hidden="true">→</b>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
