// update restaurant stars

import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/https";

// called when user rates a restaurant
export const updateRestaurantStars = onCall(
  {
    cors: true,
  },
  async (request) => {
    const { restaurantId, oldRating, newRating } = request.data;

    const restaurantRef = admin.firestore().doc(`restaurants/${restaurantId}`);

    const updatedStars = oldRating
      ? {
        [oldRating]: admin.firestore.FieldValue.increment(-1),
        [newRating]: admin.firestore.FieldValue.increment(1),
      }
      : {
        [newRating]: admin.firestore.FieldValue.increment(1),
      };

    await restaurantRef.set({ stars: updatedStars }, { merge: true });

    return { success: true };
  }
);
