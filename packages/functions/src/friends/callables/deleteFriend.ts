import { HttpsError, onCall } from "firebase-functions/https";
import { deleteFriend } from "../helper/deleteFriend";

export const deleteFriendCallable = onCall({ cors: true }, async (request) => {
  const user1Id = request.auth?.uid;
  const user2Id = request.data.friendId;
  if (!user1Id || !user2Id) {
    throw new HttpsError("invalid-argument", "No user ID provided");
  }
  await deleteFriend(user1Id, user2Id);
  return { success: true };
});
