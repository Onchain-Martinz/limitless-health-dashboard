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

type LineChartPoint = {
  date: string;
  dailyFees: number;
};

type LineChartProps = {
  points: LineChartPoint[];
  width: number;
  height: number;
};

function LineChart({ points, width, height }: LineChartProps) {
  const padding = 24;
  const values = points.map((point) => point.dailyFees);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  const xScale = (index: number) => {
    if (points.length <= 1) return padding;
    const usableWidth = width - padding * 2;
    return padding + (index / (points.length - 1)) * usableWidth;
  };

  const yScale = (value: number) => {
    const usableHeight = height - padding * 2;
    return height - padding - ((value - minValue) / range) * usableHeight;
  };

  const pathD = points
    .map((point, index) => {
      const x = xScale(index);
      const y = yScale(point.dailyFees);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const firstDate = points[0]?.date ?? "";
  const lastDate = points[points.length - 1]?.date ?? "";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ maxWidth: "100%", height: "auto", display: "block" }}
      role="img"
      aria-label="Daily fees line chart"
    >
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="#f6f8fa"
        rx={8}
      />
      <path d={pathD} fill="none" stroke="#0b6efd" strokeWidth={2} />
      <text x={padding} y={padding - 6} fill="#111" fontSize={12}>
        {maxValue.toLocaleString()}
      </text>
      <text x={padding} y={height - 6} fill="#555" fontSize={12}>
        {firstDate}
      </text>
      <text
        x={width - padding}
        y={height - 6}
        fill="#555"
        fontSize={12}
        textAnchor="end"
      >
        {lastDate}
      </text>
    </svg>
  );
}

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

          <section style={{ marginTop: 16 }}>
            {data.points.length > 0 ? (
              <LineChart
                points={data.points.slice(-90)}
                width={900}
                height={260}
              />
            ) : (
              <p>No data available for chart.</p>
            )}
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
