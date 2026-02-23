import { GoogleGenAI } from "@google/genai";

let _genAI: GoogleGenAI | null = null;

/**
 * Lazy-initialized Gemini AI client.
 * This prevents the SDK from crashing if the API key is missing at startup.
 */
const genAI = {
  get models() {
    if (!_genAI) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "GEMINI_API_KEY is not set. " +
            "Local: Add it to packages/functions/.env. " +
            "Cloud: Run 'firebase functions:secrets:set GEMINI_API_KEY'.",
        );
      }
      _genAI = new GoogleGenAI({ apiKey });
    }
    return (_genAI as any).models;
  },
};

export default genAI;
