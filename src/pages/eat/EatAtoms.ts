import { atom, useAtomValue, useSetAtom } from "jotai";
import type { IEatQuery } from "./Eat.types";

export const eatFilterSearchQuery = atom<IEatQuery>({
  name: "",
  cityAndState: [],
});
export const getFilterSearchQuery = () => useAtomValue(eatFilterSearchQuery);
export const setFilterSearchQuery = () => useSetAtom(eatFilterSearchQuery);

export const useSetFilterSearchQueryName = () => {
  const setQuery = setFilterSearchQuery();
  return (name: string) => {
    setQuery((currentQuery) => ({ ...currentQuery, name }));
  }
}

export const useSetFilterSearchQueryCityAndState = () => {
  const setQuery = setFilterSearchQuery();
  return (cityAndState: string[]) => {
    setQuery((currentQuery) => ({ ...currentQuery, cityAndState }));
  }
}


