import { PrimaryButton } from "@/components/Buttons";
import { Dialog } from "@/components/Dialog";
import { Loading } from "@/components/Loading";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { IRestaurant } from "./Eat.types";
import { getFilterSearchQuery } from "./EatAtoms";
import { EatCard } from "./EatCard";
import { EatEditForm } from "./EatEditForm";
import { useGetRestaurants } from "./hooks";

export const EatList = () => {

  const eatQuery = getFilterSearchQuery();
  const { data: restaurants, error, isFetching } = useGetRestaurants(eatQuery);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const User = useGetCurrentUser();

  if (error) return <div>Error: {error.message}</div>;

  if (isFetching) return <Loading />;

  return (
    <div className="flex flex-col gap-5 w-full">
      <PrimaryButton
        disabled={!User}
        onClick={() => setIsDialogOpen(true)}
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add Restaurant
      </PrimaryButton>
      {restaurants?.map((restaurant: IRestaurant) => (
        <EatCard key={restaurant.id} restaurant={restaurant} />
      ))}

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        title="Add Restaurant">
        <EatEditForm restaurant={undefined} closeDialog={handleDialogClose} />
      </Dialog>
    </div>
  );
};
