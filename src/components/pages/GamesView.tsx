import { GameTile } from "@/components/GameTile";
import { PageHero } from "@/components/PageHero";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { games } from "@/lib/site";

export function GamesView({ locale }: { locale: Locale }) {
  const t = getContent(locale);

  return (
    <main>
      <PageHero title={t.gamesPage.title} />
      <section className="contentSection pageWidth" aria-label={t.gamesPage.listLabel}>
        <div className="tileGrid">
          {games.map((game) => (
            <GameTile game={game} key={game.slug} locale={locale} />
          ))}
        </div>
      </section>
    </main>
  );
}
