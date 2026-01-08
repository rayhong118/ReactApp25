import { HttpsError, onCall } from "firebase-functions/https";
import genAI from "../../utils/genAIClient";

export const generateSuggestionBasedOnUserPrompt = onCall(
  {
    secrets: ["GEMINI_API_KEY"],
    cors: true,
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
      and resonable pick, return reason only. The language of the response should 
      be in the same language as the user request.
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
