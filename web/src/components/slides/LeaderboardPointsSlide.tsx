import { fmtNumber } from "../../utils/format";
import { SlideContainer, SlideItem } from "../SlideMotion";

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
    <SlideContainer>
      <SlideItem className="story-kicker">Season 2 Leaderboard</SlideItem>
      <SlideItem>
        <h2 className="story-title">Weekly points pace</h2>
      </SlideItem>
      {pointsToShow.length > 0 ? (
        <SlideItem className="story-list">
          {pointsToShow.map((point) => (
            <div key={point.id} className="story-row">
              <span>
                {formatDate(point.startIso)} to {formatDate(point.endIso)}
              </span>
              <strong>{fmtNumber(point.points)} pts</strong>
            </div>
          ))}
        </SlideItem>
      ) : (
        <SlideItem>
          <p className="story-subtitle">Season 2 points data is not available.</p>
        </SlideItem>
      )}
      {notes.length > 0 && (
        <SlideItem>
          <p className="story-footnote">{notes[0]}</p>
        </SlideItem>
      )}
    </SlideContainer>
  );
}
