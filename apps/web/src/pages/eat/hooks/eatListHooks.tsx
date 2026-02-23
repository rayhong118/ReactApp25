import { useEffect } from "react";
import {
  useGetFilterSearchQuery,
  useSetCurrentUserRestaurantRatings,
  useGetEatSort,
  useSetEatSort,
} from "../EatAtoms";
import {
  useFetchCurrentUserRestaurantRatings,
  useGetRestaurants,
} from "./hooks";
import type { TEatSort } from "../Eat.types";
import { useEatTestMode } from "./useEatTestMode";
import { MOCK_RESTAURANT } from "../EatMockData";

/**
 * This hook handles sort for eat list
 * @returns orderBy: object containing field and direction
 * @returns handleSortChange: function to handle sort change
 */
export const useEatListSort = () => {
  const orderBy = useGetEatSort();
  const setOrderBy = useSetEatSort();

  const handleSortChange = (sortInput: TEatSort | undefined) => {
    setOrderBy(sortInput);
  };

  return { orderBy, handleSortChange };
};

/**
 * This hook handles fetching restaurants for eat list.
 * Acquires eat query from atom and uses it to fetch restaurants.
 * @param orderBy: object containing field and direction. Passed to useGetRestaurants hook to sort restaurants.
 * @returns restaurants: array of restaurants
 * @returns error: error if any
 * @returns hasNextPage: boolean to check if there are more pages
 * @returns fetchNextPage: function to fetch next page
 * @returns isFetchingNextPage: boolean to check if next page is being fetched
 * @returns eatQuery: query for filtering and searching restaurants
 */
export const useRestaurantList = () => {
  const eatQuery = useGetFilterSearchQuery();
  const { orderBy } = useEatListSort();
  const {
    data: restaurants,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetRestaurants(eatQuery, orderBy);

  const { data: currentUserRatings } = useFetchCurrentUserRestaurantRatings();
  const setCurrentUserRatings = useSetCurrentUserRestaurantRatings();

  useEffect(() => {
    // populate currentUserRatings for each restaurant
    if (currentUserRatings) {
      setCurrentUserRatings(currentUserRatings);
    }
  }, [currentUserRatings, setCurrentUserRatings]);

  const allRestaurantsFromHook = restaurants?.pages.flatMap(
    (page) => page.restaurants,
  );
  const isTestMode = useEatTestMode();

  const allRestaurants =
    isTestMode &&
    (!allRestaurantsFromHook || allRestaurantsFromHook.length === 0)
      ? [MOCK_RESTAURANT]
      : allRestaurantsFromHook;

  return {
    restaurants: allRestaurants,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    eatQuery,
    isTestMode,
  };
};
