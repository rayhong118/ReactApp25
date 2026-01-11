import { useEffect, useRef, useState } from "react";
import {
  useGetFilterSearchQuery,
  useSetCurrentUserRestaurantRatings,
} from "../EatAtoms";
import {
  useFetchCurrentUserRestaurantRatings,
  useGetRestaurants,
} from "./hooks";

/**
 * This hook handles sort for eat list
 * @returns orderBy: object containing field and direction
 * @returns handleSortChange: function to handle sort change
 */
export const useEatListSort = () => {
  const [orderBy, setOrderBy] = useState<
    | {
        field: string;
        direction: "asc" | "desc";
      }
    | undefined
  >();

  const handleSortChange = (
    sortInput:
      | {
          field: string;
          direction: "asc" | "desc";
        }
      | undefined
  ) => {
    if (!sortInput) {
      setOrderBy(undefined);
      return;
    }
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
export const useRestaurantList = (
  orderBy: { field: string; direction: "asc" | "desc" } | undefined
) => {
  const eatQuery = useGetFilterSearchQuery();
  const {
    data: restaurants,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
    isFetchingNextPage,
  } = useGetRestaurants(eatQuery, orderBy);

  const { data: currentUserRatings } = useFetchCurrentUserRestaurantRatings();
  const setCurrentUserRatings = useSetCurrentUserRestaurantRatings();

  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    // populate currentUserRatings for each restaurant
    if (currentUserRatings) {
      setCurrentUserRatings(currentUserRatings);
    }
  }, [currentUserRatings]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      refetch();
    }, 500);
  }, [orderBy]);

  const allRestaurants = restaurants?.pages.flatMap((page) => page.restaurants);

  return {
    restaurants: allRestaurants,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    eatQuery,
  };
};
