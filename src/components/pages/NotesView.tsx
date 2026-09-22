import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { gameTitle, games, notes } from "@/lib/site";

export function NotesView({ locale }: { locale: Locale }) {
  const t = getContent(locale);

  return (
    <main>
      <PageHero title={t.notesPage.title} description={t.notesPage.description} />
      <section className="contentSection pageWidth">
        <div className="noteList">
          {notes.map((note) => {
            const text = t.notes[note.id];
            const game = games.find((entry) => entry.id === note.gameId);
            if (!game) throw new Error(`Unknown game for note: ${note.id}`);
            return (
              <Link className="noteListItem" href={localePath(locale, note.route)} key={note.id}>
                <span>{gameTitle(game)}</span>
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
