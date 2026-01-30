import { db } from "@/firebase";
import { USERS_COLLECTION } from "@/pages/gift/hooks/giftHooks";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import type { IFriend } from "../Friend.types";

const FRIENDS_COLLECTION: string = "friends";

/**
 * Get friends and full friend data
 * returns a query snapshot of the friends collection of current user
 */
export const useGetFriends = () => {
  const currentUser = useGetCurrentUser();
  const currentUserId = currentUser?.uid;
  const { data, isLoading, error } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      if (!currentUserId) return [];
      const q = query(
        collection(db, USERS_COLLECTION, currentUserId, FRIENDS_COLLECTION),
        where("userId", "==", currentUserId),
      );
      const querySnapshot = await getDocs(q);
      const friends = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IFriend[];
      console.log("friends", friends);
      return friends;
    },
  });

  return { data, isLoading, error };
};
