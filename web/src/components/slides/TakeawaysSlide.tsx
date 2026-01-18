import { SlideContainer, SlideItem } from "../SlideMotion";

export default function TakeawaysSlide() {
  return (
    <SlideContainer>
      <SlideItem className="story-kicker">The Takeaway</SlideItem>
      <SlideItem>
        <h2 className="story-title">What this teaches us about incentives</h2>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">
          The Limitless experiment shows that points systems can work, if
          designed properly.
        </p>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">They work best when:</p>
      </SlideItem>
      <SlideItem>
        <ul className="story-list story-list--bullets">
          <li>Rewards are tied directly to real economic actions.</li>
          <li>Incentives reset in seasons to renew motivation.</li>
          <li>Competition is visible through leaderboards.</li>
        </ul>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">
          Points alone don’t guarantee long-term retention. But when done right,
          they can drive real usage, not just hype.
        </p>
      </SlideItem>
      <SlideItem>
        <p className="story-footnote">
          This analysis is based on publicly observable data and does not include
          internal user or profit metrics.
        </p>
      </SlideItem>
    </SlideContainer>
  );
}
