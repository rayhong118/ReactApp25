import admin from "firebase-admin";
import { onDocumentUpdated } from "firebase-functions/firestore";
import { addFriend } from "../helper/addFriend";

// probably not correct, this should be a triggered function that runs
// on friend request doc change
export const handleFriendRequestUpdate = onDocumentUpdated(
  "friend-requests/{friendRequestId}",
  async (event) => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    if (!afterData) return;

    const { senderId, receiverId, status } = afterData;
    const oldStatus = beforeData?.status;

    // Only proceed if status has changed
    if (status === oldStatus) return;

    if (!senderId || !receiverId) {
      console.warn("Missing senderId or receiverId in friend request update", {
        senderId,
        receiverId,
      });
      return;
    }

    if (status === "accepted") {
      await addFriend(senderId, receiverId);
      // Once request is accepted, delete it to keep clean
      await event.data?.after.ref.delete();
    } else if (status === "rejected") {
      // Once request is rejected, keep it until sender manually deleted the request
      return;
    } else {
      return;
    }

    // Optional: add system notifications for both users
    const usersCollectionRef = admin.firestore().collection("users");
    const notification = {
      message: `Friend request ${status}`,
      type: `friend-request-${status}`,
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const batch = admin.firestore().batch();
    batch.update(usersCollectionRef.doc(senderId), {
      notifications: admin.firestore.FieldValue.arrayUnion(notification),
    });
    batch.update(usersCollectionRef.doc(receiverId), {
      notifications: admin.firestore.FieldValue.arrayUnion(notification),
    });

    await batch.commit();

    return { success: true };
  },
);
