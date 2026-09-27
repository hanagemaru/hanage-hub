import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/site";
import { getNotes, noteRoute } from "@/lib/writing";

export function NotesView({ locale }: { locale: Locale }) {
  const t = getContent(locale);
  const notes = getNotes(locale);

  return (
    <main>
      <PageHero title={t.notesPage.title} description={t.notesPage.description} />
      <section className="contentSection pageWidth" aria-label={t.notesPage.listLabel}>
        <NoteList locale={locale} notes={notes} />
      </section>
    </main>
  );
}

/** 一覧とトップページで同じ行を使う */
export function NoteList({ locale, notes }: { locale: Locale; notes: ReturnType<typeof getNotes> }) {
  return (
    <div className="noteList">
      {notes.map((note) => (
        <Link className="noteRow" href={localePath(locale, noteRoute(note.slug))} key={note.slug}>
          <time dateTime={note.date}>{formatDate(note.date)}</time>
          <strong>{note.title}</strong>
          <p>{note.description}</p>
        </Link>
      ))}
    </div>
  );
}
