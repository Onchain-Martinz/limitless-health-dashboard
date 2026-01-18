import { SlideContainer, SlideItem } from "../SlideMotion";

export default function StrategyOverviewSlide() {
  return (
    <SlideContainer>
      <SlideItem className="story-kicker">The Idea</SlideItem>
      <SlideItem>
        <h2 className="story-title">Points as a growth experiment</h2>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">
          Limitless launched in late 2025 and chose a simple growth strategy:
          reward users with points for trading.
        </p>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">
          These points were distributed in seasons, with the promise of future
          rewards.
        </p>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">
          The question is simple: did this actually work?
        </p>
      </SlideItem>
    </SlideContainer>
  );
}
