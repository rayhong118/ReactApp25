import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";

export const useGetDisplayName = (userId: string) => {
  const { data } = useQuery({
    queryKey: ["getDisplayName", userId],
    queryFn: async () => {
      const userDoc = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDoc);
      if (userDocSnap.exists()) {
        const displayName = userDocSnap.data().displayName as string;
        console.log("displayName", displayName);
        return displayName;
      }
      return "";
    },
    enabled: !!userId,
  });
  return { data };
};

// TODO: user profile related hooks
// update user profile image. default user image size is 64 x 64

// TODO: friends list related hooks
// get friends list
// add friend
// remove friend
