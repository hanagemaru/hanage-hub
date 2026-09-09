import type { Screenshot } from "@/lib/site";

/** 実画面。横スクロールで並べる。1枚もなければ欄そのものを出さない */
export function Screenshots({ shots, label }: { shots: Screenshot[]; label: string }) {
  if (shots.length === 0) return null;
  return (
    <div className="shotStrip" aria-label={label}>
      {shots.map((shot) => (
        // 静的書き出しのため next/image は使わない
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={shot.alt}
          height={shot.height}
          key={shot.src}
          loading="lazy"
          src={shot.src}
          width={shot.width}
        />
      ))}
    </div>
  );
}
