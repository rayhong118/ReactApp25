import { CustomizedButton, SecondaryButton } from "@/components/Buttons";
import { Dialog } from "@/components/Dialog";
import { withComponentSuspense } from "@/hooks/withSuspense";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import {
  faAngleDown,
  faAngleUp,
  faDirections,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { lazy, useCallback, useMemo, useState } from "react";
import { StarRating } from "../experiments/StarRating";
import type { IRestaurant, IStarRating } from "./Eat.types";
import { useGetCurrentUserRestaurantRating } from "./EatAtoms";
import { EatEditForm } from "./EatEditForm";
import * as d3 from "d3";

const EatNotesPanel = lazy(() => import("./EatNotesPanel"));

export const EatCard = React.memo(
  ({ restaurant }: { restaurant: IRestaurant }) => {
    const [isNotesExpanded, setIsNotesExpanded] = useState(false);
    const [isHistogramExpanded, setIsHistogramExpanded] = useState(false);
    const User = useGetCurrentUser();

    const currentUserRating = useGetCurrentUserRestaurantRating(
      restaurant.id || ""
    );

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const toggleNotes = useCallback(() => {
      setIsNotesExpanded((prev) => !prev);
    }, []);

    const openDialog = useCallback(() => {
      setIsDialogOpen(true);
    }, []);

    const closeDialog = useCallback(() => {
      setIsDialogOpen(false);
    }, []);

    return (
      <div>
        <Dialog
          open={isDialogOpen}
          onClose={closeDialog}
          title="Edit Restaurant"
        >
          <EatEditForm restaurant={restaurant} closeDialog={closeDialog} />
        </Dialog>
        <div className="border border-black p-4 rounded-md">
          <h1 className="text-lg font-bold">
            {restaurant.displayName || restaurant.name}
          </h1>
          {restaurant.displayName && (
            <h2 className="text-sm font-bold">{restaurant.name}</h2>
          )}
          <div>{restaurant.description}</div>

          {restaurant.cityAndState && (
            <span className="text-sm px-2 py-0.5 bg-blue-200 rounded-md">
              {restaurant.cityAndState}
            </span>
          )}
          <div className="text-sm">{restaurant.address}</div>
          <div className="text-sm">Price Per Person: {restaurant.price}</div>

          <div className="flex items-center gap-2 text-sm">
            Average: <StarRating rating={Number(restaurant.averageStars)} />{" "}
            {restaurant.averageStars}
            {restaurant.stars && (
              <SecondaryButton
                onClick={() => setIsHistogramExpanded((prev) => !prev)}
              >
                Histogram
                <FontAwesomeIcon icon={faAngleDown} className="ml-2" />
              </SecondaryButton>
            )}
          </div>

          {restaurant.stars && isHistogramExpanded && (
            <div className="flex items-center gap-2 text-sm">
              <RatingHistogram ratings={restaurant.stars} />
            </div>
          )}

          {User && (
            <div className="flex items-center gap-2 text-sm">
              Your rating: <StarRating rating={currentUserRating} />
            </div>
          )}

          <div className="flex justify-between align-center">
            <div className="flex align-center">
              <CustomizedButton onClick={toggleNotes}>
                Notes & ratings
                {isNotesExpanded ? (
                  <FontAwesomeIcon icon={faAngleDown} className="ml-2" />
                ) : (
                  <FontAwesomeIcon icon={faAngleUp} className="ml-2" />
                )}
              </CustomizedButton>
            </div>

            <div className="flex">
              <CustomizedButton disabled={!User} onClick={openDialog}>
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Edit
              </CustomizedButton>
              <CustomizedButton
                onClick={() => window.open(restaurant.url, "_blank")}
              >
                <FontAwesomeIcon icon={faDirections} className="mr-2" />
                Go
              </CustomizedButton>
            </div>
          </div>

          {isNotesExpanded && (
            <div>
              {withComponentSuspense(
                <EatNotesPanel restaurantId={restaurant.id!} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

const RatingHistogram = ({ ratings }: { ratings: Partial<IStarRating> }) => {
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
  const innerHeight = 60;
  const margin = { top: 0, right: 20, bottom: 0, left: 40 };
  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(completeRatings, (d) => d.count) || 10])
        .range([0, innerWidth]),
    [completeRatings, innerWidth]
  );

  // 3. Y Scale: Band for the star categories
  const yScale = useMemo(
    () =>
      d3
        .scaleBand()
        .domain(completeRatings.map((d) => d.stars.toString()))
        .range([0, innerHeight])
        .padding(0.3),
    [completeRatings, innerHeight]
  );

  return (
    <svg
      width={innerWidth + margin.left + margin.right}
      height={innerHeight + margin.top + margin.bottom}
      viewBox={`0 0 ${innerWidth + margin.left + margin.right} ${
        innerHeight + margin.top + margin.bottom
      }`}
      style={{ width: "100%", height: "auto" }}
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
              fill="#fbbf24"
              rx={1}
            />
            {/* The Count Label (at the end of the bar) */}
            <text
              x={xScale(d.count) + 5}
              y={(yScale(d.stars.toString()) || 0) + yScale.bandwidth() / 2}
              fontSize="12"
              fill="#4b5563"
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
            fontSize="12"
            dominantBaseline="central"
          >
            {d.stars} ★
          </text>
        ))}
      </g>
    </svg>
  );
};
