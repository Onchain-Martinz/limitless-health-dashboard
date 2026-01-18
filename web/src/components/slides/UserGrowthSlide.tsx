import { fmtNumber } from "../../utils/format";
import { SlideContainer, SlideItem } from "../SlideMotion";

type UserMetricsPoint = {
  date: string;
  dailyActiveUsers?: number | string | null;
  newUsers?: number | string | null;
  cohortSize?: number | string | null;
  retained7d?: number | string | null;
  retention7dRate?: number | string | null;
};

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0);

const toSafeNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

export default function UserGrowthSlide({
  series,
}: {
  series?: UserMetricsPoint[];
}) {
  const safeSeries = Array.isArray(series) ? series : [];

  if (safeSeries.length === 0) {
    return (
      <SlideContainer>
        <SlideItem className="story-kicker">User Growth</SlideItem>
        <SlideItem>
          <h2 className="story-title">No user data available</h2>
        </SlideItem>
        <SlideItem>
          <p className="story-subtitle">
            The user metrics endpoint is returning empty or failing right now.
          </p>
        </SlideItem>
      </SlideContainer>
    );
  }

  const latest = safeSeries[safeSeries.length - 1];

  const last7New = sum(
    safeSeries.slice(-7).map((point) => toSafeNumber(point?.newUsers))
  );

  const latestDailyActiveUsers = toSafeNumber(latest?.dailyActiveUsers);
  const latestNewUsers = toSafeNumber(latest?.newUsers);

  return (
    <SlideContainer>
      <SlideItem className="story-kicker">User Growth</SlideItem>
      <SlideItem>
        <h2 className="story-title">Momentum in the last {safeSeries.length} days</h2>
      </SlideItem>

      <SlideItem className="story-grid">
        <div className="story-metric">
          <span className="story-label">Latest daily active users</span>
          <span className="story-number">
            {fmtNumber(latestDailyActiveUsers)}
          </span>
        </div>

        <div className="story-metric">
          <span className="story-label">Latest new users</span>
          <span className="story-number">{fmtNumber(latestNewUsers)}</span>
        </div>

        <div className="story-metric">
          <span className="story-label">New users (last 7 days)</span>
          <span className="story-number">{fmtNumber(last7New)}</span>
        </div>
      </SlideItem>

      {safeSeries.length < 7 && (
        <SlideItem>
          <p className="story-footnote">
            Only {safeSeries.length} day(s) available so far.
          </p>
        </SlideItem>
      )}
    </SlideContainer>
  );
}
