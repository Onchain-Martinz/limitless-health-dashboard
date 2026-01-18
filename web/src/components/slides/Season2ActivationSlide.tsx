import { fmtNumber } from "../../utils/format";
import { SlideContainer, SlideItem } from "../SlideMotion";

type LeaderboardPoint = {
  id: string;
  startIso: string;
  endIso: string;
  points: number;
};

type ChartPoint = {
  label: string;
  value: number;
};

const formatDate = (iso: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const buildSeries = (points: LeaderboardPoint[]) =>
  points.map((point) => ({
    label: formatDate(point.startIso),
    value: point.points,
  }));

function BarChart({ points }: { points: ChartPoint[] }) {
  const maxValue = Math.max(...points.map((point) => point.value), 1);

  return (
    <div className="story-bar-chart">
      <div className="story-chart-label">Weekly points (Season 2)</div>
      {points.map((point) => (
        <div key={point.label} className="story-bar-row">
          <span className="story-bar-label">{point.label}</span>
          <div className="story-bar-track">
            <span
              className="story-bar-fill"
              style={{ width: `${(point.value / maxValue) * 100}%` }}
            />
          </div>
          <span className="story-bar-value">
            {fmtNumber(point.value, "—")} pts
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Season2ActivationSlide({
  season2Points,
}: {
  season2Points: LeaderboardPoint[];
}) {
  const pointsToShow = season2Points.slice(-6);
  const series = buildSeries(pointsToShow);

  return (
    <SlideContainer>
      <SlideItem className="story-kicker">Season 2 Launch</SlideItem>
      <SlideItem>
        <h2 className="story-title">Season 2 brought users back</h2>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">When Season 2 launched, activity spiked again.</p>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">
          Weekly leaderboard data shows increased points accumulation, suggesting
          that returning users — and new users — participated in the next season.
        </p>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">
          This wasn’t just leftover momentum. It was reactivation.
        </p>
      </SlideItem>
      {series.length > 0 ? (
        <SlideItem>
          <BarChart points={series} />
        </SlideItem>
      ) : (
        <SlideItem>
          <p className="story-footnote">Data unavailable.</p>
        </SlideItem>
      )}
    </SlideContainer>
  );
}
