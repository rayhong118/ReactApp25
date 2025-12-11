import type { IRestaurant } from "./Eat.types";
import { EatCard } from "./EatCard";
import { EatEditForm } from "./EatEditForm";
import { Dialog } from "@/components/Dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useGetRestaurants } from "./hooks";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { getFilterSearchQuery } from "./EatAtoms";

export const EatList = () => {

  const eatQuery = getFilterSearchQuery();
  const { data: restaurants, error, isFetching } = useGetRestaurants(eatQuery);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    console.log('initialized', eatQuery);
  }, [eatQuery]);

  if (error) return <div>Error: {error.message}</div>;

  if (isFetching) return <div className="px-5 py-20 md:p-20 flex flex-col gap-5 justify-center items-center"><FontAwesomeIcon icon={faSpinner} />Loading...</div>;

  return (
    <div className="flex flex-col gap-5 w-full">
      <button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2 hover:bg-gray-200 rounded-md bg-blue-500 text-white p-2">
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
