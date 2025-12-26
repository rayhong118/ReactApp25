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
import React, { lazy, useCallback, useState } from "react";
import { StarRating } from "../experiments/StarRating";
import type { IRestaurant } from "./Eat.types";
import { useGetCurrentUserRestaurantRating } from "./EatAtoms";
import { EatEditForm } from "./EatEditForm";
import { EatRatingHistogram } from "./EatRatingHistogram";
import { faChartBar } from "@fortawesome/free-regular-svg-icons";

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
          <h1 className="text-xl font-bold">
            {restaurant.displayName || restaurant.name}
          </h1>
          {restaurant.displayName && (
            <h2 className="text-lg font-bold">{restaurant.name}</h2>
          )}
          <div>{restaurant.description}</div>

          {restaurant.cityAndState && (
            <span className="px-2 py-0.5 bg-blue-200 rounded-md">
              {restaurant.cityAndState}
            </span>
          )}
          <div>{restaurant.address}</div>
          <div>Price Per Person: {restaurant.price}</div>

          <div className="flex items-center gap-2">
            Average: <StarRating rating={Number(restaurant.averageStars)} />{" "}
            {restaurant.averageStars}
            {restaurant.stars && (
              <SecondaryButton
                onClick={() => setIsHistogramExpanded((prev) => !prev)}
              >
                <FontAwesomeIcon icon={faChartBar} />
                {isHistogramExpanded ? (
                  <FontAwesomeIcon icon={faAngleDown} />
                ) : (
                  <FontAwesomeIcon icon={faAngleUp} />
                )}
              </SecondaryButton>
            )}
          </div>

          {restaurant.stars && isHistogramExpanded && (
            <div className="flex items-start gap-2 md:scale-90 bg-gray-100 p-2 rounded-md">
              <EatRatingHistogram ratings={restaurant.stars} />
            </div>
          )}

          {User && (
            <div className="flex items-center gap-2">
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
