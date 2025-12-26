import { PrimaryButton } from "@/components/Buttons";
import { Dialog } from "@/components/Dialog";
import { Loading } from "@/components/Loading";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { IRestaurant } from "./Eat.types";
import {
  useGetFilterSearchQuery,
  useSetCurrentUserRestaurantRatings,
} from "./EatAtoms";
import { EatCard } from "./EatCard.tsx";
import { EatEditForm } from "./EatEditForm";
import {
  useFetchCurrentUserRestaurantRatings,
  useGetRestaurants,
} from "./hooks";

import { useEffect } from "react";

export const EatList = () => {
  const eatQuery = useGetFilterSearchQuery();
  const { data: restaurants, error, isFetching } = useGetRestaurants(eatQuery);
  const { data: currentUserRatings } = useFetchCurrentUserRestaurantRatings();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const setCurrentUserRatings = useSetCurrentUserRestaurantRatings();

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const User = useGetCurrentUser();

  useEffect(() => {
    if (currentUserRatings) {
      setCurrentUserRatings(currentUserRatings);
    }
  }, [currentUserRatings]);

  if (error) return <div>Error: {error.message}</div>;

  if (isFetching) return <Loading />;

  return (
    <div className="flex flex-col gap-5 w-full">
      <PrimaryButton disabled={!User} onClick={() => setIsDialogOpen(true)}>
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add Restaurant
      </PrimaryButton>
      {restaurants?.map((restaurant: IRestaurant) => (
        <EatCard key={restaurant.id} restaurant={restaurant} />
      ))}

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        title="Add Restaurant"
      >
        <EatEditForm restaurant={undefined} closeDialog={handleDialogClose} />
      </Dialog>
    </div>
  );
};
