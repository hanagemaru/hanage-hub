import type { Metadata } from "next";
import { NotesView } from "@/components/pages/NotesView";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const locale = "ja";
const t = getContent(locale);

export const metadata: Metadata = pageMetadata(locale, "/notes/", {
  title: t.notesPage.title,
  description: t.notesPage.metaDescription,
});

export default function NotesPage() {
  return <NotesView locale={locale} />;
}
