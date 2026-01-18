import { fmtNumber } from "../../utils/format";
import { SlideContainer, SlideItem } from "../SlideMotion";

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
  const padding = 44;
  const toSafeNumber = (value: unknown) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };
  const values = points.map((point) => toSafeNumber(point.dailyFees));
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
    return height - padding - ((toSafeNumber(value) - minValue) / range) * usableHeight;
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
  const maxLabel = fmtNumber(maxValue, "—");
  const minLabel = fmtNumber(minValue, "—");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="story-chart"
      role="img"
      aria-label="Daily gross trading fees"
    >
      <defs>
        <linearGradient id="feesGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#47d6b6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0f1117" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="#0f1117"
        rx={18}
      />
      <path d={pathD} fill="none" stroke="#47d6b6" strokeWidth={3} />
      <path
        d={`${pathD} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
        fill="url(#feesGradient)"
        opacity={0.7}
      />
      <text x={padding} y={padding - 16} fill="#f8f8f8" fontSize={12}>
        {maxLabel === "—" ? "" : `${maxLabel} USD`}
      </text>
      <text x={padding} y={height - padding + 24} fill="#a8b0c0" fontSize={12}>
        {minLabel === "—" ? "" : `${minLabel} USD`}
      </text>
      <text x={padding} y={height - 12} fill="#a8b0c0" fontSize={12}>
        {firstDate}
      </text>
      <text
        x={width - padding}
        y={height - 12}
        fill="#a8b0c0"
        fontSize={12}
        textAnchor="end"
      >
        {lastDate}
      </text>
      <text x={padding} y={padding + 14} fill="#a8b0c0" fontSize={12}>
        Fees (USD)
      </text>
    </svg>
  );
}

export default function FeesChartSlide({ points }: { points: FeesPoint[] }) {
  const chartPoints = points;

  return (
    <SlideContainer>
      <SlideItem className="story-kicker">Revenue During Season 1</SlideItem>
      <SlideItem>
        <h2 className="story-title">
          Season 1 didn’t just drive engagement — it drove revenue
        </h2>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">
          Throughout Season 1, users didn’t just chase points. They traded.
        </p>
      </SlideItem>
      <SlideItem>
        <p className="story-subtitle">
          Daily and weekly fee data shows steady revenue generation, with clear
          spikes around high-activity periods.
        </p>
      </SlideItem>
      {chartPoints.length > 0 ? (
        <SlideItem>
          <LineChart points={chartPoints} width={900} height={420} />
        </SlideItem>
      ) : (
        <SlideItem>
          <p className="story-footnote">Data unavailable.</p>
        </SlideItem>
      )}
      <SlideItem>
        <p className="story-footnote">
          This chart reflects protocol fees generated from trading activity.
        </p>
      </SlideItem>
    </SlideContainer>
  );
}
