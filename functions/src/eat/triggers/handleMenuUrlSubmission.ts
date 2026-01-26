import admin from "firebase-admin";
import { logger } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import genAI from "../../utils/genAIClient";
import { responseJsonSchema } from "./handleMenuImageUpload";

/**
 * Firestore trigger that processes menu URL submissions in the background.
 * This runs when a new document is created in menu-url-submissions collection.
 */
export const handleMenuUrlSubmission = onDocumentCreated(
  {
    document: "menu-url-submissions/{submissionId}",
    secrets: ["GEMINI_API_KEY"],
    timeoutSeconds: 300, // 5 minutes for AI processing
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.error("No data associated with the event");
      return;
    }

    const data = snapshot.data();
    const { url, restaurantId } = data;
    const submissionId = event.params.submissionId;

    logger.info(`Processing menu URL submission: ${submissionId}`);

    try {
      // Get restaurant data
      const restaurantDoc = await admin
        .firestore()
        .collection("restaurants")
        .doc(restaurantId)
        .get();

      if (!restaurantDoc.exists) {
        throw new Error("Restaurant not found");
      }

      const restaurantData = restaurantDoc.data();
      if (!restaurantData) {
        throw new Error("Restaurant data not found");
      }

      logger.info("Restaurant data:", restaurantData);

      const prompt = `Extract menu data from this URL: ${url}. Follow the JSON schema provided.

RULES:
- Set "isAYCE" true for All-You-Can-Eat menus
- Provide both "en" and "zh" for all names and descriptions (translate if only one language visible)
- Use snake_case for category keys (e.g., "hot_appetizers")
- Group similar items together
- If NOT a valid menu or wrong restaurant, set "invalidMenuReason" and return`;

      const geminiResult = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [prompt, JSON.stringify(restaurantData)],
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: responseJsonSchema,
          tools: [{ urlContext: {} }],
        },
      });

      logger.info("Menu data:", geminiResult.text);

      if (!geminiResult.text) {
        throw new Error("No menu data found");
      }

      const menu = JSON.parse(geminiResult.text);

      if (menu.invalidMenuReason) {
        throw new Error(menu.invalidMenuReason);
      }

      // Update menu collection
      await admin
        .firestore()
        .collection("restaurant-menus")
        .doc(restaurantId)
        .set(menu, { merge: true });

      // Mark submission as completed
      await snapshot.ref.update({
        status: "completed",
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      logger.info(`Menu URL submission ${submissionId} completed successfully`);
    } catch (error) {
      logger.error(`Menu URL submission ${submissionId} failed:`, error);

      // Mark submission as failed
      await snapshot.ref.update({
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
        failedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  },
);
