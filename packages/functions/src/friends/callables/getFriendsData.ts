import * as admin from "firebase-admin";
import { logger } from "firebase-functions";
import { HttpsError, onCall } from "firebase-functions/https";

export const getFriendsData = onCall(
  {
    cors: true,
  },
  async (req) => {
    const userId = req.auth?.uid;
    if (!userId) {
      throw new HttpsError("invalid-argument", "No user ID provided");
    }
    const userDoc = await admin.firestore().doc(`users/${userId}`).get();
    const friendIds: string[] = userDoc.data()?.friendIds || [];
    if (friendIds.length > 0) {
      const usersRef = admin.firestore().collection("users");
      const userRefs = friendIds.map((id) => usersRef.doc(id));
      const userSnaps = await admin.firestore().getAll(...userRefs);

      const result = userSnaps
        .filter((doc) => doc.exists)
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      logger.info("result", result);
      return result;
    }
    return [];
  },
);
