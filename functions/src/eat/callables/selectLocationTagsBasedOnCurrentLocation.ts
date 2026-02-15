import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/https";
import genAI from "../../utils/genAIClient";

export const selectLocationTagsBasedOnCurrentLocation = onCall(
  {
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
      const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
                USER_CURRENT_LOCATION: "${cityAndState}"
                CURRENT_LOCATION_TAGS: ${JSON.stringify(locationTags)}
              `,
              },
            ],
          },
        ],
        config: {
          systemInstruction: `
            Task: Return all location tags from the CURRENT_LOCATION_TAGS that are in the 
            same metropolitan area as the USER_CURRENT_LOCATION.
          `,
          responseMimeType: "application/json",
          responseJsonSchema: schema,
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

const schema = {
  type: "object",
  properties: {
    locationTags: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["locationTags"],
};
