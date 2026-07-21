import * as d3 from "d3";
import type { IStarRating } from "./Eat.types";

export const EatRatingHistogram = ({
  ratings,
}: {
  ratings: Partial<IStarRating>;
}) => {
  // Convert ratings to complete star distribution array
  const completeRatings: { stars: number; count: number }[] = [
    5, 4, 3, 2, 1,
  ].map((star) => ({
    stars: star,
    count: ratings[star as keyof IStarRating] || 0,
  }));

  // Coordinate space layout definitions
  const margin = { top: 4, right: 48, bottom: 4, left: 42 };
  const svgWidth = 380;
  const svgHeight = 120;
  const innerWidth = svgWidth - margin.left - margin.right;
  const innerHeight = svgHeight - margin.top - margin.bottom;

  const maxCount = d3.max(completeRatings, (d) => d.count) || 1;

  // Scales
  const xScale = d3.scaleLinear().domain([0, maxCount]).range([0, innerWidth]);

  const yScale = d3
    .scaleBand()
    .domain(completeRatings.map((d) => d.stars.toString()))
    .range([0, innerHeight])
    .padding(0.28);

  return (
    <div className="w-full max-w-md mx-auto">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto overflow-visible select-none"
        role="img"
        aria-label="Rating distribution chart"
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Background tracks */}
          {completeRatings.map((d) => (
            <rect
              key={`bg-${d.stars}`}
              x={0}
              y={yScale(d.stars.toString())}
              width={innerWidth}
              height={yScale.bandwidth()}
              className="fill-gray-100 dark:fill-gray-800"
              rx={4}
            />
          ))}

          {/* Active Rating Bars */}
          {completeRatings.map((d) => {
            const barWidth = xScale(d.count);
            const yPos = yScale(d.stars.toString()) || 0;
            return (
              <g key={d.stars} className="group">
                <rect
                  x={0}
                  y={yPos}
                  width={barWidth}
                  height={yScale.bandwidth()}
                  fill="var(--color-brand-primary, #3b82f6)"
                  rx={4}
                  className="transition-all duration-300 ease-out"
                />

                {/* Count Label (Right of bar) */}
                <text
                  x={barWidth + 6}
                  y={yPos + yScale.bandwidth() / 2}
                  fontSize="12"
                  fontWeight="600"
                  fill="currentColor"
                  className="fill-gray-700 dark:fill-gray-300"
                  dominantBaseline="central"
                >
                  {d.count}
                </text>
              </g>
            );
          })}

          {/* Y-Axis Star Labels (Left of bar) */}
          {completeRatings.map((d) => (
            <text
              key={`label-${d.stars}`}
              x={-8}
              y={(yScale(d.stars.toString()) || 0) + yScale.bandwidth() / 2}
              textAnchor="end"
              fontSize="13"
              fontWeight="500"
              fill="currentColor"
              className="fill-gray-600 dark:fill-gray-400"
              dominantBaseline="central"
            >
              {d.stars} ★
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
};
