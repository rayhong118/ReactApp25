import { onDocumentUpdated } from "firebase-functions/firestore";
import { HttpsError } from "firebase-functions/https";
import { addFriend } from "../helper/addFriend";
import admin from "firebase-admin";

// probably not correct, this should be a triggered function that runs
// on friend request doc change
export const handleFriendRequestUpdate = onDocumentUpdated(
  "friend-requests/{friendRequestId}",
  async (event) => {
    const { user1Id, user2Id, status } = event.data?.after.data() || {};
    if (!user1Id || !user2Id) {
      throw new HttpsError("invalid-argument", "No user ID provided");
    }
    if (status === "accepted") {
      await addFriend(user1Id, user2Id);
      // once request is accepted, delete the request
      await event.data?.after.ref.delete();
    } else if (status === "rejected") {
      // once request is rejected, delete the request
      await event.data?.after.ref.delete();
    } else {
      return;
    }

    // for both users, add a system notification
    const usersCollectionRef = admin.firestore().collection("users");
    const user1Doc = usersCollectionRef.doc(user1Id);
    const user2Doc = usersCollectionRef.doc(user2Id);
    await user1Doc.update({
      notifications: admin.firestore.FieldValue.arrayUnion({
        message: `Friend request ${status}`,
        type: "friend-request-accepted",
        isRead: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }),
    });
    await user2Doc.update({
      notifications: admin.firestore.FieldValue.arrayUnion({
        message: `Friend request ${status}`,
        type: "friend-request-accepted",
        isRead: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }),
    });
    return { success: true };
  },
);
