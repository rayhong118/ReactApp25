import { setGlobalOptions } from "firebase-functions";

import * as admin from "firebase-admin";
import { onInit } from "firebase-functions/v2";

setGlobalOptions({ maxInstances: 10, region: "us-west2" });

onInit(() => {
  // This code runs only in the production env during cold starts.
  admin.initializeApp();
  console.log("Firebase Admin initialized via onInit");
});

export { verifyRecaptcha } from "./reCaptcha/reCaptcha";

export * from "./eat";
export * from "./friends";
