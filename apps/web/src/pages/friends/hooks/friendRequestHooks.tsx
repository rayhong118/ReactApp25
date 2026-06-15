import { db, firebaseFunctions } from "@/firebase";
import { useGetCurrentUser } from "@/pages/auth/AuthenticationAtoms";
import { useAddMessageBars } from "@/utils/MessageBarsAtom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import type { IFriendRequest } from "../Friend.types";

const FRIEND_REQUESTS_COLLECTION: string = "friend-requests";

/**
 * Get friend requests of current user, either sent or received
 * returns an object with two arrays: sentRequests and receivedRequests
 */
export const useGetFriendRequests = () => {
  const currentUserId = useGetCurrentUser()?.uid;

  const { data, isLoading, error } = useQuery({
    queryKey: ["getFriendRequests", FRIEND_REQUESTS_COLLECTION, currentUserId],
    queryFn: async () => {
      if (!currentUserId) return { sentRequests: [], receivedRequests: [] };
      const callable = httpsCallable(firebaseFunctions, "getFriendRequests");
      const result = await callable();
      // console.log(result);
      return result.data as {
        sentRequests: IFriendRequest[];
        receivedRequests: IFriendRequest[];
      };
    },
  });

  return { data, isLoading, error };
};

/**
 * Create friend request
 * creates a new doc in the friendRequests collection
 */
export const useCreateFriendRequest = () => {
  const addMessageBars = useAddMessageBars();
  const queryClient = useQueryClient();
  const currentUserId = useGetCurrentUser()?.uid;

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationKey: ["createFriendRequest"],
    mutationFn: async (friendRequest: Omit<IFriendRequest, "id">) => {
      await addDoc(collection(db, FRIEND_REQUESTS_COLLECTION), friendRequest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getFriendRequests", FRIEND_REQUESTS_COLLECTION, currentUserId],
      });
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Friend request sent successfully",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: (error) => {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Error sending friend request: " + error.message,
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });

  return { mutate, isPending, isSuccess, error };
};

/**
 * Accept friend request
 * This will trigger firebase function to modify both users friend list
 */
export const useAcceptFriendRequest = () => {
  const addMessageBars = useAddMessageBars();
  const queryClient = useQueryClient();
  const currentUserId = useGetCurrentUser()?.uid;

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationKey: ["acceptFriendRequest"],
    mutationFn: async (friendRequestId: string) => {
      const friendRequestRef = doc(
        db,
        FRIEND_REQUESTS_COLLECTION,
        friendRequestId,
      );
      const friendRequest = await getDoc(friendRequestRef);
      if (!friendRequest.exists()) {
        throw new Error("Friend request not found");
      }
      await updateDoc(friendRequestRef, {
        status: "accepted",
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getFriendRequests", FRIEND_REQUESTS_COLLECTION, currentUserId],
      });
      queryClient.invalidateQueries({
        queryKey: ["friends"],
      });
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Friend request accepted successfully",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: (error) => {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Error accepting friend request: " + error.message,
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });

  return { mutate, isPending, isSuccess, error };
};

/**
 * Delete friend request (Cancel/Decline)
 */
export const useDeleteFriendRequest = () => {
  const addMessageBars = useAddMessageBars();
  const queryClient = useQueryClient();
  const currentUserId = useGetCurrentUser()?.uid;

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationKey: ["deleteFriendRequest"],
    mutationFn: async (friendRequestId: string) => {
      const friendRequestRef = doc(
        db,
        FRIEND_REQUESTS_COLLECTION,
        friendRequestId,
      );
      await deleteDoc(friendRequestRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getFriendRequests", FRIEND_REQUESTS_COLLECTION, currentUserId],
      });
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Friend request removed",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: (error) => {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Error removing friend request: " + error.message,
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });

  return { mutate, isPending, isSuccess, error };
};
