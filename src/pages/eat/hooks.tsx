// React hooks for eat page

// add firebase database hooks

import { useMutation, useQuery } from "@tanstack/react-query";
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import type { IRestaurant } from "./Eat.types";

/**
 * This hook handles get restaurants
 * @returns data: array of restaurants
 * @returns isLoading: boolean
 * @returns error: error object
 */
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

/**
 * This hook handles both add and edit restaurant
 * @returns mutate: function to add restaurant
 * @returns isPending: boolean
 * @returns isSuccess: boolean
 * @returns error: error object
 */
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

/**
 * This hook handles delete restaurant
 * @returns mutate: function to delete restaurant
 * @returns isPending: boolean
 * @returns isSuccess: boolean
 * @returns error: error object
 */
export const deleteRestaurant = () => {

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationKey: ["deleteRestaurant"],
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "restaurants", id));
    },
    onSuccess: () => {
      console.log("Restaurant deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting restaurant:", error);
    },
  });

  return { mutate, isPending, isSuccess, error }; // note: mutate now expects id
};