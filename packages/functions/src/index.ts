// 1. THIS MUST BE THE VERY FIRST LINE
import "./config";

// 2. Now import your other dependencies
import * as admin from "firebase-admin";
import { onInit } from "firebase-functions/v2";

// 3. Initialize Admin
onInit(() => {
  admin.initializeApp();
  console.log("Firebase Admin initialized via onInit");
});

// 4. Export your functions (these will now evaluate AFTER config.ts)
export { verifyRecaptcha } from "./reCaptcha/reCaptcha";
export * from "./eat";
export * from "./friends";
