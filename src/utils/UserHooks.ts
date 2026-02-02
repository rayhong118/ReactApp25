import { auth, db } from "@/firebase";
import { useMutation, useQuery } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAddMessageBars } from "./MessageBarsAtom";
import { updateProfile } from "firebase/auth";

export const useGetUserInfo = (userId: string) => {
  const { data } = useQuery({
    queryKey: ["getUserInfo", userId],
    queryFn: async () => {
      const userDoc = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDoc);
      if (userDocSnap.exists()) {
        const alias = userDocSnap.data().alias as string;
        const color = userDocSnap.data().color as string;
        return { alias, color };
      }
      return { alias: "", color: "" };
    },
    enabled: !!userId,
  });
  return { data };
};

// TODO: user profile related hooks
// update user profile image. default user image size is 64 x 64

// update display name
export const useUpdateUserInfo = () => {
  const addMessageBars = useAddMessageBars();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (userInfo: { name?: string; color?: string }) => {
      try {
        if (userInfo.name) {
          await updateProfile(auth.currentUser!, {
            displayName: userInfo.name,
          });
        }

        // also need to update user display name in users collection
        const userDoc = doc(db, "users", auth.currentUser!.uid);
        const payload: { alias?: string; color?: string } = {};
        if (userInfo.name) {
          payload.alias = userInfo.name;
        }
        if (userInfo.color) {
          payload.color = userInfo.color;
        }
        await updateDoc(userDoc, payload);
      } catch (error) {
        addMessageBars([
          {
            id: new Date().toISOString(),
            message: "Error updating user info: " + error,
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
          message: "User info updated successfully",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: (error) => {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Error updating user info: " + error,
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });
  return { mutateAsync, isPending };
};
