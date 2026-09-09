import type { Metadata } from "next";
import { LegalView } from "@/components/pages/LegalView";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const locale = "ja";
const t = getContent(locale).privacyPage;

export const metadata: Metadata = pageMetadata(locale, "/privacy/", { title: t.title });

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
