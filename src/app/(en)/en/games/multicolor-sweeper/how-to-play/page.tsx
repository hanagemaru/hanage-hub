import type { Metadata } from "next";
import { HowToPlayView } from "@/components/pages/HowToPlayView";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { multicolorSweeper as game } from "@/lib/site";

const locale = "en";
const text = getContent(locale).howToPlay[game.id];

export const metadata: Metadata = pageMetadata(locale, game.howToPlayRoute, {
  title: text.metaTitle,
  description: text.metaDescription,
});

export default function HowToPlayPage() {
  return <HowToPlayView game={game} locale={locale} />;
}
