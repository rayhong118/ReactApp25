import { atom, useAtomValue, useSetAtom } from "jotai";

export const eatFilterSearchString = atom<string>("");
export const getFilterSearchString = () => useAtomValue(eatFilterSearchString);
export const setFilterSearchString = () => useSetAtom(eatFilterSearchString);