import Link from "next/link";
import { Markdown } from "@/components/Markdown";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { OWNER, formatDate, games, gameTitle } from "@/lib/site";
import { getNote } from "@/lib/writing";

export function NoteView({ locale, slug }: { locale: Locale; slug: string }) {
  const t = getContent(locale);
  const note = getNote(locale, slug);
  const game = games.find((entry) => entry.id === note.game);

  return (
    <main>
      <article className="noteArticle pageWidth">
        <header className="noteHeader">
          <p className="noteMeta">
            <Link href={localePath(locale, "/notes/")}>{t.notesPage.title}</Link>
            <span aria-hidden="true"> ／ </span>
            <time dateTime={note.date}>{formatDate(note.date)}</time>
            <span aria-hidden="true"> ／ </span>
            <span>{OWNER.handle}</span>
          </p>
          <h1>{note.title}</h1>
        </header>
        <div className="prose">
          <Markdown blocks={note.blocks} />
        </div>
        <div className="buttonRow">
          {game ? (
            <Link className="buttonPrimary" href={localePath(locale, game.route)}>
              {t.notesPage.gameLinkLabel}：{gameTitle(game)}
            </Link>
          ) : null}
          <Link className="buttonSecondary" href={localePath(locale, "/notes/")}>
            {t.notesPage.backLabel}
          </Link>
        </div>
      </article>
    </main>
  );
}
