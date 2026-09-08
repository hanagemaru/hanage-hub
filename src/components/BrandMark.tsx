/**
 * hanage.app のマーク。32×32のドット絵。
 * 同じ図案を src/app/icon.svg（ファビコン）にも置いている。片方だけ変えないこと。
 *
 * 寸法の決まり：余白は上と右が4、左と下が5。左下を1ドット広くして、
 * 右上に寄る毛のぶんの重さを釣り合わせる。
 * 左の縦棒と肩の厚さが5、右足が8。毛は6角と4角。
 */
export function BrandMark() {
  return (
    <svg className="brandMark" viewBox="0 0 32 32" shapeRendering="crispEdges" aria-hidden="true">
      <rect width="32" height="32" fill="var(--mark-bg)" />
      <g fill="var(--mark-ink)">
        <rect x="5" y="8" width="5" height="19" />
        <rect x="5" y="17" width="19" height="5" />
        <rect x="16" y="22" width="8" height="5" />
        <rect x="18" y="8" width="6" height="6" />
        <rect x="24" y="4" width="4" height="4" />
      </g>
    </svg>
  );
}
