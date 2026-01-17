import { fmtNumber } from "../../utils/format";

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
      {points.map((point) => (
        <div key={point.label} className="story-bar-row">
          <span className="story-bar-label">{point.label}</span>
          <div className="story-bar-track">
            <span
              className="story-bar-fill"
              style={{ width: `${(point.value / maxValue) * 100}%` }}
            />
          </div>
          <span className="story-bar-value">{fmtNumber(point.value)} pts</span>
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
    <div className="story-card">
      <div className="story-kicker">Season 2 Activation</div>
      <h2 className="story-title">Renewed Engagement with Season 2</h2>
      <p className="story-subtitle">
        The launch of Season 2 coincided with a clear spike in points accumulation
        and trading activity.
      </p>
      <p className="story-subtitle">
        Weekly leaderboard data shows increased participation intensity,
        indicating that seasonal incentives successfully reactivated demand on the
        platform.
      </p>
      {series.length > 0 ? (
        <BarChart points={series} />
      ) : (
        <p className="story-footnote">Data unavailable.</p>
      )}
    </div>
  );
}
