import { Fragment } from "react";
import Link from "next/link";
import { GameArtwork } from "@/components/GameArtwork";
import { Screenshots } from "@/components/Screenshots";
import { getContent, screenshots, specList } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import type { Game } from "@/lib/site";

export function GameView({ game, locale }: { game: Game; locale: Locale }) {
  const t = getContent(locale);
  const text = t.games[game.id];

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
    </main>
  );
}
