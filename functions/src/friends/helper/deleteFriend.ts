import * as admin from "firebase-admin";

/**
 * Helper function, not callable from client
 * Deletes a friend from a user and vice versa
 * @param user1Id - The ID of the first user
 * @param user2Id - The ID of the second user
 */
export const deleteFriend = async (user1Id: string, user2Id: string) => {
  const user1Ref = admin.firestore().collection("users").doc(user1Id);
  const user2Ref = admin.firestore().collection("users").doc(user2Id);

  const currentUser1Friends = await user1Ref
    .get()
    .then((doc) => doc.data()?.friends);
  const currentUser2Friends = await user2Ref
    .get()
    .then((doc) => doc.data()?.friends);

  if (!currentUser1Friends.includes(user2Id)) {
    throw new Error("User is not a friend");
  }
  if (!currentUser2Friends.includes(user1Id)) {
    throw new Error("User is not a friend");
  }

  await user1Ref.update({
    friends: currentUser1Friends.filter(
      (friendId: string) => friendId !== user2Id,
    ),
  });
  await user2Ref.update({
    friends: currentUser2Friends.filter(
      (friendId: string) => friendId !== user1Id,
    ),
  });
};
