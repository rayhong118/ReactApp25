import admin from "firebase-admin";
import { logger } from "firebase-functions";
import { onCall } from "firebase-functions/https";
import genAI from "../../utils/genAIClient";
import { responseJsonSchema } from "../triggers/handleMenuImageUpload";

const getMenuItemsFromURL = onCall(
  { cors: true, secrets: ["GEMINI_API_KEY"] },
  async (request) => {
    const { url, restaurantId } = request.data;
    if (!url) {
      throw new Error("URL is required");
    }

    const restaurantCollectionRef = admin.firestore().collection("restaurants");
    const menuCollectionRef = admin.firestore().collection("restaurant-menus");
    const restaurantDoc = restaurantCollectionRef.doc(restaurantId);
    const restaurantDocSnapshot = await restaurantDoc.get();

    if (!restaurantDocSnapshot.exists) {
      logger.error("Restaurant not found");
      throw new Error("Restaurant not found");
    }

    const restaurantData = restaurantDocSnapshot.data();
    if (!restaurantData) {
      logger.error("Restaurant data not found");
      throw new Error("Restaurant data not found");
    }

    logger.info("Restaurant data:", restaurantData);

    const prompt = `Extract menu data from this URL: ${url}. Follow the JSON schema provided.

RULES:
- Set "isAYCE" true for All-You-Can-Eat menus
- Provide both "en" and "zh" for all names (translate if only one language visible)
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

    if (!geminiResult.text) {
      throw new Error("No menu data found");
    }

    const menu = JSON.parse(geminiResult.text);

    if (menu.invalidMenuReason) {
      throw new Error(menu.invalidMenuReason);
    }

    // update menu collection
    const menuDoc = menuCollectionRef.doc(restaurantId);
    await menuDoc.set(menu, { merge: true });

    return menu;
  },
);

export { getMenuItemsFromURL };
