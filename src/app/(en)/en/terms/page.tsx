import type { Metadata } from "next";
import { LegalView } from "@/components/pages/LegalView";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const locale = "en";
const t = getContent(locale).termsPage;

export const metadata: Metadata = pageMetadata(locale, "/terms/", { title: t.title });

export default function LegalPage() {
  return (
    <LegalView
      description={t.description}
      locale={locale}
      revision={t.revision}
      sections={t.sections}
      title={t.title}
      translationNote={t.translationNote}
    />
  );
}
