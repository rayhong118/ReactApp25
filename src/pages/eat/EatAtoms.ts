import { atom, useAtomValue, useSetAtom } from "jotai";
import type { IEatQuery } from "./Eat.types";
import { useCallback } from "react";

export const eatFilterSearchQuery = atom<IEatQuery>({
  name: "",
  cityAndState: [],
});
export const getFilterSearchQuery = () => useAtomValue(eatFilterSearchQuery);
export const setFilterSearchQuery = () => useSetAtom(eatFilterSearchQuery);

export const useSetFilterSearchQueryName = () => {
  const setQuery = setFilterSearchQuery();
  return useCallback((name: string) => {
    setQuery((currentQuery) => ({ ...currentQuery, name }));
  }, []);
};

export const useSetFilterSearchQueryCityAndState = () => {
  const setQuery = setFilterSearchQuery();
  return useCallback((cityAndState: string[]) => {
    setQuery((currentQuery) => ({ ...currentQuery, cityAndState }));
  }, []);
};
