import type { Metadata } from "next";
import { GamesView } from "@/components/pages/GamesView";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const locale = "en";

const t = getContent(locale);

export const metadata: Metadata = pageMetadata(locale, "/games/", {
  title: t.gamesPage.title,
  description: t.gamesPage.metaDescription,
});

export default function GamesPage() {
  return <GamesView locale={locale} />;
}
