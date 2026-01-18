import { SlideContainer, SlideItem } from "../SlideMotion";

export default function PostAirdropSlide() {
  return (
    <SlideContainer>
      <SlideItem className="story-kicker">After the Airdrop</SlideItem>
      <SlideItem>
        <h2 className="story-title">Did users leave after getting rewarded?</h2>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">
          After Season 1 ended, users received rewards for their points.
        </p>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">
          This is usually where things break. People farm rewards… then
          disappear.
        </p>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">
          But Limitless didn’t stop there. Season 2 was teased almost
          immediately.
        </p>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">So what happened next?</p>
      </SlideItem>
    </SlideContainer>
  );
}
