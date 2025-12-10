// React hooks for eat page

// add firebase database hooks

import { useQuery } from "@tanstack/react-query";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export const useGetRestaurants = () => {

  const { data, isLoading, error } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "restaurants"));
        const restaurants = querySnapshot.docs.map((doc) => doc.data());
        return restaurants;
      } catch (error) {
        return error;
      }
    },
  });
  return { data, isLoading, error };
}

export const addRestaurant = async (restaurant: any) => {
  const docRef = await addDoc(collection(db, "restaurants"), restaurant);
  return docRef;
};

