import { Dialog } from "@/components/Dialog";
import type { IRestaurant } from "./Eat.types";
import { EatCard } from "./EatCard";
import { EatEditForm } from "./EatEditForm";
import { useGetRestaurants } from "./hooks";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export const Eat = () => {
  const { data: restaurants, error, refetch, isFetching } = useGetRestaurants();
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  if (error) return <div>Error: {error.message}</div>;

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    refetch();
  };
  if (isFetching) return <div className="px-5 py-20 md:p-20 flex flex-col gap-5"><FontAwesomeIcon icon={faSpinner} />Loading...</div>;

  return (
    <div className="px-5 py-20 md:p-20 flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Eat</h1>
      <button onClick={() => setIsDialogOpen(true)}>Add Restaurant</button>
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
