import { fmtNumber } from "../../utils/format";

type FeesPoint = {
  date: string;
  dailyFees: number;
};

const SEASON1_START = "2025-07-01";
const SEASON1_END = "2025-09-22";

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0);
const toSafeNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const formatUsd = (value: number) => {
  const formatted = fmtNumber(value, "—");
  return formatted === "—" ? formatted : `$${formatted}`;
};

export default function ActivityBeforeAfterSlide({
  points,
}: {
  points: FeesPoint[];
}) {
  const pre = points.filter((point) => point.date < SEASON1_START);
  const season1 = points.filter(
    (point) => point.date >= SEASON1_START && point.date <= SEASON1_END
  );

  const hasComparison = pre.length > 0 && season1.length > 0;
  const preAvg = hasComparison
    ? sum(pre.map((p) => toSafeNumber(p.dailyFees))) / pre.length
    : 0;
  const seasonAvg =
    hasComparison
      ? sum(season1.map((p) => toSafeNumber(p.dailyFees))) / season1.length
      : 0;
  const lift = preAvg > 0 ? ((seasonAvg - preAvg) / preAvg) * 100 : 0;
  const showExtremeNote = preAvg < 50 && seasonAvg > 1000;

  return (
    <div className="story-card">
      <div className="story-kicker">Before vs After Season 1</div>
      <h2 className="story-title">What changed after points went live?</h2>
      <p className="story-subtitle">
        Before Season 1, activity on Limitless was quiet. Trading fees were low,
        and participation was limited.
      </p>
      <p className="story-subtitle">
        Once the Season 1 points program launched, things changed quickly.
        Trading activity picked up, and fees followed.
      </p>
      {hasComparison ? (
        <div className="story-grid">
          <div className="story-metric">
            <span className="story-label">Avg daily fees before Season 1</span>
            <span className="story-number">{formatUsd(preAvg)}</span>
          </div>
          <div className="story-metric">
            <span className="story-label">Avg daily fees during Season 1</span>
            <span className="story-number">{formatUsd(seasonAvg)}</span>
          </div>
          <div className="story-metric">
            <span className="story-label">Increase in activity</span>
            <span className="story-number">{fmtNumber(lift, "—")}%</span>
          </div>
        </div>
      ) : (
        <p className="story-footnote">
          Insufficient historical data to compute comparison.
        </p>
      )}
      {showExtremeNote && (
        <p className="story-footnote">
          Yes — that jump looks extreme. It surprised us too. But this is what
          the public data shows.
        </p>
      )}
      <p className="story-footnote">
        Fees are used here as a proxy for user activity, since historical DAU
        data is not publicly available.
      </p>
    </div>
  );
}
