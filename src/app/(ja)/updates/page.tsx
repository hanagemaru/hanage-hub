import type { Metadata } from "next";
import { UpdatesView } from "@/components/pages/UpdatesView";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const locale = "ja";

const t = getContent(locale);

export const metadata: Metadata = pageMetadata(locale, "/updates/", {
  title: t.updatesPage.title,
  description: t.updatesPage.metaDescription,
});

export default function UpdatesPage() {
  return <UpdatesView locale={locale} />;
}
