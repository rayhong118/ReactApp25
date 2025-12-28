import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import type { IEatQuery, TUserRatings } from "./Eat.types";

/**
 * Atoms for search query that will be used to fetch data from Firestore
 */
export const eatFilterSearchQueryAtom = atom<IEatQuery>({
  cityAndState: [],
  id: "",
});

export const useGetFilterSearchQuery = () =>
  useAtomValue(eatFilterSearchQueryAtom);
export const useSetFilterSearchQuery = () =>
  useSetAtom(eatFilterSearchQueryAtom);

/**
 * Filter based on location (city and state) tag values
 */
export const useUpdateFilterSearchQueryCityAndState = () => {
  const setQuery = useSetFilterSearchQuery();
  return useCallback(
    (cityAndState: string[]) => {
      setQuery((currentQuery) => ({ ...currentQuery, cityAndState }));
    },
    [setQuery]
  );
};

/**
 * Atoms for current user's ratings
 */
export const currentUserRestaurantRatingsAtom = atom<TUserRatings>({});

export const useGetCurrentUserRestaurantRatings = () =>
  useAtomValue(currentUserRestaurantRatingsAtom);

export const useGetCurrentUserRestaurantRating = (restaurantId: string) => {
  const ratingAtom = useMemo(
    () =>
      atom((get) => get(currentUserRestaurantRatingsAtom)[restaurantId] || 0),
    [restaurantId]
  );
  return useAtomValue(ratingAtom);
};

export const useSetCurrentUserRestaurantRatings = () =>
  useSetAtom(currentUserRestaurantRatingsAtom);

export const useUpdateCurrentUserRestaurantRatings = () => {
  const setRatings = useSetCurrentUserRestaurantRatings();
  return useCallback(
    (value: TUserRatings) => {
      setRatings((currentRatings) => ({ ...currentRatings, ...value }));
    },
    [setRatings]
  );
};
