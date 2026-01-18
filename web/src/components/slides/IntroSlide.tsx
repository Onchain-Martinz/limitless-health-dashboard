import { SlideContainer, SlideItem } from "../SlideMotion";

export default function IntroSlide() {
  return (
    <SlideContainer>
      <SlideItem className="story-kicker">Limitless Exchange</SlideItem>
      <SlideItem>
        <h1 className="story-title">
          A product marketing insight on using points incentives for user
          acquisition
        </h1>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">A case study on Limitless</p>
      </SlideItem>
      <SlideItem>
        <p className="story-footnote">Data verified from Limitless public APIs</p>
      </SlideItem>
    </SlideContainer>
  );
}
