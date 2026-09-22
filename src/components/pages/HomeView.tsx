import Link from "next/link";
import { GameTile } from "@/components/GameTile";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { formatDate, games, notes, updates } from "@/lib/site";

export function HomeView({ locale }: { locale: Locale }) {
  const t = getContent(locale);
  const latest = updates[0];
  const latestText = t.updates[latest.id];

  return (
    <main>
      <section className="hero pageWidth">
        <h1>hanage.app</h1>
        <p className="heroCopy">{t.siteTagline}</p>
      </section>

      <section className="section pageWidth" aria-labelledby="games-title">
        <div className="sectionHeading">
          <h2 id="games-title">{t.home.gamesHeading}</h2>
          <Link className="textLink" href={localePath(locale, "/games/")}>
            {t.home.gamesMore} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="tileGrid">
          {games.map((game) => (
            <GameTile game={game} key={game.slug} locale={locale} />
          ))}
        </div>
      </section>

      <section className="section pageWidth" aria-labelledby="notes-title">
        <div className="sectionHeading">
          <h2 id="notes-title">{t.home.notesHeading}</h2>
          <Link className="textLink" href={localePath(locale, "/notes/")}>
            {t.home.notesMore} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="notePreviewGrid">
          {notes.slice(0, 4).map((note) => (
            <Link className="notePreview" href={localePath(locale, note.route)} key={note.id}>
              <span>{t.games[note.gameId].subtitle}</span>
              <strong>{t.notes[note.id].title}</strong>
              <p>{t.notes[note.id].summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section pageWidth" aria-labelledby="news-title">
        <div className="sectionHeading">
          <h2 id="news-title">{t.home.updatesHeading}</h2>
          <Link className="textLink" href={localePath(locale, "/updates/")}>
            {t.home.updatesMore} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <Link className="newsRow" href={localePath(locale, "/updates/")}>
          <time dateTime={latest.date}>{formatDate(latest.date)}</time>
          <span className="newsTag">{latest.kind}</span>
          <strong>{latestText.title}</strong>
          <span className="newsArrow" aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
