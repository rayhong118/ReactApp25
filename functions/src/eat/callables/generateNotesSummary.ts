import { onCall } from "firebase-functions/v2/https";
import genAI from "../../utils/genAIClient";
import { HttpsError } from "firebase-functions/v2/https";

export const generateNotesSummary = onCall(
  {
    secrets: ["GEMINI_API_KEY"],
    cors: true,
    region: "us-central1",
  },
  async (req) => {
    const notes = req.data?.notes;

    if (!notes || notes.length === 0) {
      throw new HttpsError("invalid-argument", "No notes provided");
    }
    const prompt = `Notes: ${JSON.stringify(notes)}
    Task: Generate a summary of the notes.`;
    const result = await genAI.models.generateContentStream({
      model: "gemini-3-flash",
      contents: [{ parts: [{ text: prompt }] }],
    });

    return (async function* () {
      for await (const chunk of result) {
        yield chunk.text;
      }
    })();
  }
);
