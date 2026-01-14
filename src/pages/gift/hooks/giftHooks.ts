import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";

import { db } from "@/firebase";
import type { IGift } from "../Gift.types";

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

export const useAddGift = () => {};

export const useUpdateGift = () => {};

export const useDeleteGift = () => {};
