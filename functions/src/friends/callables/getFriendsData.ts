import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/https";

export const getFriendsData = onCall(
  {
    cors: true,
  },
  async (req) => {
    const userId = req.data?.userId;
    if (!userId) {
      throw new HttpsError("invalid-argument", "No user ID provided");
    }
    const friendsRef = admin.firestore().collection(`users/${userId}/friends`);
    const friendsDocSnap = await friendsRef.get();
    if (friendsDocSnap.docs.length > 0) {
      return friendsDocSnap.docs.map((doc) => doc.data());
    }
    return null;
  },
);
