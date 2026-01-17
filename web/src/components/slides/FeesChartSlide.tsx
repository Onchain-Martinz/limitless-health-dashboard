import { fmtNumber } from "../../utils/format";

type FeesPoint = {
  date: string;
  dailyFees: number;
};

type LineChartProps = {
  points: FeesPoint[];
  width: number;
  height: number;
};

function LineChart({ points, width, height }: LineChartProps) {
  const padding = 28;
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
  const maxLabel = fmtNumber(maxValue);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="story-chart"
      role="img"
      aria-label="Daily fees line chart"
    >
      <defs>
        <linearGradient id="feesGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#47d6b6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0f1117" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="#0f1117"
        rx={16}
      />
      <path d={pathD} fill="none" stroke="#47d6b6" strokeWidth={3} />
      <path
        d={`${pathD} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
        fill="url(#feesGradient)"
        opacity={0.6}
      />
      <text x={padding} y={padding - 8} fill="#f8f8f8" fontSize={12}>
        {maxLabel}
      </text>
      <text x={padding} y={height - 8} fill="#a8b0c0" fontSize={12}>
        {firstDate}
      </text>
      <text
        x={width - padding}
        y={height - 8}
        fill="#a8b0c0"
        fontSize={12}
        textAnchor="end"
      >
        {lastDate}
      </text>
    </svg>
  );
}

export default function FeesChartSlide({ points }: { points: FeesPoint[] }) {
  const chartPoints = points;

  return (
    <div className="story-card">
      <div className="story-kicker">Season 1 Economic Impact</div>
      <h2 className="story-title">Revenue Generated During Season 1</h2>
      <p className="story-subtitle">
        Throughout Season 1, Limitless generated consistent protocol revenue
        through gross trading fees.
      </p>
      <p className="story-subtitle">
        Daily and weekly fee data confirms that the incentive system was directly
        aligned with revenue-generating behavior, rather than passive engagement.
      </p>
      <p className="story-footnote">Daily gross fees (USD).</p>
      {chartPoints.length > 0 ? (
        <LineChart points={chartPoints} width={900} height={320} />
      ) : (
        <p className="story-subtitle">Not enough data to chart yet.</p>
      )}
    </div>
  );
}
