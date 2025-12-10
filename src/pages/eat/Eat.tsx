import type { IRestaurant } from "./Eat.types";
import { EatCard } from "./EatCard";
import { useGetRestaurants } from "./hooks";

export const Eat = () => {
  const { data: restaurants, isLoading, error } = useGetRestaurants();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-5 py-20 md:p-20 flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Eat</h1>
      {restaurants?.map((restaurant: IRestaurant) => (
        <EatCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
};
