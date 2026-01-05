import { HttpsError, onCall } from "firebase-functions/v2/https";
import genAI from "../../utils/genAIClient";

export const generateNotesSummary = onCall(
  {
    secrets: ["GEMINI_API_KEY"],
    cors: true,
    region: "us-central1",
  },
  async (req, res) => {
    const notes = req.data?.notes;
    const restaurant = req.data?.restaurant;
    const language = req.data?.language || "en";

    if (!notes || notes.length === 0) {
      throw new HttpsError("invalid-argument", "No notes provided");
    }
    const prompt = `
    Task: Summarize notes for the restaurant "${
      restaurant.name
    }" in ${language}.
  
    Formatting Rules:
    - Use a Level 2 Heading (##) for the restaurant name.
    - Use Level 3 Headings (###) for each summary category.
    - Use bullet points (*) for details.
    - Bold key terms like prices, wait times, or dish names.
    - Use an emoji at the start of each category heading.

    Notes to summarize: ${JSON.stringify(notes)}`;
    const result = await genAI.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
    });

    let fullText = "";

    // Iterate through the AI stream
    for await (const chunk of result) {
      const chunkText = chunk.text || "";
      fullText += chunkText;

      // Check if client supports streaming, then send the chunk
      if (req.acceptsStreaming) {
        res?.sendChunk(chunkText);
      }
    }

    // You MUST return the final result for non-streaming clients
    // and to officially "end" the function.
    return fullText;
  }
);
