// React hooks for eat page

// add firebase database hooks

import { useMutation, useQuery } from "@tanstack/react-query";
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

export const addRestaurant = () => {

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationKey: ["addRestaurant"],
    mutationFn: async (restaurant: Partial<IRestaurant>) => {
      await addDoc(collection(db, "restaurants"), restaurant);
    },
    onSuccess: () => {
      // will connect to messaging system later
      console.log("Restaurant added successfully");
    },
    onError: (error) => {
      console.error("Error adding restaurant:", error);
    },
  });

  return { mutate, isPending, isSuccess, error }; // note: mutate now expects Partial<IRestaurant>
};
