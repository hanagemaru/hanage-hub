// ドット絵は文字列の配列で持つ。1文字が1ドットで、"."は透明。
// multicolor-sweeper 本体の描き方に合わせている。
export function spriteRects(
  sprite: readonly string[],
  palette: Record<string, string>,
  offsetX = 0,
  offsetY = 0,
  keyPrefix = "",
): React.JSX.Element[] {
  const out: React.JSX.Element[] = [];
  sprite.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const slot = row[x];
      let width = 1;
      while (x + width < row.length && row[x + width] === slot) width += 1;
      if (slot !== ".") {
        out.push(
          <rect
            key={`${keyPrefix}${x}-${y}`}
            x={offsetX + x}
            y={offsetY + y}
            width={width}
            height={1}
            fill={palette[slot]}
          />,
        );
      }
      x += width;
    }
  });
  return out;
}
