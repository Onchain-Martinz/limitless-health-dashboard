import type { Handler } from "@netlify/functions";

type Period = {
  startIso?: string;
  endIso?: string;
  points?: number;
};

type LeaderboardRow = {
  account?: string;
  user?: { account?: string };
};

type LeaderboardResponse = {
  periods?: Period[];
  data?: LeaderboardRow[];
  totalPages?: number;
  meta?: { totalPages?: number };
};

type SeriesPoint = {
  weekStart: string;
  weekEnd: string;
  weeklyPoints: number | null;
  activeUsers: null;
  newUsers: null;
  returningUsers: null;
  retentionFromPrevWeek: null;
  retainedFromPrevWeek: null;
  prevWeekActiveUsers: null;
};

const BASE_URL = "https://api.limitless.exchange/leaderboard/week";
const DEFAULT_SEASON = "SEASON2";
const DEFAULT_METRIC = "points";
const DEFAULT_LIMIT = 100;
const DEFAULT_MAX_PAGES = 10;
const DEFAULT_WEEKS = 12;

const toNumberParam = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const headers = {
  accept: "application/json",
  origin: "https://limitless.exchange",
  referer: "https://limitless.exchange/",
};

const getTotalPages = (payload: LeaderboardResponse) =>
  Number(payload.totalPages ?? payload.meta?.totalPages ?? 1) || 1;

const getAccount = (row: LeaderboardRow) =>
  row.account ?? row.user?.account ?? "";

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

export const handler: Handler = async (event) => {
  try {
    const season = event.queryStringParameters?.season || DEFAULT_SEASON;
    const metric = event.queryStringParameters?.metric || DEFAULT_METRIC;
    const limit = toNumberParam(event.queryStringParameters?.limit ?? null, DEFAULT_LIMIT);
    const requestedMaxPages = toNumberParam(
      event.queryStringParameters?.maxPages ?? null,
      DEFAULT_MAX_PAGES
    );
    const weeksRequested = toNumberParam(
      event.queryStringParameters?.weeks ?? null,
      DEFAULT_WEEKS
    );

    const firstUrl = buildUrl(season, metric, 1, limit);
    const firstRes = await fetch(firstUrl, { headers });
    if (!firstRes.ok) {
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ok: false,
          error: `${firstRes.status} ${firstRes.statusText}`,
          status: firstRes.status,
          url: firstUrl,
        }),
      };
    }

    const firstPayload = (await firstRes.json()) as LeaderboardResponse;
    const periods = Array.isArray(firstPayload.periods) ? firstPayload.periods : [];
    const totalPages = getTotalPages(firstPayload);
    const maxPages = Math.min(requestedMaxPages, totalPages);

    const sortedPeriods = periods
      .filter((period) => period.startIso && period.endIso)
      .sort((a, b) => (a.startIso || "").localeCompare(b.startIso || ""));

    const recentPeriods =
      sortedPeriods.length > 0
        ? sortedPeriods.slice(-weeksRequested)
        : [];

    const observedAccounts = new Set<string>();
    let pagesFetched = 0;

    for (let page = 1; page <= maxPages; page += 1) {
      const url = buildUrl(season, metric, page, limit);
      const res = await fetch(url, { headers });
      if (!res.ok) {
        return {
          statusCode: 502,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ok: false,
            error: `${res.status} ${res.statusText}`,
            status: res.status,
            url,
          }),
        };
      }

      const payload = (await res.json()) as LeaderboardResponse;
      pagesFetched += 1;

      const rows = Array.isArray(payload.data) ? payload.data : [];
      for (const row of rows) {
        const account = getAccount(row).toLowerCase();
        if (account) observedAccounts.add(account);
      }

      const pageTotal = getTotalPages(payload);
      if (page >= Math.min(maxPages, pageTotal)) {
        break;
      }
    }

    const series: SeriesPoint[] = recentPeriods.map((period) => ({
      weekStart: period.startIso || "",
      weekEnd: period.endIso || "",
      weeklyPoints: typeof period.points === "number" ? period.points : null,
      activeUsers: null,
      newUsers: null,
      returningUsers: null,
      retentionFromPrevWeek: null,
      retainedFromPrevWeek: null,
      prevWeekActiveUsers: null,
    }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
      body: JSON.stringify({
        ok: true,
        source: "limitless-leaderboard-week",
        season,
        metric,
        pagesFetched,
        totalPages,
        weeksReturned: series.length,
        observedUsers: observedAccounts.size,
        series,
        note:
          "Limitless leaderboard/week provides weekly points periods, but does not expose per-week user lists via a supported query param. Need an endpoint that returns users per period to compute retention.",
      }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: false,
        error: message,
        status: 502,
        url: BASE_URL,
      }),
    };
  }
};
