import { fmtNumber } from "../../utils/format";

type LeaderboardPoint = {
  id: string;
  startIso: string;
  endIso: string;
  points: number;
};

const formatDate = (iso: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

export default function LeaderboardPointsSlide({
  season2Points,
  notes,
}: {
  season2Points: LeaderboardPoint[];
  notes: string[];
}) {
  const pointsToShow = season2Points.slice(-6);

  return (
    <div className="story-card">
      <div className="story-kicker">Season 2 Leaderboard</div>
      <h2 className="story-title">Weekly points pace</h2>
      {pointsToShow.length > 0 ? (
        <div className="story-list">
          {pointsToShow.map((point) => (
            <div key={point.id} className="story-row">
              <span>
                {formatDate(point.startIso)} to {formatDate(point.endIso)}
              </span>
              <strong>{fmtNumber(point.points)} pts</strong>
            </div>
          ))}
        </div>
      ) : (
        <p className="story-subtitle">Season 2 points data is not available.</p>
      )}
      {notes.length > 0 && <p className="story-footnote">{notes[0]}</p>}
    </div>
  );
}
