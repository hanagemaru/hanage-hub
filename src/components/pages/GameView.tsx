import { Fragment } from "react";
import Link from "next/link";
import { GameArtwork } from "@/components/GameArtwork";
import { Screenshots } from "@/components/Screenshots";
import { getContent, screenshots, specList } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { notes } from "@/lib/site";
import type { Game } from "@/lib/site";

export function GameView({ game, locale }: { game: Game; locale: Locale }) {
  const t = getContent(locale);
  const text = t.games[game.id];
  const relatedNotes = notes.filter((note) => note.gameId === game.id);

  return (
    <main>
      <section className="gameIntro pageWidth">
        <GameArtwork kind={game.artwork} detail />
        <div className="gameIntroCopy">
          <h1>
            {game.titleLines.map((line, index) => (
              <Fragment key={line}>
                {index > 0 ? <br /> : null}
                {line}
              </Fragment>
            ))}
          </h1>
          <p className="gameLead">{text.description}</p>
          <div className="tagList" aria-label={t.gameDetail.specsLabel}>
            {specList(text.specs).map((spec) => (
              <span className="tag" key={spec}>
                {spec}
              </span>
            ))}
          </div>
          <div className="buttonRow">
            <a className="buttonPrimary" href={game.playUrl} target="_blank" rel="noreferrer">
              {text.playLabel}
            </a>
            <Link
              className="buttonSecondary"
              href={localePath(locale, game.howToPlayRoute)}
            >
              {t.gameDetail.howToPlayLabel}
            </Link>
          </div>
          <Screenshots label={text.shotsLabel} shots={screenshots(game, text)} />
        </div>
      </section>

      <section className="contentSection pageWidth">
        <article className="contentCard">
          <h2>{text.detailsHeading}</h2>
          {text.details.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>

        <article className="contentCard">
          <h2>{t.gameDetail.relatedNotesLabel}</h2>
          <div className="noteLinkList">
            {relatedNotes.map((note) => (
              <Link className="noteLink" href={localePath(locale, note.route)} key={note.id}>
                <strong>{t.notes[note.id].title}</strong>
                <span>{t.notes[note.id].summary}</span>
                <b aria-hidden="true">→</b>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
