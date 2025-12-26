import { signInWithPopup } from "firebase/auth";
import { useCallback } from "react";
import { auth, githubProvider, googleProvider } from "../firebase";
import { useSetCurrentUser } from "./AuthenticationAtoms";

export const useFirebaseSignInWithGoogle = () => {
  const setCurrentUser = useSetCurrentUser();
  // Implementation for sign in with Google can be added here
  return useCallback(async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      alert("User Signed In with Google Successfully");
      setCurrentUser(userCredential.user);
      return userCredential;
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      return null;
    }
  }, [setCurrentUser]);
};

export const useFirebaseSignInWithGitHub = () => {
  const setCurrentUser = useSetCurrentUser();
  // Implementation for sign in with Google can be added here
  return useCallback(async () => {
    try {
      const userCredential = await signInWithPopup(auth, githubProvider);
      alert("User Signed In with GitHub Successfully");
      setCurrentUser(userCredential.user);

      return userCredential;
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      return null;
    }
  }, [setCurrentUser]);
};

export const useSignOut = () => {
  const setCurrentUser = useSetCurrentUser();
  return useCallback(async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      alert("User Signed Out Successfully");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }, [setCurrentUser]);
};
