import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, getFirestore } from "firebase/firestore";

import type { IGift } from "../Gift.types";

const GIFT_LIST_COLLECTION: string = "gift-lists";

/**
 * Get gift list of user by user id
 */
export const useGetGiftList = (userId: string) => {
  const { data } = useQuery({
    queryKey: ["getGiftList", GIFT_LIST_COLLECTION, userId],
    queryFn: async () => {
      const db = getFirestore();
      const giftListDocRef = collection(
        db,
        GIFT_LIST_COLLECTION,
        userId,
        "gifts"
      );
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
