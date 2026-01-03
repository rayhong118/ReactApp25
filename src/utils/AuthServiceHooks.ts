import { signInWithPopup } from "firebase/auth";
import { useCallback } from "react";
import { auth, githubProvider, googleProvider } from "../firebase";
import { useSetCurrentUser } from "./AuthenticationAtoms";
import { useAddMessageBars } from "./MessageBarsAtom";
import { useNavigate } from "react-router-dom";

export const useFirebaseSignInWithGoogle = () => {
  const setCurrentUser = useSetCurrentUser();
  const addMessageBars = useAddMessageBars();
  const navigate = useNavigate();
  // Implementation for sign in with Google can be added here
  return useCallback(async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);

      setCurrentUser(userCredential.user);
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
