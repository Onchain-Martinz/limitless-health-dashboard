import { SlideContainer, SlideItem } from "../SlideMotion";

export default function AttributionSlide() {
  return (
    <SlideContainer>
      <SlideItem className="story-kicker">Presented by</SlideItem>
      <SlideItem>
        <h2 className="story-title">Martinz & Simon</h2>
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
        <div className="story-logo-wrap">
          <img
            className="story-logo"
            src="/simon-logo.png"
            alt="Simon logo"
          />
        </div>
      </SlideItem>
      <SlideItem>
        <p className="story-footnote">
          Follow on X: <a href="https://x.com/onchain_Martinz" target="_blank" rel="noopener noreferrer">@onchain_Martinz</a> | <a href="https://x.com/thisis_simon?s=21" target="_blank" rel="noopener noreferrer">@thisis_simon</a>
        </p>
      </SlideItem>
    </SlideContainer>
  );
}