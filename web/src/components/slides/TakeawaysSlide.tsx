export default function TakeawaysSlide() {
  return (
    <div className="story-card">
      <div className="story-kicker">Marketing Takeaways</div>
      <h2 className="story-title">What This Teaches Us About Incentives</h2>
      <p className="story-subtitle">
        The Limitless case study demonstrates that points-based incentive systems
        can be effective growth engines when:
      </p>
      <ul className="story-list story-list--bullets">
        <li>Rewards are directly tied to core revenue actions.</li>
        <li>Incentives are structured seasonally to reset motivation.</li>
        <li>Leaderboards introduce social competition.</li>
      </ul>
      <p className="story-subtitle">
        While incentives alone do not guarantee long-term retention, well-designed
        point systems can drive real economic activity rather than vanity metrics.
      </p>
      <p className="story-footnote">
        User metrics are derived from publicly observable activity and
        leaderboard data. This analysis does not include internal user analytics
        or realized profit data.
      </p>
    </div>
  );
}
