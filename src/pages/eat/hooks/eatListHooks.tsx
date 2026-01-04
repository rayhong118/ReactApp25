import { useEffect, useRef, useState } from "react";
import {
  useGetFilterSearchQuery,
  useSetCurrentUserRestaurantRatings,
} from "../EatAtoms";
import {
  useFetchCurrentUserRestaurantRatings,
  useGetRestaurants,
} from "./hooks";

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
