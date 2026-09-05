import type { GameArtworkKind } from "@/lib/site";
import { spriteRects } from "./pixel";

// 色は各ゲーム本体の定義に合わせている。
// multicolor-sweeper: src/game/rules.ts と src/styles.css
const SWEEPER = {
  board: "#0f1120",
  covered: "#353a59",
  coveredHi: "#5b6288",
  coveredLo: "#1b1f36",
  opened: "#20243c",
  openedLine: "#343957",
  pole: "#c3c3c3",
  red: "#ef5f6d",
  blue: "#4d88ff",
  green: "#57e0a2",
};

// putt: src/config.ts
const PUTT = {
  sky: "#63b7dd",
  deepRough: "#3a7332",
  rough: "#4f9844",
  green: "#74cf5c",
  stripe: "#84dc6a",
  cup: "#121a12",
  flagstick: "#f0f0f0",
  flag: "#d94f3d",
  ball: "#f6f8f4",
};

/** 3×5のドット数字。使う数だけ持つ */
const DIGITS: Record<string, readonly string[]> = {
  "1": [".#.", "##.", ".#.", ".#.", "###"],
  "2": ["###", "..#", "###", "#..", "###"],
  "3": ["###", "..#", "###", "..#", "###"],
};

/** 竿と旗。ゲーム本体の旗を、セルに収まる大きさで描き直したもの */
const FLAG = [
  "pcc....",
  "pcccc..",
  "pccccc.",
  "pcccc..",
  "pcc....",
  "pp.....",
  "pp.....",
  "pp.....",
  "pp.....",
];

const CELL = 10;
const GAP = 1;

type Clue = { color: "red" | "blue" | "green"; digit: string }[];

type CellSpec =
  | { kind: "covered" }
  | { kind: "flag"; color: "red" | "blue" | "green" }
  | { kind: "clue"; clue: Clue };

// 「セルが色に染まる」ゲームではないので、色は数字と旗だけに出す。
const covered: CellSpec = { kind: "covered" };
const BOARD: CellSpec[][] = [
  [covered, covered, { kind: "clue", clue: [{ color: "red", digit: "2" }, { color: "blue", digit: "1" }] }, covered],
  [{ kind: "flag", color: "red" }, { kind: "clue", clue: [{ color: "green", digit: "1" }] }, covered, covered],
  [{ kind: "clue", clue: [{ color: "red", digit: "1" }, { color: "blue", digit: "1" }, { color: "green", digit: "2" }] }, covered, { kind: "flag", color: "blue" }, covered],
  [covered, { kind: "flag", color: "green" }, covered, { kind: "clue", clue: [{ color: "blue", digit: "3" }] }],
];

/** 数字は色ごとに2×2の位置へ置く。本体の clue と同じ並び */
const CLUE_SLOT = { red: [1, 1], blue: [6, 1], green: [1, 5] } as const;

function SweeperCell({ spec, x, y }: { spec: CellSpec; x: number; y: number }) {
  if (spec.kind === "clue") {
    return (
      <>
        <rect x={x} y={y} width={CELL} height={CELL} fill={SWEEPER.opened} />
        <rect x={x} y={y} width={CELL} height={1} fill={SWEEPER.openedLine} />
        <rect x={x} y={y} width={1} height={CELL} fill={SWEEPER.openedLine} />
        {spec.clue.map(({ color, digit }) => {
          const [dx, dy] = CLUE_SLOT[color];
          return spriteRects(DIGITS[digit], { "#": SWEEPER[color] }, x + dx, y + dy, `${x}-${y}-${color}-`);
        })}
      </>
    );
  }

  return (
    <>
      <rect x={x} y={y} width={CELL} height={CELL} fill={SWEEPER.covered} />
      {/* 本体のセルと同じく、上と左を明るく、下と右を暗くする */}
      <rect x={x} y={y} width={CELL} height={1} fill={SWEEPER.coveredHi} />
      <rect x={x} y={y} width={1} height={CELL} fill={SWEEPER.coveredHi} />
      <rect x={x} y={y + CELL - 1} width={CELL} height={1} fill={SWEEPER.coveredLo} />
      <rect x={x + CELL - 1} y={y} width={1} height={CELL} fill={SWEEPER.coveredLo} />
      {spec.kind === "flag"
        ? spriteRects(FLAG, { p: SWEEPER.pole, c: SWEEPER[spec.color] }, x + 2, y + 1, `${x}-${y}-flag-`)
        : null}
    </>
  );
}

function SweeperScene() {
  return (
    <svg className="artScene" viewBox="0 0 45 45" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="0" y="0" width="45" height="45" fill={SWEEPER.board} />
      {BOARD.map((row, j) =>
        row.map((spec, i) => (
          <SweeperCell key={`${i}-${j}`} spec={spec} x={1 + i * (CELL + GAP)} y={1 + j * (CELL + GAP)} />
        )),
      )}
    </svg>
  );
}

const HORIZON = 16;
const GREEN_TOP = 23;

/** グリーンの手前が盛り上がって見えるように、列ごとの上端を段で決める */
function greenTop(x: number): number {
  const t = (x - 22) / 22;
  return GREEN_TOP + Math.round(4 * t * t);
}

function PuttScene() {
  const columns = [];
  for (let x = 0; x < 45; x += 1) {
    const top = greenTop(x);
    columns.push(
      <rect key={`g${x}`} x={x} y={top} width={1} height={45 - top} fill={x % 7 === 3 ? PUTT.stripe : PUTT.green} />,
    );
  }

  return (
    <svg className="artScene" viewBox="0 0 45 45" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="0" y="0" width="45" height={HORIZON} fill={PUTT.sky} />
      <rect x="0" y={HORIZON} width="45" height="4" fill={PUTT.deepRough} />
      <rect x="0" y={HORIZON + 4} width="45" height="7" fill={PUTT.rough} />
      {columns}
      {/* カップ */}
      <rect x="19" y="28" width="6" height="1" fill={PUTT.cup} />
      <rect x="18" y="29" width="8" height="2" fill={PUTT.cup} />
      <rect x="19" y="31" width="6" height="1" fill={PUTT.cup} />
      {/* 旗竿と旗 */}
      <rect x="22" y="10" width="1" height="20" fill={PUTT.flagstick} />
      {spriteRects(
        ["ccccccc", "cccccc.", "ccccc..", "cccc...", "cc....."],
        { c: PUTT.flag },
        23,
        10,
        "flag-",
      )}
      {/* ボール */}
      {spriteRects(
        [".###.", "#####", "#####", "#####", ".###."],
        { "#": PUTT.ball },
        13,
        35,
        "ball-",
      )}
    </svg>
  );
}

const scenes: Record<GameArtworkKind, React.ReactNode> = {
  sweeper: <SweeperScene />,
  putt: <PuttScene />,
};

export function GameArtwork({
  kind,
  detail = false,
  status,
}: {
  kind: GameArtworkKind;
  detail?: boolean;
  status?: string;
}) {
  return (
    <div className={`${detail ? "detailArtwork" : "tileArtwork"} art-${kind}`}>
      {status ? <span className="statusBadge">{status}</span> : null}
      {scenes[kind]}
    </div>
  );
}
