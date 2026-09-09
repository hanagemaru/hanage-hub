import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { getContent, type HowToSection } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import type { Game } from "@/lib/site";

function SectionBody({ section }: { section: HowToSection }) {
  switch (section.kind) {
    case "steps":
      return (
        <ol className="stepList">
          {section.steps.map((step, index) => (
            <li key={step.title}>
              <span>{index + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "defs":
      return (
        <>
          {section.intro ? <p>{section.intro}</p> : null}
          <ul>
            {section.items.map((item) => (
              <li key={item.term}>
                <strong>{item.term}</strong>
                {item.body}
              </li>
            ))}
          </ul>
          {section.note ? <p>{section.note}</p> : null}
        </>
      );
    case "list":
      return (
        <ul>
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "prose":
      return <p>{section.body}</p>;
  }
}

export function HowToPlayView({ game, locale }: { game: Game; locale: Locale }) {
  const t = getContent(locale);
  const text = t.howToPlay[game.id];
  const gameText = t.games[game.id];
  const lastIndex = text.sections.length - 1;

  return (
    <main>
      <PageHero title={t.gameDetail.howToPlayTitle} description={text.heroDescription} />
      <section className="contentSection pageWidth">
        {text.sections.map((section, index) => (
          <article className="contentCard" key={section.heading}>
            <h2>{section.heading}</h2>
            <SectionBody section={section} />
            {/* 最後の欄にだけ、紹介ページへ戻る導線と本体を開くボタンを置く */}
            {index === lastIndex ? (
              <div className="buttonRow">
                <Link className="buttonSecondary" href={localePath(locale, game.route)}>
                  {text.backLabel}
                </Link>
                <a
                  className="buttonPrimary"
                  href={game.playUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {gameText.playLabel}
                </a>
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}
