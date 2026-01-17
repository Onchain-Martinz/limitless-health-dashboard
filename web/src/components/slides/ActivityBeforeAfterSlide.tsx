import { fmtNumber } from "../../utils/format";

type FeesPoint = {
  date: string;
  dailyFees: number;
};

type UserMetricsPoint = {
  date: string;
  dailyActiveUsers: number;
  newUsers: number;
};

const SEASON1_START = "2025-07-01";
const SEASON1_END = "2025-09-22";

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0);
const formatUsd = (value: number) => {
  const formatted = fmtNumber(value);
  return formatted === "N/A" ? formatted : `$${formatted}`;
};

export default function ActivityBeforeAfterSlide({
  points,
  userMetrics,
}: {
  points: FeesPoint[];
  userMetrics: UserMetricsPoint[];
}) {
  const pre = points.filter((point) => point.date < SEASON1_START);
  const season1 = points.filter(
    (point) => point.date >= SEASON1_START && point.date <= SEASON1_END
  );

  const preAvg = pre.length > 0 ? sum(pre.map((p) => p.dailyFees)) / pre.length : 0;
  const seasonAvg =
    season1.length > 0 ? sum(season1.map((p) => p.dailyFees)) / season1.length : 0;
  const hasComparison = pre.length > 0 && season1.length > 0;
  const lift = preAvg > 0 ? ((seasonAvg - preAvg) / preAvg) * 100 : 0;
  const latestUser = userMetrics[userMetrics.length - 1];

  return (
    <div className="story-card">
      <div className="story-kicker">Activity Before vs After Season 1</div>
      <h2 className="story-title">Early Signals of Growth</h2>
      <p className="story-subtitle">
        Prior to the launch of Season 1, protocol activity was relatively muted,
        as reflected in early fee generation.
      </p>
      <p className="story-subtitle">
        Following the introduction of the Season 1 points program, gross trading
        fees increased materially, indicating a rise in trading participation and
        transaction frequency. While full historical DAU is not publicly
        available, protocol fees serve as a reliable proxy for user activity.
      </p>
      {hasComparison ? (
        <div className="story-grid">
          <div className="story-metric">
            <span className="story-label">Pre-Season 1 avg daily fees</span>
            <span className="story-number">{formatUsd(preAvg)}</span>
          </div>
          <div className="story-metric">
            <span className="story-label">Season 1 avg daily fees</span>
            <span className="story-number">{formatUsd(seasonAvg)}</span>
          </div>
          <div className="story-metric">
            <span className="story-label">Season 1 lift vs pre</span>
            <span className="story-number">{lift.toFixed(1)}%</span>
          </div>
          {latestUser && (
            <div className="story-metric">
              <span className="story-label">Latest observed active users</span>
              <span className="story-number">
                {fmtNumber(latestUser.dailyActiveUsers)}
              </span>
            </div>
          )}
        </div>
      ) : (
        <p className="story-footnote">
          Insufficient historical data to compute comparison.
        </p>
      )}
      <p className="story-footnote">Fees are used as a proxy for activity.</p>
    </div>
  );
}
