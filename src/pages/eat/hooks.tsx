// React hooks for eat page

// add firebase database hooks

import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export const getRestaurants = async () => {
  const querySnapshot = await getDocs(collection(db, "restaurants"));
  const restaurants = querySnapshot.docs.map((doc) => doc.data());
  return restaurants;
};

export const addRestaurant = async (restaurant: any) => {
  const docRef = await addDoc(collection(db, "restaurants"), restaurant);
  return docRef;
};

