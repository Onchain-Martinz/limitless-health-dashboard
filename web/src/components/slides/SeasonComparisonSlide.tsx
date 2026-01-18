import { fmtNumber } from "../../utils/format";
import { SlideContainer, SlideItem } from "../SlideMotion";

type FeesPoint = {
  date: string;
  dailyFees: number;
};

type LeaderboardPoint = {
  startIso: string;
  endIso: string;
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

const toDateString = (iso: string) => iso.slice(0, 10);
const formatUsd = (value: number) => {
  const formatted = fmtNumber(value, "—");
  return formatted === "—" ? formatted : `$${formatted}`;
};

export default function SeasonComparisonSlide({
  feesPoints,
  season2Points,
}: {
  feesPoints: FeesPoint[];
  season2Points: LeaderboardPoint[];
}) {
  const season1Fees = feesPoints.filter(
    (point) => point.date >= SEASON1_START && point.date <= SEASON1_END
  );

  const season2Start = season2Points[0]?.startIso
    ? toDateString(season2Points[0].startIso)
    : "";
  const season2End = season2Points[season2Points.length - 1]?.endIso
    ? toDateString(season2Points[season2Points.length - 1].endIso)
    : "";

  const season2Fees =
    season2Start && season2End
      ? feesPoints.filter(
          (point) => point.date >= season2Start && point.date <= season2End
        )
      : [];

  const season1Total = sum(season1Fees.map((point) => toSafeNumber(point.dailyFees)));
  const season2Total = sum(season2Fees.map((point) => toSafeNumber(point.dailyFees)));
  const growth =
    season1Total > 0 ? ((season2Total - season1Total) / season1Total) * 100 : 0;

  return (
    <SlideContainer>
      <SlideItem className="story-kicker">Season 1 vs Season 2</SlideItem>
      <SlideItem>
        <h2 className="story-title">The system got stronger over time</h2>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">Comparing both seasons shows a clear trend.</p>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">
          Season 2 generated significantly more fees than Season 1, despite
          similar incentive mechanics.
        </p>
      </SlideItem>
      {season1Fees.length > 0 && season2Fees.length > 0 ? (
        <SlideItem className="story-grid">
          <div className="story-metric">
            <span className="story-label">Season 1 total fees</span>
            <span className="story-number">{formatUsd(season1Total)}</span>
          </div>
          <div className="story-metric">
            <span className="story-label">Season 2 total fees</span>
            <span className="story-number">{formatUsd(season2Total)}</span>
          </div>
          <div className="story-metric">
            <span className="story-label">Increase</span>
            <span className="story-number">{fmtNumber(growth, "—")}%</span>
          </div>
        </SlideItem>
      ) : (
        <SlideItem>
          <p className="story-footnote">Data unavailable.</p>
        </SlideItem>
      )}
      <SlideItem>
        <p className="story-footnote">
          Season 2 totals are calculated over observed leaderboard periods.
        </p>
      </SlideItem>
    </SlideContainer>
  );
}
