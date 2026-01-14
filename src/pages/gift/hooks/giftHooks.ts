import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/firebase";
import type { IGift } from "../Gift.types";
import { useAddMessageBars } from "@/utils/MessageBarsAtom";

const USERS_COLLECTION: string = "users";

// TODO: loading indication and error handling
/**
 * Get gift list of user by user id
 * @param userId
 */
export const useGetGiftList = (userId: string) => {
  const { data } = useQuery({
    queryKey: ["getGiftList", USERS_COLLECTION, userId],
    queryFn: async () => {
      const giftListDocRef = collection(db, USERS_COLLECTION, userId, "gifts");
      const giftListDoc = await getDocs(giftListDocRef);
      if (giftListDoc.docs.length > 0) {
        const result = giftListDoc.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as IGift[];
        console.log(result);
        return result;
      }
      return [];
    },
  });

  return { data };
};

/**
 * Add gift to user's gift list
 * @param userId
 */
export const useAddGift = (userId: string) => {
  const queryClient = useQueryClient();
  const addMessageBar = useAddMessageBars();
  const { mutateAsync: addGift } = useMutation({
    mutationKey: ["addGift", USERS_COLLECTION, userId],

    mutationFn: async (gift: Partial<IGift>) => {
      /**
       * Add gift to user's gift list. On creation,
       * @param gift should contain: name, type.
       * optional: description
       */
      const giftData: Partial<IGift> = {
        ...gift,
        addedAt: Timestamp.fromDate(new Date()),
      };
      const giftListDocRef = collection(db, USERS_COLLECTION, userId, "gifts");
      await addDoc(giftListDocRef, giftData);
    },
    onSuccess: () => {
      addMessageBar([
        {
          id: "add-gift-success",
          message: "Gift added successfully!",
          type: "success",
          autoDismiss: true,
        },
      ]);
      queryClient.invalidateQueries({
        queryKey: ["getGiftList"],
      });
    },
    onError: (error) => {
      addMessageBar([
        {
          id: "add-gift-error",
          message: "Error adding gift!" + error,
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });

  return { addGift };
};

export const useUpdateGift = (userId: string) => {
  const queryClient = useQueryClient();
  const addMessageBar = useAddMessageBars();
  const { mutateAsync: updateGift } = useMutation({
    mutationKey: ["updateGift", USERS_COLLECTION, userId],
    mutationFn: async (gift: Partial<IGift>) => {
      const giftListDocRef = collection(db, USERS_COLLECTION, userId, "gifts");
      const giftDocRef = doc(giftListDocRef, gift.id!);
      await updateDoc(giftDocRef, gift);
    },
    onSuccess: () => {
      addMessageBar([
        {
          id: "update-gift-success",
          message: "Gift updated successfully!",
          type: "success",
          autoDismiss: true,
        },
      ]);
      queryClient.invalidateQueries({
        queryKey: ["getGiftList"],
      });
    },
    onError: (error) => {
      addMessageBar([
        {
          id: "update-gift-error",
          message: "Error updating gift!" + error,
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });

  return { updateGift };
};

export const useDeleteGift = () => {};
