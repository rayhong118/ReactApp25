import { CustomizedButton } from "@/components/Buttons";
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
import type { IRestaurant } from "./Eat.types";
import { useGetCurrentUserRestaurantRating } from "./EatAtoms";
import { EatEditForm } from "./EatEditForm";

const EatNotesPanel = lazy(() => import("./EatNotesPanel"));

export const EatCard = React.memo(
  ({ restaurant }: { restaurant: IRestaurant }) => {
    const [isNotesExpanded, setIsNotesExpanded] = useState(false);
    const User = useGetCurrentUser();

    const averageRatingData = useMemo(() => {
      if (!restaurant.stars) return { rating: 0, string: "No ratings yet" };

      const ratingCount = Object.values(restaurant.stars).reduce(
        (curr, accu) => curr + accu,
        0
      );
      const totalScore = Object.entries(restaurant.stars).reduce(
        (accu, [key, value]) => accu + value * Number(key),
        0
      );

      if (ratingCount === 0) return { rating: 0, string: "No ratings yet" };

      const average = totalScore / ratingCount;
      return {
        rating: Math.round(average),
        string: average.toFixed(1),
      };
    }, [restaurant.stars]);

    const averageRating = averageRatingData.rating;
    const averageRatingString = averageRatingData.string;

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
            Average: <StarRating rating={averageRating} /> {averageRatingString}
          </div>

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
