import { atom, useAtomValue, useSetAtom } from "jotai";
import type { IEatQuery, TUserRatings } from "./Eat.types";
import { useCallback } from "react";

/**
 * Atoms for search query that will be used to fetch data from Firestore
 */
export const eatFilterSearchQueryAtom = atom<IEatQuery>({
  name: "",
  cityAndState: [],
});
export const getFilterSearchQuery = () =>
  useAtomValue(eatFilterSearchQueryAtom);
export const setFilterSearchQuery = () => useSetAtom(eatFilterSearchQueryAtom);

/**
 * Not in use. Firebase does not support string partial matching
 */
export const useSetFilterSearchQueryName = () => {
  const setQuery = setFilterSearchQuery();
  return useCallback((name: string) => {
    setQuery((currentQuery) => ({ ...currentQuery, name }));
  }, []);
};

/**
 * Filter based on location (city and state) tag values
 */
export const useSetFilterSearchQueryCityAndState = () => {
  const setQuery = setFilterSearchQuery();
  return useCallback((cityAndState: string[]) => {
    setQuery((currentQuery) => ({ ...currentQuery, cityAndState }));
  }, []);
};

/**
 * Atoms for current user's ratings
 */
export const currentUserRestaurantRatingsAtom = atom<TUserRatings>({});

export const getCurrentUserRestaurantRatings = () =>
  useAtomValue(currentUserRestaurantRatingsAtom);

export const setCurrentUserRestaurantRatings = () =>
  useSetAtom(currentUserRestaurantRatingsAtom);

export const updateCurrentUserRestaurantRatings = (value: TUserRatings) => {
  const setRatings = setCurrentUserRestaurantRatings();
  setRatings((currentRatings) => ({ ...currentRatings, ...value }));
};
