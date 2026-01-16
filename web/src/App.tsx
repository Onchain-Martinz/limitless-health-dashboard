import { useEffect, useState } from "react";

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

export default function App() {
  const [data, setData] = useState<FeesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/.netlify/functions/fees");
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = (await res.json()) as FeesResponse;
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    };

    run();
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Limitless Health Dashboard</h1>

      <h2>Gross Trading Fees</h2>

      {!data && !error && <p>Loading...</p>}

      {error && (
        <pre style={{ background: "#fee", padding: 12 }}>Error: {error}</pre>
      )}

      {data && data.ok && (
        <>
          <section>
            <p>
              Latest daily fees:{" "}
              {data.points.length > 0
                ? data.points[data.points.length - 1].dailyFees.toLocaleString()
                : "N/A"}
            </p>
            <p>
              Total cumulative fees:{" "}
              {data.points.length > 0
                ? data.points[data.points.length - 1].totalFees.toLocaleString()
                : "N/A"}
            </p>
            <p>
              Last 7 days fees:{" "}
              {data.points.length > 0
                ? data.points
                    .slice(-7)
                    .reduce((sum, point) => sum + point.dailyFees, 0)
                    .toLocaleString()
                : "N/A"}
            </p>
          </section>

          <table
            style={{ marginTop: 16, borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                  Date
                </th>
                <th style={{ textAlign: "right", borderBottom: "1px solid #ddd" }}>
                  Daily Fees
                </th>
                <th style={{ textAlign: "right", borderBottom: "1px solid #ddd" }}>
                  Total Fees
                </th>
              </tr>
            </thead>
            <tbody>
              {data.points.slice(-10).map((point) => (
                <tr key={point.date}>
                  <td style={{ padding: "6px 4px" }}>{point.date}</td>
                  <td style={{ padding: "6px 4px", textAlign: "right" }}>
                    {point.dailyFees.toLocaleString()}
                  </td>
                  <td style={{ padding: "6px 4px", textAlign: "right" }}>
                    {point.totalFees.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}