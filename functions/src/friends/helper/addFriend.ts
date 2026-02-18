import * as admin from "firebase-admin";

/**
 * Helper function, not callable from client
 * Adds a friend to a user and vice versa
 * @param user1Id - The ID of the first user
 * @param user2Id - The ID of the second user
 */
export const addFriend = async (user1Id: string, user2Id: string) => {
  const db = admin.firestore();
  const user1Ref = db.collection("users").doc(user1Id);
  const user2Ref = db.collection("users").doc(user2Id);

  await db.runTransaction(async (transaction) => {
    const user1Doc = await transaction.get(user1Ref);
    const user2Doc = await transaction.get(user2Ref);

    if (!user1Doc.exists || !user2Doc.exists) {
      throw new Error("One or both users do not exist");
    }

    const friends1 = user1Doc.data()?.friendIds || [];
    const friends2 = user2Doc.data()?.friendIds || [];

    // Check if already friends to avoid duplicates
    if (friends1.includes(user2Id) && friends2.includes(user1Id)) {
      return;
    }

    transaction.update(user1Ref, {
      friendIds: admin.firestore.FieldValue.arrayUnion(user2Id),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    transaction.update(user2Ref, {
      friendIds: admin.firestore.FieldValue.arrayUnion(user1Id),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
};
