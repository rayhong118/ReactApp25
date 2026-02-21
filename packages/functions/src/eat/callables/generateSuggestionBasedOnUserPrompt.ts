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
        "Missing prompt or restaurant list.",
      );
    }

    try {
      // 2. Call the Model
      const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",

        contents: [
          { role: "user", parts: [{ text: userPrompt }] },
          {
            role: "user",
            parts: [
              { text: `RESTAURANT_CONTEXT: ${JSON.stringify(restaurants)}` },
            ],
          },
        ],
        config: {
          systemInstruction:
            "Pick the best restaurant from the list based on the user request and explain why. " +
            "If no clear pick, return a reason why. Response language MUST match user request language.",
          responseMimeType: "application/json",
          responseJsonSchema: schema, // Prevents JSON parse errors
          temperature: 0, // Makes the recommendation more consistent
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
        "Failed to generate recommendation." + error,
      );
    }
  },
);

// Define the schema for guaranteed structured output
const schema = {
  type: "object",
  properties: {
    restaurantId: { type: "string" },
    reason: { type: "string" },
  },
  required: ["reason"],
};
