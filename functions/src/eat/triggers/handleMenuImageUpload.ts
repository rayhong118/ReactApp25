import admin from "firebase-admin";
import { logger } from "firebase-functions";
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
    // Parse uploadTime with fallback to current time
    const rawUploadTime = event.data.metadata?.uploadTime;
    const parsedTime = rawUploadTime ? parseInt(rawUploadTime) : Date.now();
    const uploadDate = new Date(isNaN(parsedTime) ? Date.now() : parsedTime);

    if (!restaurantId) {
      throw new Error("No restaurant ID found");
    }

    // TODO: Create image info with status "pending".
    const menuImagesCollection = admin.firestore().collection("menu-images");
    const menuImageDoc = menuImagesCollection.doc();
    await menuImageDoc.create({
      restaurantId,
      uploadTime: uploadDate,
      status: "pending",
    });
    try {
      // 1. Acquire the file from Storage (using default bucket)
      const bucket = admin.storage().bucket();
      const file = bucket.file(filePath);
      const [fileBuffer] = await file.download();
      const base64Image = fileBuffer.toString("base64");

      // menu collection stores actual menu data. key is restaurantId
      const menuCollectionRef = admin
        .firestore()
        .collection("restaurant-menus");

      const restaurantCollectionRef = admin
        .firestore()
        .collection("restaurants");

      logger.info("Restaurant ID:", restaurantId);

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

      // send image and prompt to genAI
      const imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      };

      const prompt = `Extract menu data from this image. Follow the JSON schema provided.

RULES:
- Set "isAYCE" true for All-You-Can-Eat menus
- Provide both "en" and "zh" for all names and descriptions (translate if only one language visible)
- Use snake_case for category keys (e.g., "hot_appetizers")
- Group similar items together
- If NOT a valid menu or wrong restaurant, set "invalidMenuReason" and return`;

      const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [prompt, imagePart, JSON.stringify(restaurantData)],
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: responseJsonSchema,
        },
      });

      logger.info("Menu data:", result.text);

      // handle result
      const menuData = result.text;
      if (!menuData) {
        throw new Error("Menu data not found");
      }
      const menu = JSON.parse(menuData);

      if (menu.invalidMenuReason) {
        throw new Error(menu.invalidMenuReason);
      }

      // update menu collection
      const menuDoc = menuCollectionRef.doc(restaurantId);
      await menuDoc.set(menu, { merge: true });

      // update menu image collection
      await menuImageDoc.update({
        status: "completed",
      });
    } catch (error) {
      logger.error(error);
      await menuImageDoc.update({
        status: "failed",
        error: error,
      });
      throw error;
    }
  },
);

export const responseJsonSchema = {
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
        description: {
          type: "object",
          properties: {
            en: { type: "string" },
            zh: { type: "string" },
          },
          required: ["en", "zh"],
        },
        price: { anyOf: [{ type: "number" }, { type: "string" }] },
      },
      required: ["name"],
    },
  },
  type: "object",
  // schema main body
  properties: {
    invalidMenuReason: {
      type: "string",
      description:
        "Explain why the image is not a valid menu (e.g. 'not a menu', 'wrong restaurant')",
    },
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
