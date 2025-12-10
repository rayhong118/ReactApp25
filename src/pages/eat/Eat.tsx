import type { IRestaurant } from "./Eat.types";
import { useGetRestaurants } from "./hooks";

export const Eat = () => {

  const { data: restaurants, isLoading, error } = useGetRestaurants<IRestaurant[]>();

  return (
    <div>
      <h1>Eat</h1>
      {restaurants?.map((restaurant) => (
        <div key={restaurant.id} >{restaurant.name}</div>
      ))}
    </div>
  );
};