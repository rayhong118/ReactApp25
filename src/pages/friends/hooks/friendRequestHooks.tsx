import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import type { IFriendRequest, IFriendRequestRecord } from "../Friend.types";

const FRIEND_REQUESTS_COLLECTION: string = "friend-requests";

/**
 * Get friend requests of current user, either sent or received
 * returns a query snapshot of the friendRequests collection
 */
export const useGetFriendRequests = () => {
  const currentUserId = useGetCurrentUser()?.uid;

  const { data, isLoading, error } = useQuery({
    queryKey: ["getFriendRequests", FRIEND_REQUESTS_COLLECTION, currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const senderQuery = query(
        collection(db, FRIEND_REQUESTS_COLLECTION),
        where("senderId", "==", currentUserId),
      );
      const receiverQuery = query(
        collection(db, FRIEND_REQUESTS_COLLECTION),
        where("receiverId", "==", currentUserId),
      );
      const senderSnapshot = await getDocs(senderQuery);
      const receiverSnapshot = await getDocs(receiverQuery);
      const result: IFriendRequestRecord = {
        sent: [],
        received: [],
      };
      senderSnapshot.docs.concat(receiverSnapshot.docs).forEach((doc) => {
        const friendRequest = {
          ...doc.data(),
        } as IFriendRequest;
        if (friendRequest.senderId === currentUserId) {
          result.sent.push(friendRequest);
        } else {
          result.received.push(friendRequest);
        }
      });
      // console.log(result);
      return result;
    },
  });

  return { data, isLoading, error };
};

/**
 * Send friend request
 * creates a new doc in the friendRequests collection
 */
export const useSendFriendRequest = () => {};

/**
 * Accept friend request
 * call firebase function to modify both users friend list
 */
export const useAcceptFriendRequest = () => {};
