import { signInWithPopup, getAdditionalUserInfo } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db, githubProvider, googleProvider } from "../../firebase";
import { useSetCurrentUser } from "./AuthenticationAtoms";
import { useAddMessageBars } from "../../utils/MessageBarsAtom";

export const useFirebaseSignInWithGoogle = () => {
  const setCurrentUser = useSetCurrentUser();
  const addMessageBars = useAddMessageBars();
  const navigate = useNavigate();
  // Implementation for sign in with Google can be added here
  return async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);

      setCurrentUser(userCredential.user);
      
      // Update/create user document in users collection. Initialize alias only on first login (registration)
      const details = getAdditionalUserInfo(userCredential);
      const isNewUser = details?.isNewUser;

      const userDoc = doc(db, "users", userCredential.user.uid);
      const userData: Record<string, any> = {
        email: userCredential.user.email || "",
      };

      if (isNewUser) {
        userData.alias =
          userCredential.user.displayName ||
          userCredential.user.email?.split("@")[0] ||
          "User";
      }

      await setDoc(userDoc, userData, { merge: true });

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
  };
};

export const useFirebaseSignInWithGitHub = () => {
  const setCurrentUser = useSetCurrentUser();
  const addMessageBars = useAddMessageBars();
  const navigate = useNavigate();
  // Implementation for sign in with Google can be added here
  return async () => {
    try {
      const userCredential = await signInWithPopup(auth, githubProvider);
      setCurrentUser(userCredential.user);

      // Update/create user document in users collection. Initialize alias only on first login (registration)
      const details = getAdditionalUserInfo(userCredential);
      const isNewUser = details?.isNewUser;

      const userDoc = doc(db, "users", userCredential.user.uid);
      const userData: Record<string, any> = {
        email: userCredential.user.email || "",
      };

      if (isNewUser) {
        userData.alias =
          userCredential.user.displayName ||
          userCredential.user.email?.split("@")[0] ||
          "User";
      }

      await setDoc(userDoc, userData, { merge: true });

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
  };
};

export const useSignOut = () => {
  const setCurrentUser = useSetCurrentUser();
  const addMessageBars = useAddMessageBars();
  const navigate = useNavigate();
  return async () => {
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
  };
};

export const useDeleteAccount = () => {
  const setCurrentUser = useSetCurrentUser();
  const addMessageBars = useAddMessageBars();
  const navigate = useNavigate();
  return async () => {
    try {
      await auth.currentUser?.delete();
      setCurrentUser(null);
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Account Deleted Successfully",
          type: "success",
          autoDismiss: true,
        },
      ]);
      navigate("/auth");
    } catch (error) {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Error deleting account: " + error,
          type: "error",
          autoDismiss: true,
        },
      ]);
    }
  };
};
