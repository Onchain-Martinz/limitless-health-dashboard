import { SlideContainer, SlideItem } from "../SlideMotion";

export default function AttributionSlide() {
  return (
    <SlideContainer>
      <SlideItem className="story-kicker">Presented by</SlideItem>
      <SlideItem>
        <h2 className="story-title">Martinz</h2>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">Product research & data storytelling</p>
      </SlideItem>
      <SlideItem>
        <div className="story-logo-wrap">
          <img
            className="story-logo"
            src="/martinz-logo.png"
            alt="Martinz logo"
          />
        </div>
      </SlideItem>
      <SlideItem>
        <p className="story-footnote">Follow on X: @onchain_Martinz</p>
      </SlideItem>
    </SlideContainer>
  );
}
