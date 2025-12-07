import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useCallback } from "react";
import { auth, githubProvider, googleProvider } from "../../firebase";
import { useSetCurrentUser } from "./AuthenticationAtoms";

export function useFirebseSignUp() {
  return useCallback(async (email: string, password: string) => {
    try {
      // sign up only, do not set user credential state
      // user need to log in again
      await createUserWithEmailAndPassword(auth, email, password);

      alert("User Registered Successfully");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }, []);
}

export const useFirebaseSignIn = () => {
  // Implementation for sign in can be added here
  return useCallback(async (email: string, password: string) => {
    // Sign in logic goes here
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      alert("User Signed In Successfully");
      return userCredential;
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      return null;
    }
  }, []);
};

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
