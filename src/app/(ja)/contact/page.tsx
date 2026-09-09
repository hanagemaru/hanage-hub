import type { Metadata } from "next";
import { ContactView } from "@/components/pages/ContactView";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const locale = "ja";

const t = getContent(locale);

export const metadata: Metadata = pageMetadata(locale, "/contact/", {
  title: t.contactPage.title,
  description: t.contactPage.metaDescription,
});

export default function ContactPage() {
  return <ContactView locale={locale} />;
}
