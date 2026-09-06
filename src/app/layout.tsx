import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WebAnalytics } from "@/components/WebAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hanage.app"),
  title: {
    default: "hanage.app | Games & Web Apps",
    template: "%s | hanage.app",
  },
  description:
    "個人制作のブラウザゲームやWebアプリを公開しています。インストールなしですぐに遊べます。",
  applicationName: "hanage.app",
  alternates: { canonical: "/" },
  openGraph: {
    title: "hanage.app | Games & Web Apps",
    description: "ちょっと変わった、すぐ遊べる。個人制作ゲームとWebアプリのハブサイト。",
    url: "https://hanage.app",
    siteName: "hanage.app",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "hanage.app | Games & Web Apps",
    description: "ちょっと変わった、すぐ遊べる。",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <WebAnalytics />
      </body>
    </html>
  );
}
