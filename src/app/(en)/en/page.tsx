import type { Metadata } from "next";
import { HomeView } from "@/components/pages/HomeView";

const locale = "en";

import { rootMetadata } from "@/lib/metadata";

export const metadata: Metadata = rootMetadata(locale);

export default function HomePage() {
  return <HomeView locale={locale} />;
}
