import { atom, useAtomValue, useSetAtom } from "jotai";
import type { IEatQuery } from "./Eat.types";

export const eatFilterSearchQuery = atom<IEatQuery>({
  name: "",
  cityAndState: "",
});
export const getFilterSearchQuery = () => useAtomValue(eatFilterSearchQuery);
export const setFilterSearchQuery = () => useSetAtom(eatFilterSearchQuery);