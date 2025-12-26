import { GoogleGenAI } from "@google/genai";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";

// on restaurant document creation, add cityAndState to cityAndStateList
// handle count of restaurants per cityAndState on document creation,
// deletion and update
export const handleRestaurantLocationTags = onDocumentWritten(
  "restaurants/{restaurantId}",
  async (event) => {
    const change = event.data;

    const beforeTag = change?.before.data()?.cityAndState;
    const afterTag = change?.after.data()?.cityAndState;

    // check cityAndStateList for cityAndState
    const locationTagsCollectionRef = admin
      .firestore()
      .collection("restaurant-location-tags");

    if (!afterTag && !beforeTag) return;
    // Handle cases where cityAndState might be missing

    // Logic for afterTag (addition or update to new value)
    if (afterTag) {
      const afterTagSnapshot = await locationTagsCollectionRef
        .where("value", "==", afterTag)
        .get();
      if (afterTagSnapshot.empty) {
        // Tag doesn't exist, create it
        await locationTagsCollectionRef
          .doc(afterTag)
          .set({ value: afterTag, count: 1 });
      } else {
        // Tag exists
        if (beforeTag !== afterTag) {
          // Only increment if it's a new tag for this doc (change or creation)
          await afterTagSnapshot.docs[0].ref.update({
            count: FieldValue.increment(1),
          });
        }
      }
    }

    // Logic for beforeTag (deletion or update from old value)
    if (beforeTag && beforeTag !== afterTag) {
      const beforeTagSnapshot = await locationTagsCollectionRef
        .where("value", "==", beforeTag)
        .get();
      if (!beforeTagSnapshot.empty) {
        // decrement count for beforeTag using the found document reference
        await beforeTagSnapshot.docs[0].ref.update({
          count: FieldValue.increment(-1),
        });
      }
    }
  }
);

interface IStarRating {
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

// Initialize outside the function to reuse the instance
// In 2025, the new SDK expects an object { apiKey: ... }
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateSuggestionBasedOnUserPrompt = onCall(
  {
    secrets: ["GEMINI_API_KEY"],
    cors: true,
    region: "us-central1",
  },
  async (request) => {
    // 1. Data Validation
    const { userPrompt, restaurants } = request.data;

    if (!userPrompt || !restaurants) {
      throw new HttpsError(
        "invalid-argument",
        "Missing prompt or restaurant list."
      );
    }

    try {
      const prompt = `
      USER_REQUEST: "${userPrompt}"
      RESTAURANT_LIST: ${JSON.stringify(restaurants)}
      
      Task: Pick the best restaurant and explain why. If you don't have a clear 
      and resonable pick, return reason only.
      Return ONLY a JSON object: {"restaurantId": "string", "reason": "string"}
    `;

      // 2. Call the Model
      const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
        },
      });

      // 3. Proper Response Handling
      const rawResponse = result.text;

      if (!rawResponse) {
        throw new HttpsError("internal", "Gemini returned an empty response.");
      }

      return JSON.parse(rawResponse);
    } catch (error) {
      throw new HttpsError(
        "internal",
        "Failed to generate recommendation." + error
      );
    }
  }
);

// update restaurant stars
// called when user rates a restaurant
export const updateRestaurantStars = onCall(
  {
    region: "us-central1",
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

export const selectLocationTagsBasedOnCurrentLocation = onCall(
  {
    region: "us-central1",
    cors: true,
    secrets: ["GEMINI_API_KEY"],
  },
  async (request) => {
    const { cityAndState } = request.data;

    const locationTagsCollectionRef = admin
      .firestore()
      .collection("restaurant-location-tags");

    const locationTagsSnapshot = await locationTagsCollectionRef.get();

    const locationTags = locationTagsSnapshot.docs.map((doc) => doc.data());

    try {
      const prompt = `
      USER_CURRENT_LOCATION: "${cityAndState}"
      CURRENT_LOCATION_TAGS: ${JSON.stringify(locationTags)}
      
      Task: Return all location tags from the CURRENT_LOCATION_TAGS that are in the 
      same metropolitan area as the USER_CURRENT_LOCATION.
      Return ONLY a JSON object: {"locationTags": "string[]"}
    `;

      const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
        },
      });

      const rawResponse = result.text;

      if (!rawResponse) {
        throw new HttpsError("internal", "Gemini returned an empty response.");
      }

      return JSON.parse(rawResponse);
    } catch (error) {
      throw new HttpsError(
        "internal",
        "Failed to generate recommendation." + error
      );
    }
  }
);
