export default function TakeawaysSlide() {
  return (
    <div className="story-card">
      <div className="story-kicker">The Takeaway</div>
      <h2 className="story-title">What this teaches us about incentives</h2>
      <p className="story-subtitle">
        The Limitless experiment shows that points systems can work — if designed
        properly.
      </p>
      <p className="story-subtitle">They work best when:</p>
      <ul className="story-list story-list--bullets">
        <li>Rewards are tied directly to real economic actions.</li>
        <li>Incentives reset in seasons to renew motivation.</li>
        <li>Competition is visible through leaderboards.</li>
      </ul>
      <p className="story-subtitle">
        Points alone don’t guarantee long-term retention. But when done right,
        they can drive real usage — not just hype.
      </p>
      <p className="story-footnote">
        This analysis is based on publicly observable data and does not include
        internal user or profit metrics.
      </p>
    </div>
  );
}
