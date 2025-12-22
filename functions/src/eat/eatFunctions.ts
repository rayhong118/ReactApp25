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
      console.error("Gemini Logic Error:", error);
      throw new HttpsError("internal", "Failed to generate recommendation.");
    }
  }
);

// On user submit of a restaurant rating, calculate the average rating
// and update the restaurant document
export const handleRestaurantRatingSubmit = onDocumentWritten(
  "user-restaurant-ratings/{userId}",
  async (event) => {
    // Get current rating and previous rating
    // Get restaurant ratings
    // Update restaurant ratings

    const afterData = event.data?.after.data();
    const beforeData = event.data?.before.data();

    const restaurantId = Object.keys(afterData || {})[0];
    const beforeRating = beforeData?.[restaurantId] || 0;
    const afterRating = afterData?.[restaurantId] || 0;

    const restaurantStarsRef = await admin
      .firestore()
      .doc(`restaurants/${restaurantId}`)
      .get();

    const updatePayload = {
      stars: {
        ...restaurantStarsRef.data()?.stars,
        [afterRating]: admin.firestore.FieldValue.increment(1),
      },
    };
    if (beforeRating) {
      updatePayload.stars[beforeRating] =
        admin.firestore.FieldValue.increment(-1);
    }

    if (!restaurantStarsRef.exists) {
      await restaurantStarsRef.ref.set(updatePayload);
    }
    await restaurantStarsRef.ref.update(updatePayload);
    return { success: true };
  }
);
