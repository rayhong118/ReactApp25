import admin from "firebase-admin";
import { onObjectFinalized } from "firebase-functions/storage";
import genAI from "../../utils/genAIClient";

export const handleMenuImageUpload = onObjectFinalized(
  "menuImages",
  async (event) => {
    // TODO: handle menu image upload

    // Get restaurant menu info regarding the image
    const restaurantId = event.data.metadata?.restaurantId;
    const uploadTime = event.data.metadata?.uploadTime;

    if (!restaurantId) {
      throw new Error("No restaurant ID found");
    }
    const menuImagesCollection = admin.firestore().collection("menu-images");
    const menuImageDocSnapshot = await menuImagesCollection
      .where("restaurantId", "==", restaurantId)
      // time comparison might fail. Need to fix this
      .where("createdAt", "==", uploadTime)
      .get();

    if (menuImageDocSnapshot.empty) {
      throw new Error("Menu not found");
    }
    const filePath = event.data.name;
    const bucketName = event.data.bucket;
    // 1. Acquire the file from Storage
    const bucket = admin.storage().bucket(bucketName);
    const file = bucket.file(filePath);
    const [fileBuffer] = await file.download();
    const base64Image = fileBuffer.toString("base64");

    // menu collection stores actual menu data. key is restaurantId
    const menuCollectionRef = admin.firestore().collection("menus");

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
    await menuDoc.set(menu);

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
    isAYCE: { type: "boolean" },
    categories: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                price: { type: "number" },
                description: { type: "string" },
              },
            },
          },
        },
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
      },
    },
  },
};
