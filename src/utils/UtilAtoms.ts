import { useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type TColorTheme = "light" | "dark";
export const themeAtom = atomWithStorage<TColorTheme>("theme", "light");

export const useThemeValue = () => useAtomValue(themeAtom);
export const useSetTheme = () => useSetAtom(themeAtom);
