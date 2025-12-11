import { Dialog } from "@/components/Dialog";
import type { IRestaurant } from "./Eat.types";
import { EatCard } from "./EatCard";
import { EatEditForm } from "./EatEditForm";
import { useGetRestaurants } from "./hooks";
import { useState } from "react";

export const Eat = () => {
  const { data: restaurants, isLoading, error, refetch } = useGetRestaurants();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    refetch();
  };

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
