import { onDocumentUpdated } from "firebase-functions/firestore";
import { HttpsError } from "firebase-functions/https";
import { addFriend } from "../helper/addFriend";

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
    }
    return { success: true };
  },
);
