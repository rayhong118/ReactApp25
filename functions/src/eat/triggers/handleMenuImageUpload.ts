import admin from "firebase-admin";
import { onObjectFinalized } from "firebase-functions/storage";
import genAI from "../../utils/genAIClient";

export const handleMenuImageUpload = onObjectFinalized(
  { secrets: ["GEMINI_API_KEY"] },
  async (event) => {
    // Filter to only process files in the menuImages folder
    const filePath = event.data.name;
    if (!filePath.startsWith("menuImages/")) {
      console.log(`Ignoring file outside menuImages folder: ${filePath}`);
      return;
    }

    // Get restaurant menu info regarding the image
    const restaurantId = event.data.metadata?.restaurantId;
    // const uploadTime = event.data.metadata?.uploadTime;

    if (!restaurantId) {
      throw new Error("No restaurant ID found");
    }
    const menuImagesCollection = admin.firestore().collection("menu-images");
    const menuImageDocSnapshot = await menuImagesCollection
      .where("restaurantId", "==", restaurantId)
      // time comparison might fail. Need to fix this
      // .where("createdAt", "==", uploadTime)
      .get();

    if (menuImageDocSnapshot.empty) {
      throw new Error("Menu not found");
    }
    // 1. Acquire the file from Storage (using default bucket)
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);
    const [fileBuffer] = await file.download();
    const base64Image = fileBuffer.toString("base64");

    // menu collection stores actual menu data. key is restaurantId
    const menuCollectionRef = admin.firestore().collection("restaurant-menus");

    // send image and prompt to genAI
    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image,
      },
    };

    const prompt = `Extract menu data from this image and return structured JSON.

INSTRUCTIONS:
1. AYCE Detection: Set "isAYCE" to true if this is an All-You-Can-Eat menu, false otherwise.

2. AYCE Pricing (if applicable): Extract pricing tiers into "aycePrices" array with:
   - price: numeric value
   - timePeriod: "Lunch", "Dinner", "Weekend", "Happy Hour", etc.
   - additionalInfo: any restrictions or notes (optional)

3. Categories: Organize items by category (e.g., "appetizers", "main_course", "desserts").
   - Each category MUST have:
     * name: object with "en" (English) and "zh" (Chinese) translations
     * items: array of menu items
   - Use lowercase snake_case for category keys (e.g., "hot_appetizers")

4. Menu Items: For each item, extract:
   - name: object with "en" and "zh" translations
   - price: number or string (use "Market Price" if price varies)
   - description: brief description if available (optional)

IMPORTANT:
- Extract both English and Chinese names when visible
- If only one language is present, translate it to populate the other field
  (e.g., if only English is shown, provide a Chinese translation and vice versa)
- Group similar items logically (e.g., all sushi rolls together)
- Return valid JSON matching the provided schema`;

    const result = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [prompt, imagePart],
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: responseJsonSchema,
      },
    });

    // handle result
    const menuData = result.text;
    if (!menuData) {
      throw new Error("Menu data not found");
    }
    const menu = JSON.parse(menuData);

    // update menu collection
    const menuDoc = menuCollectionRef.doc(restaurantId);
    await menuDoc.set(menu, { merge: true });

    // update menu image collection
    const menuImageDoc = menuImagesCollection.doc(
      menuImageDocSnapshot.docs[0].id
    );
    await menuImageDoc.update({
      menuStatus: "completed",
    });
  }
);

const responseJsonSchema = {
  $defs: {
    // reusable menu item schema
    menuItem: {
      type: "object",
      properties: {
        name: {
          type: "object",
          properties: {
            en: { type: "string" },
            zh: { type: "string" },
          },
          required: ["en", "zh"],
        },
        description: { type: "string" },
        price: { anyOf: [{ type: "number" }, { type: "string" }] },
      },
      required: ["name"],
    },
  },
  type: "object",
  // schema main body
  properties: {
    isAYCE: { type: "boolean" },
    categories: {
      type: "object",
      // Each property key is a category identifier
      // Each property value is an object with localized name and items array
      additionalProperties: {
        type: "object",
        properties: {
          name: {
            type: "object",
            properties: {
              en: { type: "string" },
              zh: { type: "string" },
            },
            required: ["en", "zh"],
          },
          items: {
            type: "array",
            items: { $ref: "#/$defs/menuItem" },
          },
        },
        required: ["name", "items"],
      },
    },
    aycePrices: {
      type: "array",
      items: {
        type: "object",
        properties: {
          price: { type: "number" },
          timePeriod: { type: "string" },
          additionalInfo: { type: "string" },
        },
        required: ["price", "timePeriod"],
      },
    },
  },
  required: ["isAYCE", "categories"],
};
