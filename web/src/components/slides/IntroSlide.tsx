export default function IntroSlide({ dateRange }: { dateRange?: string }) {
  return (
    <div className="story-card">
      <div className="story-kicker">Limitless Exchange</div>
      <h1 className="story-title">
        How Points Incentives Drive Growth in Prediction Markets
      </h1>
      <p className="story-subtitle">
        A product marketing case study using verified Limitless Exchange data.
      </p>
      <p className="story-subtitle">
        This report analyzes how seasonal point incentives influenced user
        participation, trading activity, and protocol revenue on Limitless
        Exchange. All metrics are derived from publicly observable data pulled
        directly from Limitless APIs and DefiLlama.
      </p>
      {dateRange && (
        <div className="story-chip">Data range: {dateRange}</div>
      )}
    </div>
  );
}
