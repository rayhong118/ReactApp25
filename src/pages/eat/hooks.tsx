// React hooks for eat page

// add firebase database hooks

import { useMutation, useQuery } from "@tanstack/react-query";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where, type QueryConstraint } from "firebase/firestore";
import { db } from "../../firebase";
import type { INote, IRestaurant } from "./Eat.types";
import type { IEatQuery } from "./Eat.types";

/**      
 * This hook handles get restaurants
 * @returns data: array of restaurants
 * @returns isLoading: boolean
 * @returns error: error object
 */
export const useGetRestaurants = (eatQuery?: IEatQuery) => {
  const { data, error, refetch, isFetching } = useQuery({
    queryKey: ["restaurants", eatQuery?.cityAndState, eatQuery?.priceRangeLower, eatQuery?.priceRangeUpper],
    queryFn: async () => {
      console.log("Fetching restaurants");
      const constraints: QueryConstraint[] = [];
      if (eatQuery?.name) {
        constraints.push(where("name", "==", eatQuery.name));
      }
      if (eatQuery?.cityAndState) {
        constraints.push(where("cityAndState", "==", eatQuery.cityAndState));
      }
      if (eatQuery?.priceRangeLower) {
        constraints.push(where("price", ">=", eatQuery.priceRangeLower));
      }
      if (eatQuery?.priceRangeUpper) {
        constraints.push(where("price", "<=", eatQuery.priceRangeUpper));
      }
      const q = query(collection(db, "restaurants"), ...constraints);
      const querySnapshot = await getDocs(q);
      const restaurants = querySnapshot.docs.map(
        (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as IRestaurant)
      );
      console.log("Restaurants", restaurants);
      return restaurants || [];
    },
    refetchOnWindowFocus: false,
  });
  return { data, error, refetch, isFetching };
};

/**
 * This hook handles add restaurant
 * @returns mutate: function to add restaurant
 * @returns isPending: boolean
 * @returns isSuccess: boolean
 * @returns error: error object
 */
export const useAddRestaurant = () => {

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationKey: ["addRestaurant"],
    mutationFn: async (restaurant: Partial<IRestaurant>) => {
      console.log("Adding restaurant", restaurant);
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
 * This hook handles edit restaurant
 * @returns mutate: function to edit restaurant
 * @returns isPending: boolean
 * @returns isSuccess: boolean
 * @returns error: error object
 */
export const useEditRestaurant = () => {
  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationKey: ["editRestaurant"],
    mutationFn: async (restaurant: Partial<IRestaurant>) => {
      console.log("Editing restaurant", restaurant);
      if (!restaurant.id) {
        throw new Error("Restaurant ID is required");
      }
      await updateDoc(doc(db, "restaurants", restaurant.id), restaurant);
    },
    onSuccess: () => {
      console.log("Restaurant edited successfully");
    },
    onError: (error) => {
      console.error("Error editing restaurant:", error);
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
export const useDeleteRestaurant = () => {

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationKey: ["deleteRestaurant"],
    mutationFn: async (id: string) => {
      console.log("Deleting restaurant", id);

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

/**
 * This hook handles get restaurant notes
 * @param restaurantId: string, used to query in db
 * @returns data: array of notes
 * @returns isLoading: boolean
 * @returns error: error object
 */
export const useGetRestaurantNotes = (restaurantId: string) => {
  const { data, error, refetch, isFetching } = useQuery({
    queryKey: ["restaurant-notes", restaurantId],
    queryFn: async () => {
      console.log("Fetching restaurant notes");
      const q = query(collection(db, "restaurant-notes"), where("restaurantId", "==", restaurantId));
      const querySnapshot = await getDocs(q);
      const notes = querySnapshot.docs.map(
        (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as INote)
      );
      console.log("Restaurant notes", notes);
      return notes || [];
    },
    refetchOnWindowFocus: false,
  });
  return { data, error, refetch, isFetching };
};

/**
 * This hook handles add note to restaurant
 * @returns mutate: function to add note
 * @returns isPending: boolean
 * @returns isSuccess: boolean
 * @returns error: error object
 */
export const useAddRestaurantNote = (restaurantId: string) => {
  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationKey: ["addNote", restaurantId],
    mutationFn: async (note: INote) => {
      console.log("Adding note", note);
      await addDoc(collection(db, "restaurant-notes"), note);
    },
    onSuccess: () => {
      console.log("Note added successfully");
    },
    onError: (error) => {
      console.error("Error adding note:", error);
    },
  });

  return { mutate, isPending, isSuccess, error }; // note: mutate now expects Partial<INotes>
};


/**
 * This hook handles delete note from restaurant
 * @returns mutate: function to delete note
 * @returns isPending: boolean
 * @returns isSuccess: boolean
 * @returns error: error object
 */
export const useDeleteRestaurantNote = () => {
  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationKey: ["deleteNote"],
    mutationFn: async (noteId: string) => {
      console.log("Deleting note", noteId);
      await deleteDoc(doc(db, "restaurant-notes", noteId));
    },
    onSuccess: () => {
      console.log("Note deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting note:", error);
    },
  });

  return { mutate, isPending, isSuccess, error }; // note: mutate now expects id
};