import { useGetCurrentUser } from "@/pages/auth/AuthenticationAtoms";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpsCallable } from "firebase/functions";
import { firebaseFunctions } from "@/firebase";
import { useAddMessageBars } from "@/utils/MessageBarsAtom";
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

/**
 * Delete / Remove a friend relationship
 */
export const useDeleteFriend = () => {
  const addMessageBars = useAddMessageBars();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["deleteFriend"],
    mutationFn: async (friendId: string) => {
      const deleteFriendCallable = httpsCallable(
        firebaseFunctions,
        "deleteFriendCallable",
      );
      await deleteFriendCallable({ friendId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Friend removed successfully",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: (error) => {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Error removing friend: " + error.message,
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });

  return { mutate, isPending };
};
