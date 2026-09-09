import type { Metadata } from "next";
import { AboutView } from "@/components/pages/AboutView";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const locale = "ja";

const t = getContent(locale);

export const metadata: Metadata = pageMetadata(locale, "/about/", {
  title: t.aboutPage.title,
  description: t.aboutPage.metaDescription,
});

export default function AboutPage() {
  return <AboutView locale={locale} />;
}
