import { onCall } from "firebase-functions/v2/https";
import { HttpsError } from "firebase-functions/v2/https";
import admin from "firebase-admin";

export const getFriendRequests = onCall(async (request) => {
  const currentUserId = request.auth?.uid;
  if (!currentUserId) {
    throw new HttpsError("unauthenticated", "User not authenticated");
  }
  const friendRequestsCollectionRef = admin
    .firestore()
    .collection("friend-requests");
  const senderQuery = friendRequestsCollectionRef.where(
    "senderId",
    "==",
    currentUserId,
  );
  const receiverQuery = friendRequestsCollectionRef.where(
    "receiverId",
    "==",
    currentUserId,
  );
  const senderSnapshot = await senderQuery.get();
  const receiverSnapshot = await receiverQuery.get();
  const sentRequests = senderSnapshot.docs.map((doc) => doc.data());
  const receivedRequests = receiverSnapshot.docs.map((doc) => doc.data());
  return { sentRequests, receivedRequests };
});
