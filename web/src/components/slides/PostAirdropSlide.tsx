import { fmtNumber } from "../../utils/format";

type FeesPoint = {
  date: string;
  dailyFees: number;
};

const SEASON1_END = "2025-09-22";

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0);
const formatUsd = (value: number) => {
  const formatted = fmtNumber(value);
  return formatted === "N/A" ? formatted : `$${formatted}`;
};

export default function PostAirdropSlide({ points }: { points: FeesPoint[] }) {
  const postSeason1 = points.filter((point) => point.date > SEASON1_END);
  const last30 = postSeason1.slice(-30);
  const totalFees = sum(last30.map((point) => point.dailyFees));
  const avgFees = last30.length > 0 ? totalFees / last30.length : 0;

  return (
    <div className="story-card">
      <div className="story-kicker">Post-Airdrop Behavior</div>
      <h2 className="story-title">Did Users Leave After the Airdrop?</h2>
      <p className="story-subtitle">
        At the conclusion of Season 1, rewards were distributed to users who
        accumulated points. In many incentive-driven systems, such events are
        followed by sharp drops in activity.
      </p>
      <p className="story-subtitle">
        However, post-airdrop data shows continued fee generation and trading
        activity, suggesting participation extended beyond short-term reward
        farming.
      </p>
      {last30.length > 0 ? (
        <div className="story-grid">
          <div className="story-metric">
            <span className="story-label">Post-airdrop avg daily fees</span>
            <span className="story-number">{formatUsd(avgFees)}</span>
          </div>
          <div className="story-metric">
            <span className="story-label">Post-airdrop 30-day fees</span>
            <span className="story-number">{formatUsd(totalFees)}</span>
          </div>
          <div className="story-metric">
            <span className="story-label">Days measured</span>
            <span className="story-number">{fmtNumber(last30.length)}</span>
          </div>
        </div>
      ) : (
        <p className="story-footnote">Data unavailable.</p>
      )}
    </div>
  );
}
