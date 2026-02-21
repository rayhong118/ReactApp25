import { atom, useAtomValue, useSetAtom } from "jotai";
import type { IEatQuery, TEatSort, TUserRatings } from "./Eat.types";

/**
 * Atoms for search query that will be used to fetch data from Firestore
 */
export const eatFilterSearchQueryAtom = atom<IEatQuery>({
  cityAndState: [],
  id: "",
});
export const eatSortAtom = atom<TEatSort | undefined>(undefined);

export const useGetEatSort = () => useAtomValue(eatSortAtom);
export const useSetEatSort = () => useSetAtom(eatSortAtom);

export const useGetFilterSearchQuery = () =>
  useAtomValue(eatFilterSearchQueryAtom);
export const useSetFilterSearchQuery = () =>
  useSetAtom(eatFilterSearchQueryAtom);

/**
 * Filter based on location (city and state) tag values
 */
export const useUpdateFilterSearchQueryCityAndState = () => {
  const setQuery = useSetFilterSearchQuery();
  return (cityAndState: string[]) => {
    setQuery((currentQuery) => ({ ...currentQuery, cityAndState }));
  };
};

/**
 * Atoms for current user's ratings
 */
export const currentUserRestaurantRatingsAtom = atom<TUserRatings>({});

export const useGetCurrentUserRestaurantRatings = () =>
  useAtomValue(currentUserRestaurantRatingsAtom);

export const useGetCurrentUserRestaurantRating = (restaurantId: string) => {
  const ratingAtom = atom(
    (get) => get(currentUserRestaurantRatingsAtom)[restaurantId] || 0,
  );
  return useAtomValue(ratingAtom);
};

export const useSetCurrentUserRestaurantRatings = () =>
  useSetAtom(currentUserRestaurantRatingsAtom);

export const useUpdateCurrentUserRestaurantRatings = () => {
  const setRatings = useSetCurrentUserRestaurantRatings();
  return (value: TUserRatings) => {
    setRatings((currentRatings) => ({ ...currentRatings, ...value }));
  };
};
