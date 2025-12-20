import { getAI, getGenerativeModel } from "firebase/ai";
import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { firebaseApiKey, googleReCaptchaSiteKey } from "./apikeys.ts";

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: "dogheadportal.firebaseapp.com",
  databaseURL: "https://dogheadportal.firebaseio.com",
  projectId: "dogheadportal",
  storageBucket: "dogheadportal.appspot.com",
  messagingSenderId: "978501106081",
  appId: "1:978501106081:web:490f0df9d7b02f41",
};

const app = initializeApp(firebaseConfig);
export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(googleReCaptchaSiteKey), // Use your Public Site Key
  isTokenAutoRefreshEnabled: true // Automatically refreshes the token in the background
});
export const ai = getAI(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const db = getFirestore(app);
export const geminiModel = getGenerativeModel(ai, { model: "gemini-2.5-flash" });
export const firebaseFunctions = getFunctions(app, "us-central1");
