import { HttpsError, onCall } from "firebase-functions/v2/https";
import genAI from "../../utils/genAIClient";

export const generateNotesSummary = onCall(
  {
    cors: true,
    secrets: ["GEMINI_API_KEY"],
  },
  async (req, res) => {
    const notes = req.data?.notes;
    const restaurant = req.data?.restaurant;
    const language = req.data?.language || "en";

    if (!notes || notes.length === 0) {
      throw new HttpsError("invalid-argument", "No notes provided");
    }

    const result = await genAI.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              text: `Notes to summarize: ${JSON.stringify(notes)}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction:
          `Summarize notes for the restaurant "${restaurant.name}" in ${language}.\n\n` +
          "Formatting Rules:\n" +
          "- Use a Level 2 Heading (##) for the restaurant name.\n" +
          "- Use Level 3 Headings (###) for each summary category.\n" +
          "- Use bullet points (*) for details.\n" +
          "- Bold key terms like prices, wait times, or dish names.\n" +
          "- Use an emoji at the start of each category heading.",
      },
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
  },
);
