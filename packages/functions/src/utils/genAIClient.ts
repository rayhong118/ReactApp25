// Initialize outside the function to reuse the instance

import { GoogleGenAI } from "@google/genai";

// In 2025, the new SDK expects an object { apiKey: ... }
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default genAI;
