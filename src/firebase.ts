import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { firebaseApiKey } from "./apikeys.ts";

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
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const db = getFirestore(app);
