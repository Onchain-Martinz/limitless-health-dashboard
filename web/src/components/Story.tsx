import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent, TouchEvent } from "react";
import IntroSlide from "./slides/IntroSlide";
import StrategyOverviewSlide from "./slides/StrategyOverviewSlide";
import FeesChartSlide from "./slides/FeesChartSlide";
import ActivityBeforeAfterSlide from "./slides/ActivityBeforeAfterSlide";
import PostAirdropSlide from "./slides/PostAirdropSlide";
import Season2ActivationSlide from "./slides/Season2ActivationSlide";
import TopWalletsSlide from "./slides/TopWalletsSlide";
import SeasonComparisonSlide from "./slides/SeasonComparisonSlide";
import TakeawaysSlide from "./slides/TakeawaysSlide";

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

type UserMetricsPoint = {
  date: string;
  dailyActiveUsers: number;
  newUsers: number;
  cohortSize: number;
  retained7d: number;
  retention7dRate: number;
};

type UserMetricsResponse = {
  ok: boolean;
  source: string;
  requestedDays: number;
  series: UserMetricsPoint[];
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
  element: JSX.Element;
};

const LoadingSlide = () => (
  <div className="story-card">
    <div className="story-kicker">Loading</div>
    <h1 className="story-title">Building your Limitless Wrapped...</h1>
    <p className="story-subtitle">Fetching fees, users, and leaderboard data.</p>
  </div>
);

const ErrorSlide = ({ messages }: { messages: string[] }) => (
  <div className="story-card story-card--warning">
    <div className="story-kicker">Partial data</div>
    <h1 className="story-title">Some endpoints failed</h1>
    <ul className="story-list">
      {messages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
    <p className="story-footnote">We will still show the slides we can.</p>
  </div>
);

export default function Story() {
  const [feesData, setFeesData] = useState<FeesResponse | null>(null);
  const [userMetricsData, setUserMetricsData] = useState<UserMetricsResponse | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardMetricsResponse | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
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
        fetchJson<UserMetricsResponse>("/.netlify/functions/user-metrics?days=14", "User metrics"),
        fetchJson<LeaderboardMetricsResponse>(
          "/.netlify/functions/leaderboard-metrics?weeks=12",
          "Leaderboard"
        ),
      ]);

      if (!isMounted) return;

      const nextErrors: string[] = [];

      const feesResult = results[0];
      if (feesResult.status === "fulfilled" && feesResult.value.ok) {
        setFeesData(feesResult.value);
      } else {
        nextErrors.push("Fees data unavailable.");
      }

      const userResult = results[1];
      if (userResult.status === "fulfilled" && userResult.value.ok) {
        setUserMetricsData(userResult.value);
      } else {
        nextErrors.push("User metrics unavailable.");
      }

      const leaderboardResult = results[2];
      if (leaderboardResult.status === "fulfilled" && leaderboardResult.value.ok) {
        setLeaderboardData(leaderboardResult.value);
      } else {
        nextErrors.push("Leaderboard data unavailable.");
      }

      setErrors(nextErrors);
      setLoading(false);
    };

    run();

    return () => {
      isMounted = false;
    };
  }, []);

  const dateRange = useMemo(() => {
    if (feesData?.points?.length) {
      const first = feesData.points[0]?.date;
      const last = feesData.points[feesData.points.length - 1]?.date;
      if (first && last) return `${first} to ${last}`;
    }
    if (userMetricsData?.series?.length) {
      const first = userMetricsData.series[0]?.date;
      const last = userMetricsData.series[userMetricsData.series.length - 1]?.date;
      if (first && last) return `${first} to ${last}`;
    }
    return undefined;
  }, [feesData, userMetricsData]);

  const slides = useMemo<Slide[]>(() => {
    if (loading) {
      return [{ key: "loading", element: <LoadingSlide /> }];
    }

    const nextSlides: Slide[] = [
      {
        key: "intro",
        element: <IntroSlide dateRange={dateRange} />,
      },
    ];

    if (errors.length > 0) {
      nextSlides.push({
        key: "errors",
        element: <ErrorSlide messages={errors} />,
      });
    }

    nextSlides.push({
      key: "strategy-overview",
      element: <StrategyOverviewSlide />,
    });

    nextSlides.push({
      key: "activity-before-after",
      element: (
        <ActivityBeforeAfterSlide
          points={feesData?.points ?? []}
          userMetrics={userMetricsData?.series ?? []}
        />
      ),
    });
    nextSlides.push({
      key: "fees-chart",
      element: <FeesChartSlide points={feesData?.points ?? []} />,
    });
    nextSlides.push({
      key: "post-airdrop",
      element: <PostAirdropSlide points={feesData?.points ?? []} />,
    });
    nextSlides.push({
      key: "season2-activation",
      element: (
        <Season2ActivationSlide
          season2Points={leaderboardData?.season2.points ?? []}
        />
      ),
    });

    nextSlides.push({
      key: "top-wallets",
      element: <TopWalletsSlide leaderboardData={leaderboardData} />,
    });

    nextSlides.push({
      key: "season-comparison",
      element: (
        <SeasonComparisonSlide
          feesPoints={feesData?.points ?? []}
          season2Points={leaderboardData?.season2.points ?? []}
        />
      ),
    });

    nextSlides.push({
      key: "takeaways",
      element: <TakeawaysSlide />,
    });

    return nextSlides;
  }, [loading, errors, feesData, userMetricsData, leaderboardData, dateRange]);

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

      <div
        className="story-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide) => (
          <section key={slide.key} className="story-slide">
            {slide.element}
          </section>
        ))}
      </div>

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
