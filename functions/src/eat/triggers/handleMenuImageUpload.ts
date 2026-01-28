import admin from "firebase-admin";
import { logger } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/firestore";
import { File } from "@google-cloud/storage";
import genAI from "../../utils/genAIClient";

export const handleMenuImageUpload = onDocumentCreated(
  "menu-images/{menuImageDocId}",
  async (event) => {
    const menuImageDoc = event.data;
    if (!menuImageDoc) {
      logger.error("No menu image doc found");
      return;
    }
    const menuImageData = menuImageDoc.data();
    if (!menuImageData) {
      logger.error("No menu image data found");
      return;
    }
    const storagePaths = menuImageData.storagePaths;
    if (!storagePaths || storagePaths.length === 0) {
      logger.error("No storage paths found");
      return;
    }

    // Get restaurant menu info regarding the image
    const restaurantId = menuImageData.restaurantId;

    if (!restaurantId) {
      throw new Error("No restaurant ID found");
    }

    try {
      // 1. Acquire the files from Storage (using default bucket)
      const bucket = admin.storage().bucket();
      const files = storagePaths.map((path: string) => bucket.file(path));

      // Download all files
      const downloadPromises = files.map((file: File) => file.download());
      const downloadedFiles = await Promise.all(downloadPromises);
      const imageBuffers = downloadedFiles.map((response) => response[0]);

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

      // send images and prompt to genAI
      const imageParts = imageBuffers.map((buffer) => ({
        inlineData: {
          mimeType: "image/jpeg",
          data: buffer.toString("base64"),
        },
      }));

      const prompt = `Extract menu data from these images. Follow the JSON schema provided.

RULES:
- Set "isAYCE" true for All-You-Can-Eat menus
- Provide both "en" and "zh" for all names and descriptions (translate if only one language visible)
- Use snake_case for category keys (e.g., "hot_appetizers")
- Group similar items together
- If NOT a valid menu or wrong restaurant, set "invalidMenuReason" and return`;

      const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [prompt, ...imageParts, JSON.stringify(restaurantData)],
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
      await menuImageDoc.ref.update({
        status: "completed",
      });
    } catch (error) {
      logger.error(error);
      await menuImageDoc.ref.update({
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
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
