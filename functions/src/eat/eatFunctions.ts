import { GoogleGenerativeAI } from "@google/generative-ai";
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { onCall } from "firebase-functions/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";

// on restaurant document creation, add cityAndState to cityAndStateList
// handle count of restaurants per cityAndState on document creation, deletion and update
export const handleRestaurantLocationTags = onDocumentWritten("restaurants/{cityAndState}", async (event) => {
  const change = event.data;

  const beforeTag = change?.before.data()?.cityAndState;
  const afterTag = change?.after.data()?.cityAndState;

  // check cityAndStateList for cityAndState
  const locationTagsCollectionRef = admin.firestore().collection('restaurant-location-tags');
  
  if (!afterTag && !beforeTag) return; // Handle cases where cityAndState might be missing

  // Logic for afterTag (addition or update to new value)
  if (afterTag) {
    const afterTagSnapshot = await locationTagsCollectionRef.where('value', '==', afterTag).get();
    if (afterTagSnapshot.empty) {
      // Tag doesn't exist, create it
      await locationTagsCollectionRef.doc(afterTag).set({ value: afterTag, count: 1 });
    } else {
      // Tag exists
      if (beforeTag !== afterTag) {
        // Only increment if it's a new tag for this doc (change or creation)
        await afterTagSnapshot.docs[0].ref.update({ count: FieldValue.increment(1) });
      }
    }
  }

  // Logic for beforeTag (deletion or update from old value)
  if (beforeTag && beforeTag !== afterTag) {
    const beforeTagSnapshot = await locationTagsCollectionRef.where('value', '==', beforeTag).get();
    if (!beforeTagSnapshot.empty) {
      // decrement count for beforeTag using the found document reference
      await beforeTagSnapshot.docs[0].ref.update({ count: FieldValue.increment(-1) });
    }
  }
});


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateSuggestionBasedOnUserPrompt = onCall({
  secrets: ["GEMINI_API_KEY"], // Function now has access to process.env.GEMINI_API_KEY
  cors: true,
}, async (req) => {
  // TODO: besides user prompt, also pass in user current location?
  const { userPrompt, restaurants } = req.data;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    // System instructions keep the logic separate from the user input
    systemInstruction: "You have access to a list of restaurants collected by app users. Select the best restaurant from the context. Return ONLY JSON: { 'restaurantId': string, 'reason': string }",
  });

  const prompt = `
    USER_REQUEST: "${userPrompt}"
    RESTAURANT_LIST: ${JSON.stringify(restaurants)}
  `;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" } // Force JSON mode
  });

  return JSON.parse(result.response.text());
})