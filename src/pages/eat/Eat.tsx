import type { IRestaurant } from "./Eat.types";
import { EatCard } from "./EatCard";
import { useGetRestaurants } from "./hooks";

export const Eat = () => {
  const { data: restaurants, isLoading, error } = useGetRestaurants();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Eat</h1>
      {restaurants?.map((restaurant: IRestaurant) => (
        <EatCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
};
