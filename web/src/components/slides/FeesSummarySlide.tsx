import { fmtNumber } from "../../utils/format";
import { SlideContainer, SlideItem } from "../SlideMotion";

type FeesPoint = {
  date: string;
  dailyFees: number;
  totalFees: number;
};

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0);
const formatUsd = (value: number) => {
  const formatted = fmtNumber(value);
  return formatted === "N/A" ? formatted : `$${formatted}`;
};

export default function FeesSummarySlide({ points }: { points: FeesPoint[] }) {
  if (!points.length) {
    return (
      <SlideContainer>
        <SlideItem className="story-kicker">Gross Trading Fees</SlideItem>
        <SlideItem>
          <h2 className="story-title">No fee data available</h2>
        </SlideItem>
        <SlideItem>
          <p className="story-subtitle">Check back once fees are indexed.</p>
        </SlideItem>
      </SlideContainer>
    );
  }

  const latest = points[points.length - 1];
  const last7 = sum(points.slice(-7).map((point) => point.dailyFees));

  return (
    <SlideContainer>
      <SlideItem className="story-kicker">Gross Trading Fees</SlideItem>
      <SlideItem>
        <h2 className="story-title">Fees that fuel the exchange</h2>
      </SlideItem>
      <SlideItem className="story-grid">
        <div className="story-metric">
          <span className="story-label">Latest daily fees</span>
          <span className="story-number">{formatUsd(latest.dailyFees)}</span>
        </div>
        <div className="story-metric">
          <span className="story-label">Total cumulative fees</span>
          <span className="story-number">{formatUsd(latest.totalFees)}</span>
        </div>
        <div className="story-metric">
          <span className="story-label">Last 7 days</span>
          <span className="story-number">{formatUsd(last7)}</span>
        </div>
      </SlideItem>
    </SlideContainer>
  );
}
