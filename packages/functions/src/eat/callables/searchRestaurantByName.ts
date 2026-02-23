import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/https";
import genAI from "../../utils/genAIClient";

// due to firebase does not allow partial name matching, we need to use callable function to search restaurant by name
export const searchRestaurantByName = onCall(
  {
    cors: true,
    secrets: ["GEMINI_API_KEY"],
  },
  async (request) => {
    const { name } = request.data;

    const restaurantCollectionRef = admin.firestore().collection("restaurants");

    const restaurantSnapshot = await restaurantCollectionRef.get();

    const restaurants = restaurantSnapshot.docs.map((doc) => doc.data());

    const restaurantData = restaurants.map((restaurant) => {
      return {
        name: restaurant.name,
        displayName: restaurant.displayName,
        id: restaurant.id,
      };
    });

    try {
      const prompt = `Task: Search for the restaurant with name or displayName matching: ${name}
      
      Return ONLY a JSON object: {"restaurantId": "string"}
      If no restaurant is found, return {"restaurantId": null}`;

      const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [prompt, JSON.stringify(restaurantData)],
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
        "Failed to generate recommendation." + error,
      );
    }
  },
);
