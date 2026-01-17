import type { Handler } from "@netlify/functions";

type Period = {
  id?: string | number;
  startIso?: string;
  endIso?: string;
  points?: number | string;
  value?: number | string;
  volume?: number | string;
};

type LeaderboardResponse = {
  periods?: Period[];
  totalPages?: number;
  meta?: { totalPages?: number };
};

type PeriodOutput = {
  id: string;
  startIso: string;
  endIso: string;
  points: number;
};

const BASE_URL = "https://api.limitless.exchange/leaderboard/week";
const DEFAULT_WEEKS = 12;
const MIN_WEEKS = 4;
const MAX_WEEKS = 52;
const DEFAULT_LIMIT = 100;
const DEFAULT_MAX_PAGES = 3;
const MIN_MAX_PAGES = 1;
const MAX_MAX_PAGES = 5;
const REQUEST_TIMEOUT_MS = 7000;

const headers = {
  accept: "application/json",
  origin: "https://limitless.exchange",
  referer: "https://limitless.exchange/",
};

const toNumberParam = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getTotalPages = (payload: LeaderboardResponse) =>
  Number(payload.totalPages ?? payload.meta?.totalPages ?? 1) || 1;

const buildUrl = (
  season: string,
  metric: string,
  page: number,
  limit: number
) => {
  const params = new URLSearchParams({
    season,
    metric,
    page: String(page),
    limit: String(limit),
  });

  return `${BASE_URL}?${params.toString()}`;
};

const normalizePeriods = (periods: Period[]) => {
  const map = new Map<string, PeriodOutput>();

  for (const period of periods) {
    const idValue = period.id ?? `${period.startIso ?? ""}-${period.endIso ?? ""}`;
    const id = String(idValue);
    if (!id || !period.startIso || !period.endIso) continue;

    const value =
      period.points ??
      period.volume ??
      period.value ??
      0;

    map.set(id, {
      id,
      startIso: period.startIso,
      endIso: period.endIso,
      points: toNumber(value),
    });
  }

  return Array.from(map.values()).sort((a, b) =>
    a.startIso.localeCompare(b.startIso)
  );
};

const fetchWithTimeout = async (url: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, { headers, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
};

const fetchPage = async (season: string, metric: string, page: number) => {
  const url = buildUrl(season, metric, page, DEFAULT_LIMIT);
  const res = await fetchWithTimeout(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  const payload = (await res.json()) as LeaderboardResponse;
  return { payload, url };
};

const getRecentPeriods = (periods: Period[], weeks: number) => {
  const sorted = periods
    .filter((period) => period.startIso && period.endIso)
    .sort((a, b) => (a.startIso || "").localeCompare(b.startIso || ""));

  return sorted.slice(-weeks);
};

const mergePeriods = (target: Period[], incoming: Period[]) => {
  if (!Array.isArray(incoming)) return;
  target.push(...incoming);
};

const fetchPeriodsLimited = async (
  season: string,
  metric: string,
  weeks: number,
  maxPages: number
) => {
  const first = await fetchPage(season, metric, 1);
  const periods: Period[] = Array.isArray(first.payload.periods)
    ? [...first.payload.periods]
    : [];
  const totalPages = getTotalPages(first.payload);
  const cappedPages = Math.min(maxPages, totalPages);

  const recentPeriods = getRecentPeriods(periods, weeks);
  if (recentPeriods.length >= weeks || cappedPages <= 1) {
    return { periods, totalPages, pagesFetched: 1 };
  }

  const remainingPages: number[] = [];
  for (let page = 2; page <= cappedPages; page += 1) {
    remainingPages.push(page);
  }

  const results = await Promise.all(
    remainingPages.map((page) => fetchPage(season, metric, page))
  );

  for (const result of results) {
    mergePeriods(periods, result.payload.periods ?? []);
  }

  return { periods, totalPages, pagesFetched: 1 + results.length };
};

export const handler: Handler = async (event) => {
  try {
    const weeksParam = toNumberParam(event.queryStringParameters?.weeks ?? null, DEFAULT_WEEKS);
    const weeks = Math.min(Math.max(weeksParam, MIN_WEEKS), MAX_WEEKS);
    const maxPagesParam = toNumberParam(
      event.queryStringParameters?.maxPages ?? null,
      DEFAULT_MAX_PAGES
    );
    const maxPages = Math.min(
      Math.max(maxPagesParam, MIN_MAX_PAGES),
      MAX_MAX_PAGES
    );

    const notes: string[] = [];

    const season1Points = await fetchPeriodsLimited("SEASON1", "points", weeks, maxPages);
    const season2Points = await fetchPeriodsLimited("SEASON2", "points", weeks, maxPages);

    let season2VolumePeriods: Period[] = [];
    let season2VolumePages = 0;
    try {
      const season2Volume = await fetchPeriodsLimited("SEASON2", "volume", weeks, maxPages);
      season2VolumePeriods = season2Volume.periods;
      season2VolumePages = season2Volume.pagesFetched;
    } catch (error) {
      notes.push("SEASON2 volume unavailable; returning empty volume array.");
    }

    const season1PointsSeries = normalizePeriods(season1Points.periods).slice(-weeks);
    const season2PointsSeries = normalizePeriods(season2Points.periods).slice(-weeks);
    const season2VolumeSeries = normalizePeriods(season2VolumePeriods).slice(-weeks);

    const pagesFetched =
      season1Points.pagesFetched + season2Points.pagesFetched + season2VolumePages;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
      body: JSON.stringify({
        ok: true,
        source: "limitless-leaderboard",
        weeks,
        season1: {
          points: season1PointsSeries,
        },
        season2: {
          points: season2PointsSeries,
          volume: season2VolumeSeries,
        },
        notes,
      }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const timeoutHint = message.includes("aborted") || message.includes("Timeout")
      ? "Reduce maxPages or weeks to avoid timeouts."
      : undefined;

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
      body: JSON.stringify({
        ok: false,
        error: message,
        hint: timeoutHint,
      }),
    };
  }
};
