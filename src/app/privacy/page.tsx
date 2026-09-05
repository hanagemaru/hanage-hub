import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <main>
      <PageHero
        kicker="PRIVACY"
        title="プライバシーポリシー"
        description="hanage.appおよび掲載作品における情報の取り扱いについてご案内します。"
      />
      <section className="contentSection pageWidth">
        <article className="contentCard">
          <p>制定日：2026年8月13日／最終更新：2026年9月4日</p>

          <h3>取得する情報</h3>
          <ul>
            <li>サーバーのアクセスログ（IPアドレス、ブラウザの種類、アクセス日時など）</li>
            <li>設定や進行状況を端末内に保存するためのローカルストレージ等のデータ</li>
            <li>ランキングに記録を登録した場合の、表示名・記録・端末ごとの匿名ID</li>
          </ul>
          <p>会員登録は不要で、氏名・住所・メールアドレスをお預かりすることはありません。</p>

          <h3>利用目的</h3>
          <p>
            取得した情報は、サービスの提供、不具合の調査、利用状況の把握、品質改善、不正利用の防止に使用します。
          </p>

          <h3>ランキングについて</h3>
          <p>
            ランキングのある作品では、プレイ開始時に名前を求めません。記録を登録するときにはじめて表示名を決めます。表示名は他の利用者に公開されるため、本名や連絡先を入力しないでください。
          </p>
          <p>
            利用者の識別には、ログインを伴わない匿名IDを使用します。登録した記録や表示名の削除をご希望の場合は、お問い合わせページからご連絡ください。
          </p>

          <h3>Cookie・広告</h3>
          <p>
            <strong>現在、当サイトおよび掲載作品では広告を配信していません。</strong>
            今後、Google AdSense および H5 Games Ads による広告の導入を予定しています。導入した場合、広告配信事業者がCookie等を使用して利用者の興味に応じた広告を表示することがあります。
          </p>
          <p>
            導入時には、利用する広告サービスと情報の取り扱いを本ページに追記し、法令上必要となる地域では広告の表示前に同意確認を行います。Googleによる広告Cookieの利用は、Googleの広告設定ページから無効にできます。
          </p>

          <h3>アクセス解析</h3>
          <p>
            現在、外部のアクセス解析サービスは導入していません。導入した場合は、サービス名と取得される情報を本ページに追記します。
          </p>

          <h3>外部サイト</h3>
          <p>
            当サイトから移動した外部サイトでの情報の取り扱いについて、当サイトは責任を負いません。各サイトの方針をご確認ください。
          </p>

          <h3>方針の変更</h3>
          <p>
            法令やサービス内容の変更に応じて、本方針を改定することがあります。重要な変更は当サイト上でお知らせします。
          </p>

          <h3>お問い合わせ</h3>
          <p>
            本方針に関するご連絡は<Link className="textLink" href="/contact/">お問い合わせ</Link>ページからお願いします。
          </p>
        </article>
      </section>
    </main>
  );
}
