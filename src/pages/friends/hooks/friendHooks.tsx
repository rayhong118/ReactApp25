import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import { useQuery } from "@tanstack/react-query";
import { httpsCallable } from "firebase/functions";
import { firebaseFunctions } from "@/firebase";
// const FRIENDS_COLLECTION: string = "friends";

import type { IFriend } from "../Friend.types";

/**
 * Get friends and full friend data
 * returns a query snapshot of the friends collection of current user
 */
export const useGetFriends = () => {
  const currentUser = useGetCurrentUser();
  const currentUserId = currentUser?.uid;
  const { data, isLoading, error } = useQuery<IFriend[]>({
    queryKey: ["friends"],
    queryFn: async () => {
      if (!currentUserId) return [];
      const getFriendsData = httpsCallable(firebaseFunctions, "getFriendsData");
      const result = await getFriendsData();
      const friends = result.data as IFriend[];
      console.log("friends", friends);
      return friends;
    },
    enabled: !!currentUserId,
    staleTime: 60 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  });

  return { data, isLoading, error };
};
