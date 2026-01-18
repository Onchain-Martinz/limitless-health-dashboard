import { fmtNumber } from "../../utils/format";
import { SlideContainer, SlideItem } from "../SlideMotion";

type FeesPoint = {
  date: string;
  dailyFees: number;
};

const SEASON1_START = "2025-07-01";
const SEASON1_END = "2025-09-22";

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0);
const formatUsd = (value: number) => {
  const formatted = fmtNumber(value);
  return formatted === "N/A" ? formatted : `$${formatted}`;
};

export default function Season1ImpactSlide({ points }: { points: FeesPoint[] }) {
  const season1Points = points.filter(
    (point) => point.date >= SEASON1_START && point.date <= SEASON1_END
  );
  const totalFees = sum(season1Points.map((point) => point.dailyFees));
  const avgFees = season1Points.length > 0 ? totalFees / season1Points.length : 0;

  return (
    <SlideContainer>
      <SlideItem className="story-kicker">Season 1 Economic Impact</SlideItem>
      <SlideItem>
        <h2 className="story-title">Revenue Generated During Season 1</h2>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">
          Throughout Season 1, Limitless generated consistent protocol revenue
          through gross trading fees.
        </p>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">
          Daily and weekly fee data confirms that the incentive system was directly
          aligned with revenue-generating behavior, rather than passive engagement.
        </p>
      </SlideItem>
      {season1Points.length > 0 ? (
        <SlideItem className="story-grid">
          <div className="story-metric">
            <span className="story-label">Season 1 total fees</span>
            <span className="story-number">{formatUsd(totalFees)}</span>
          </div>
          <div className="story-metric">
            <span className="story-label">Season 1 avg daily fees</span>
            <span className="story-number">{formatUsd(avgFees)}</span>
          </div>
          <div className="story-metric">
            <span className="story-label">Days measured</span>
            <span className="story-number">{fmtNumber(season1Points.length)}</span>
          </div>
        </SlideItem>
      ) : (
        <SlideItem>
          <p className="story-footnote">Data unavailable.</p>
        </SlideItem>
      )}
    </SlideContainer>
  );
}
