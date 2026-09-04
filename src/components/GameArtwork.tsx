import type { GameArtworkKind } from "@/lib/site";

/** 盤面の見本。空文字は未開封セル */
const sweeperCells = [
  "", "", "blue", "", "", "",
  "", "red", "", "green", "", "",
  "yellow", "", "open", "", "blue", "",
  "", "green", "", "red", "", "",
  "", "", "blue", "", "green", "",
  "", "", "", "", "", "",
];

function SweeperScene() {
  return (
    <div className="sweeperBoard">
      {sweeperCells.map((color, index) => (
        <span className={`gameCell ${color}`} key={`${color}-${index}`} />
      ))}
    </div>
  );
}

function PuttScene() {
  return (
    <div className="puttScene">
      <span className="puttGreen" />
      <span className="puttCup" />
      <span className="puttFlag">
        <i className="puttPole" />
        <i className="puttCloth" />
      </span>
      <span className="puttBall" />
    </div>
  );
}

const scenes: Record<GameArtworkKind, { node: React.ReactNode; label: string[] }> = {
  sweeper: { node: <SweeperScene />, label: ["MULTICOLOR", "SWEEPER"] },
  putt: { node: <PuttScene />, label: ["PUTT"] },
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
  const scene = scenes[kind];

  return (
    <div className={`${detail ? "detailArtwork" : "tileArtwork"} art-${kind}`} aria-hidden="true">
      {status ? <span className="statusBadge">{status}</span> : null}
      {scene.node}
      <span className="artLabel">
        {scene.label.map((line, index) => (
          <span key={line}>
            {index > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </span>
    </div>
  );
}
