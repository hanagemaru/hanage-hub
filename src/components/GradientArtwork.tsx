const cells = [
  "", "", "blue", "blue", "", "",
  "", "purple", "purple", "red", "", "",
  "blue", "purple", "light", "red", "red", "",
  "blue", "blue", "purple", "purple", "red", "",
  "", "blue", "blue", "purple", "", "",
  "", "", "", "", "", "",
];

export function GradientArtwork({ detail = false, status }: { detail?: boolean; status?: string }) {
  return (
    <div className={detail ? "detailArtwork" : "tileArtwork"} aria-hidden="true">
      {status ? <span className="statusBadge">{status}</span> : null}
      <div className="gameBoard">
        {cells.map((color, index) => (
          <span className={`gameCell ${color}`} key={`${color}-${index}`} />
        ))}
      </div>
      <span className="artLabel">GRADIENT<br />SWEEPER</span>
    </div>
  );
}
