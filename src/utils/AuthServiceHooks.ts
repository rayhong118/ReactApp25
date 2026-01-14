import { useMutation, useQuery } from "@tanstack/react-query";
import {
  signInWithPopup,
  updateProfile,
  getAdditionalUserInfo,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, githubProvider, googleProvider } from "../firebase";
import { useSetCurrentUser } from "./AuthenticationAtoms";
import { useAddMessageBars } from "./MessageBarsAtom";

export const useFirebaseSignInWithGoogle = () => {
  const setCurrentUser = useSetCurrentUser();
  const addMessageBars = useAddMessageBars();
  const navigate = useNavigate();
  // Implementation for sign in with Google can be added here
  return useCallback(async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);

      setCurrentUser(userCredential.user);
      // Use this helper function to extract metadata
      const details = getAdditionalUserInfo(userCredential);

      if (details && details.isNewUser) {
        // update user display name in users collection
        const userDoc = doc(db, "users", userCredential.user.uid);
        await updateDoc(userDoc, {
          displayName: userCredential.user.displayName,
        });
      }

      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "User Signed In with Google Successfully",
          type: "success",
          autoDismiss: true,
        },
      ]);
      navigate("/settings");
      return userCredential;
    } catch (error) {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Error signing in with Google: " + error,
          type: "error",
          autoDismiss: true,
        },
      ]);
      return null;
    }
  }, [setCurrentUser]);
};

export const useFirebaseSignInWithGitHub = () => {
  const setCurrentUser = useSetCurrentUser();
  const addMessageBars = useAddMessageBars();
  const navigate = useNavigate();
  // Implementation for sign in with Google can be added here
  return useCallback(async () => {
    try {
      const userCredential = await signInWithPopup(auth, githubProvider);
      setCurrentUser(userCredential.user);

      const details = getAdditionalUserInfo(userCredential);
      if (details && details.isNewUser) {
        // update user display name in users collection
        const userDoc = doc(db, "users", userCredential.user.uid);
        await updateDoc(userDoc, {
          displayName: userCredential.user.displayName,
        });
      }

      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "User Signed In with GitHub Successfully",
          type: "success",
          autoDismiss: true,
        },
      ]);
      navigate("/settings");
      return userCredential;
    } catch (error) {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Error signing in with GitHub: " + error,
          type: "error",
          autoDismiss: true,
        },
      ]);
      return null;
    }
  }, [setCurrentUser]);
};

export const useSignOut = () => {
  const setCurrentUser = useSetCurrentUser();
  const addMessageBars = useAddMessageBars();
  const navigate = useNavigate();
  return useCallback(async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "User Signed Out Successfully",
          type: "success",
          autoDismiss: true,
        },
      ]);
      navigate("/auth");
    } catch (error) {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Error signing out: " + error,
          type: "error",
          autoDismiss: true,
        },
      ]);
    }
  }, [setCurrentUser]);
};

export const useUpdateDisplayName = () => {
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
          displayName: newName,
        });
      } catch (error) {
        addMessageBars([
          {
            id: new Date().toISOString(),
            message: "Error updating display name: " + error,
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
          message: "Display name updated successfully",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: (error) => {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Error updating display name: " + error,
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });
  return { mutateAsync, isPending };
};

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
