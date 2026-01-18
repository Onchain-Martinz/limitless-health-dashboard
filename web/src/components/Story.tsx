import React, { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent, TouchEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Easing } from "framer-motion";
import IntroSlide from "./slides/IntroSlide";
import StrategyOverviewSlide from "./slides/StrategyOverviewSlide";
import ActivityBeforeAfterSlide from "./slides/ActivityBeforeAfterSlide";
import FeesChartSlide from "./slides/FeesChartSlide";
import PostAirdropSlide from "./slides/PostAirdropSlide";
import Season2ActivationSlide from "./slides/Season2ActivationSlide";
import TopWalletsSlide from "./slides/TopWalletsSlide";
import SeasonComparisonSlide from "./slides/SeasonComparisonSlide";
import TakeawaysSlide from "./slides/TakeawaysSlide";
import AttributionSlide from "./slides/AttributionSlide";
import { SlideContainer, SlideItem } from "./SlideMotion";

type FeesPoint = {
  date: string;
  dailyFees: number;
  totalFees: number;
};

type FeesResponse = {
  ok: boolean;
  protocol: string;
  source: string;
  points: FeesPoint[];
};

type LeaderboardPoint = {
  id: string;
  startIso: string;
  endIso: string;
  points: number;
};

type LeaderboardMetricsResponse = {
  ok: boolean;
  source: string;
  weeks: number;
  season1: { points: LeaderboardPoint[] };
  season2: { points: LeaderboardPoint[]; volume: LeaderboardPoint[] };
  notes: string[];
};

type Slide = {
  key: string;
  element: React.ReactElement;
};

const EASE_OUT: Easing = [0.22, 1, 0.36, 1];

const LoadingSlide = () => (
  <SlideContainer>
    <SlideItem className="story-kicker">Loading</SlideItem>
    <SlideItem>
      <h1 className="story-title">Preparing the report...</h1>
    </SlideItem>
    <SlideItem>
      <p className="story-subtitle">Fetching verified data sources.</p>
    </SlideItem>
  </SlideContainer>
);

export default function Story() {
  const [feesData, setFeesData] = useState<FeesResponse | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchJson = async <T,>(url: string, label: string) => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`${label} failed (${res.status})`);
      }
      return (await res.json()) as T;
    };

    const run = async () => {
      const results = await Promise.allSettled([
        fetchJson<FeesResponse>("/.netlify/functions/fees", "Fees"),
        fetchJson<LeaderboardMetricsResponse>(
          "/.netlify/functions/leaderboard-metrics?weeks=12",
          "Leaderboard"
        ),
      ]);

      if (!isMounted) return;

      const feesResult = results[0];
      if (feesResult.status === "fulfilled" && feesResult.value.ok) {
        setFeesData(feesResult.value);
      }

      const leaderboardResult = results[1];
      if (leaderboardResult.status === "fulfilled" && leaderboardResult.value.ok) {
        setLeaderboardData(leaderboardResult.value);
      }

      setLoading(false);
    };

    run();

    return () => {
      isMounted = false;
    };
  }, []);

  const slides = useMemo<Slide[]>(() => {
    if (loading) {
      return [{ key: "loading", element: <LoadingSlide /> }];
    }

    return [
      { key: "intro", element: <IntroSlide /> },
      { key: "strategy-overview", element: <StrategyOverviewSlide /> },
      {
        key: "activity-before-after",
        element: <ActivityBeforeAfterSlide points={feesData?.points ?? []} />,
      },
      { key: "fees-chart", element: <FeesChartSlide points={feesData?.points ?? []} /> },
      { key: "post-airdrop", element: <PostAirdropSlide /> },
      {
        key: "season2-activation",
        element: <Season2ActivationSlide season2Points={leaderboardData?.season2.points ?? []} />,
      },
      { key: "top-wallets", element: <TopWalletsSlide /> },
      {
        key: "season-comparison",
        element: (
          <SeasonComparisonSlide
            feesPoints={feesData?.points ?? []}
            season2Points={leaderboardData?.season2.points ?? []}
          />
        ),
      },
      { key: "takeaways", element: <TakeawaysSlide /> },
      { key: "attribution", element: <AttributionSlide /> },
    ];
  }, [loading, feesData, leaderboardData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        setIndex((prev) => Math.min(prev + 1, slides.length - 1));
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length]);

  useEffect(() => {
    if (index > slides.length - 1) {
      setIndex(Math.max(slides.length - 1, 0));
    }
  }, [slides.length, index]);

  const handleAdvance = () => {
    setIndex((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const handleRetreat = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleRestart = () => {
    setIndex(0);
  };

  const handleRootClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (target.closest("button, a, input, textarea, select, label, [data-no-advance]")) {
      return;
    }
    handleAdvance();
  };

  const handleTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX ?? null;
    if (startX == null || endX == null) return;
    const delta = startX - endX;
    if (Math.abs(delta) < 40) return;
    if (delta > 0) {
      setIndex((prev) => Math.min(prev + 1, slides.length - 1));
    } else {
      setIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const activeSlide = slides[index];

  return (
    <div
      className="story-root"
      onClick={handleRootClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="story-progress">
        {slides.map((slide, idx) => (
          <span
            key={slide.key}
            className={`story-dot ${idx === index ? "is-active" : ""}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={activeSlide.key}
          className="story-slide"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          {activeSlide.element}
        </motion.section>
      </AnimatePresence>

      <div className="story-footer" data-no-advance>
        <button
          className="story-button"
          onClick={handleRetreat}
          disabled={index === 0}
        >
          Back
        </button>
        {index < slides.length - 1 ? (
          <button className="story-button" onClick={handleAdvance}>
            Next
          </button>
        ) : (
          <button className="story-button" onClick={handleRestart}>
            Restart
          </button>
        )}
      </div>
    </div>
  );
}
