import { CustomizedButton } from "@/components/Buttons";
import { Dialog } from "@/components/Dialog";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import {
  faAngleDown,
  faAngleUp,
  faDirections,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lazy, useState } from "react";
import { StarRating } from "../experiments/StarRating";
import type { IRestaurant } from "./Eat.types";
import { useGetCurrentUserRestaurantRatings } from "./EatAtoms";
import { EatEditForm } from "./EatEditForm";
import { withComponentSuspense } from "@/hooks/withSuspense";

const EatNotesPanel = lazy(() => import("./EatNotesPanel"));

export const EatCard = ({ restaurant }: { restaurant: IRestaurant }) => {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const User = useGetCurrentUser();
  const calculateAverageRating = () => {
    console.log("restaurant.stars", restaurant.stars);
    if (!restaurant.stars) return 3;

    const ratingCount = Object.values(restaurant.stars).reduce(
      (curr, accu) => curr + accu,
      0
    );
    const totalScore = Object.values(restaurant.stars).reduce(
      (accu, curr, index) => accu + curr * (index + 1),
      0
    );
    const average = totalScore / ratingCount;
    return average;
  };
  const averageRating: number = restaurant.stars
    ? Math.round(calculateAverageRating())
    : 0;
  const averageRatingString =
    averageRating !== 0 ? averageRating.toFixed(1) : "No ratings yet";

  const currentUserRatings = useGetCurrentUserRestaurantRatings();
  const currentUserRating = currentUserRatings?.[restaurant.id!] || 0;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Edit Restaurant"
      >
        <EatEditForm
          restaurant={restaurant}
          closeDialog={() => setIsDialogOpen(false)}
        />
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

        <div className="flex items-center gap-2 text-sm">
          Your rating: <StarRating rating={currentUserRating} />
        </div>

        <div className="flex justify-between align-center">
          <div className="flex align-center">
            <CustomizedButton
              onClick={() => setIsNotesExpanded(!isNotesExpanded)}
            >
              Notes and ratings
              {isNotesExpanded ? (
                <FontAwesomeIcon icon={faAngleDown} className="ml-2" />
              ) : (
                <FontAwesomeIcon icon={faAngleUp} className="ml-2" />
              )}
            </CustomizedButton>
          </div>

          <div className="flex gap-2">
            <CustomizedButton
              disabled={!User}
              onClick={() => setIsDialogOpen(true)}
            >
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
};
