import * as admin from "firebase-admin";
import { onDocumentWritten } from "firebase-functions/firestore";

export interface IStarRating {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

// update restaurant average rating
// called when restaurant document is updated
export const updateRestaurantAverageRating = onDocumentWritten(
  "restaurants/{restaurantId}",
  async (event) => {
    const restaurantId = event.params.restaurantId;
    const change = event.data;
    if (!change) return;

    if (
      JSON.stringify(change.before.data()) ===
      JSON.stringify(change.after.data())
    )
      return;

    const afterStars: Partial<IStarRating> = change?.after.data()?.stars;

    const starRatingCount: number = Object.values(afterStars || {}).reduce(
      (acc, count) => acc + count,
      0
    );

    if (!starRatingCount) return;

    const newAverageRating: number =
      Object.entries(afterStars || {}).reduce(
        (acc, [rating, count]) => acc + Number(rating) * count,
        0
      ) / starRatingCount || 0;

    const newAverageRatingString = newAverageRating.toFixed(1);
    const restaurantRef = admin.firestore().doc(`restaurants/${restaurantId}`);
    await restaurantRef.set(
      { averageStars: newAverageRatingString, starRatingCount },
      { merge: true }
    );

    return { success: true };
  }
);
