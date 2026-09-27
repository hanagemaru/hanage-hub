import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import type { Block, Inline } from "@/lib/markdown";

/** サイト内のパスは Link、外部は新しいタブ */
function renderLink(href: string, children: ReactNode, key: number) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} key={key}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} key={key} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function renderInlines(inlines: Inline[]): ReactNode {
  return inlines.map((inline, index) => {
    switch (inline.kind) {
      case "text":
        return <Fragment key={index}>{inline.text}</Fragment>;
      case "break":
        return <br key={index} />;
      case "strong":
        return <strong key={index}>{renderInlines(inline.children)}</strong>;
      case "link":
        return renderLink(inline.href, renderInlines(inline.children), index);
    }
  });
}

/**
 * `content/` の .md から読んだ本文を出す。
 *
 * 見出しは h2 / h3 のまま出す。ページの h1 は題名なので、本文には持たせない。
 */
export function Markdown({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "heading":
            return block.level === 2 ? (
              <h2 key={index}>{renderInlines(block.children)}</h2>
            ) : (
              <h3 key={index}>{renderInlines(block.children)}</h3>
            );
          case "paragraph":
            return <p key={index}>{renderInlines(block.children)}</p>;
          case "list":
            return (
              <ul key={index}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{renderInlines(item)}</li>
                ))}
              </ul>
            );
          case "image":
            // 実寸が分からないので next/image は使わない。静的書き出しでは最適化もしない
            // eslint-disable-next-line @next/next/no-img-element
            return <img key={index} src={block.src} alt={block.alt} loading="lazy" />;
        }
      })}
    </>
  );
}
