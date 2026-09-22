import type { Metadata } from "next";
import { NoteView } from "@/components/pages/NoteView";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { notes, type NoteId } from "@/lib/site";

const locale = "ja";
const id: NoteId = "sweeper-no-guess";
const note = notes.find((entry) => entry.id === id);

if (!note) {
  throw new Error(`Unknown note: ${id}`);
}

const text = getContent(locale).notes[id];

export const metadata: Metadata = pageMetadata(locale, note.route, {
  title: text.title,
  description: text.metaDescription,
});

export default function NotePage() {
  return <NoteView id={id} locale={locale} />;
}
