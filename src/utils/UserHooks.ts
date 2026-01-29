import { auth, db } from "@/firebase";
import { useMutation, useQuery } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAddMessageBars } from "./MessageBarsAtom";
import { updateProfile } from "firebase/auth";

export const useGetAlias = (userId: string) => {
  const { data } = useQuery({
    queryKey: ["getAlias", userId],
    queryFn: async () => {
      const userDoc = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDoc);
      if (userDocSnap.exists()) {
        const alias = userDocSnap.data().alias as string;
        console.log("alias", alias);
        return alias;
      }
      return "";
    },
    enabled: !!userId,
  });
  return { data };
};

// TODO: user profile related hooks
// update user profile image. default user image size is 64 x 64

// update display name
export const useUpdateAlias = () => {
  const addMessageBars = useAddMessageBars();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (newName: string) => {
      try {
        await updateProfile(auth.currentUser!, {
          displayName: newName,
        });
        // also need to update user display name in users collection
        const userDoc = doc(db, "users", auth.currentUser!.uid);
        await updateDoc(userDoc, {
          alias: newName,
        });
      } catch (error) {
        addMessageBars([
          {
            id: new Date().toISOString(),
            message: "Error updating alias: " + error,
            type: "error",
            autoDismiss: true,
          },
        ]);
      }
    },

    onSuccess: () => {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Alias updated successfully",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: (error) => {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Error updating alias: " + error,
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });
  return { mutateAsync, isPending };
};
