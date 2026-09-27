import type { Metadata } from "next";
import { NoteView } from "@/components/pages/NoteView";
import { pageMetadata } from "@/lib/metadata";
import { getNote, getNotes, noteRoute } from "@/lib/writing";

const locale = "ja";

// content/ja/notes/ にあるものだけを書き出す。それ以外のURLは404
export const dynamicParams = false;

export function generateStaticParams() {
  return getNotes(locale).map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(locale, slug);
  return pageMetadata(locale, noteRoute(slug), { title: note.title, description: note.description });
}

export default async function NotePage({ params }: PageProps<"/notes/[slug]">) {
  const { slug } = await params;
  return <NoteView locale={locale} slug={slug} />;
}
