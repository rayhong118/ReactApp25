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

    const prompt = `
    Read this menu image and return a JSON list of all menu items. 
    Analyze this menu image.

    1. Determine if this is an 'All You Can Eat' (AYCE) menu.
    2. Extract a JSON object containing the pricing tiers.
    3. Map out the different prices based on time or day (e.g., Lunch vs. Dinner, Weekday vs. Weekend).
    4. List all food categories and items.
    For each item, include the 'name', 'price', and a short 'description' if available. 
    Group them by their category (e.g., Appetizers, Main Course).
    `;

    const result = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [prompt, imagePart],
      config: {
        responseMimeType: "application/json",
        responseSchema,
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

const responseSchema = {
  type: "object",
  properties: {
    restaurantId: {
      type: "string",
      description: "The unique ID of the restaurant",
    },
    isAYCE: {
      type: "boolean",
      description: "True if the menu is an 'All You Can Eat' buffet style",
    },
    categories: {
      type: "object",
      description:
        "A map where keys are category names (e.g. 'Appetizers') and values are lists of items",
      // This implements {[categoryName: string]: IMenuItem[]}
      additionalProperties: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              en: { type: "string" },
              zh: { type: "string" },
            },
            description: { type: "string" },
            price: {
              // Implements number | string
              anyOf: [{ type: "number" }, { type: "string" }],
              description: "Numeric price or string like 'Market Price'",
            },
          },
          required: ["name"],
        },
      },
    },
    aycePrices: {
      type: "array",
      items: {
        type: "object",
        properties: {
          price: { type: "number" },
          timePeriod: {
            type: "string",
            description: "e.g., 'Lunch', 'Dinner', 'Weekend'",
          },
          additionalInfo: { type: "string" },
        },
        required: ["price", "timePeriod"],
      },
    },
  },
  required: ["restaurantId", "categories", "isAYCE"],
};
