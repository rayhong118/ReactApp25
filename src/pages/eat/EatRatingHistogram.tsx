import * as d3 from "d3";
import type { IStarRating } from "./Eat.types";

export const EatRatingHistogram = ({
  ratings,
}: {
  ratings: Partial<IStarRating>;
}) => {
  // convert ratings to complete ratings
  const completeRatings: { stars: number; count: number }[] = [
    5, 4, 3, 2, 1,
  ].map((star) => {
    return {
      stars: star,
      count: ratings[star as keyof IStarRating] || 0,
    };
  });

  const innerWidth = 320;
  const innerHeight = 100;
  const margin = { top: 0, right: 20, bottom: 0, left: 40 };
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(completeRatings, (d) => d.count) || 10])
    .range([0, innerWidth]);

  // 3. Y Scale: Band for the star categories
  const yScale = d3
    .scaleBand()
    .domain(completeRatings.map((d) => d.stars.toString()))
    .range([0, innerHeight])
    .padding(0.3);

  return (
    <svg
      width={innerWidth + margin.left + margin.right}
      height={innerHeight + margin.top + margin.bottom}
      viewBox={`0 0 ${innerWidth + margin.left + margin.right} ${
        innerHeight + margin.top + margin.bottom
      }`}
      style={{ width: "100%", height: "100px" }}
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        {completeRatings.map((d) => (
          <g key={d.stars}>
            {/* The Bar */}
            <rect
              x={0}
              y={yScale(d.stars.toString())}
              width={xScale(d.count)}
              height={yScale.bandwidth()}
              fill="var(--color-brand-primary)"
              rx={8}
              ry={8}
            />
            {/* The Count Label (at the end of the bar) */}
            <text
              x={xScale(d.count) + 5}
              y={(yScale(d.stars.toString()) || 0) + yScale.bandwidth() / 2}
              fontSize="16"
              fill="var(--color-foreground)"
              dominantBaseline="central"
            >
              {d.count}
            </text>
          </g>
        ))}

        {/* Y-Axis Labels (Stars) */}
        {completeRatings.map((d) => (
          <text
            key={`label-${d.stars}`}
            x={-10}
            y={(yScale(d.stars.toString()) || 0) + yScale.bandwidth() / 2}
            textAnchor="end"
            fontSize="16"
            fill="var(--color-foreground)"
            dominantBaseline="central"
          >
            {d.stars} ★
          </text>
        ))}
      </g>
    </svg>
  );
};
