import { useEffect, useState } from "react";
import { fmtNumber } from "../../utils/format";

type LeaderboardRow = {
  account?: string;
  displayName?: string;
  user?: { account?: string; displayName?: string };
  totalVolume?: number | string;
  volume?: number | string;
  points?: number | string;
  totalPoints?: number | string;
};

type LeaderboardPayload = {
  data?: LeaderboardRow[];
};

type WalletEntry = {
  rank: number;
  label: string;
  value: number;
  account: string;
};

type LeaderboardMetricsResponse = {
  season2?: { volume?: unknown[] };
};

const shortenAddress = (address: string) => {
  if (!address) return "Unknown";
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatValue = (value: number, metric: "volume" | "points") => {
  const rounded = Math.round(value * 100) / 100;
  const formatted = fmtNumber(rounded, "0");
  return metric === "volume" ? `$${formatted} USDC` : `${formatted} pts`;
};

const fetchLeaderboard = async (metric: "volume" | "points") => {
  const url = `https://api.limitless.exchange/leaderboard/week?metric=${metric}&page=1&limit=10&season=SEASON2`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return (await res.json()) as LeaderboardPayload;
};

export default function TopWalletsSlide({
  leaderboardData,
}: {
  leaderboardData: LeaderboardMetricsResponse | null;
}) {
  const [wallets, setWallets] = useState<WalletEntry[]>([]);
  const [metric, setMetric] = useState<"volume" | "points">("volume");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        if (leaderboardData?.season2?.volume && leaderboardData.season2.volume.length > 0) {
          setMetric("volume");
        }

        let payload = await fetchLeaderboard("volume");
        let chosenMetric: "volume" | "points" = "volume";

        if (!Array.isArray(payload.data) || payload.data.length === 0) {
          payload = await fetchLeaderboard("points");
          chosenMetric = "points";
        }

        const rows = Array.isArray(payload.data) ? payload.data : [];
        const entries = rows
          .map((row, index) => {
            const account = row.account ?? row.user?.account ?? "";
            if (!account) return null;
            const displayName = row.displayName ?? row.user?.displayName ?? "";
            const label = displayName || shortenAddress(account);
            const value =
              chosenMetric === "volume"
                ? toNumber(row.totalVolume ?? row.volume ?? row.points)
                : toNumber(row.totalPoints ?? row.points);

            return {
              rank: index + 1,
              label,
              value,
              account,
            } as WalletEntry;
          })
          .filter((entry): entry is WalletEntry => Boolean(entry));

        if (!active) return;

        setWallets(entries);
        setMetric(chosenMetric);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load wallets");
      } finally {
        if (active) setLoading(false);
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [leaderboardData]);

  return (
    <div className="story-card">
      <div className="story-kicker">User Behavior & Competition</div>
      <h2 className="story-title">Who Drove the Activity?</h2>
      <p className="story-subtitle">
        Leaderboard data from Season 2 highlights a cohort of highly engaged
        wallets responsible for a disproportionate share of points and trading
        volume.
      </p>
      <p className="story-subtitle">
        While profitability data is not publicly available, ranking by volume
        and points reveals strong competitive dynamics among active participants.
      </p>

      {loading && <p className="story-subtitle">Loading leaderboard…</p>}
      {error && <p className="story-subtitle">Unable to load wallets: {error}</p>}

      {!loading && !error && wallets.length > 0 && (
        <div className="story-list">
          {wallets.map((wallet) => (
            <div key={wallet.account} className="story-row">
              <span>
                #{wallet.rank} {wallet.label}
              </span>
              <strong>{formatValue(wallet.value, metric)}</strong>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && wallets.length === 0 && (
        <p className="story-subtitle">Leaderboard data is currently empty.</p>
      )}

      <p className="story-footnote">
        Top wallets are based on available API data (volume/points), not
        profitability.
      </p>
    </div>
  );
}
