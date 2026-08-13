import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <main>
      <PageHero kicker="PRIVACY" title="プライバシーポリシー" description="当サイトにおける情報の取り扱いについてご案内します。" />
      <section className="contentSection pageWidth">
        <article className="contentCard">
          <p>制定日：2026年8月13日</p>
          <h3>取得する情報</h3>
          <p>当サイトでは、サーバーのアクセスログとしてIPアドレス、ブラウザ情報、アクセス日時などが記録される場合があります。また、ゲームの設定や進行状況を端末内に保存するため、ブラウザのローカルストレージ等を使用する場合があります。</p>
          <h3>利用目的</h3>
          <p>取得した情報は、サービスの提供、不具合の調査、利用状況の把握、品質改善、不正利用の防止に使用します。</p>
          <h3>Cookie・広告・アクセス解析</h3>
          <p>当サイトでは、利便性向上、利用状況の把握または広告配信のためにCookie等を利用する場合があります。外部の広告サービスやアクセス解析サービスを導入した場合は、利用するサービスと情報の取り扱いを本ページに追記します。</p>
          <h3>外部サイト</h3>
          <p>当サイトから移動した外部サイトでの情報の取り扱いについて、当サイトは責任を負いません。各サイトの方針をご確認ください。</p>
          <h3>方針の変更</h3>
          <p>法令やサービス内容の変更に応じて、本方針を改定することがあります。重要な変更は当サイト上でお知らせします。</p>
        </article>
      </section>
    </main>
  );
}
