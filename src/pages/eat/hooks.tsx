// React hooks for eat page

// add firebase database hooks

import { useQuery } from "@tanstack/react-query";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import type { IRestaurant } from "./Eat.types";

export const useGetRestaurants = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, "restaurants"));
      const restaurants = querySnapshot.docs.map(
        (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as IRestaurant)
      );
      return restaurants;
    },
  });
  return { data, isLoading, error };
};

export const addRestaurant = async (restaurant: IRestaurant) => {
  console.log("restaurant", restaurant);
  await addDoc(collection(db, "restaurants"), restaurant);
  return;
};
