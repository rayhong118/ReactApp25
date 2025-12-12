import { Dialog } from "@/components/Dialog";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { IRestaurant } from "./Eat.types";
import { getFilterSearchQuery } from "./EatAtoms";
import { EatCard } from "./EatCard";
import { EatEditForm } from "./EatEditForm";
import { useGetRestaurants } from "./hooks";
import { Loading } from "@/components/Loading";

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
      <button
        disabled={!User}
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center gap-2 hover:bg-blue-600 rounded-md bg-blue-500 text-white p-2 cursor-pointer disabled:bg-gray-200 disabled:hover:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed">
        <FontAwesomeIcon icon={faPlus} />
        Add Restaurant
      </button>
      {restaurants?.map((restaurant: IRestaurant) => (
        <EatCard key={restaurant.id} restaurant={restaurant} />
      ))}

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        title="Add Restaurant">
        <EatEditForm restaurant={undefined} />
      </Dialog>
    </div>
  );
};
