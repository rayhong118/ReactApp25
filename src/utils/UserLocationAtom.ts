import { atom, useAtomValue, useSetAtom } from "jotai";

export const UserLocationAtom = atom<{ lat: number; lng: number }|null>(null);

export const useGetUserLocation = () => useAtomValue(UserLocationAtom);
export const useSetUserLocation = () => useSetAtom(UserLocationAtom);