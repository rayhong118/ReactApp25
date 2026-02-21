import type { User } from "firebase/auth";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { auth } from "../../firebase";

export const CurrentUserAtom = atom<User | null>(auth.currentUser);

export const useGetCurrentUser = () => useAtomValue(CurrentUserAtom);
export const useSetCurrentUser = () => useSetAtom(CurrentUserAtom);
