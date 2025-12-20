// React hooks for eat page

// add firebase database hooks

import { useAddMessageBars } from "@/utils/MessageBarsAtom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where, type QueryConstraint } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, firebaseFunctions } from "../../firebase";
import type { IEatQuery, ILocationTag, INote, IRestaurant } from "./Eat.types";

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
      const constraints: QueryConstraint[] = [];
      if (eatQuery?.name) {
        constraints.push(where("name", "==", eatQuery.name));
      }
      if (eatQuery?.cityAndState && eatQuery?.cityAndState.length > 0) {
        constraints.push(where("cityAndState", "in", eatQuery.cityAndState));
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
  const addMessageBars = useAddMessageBars();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isSuccess, error } = useMutation({
    mutationKey: ["addRestaurant"],
    mutationFn: async (restaurant: Partial<IRestaurant>) => {
      await addDoc(collection(db, "restaurants"), restaurant);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Restaurant added successfully",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: (error) => {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Error adding restaurant: " + error.message,
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });

  return { mutateAsync, isPending, isSuccess, error }; // note: mutate now expects Partial<IRestaurant>
};

/**
 * This hook handles edit restaurant
 * @returns mutate: function to edit restaurant
 * @returns isPending: boolean
 * @returns isSuccess: boolean
 * @returns error: error object
 */
export const useEditRestaurant = () => {
  const addMessageBars = useAddMessageBars();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isSuccess, error } = useMutation({
    mutationKey: ["editRestaurant"],
    mutationFn: async (restaurant: Partial<IRestaurant>) => {
      if (!restaurant.id) {
        throw new Error("Restaurant ID is required");
      }
      await updateDoc(doc(db, "restaurants", restaurant.id), restaurant);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Restaurant edited successfully",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: (error) => {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Error editing restaurant: " + error.message,
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });

  return { mutateAsync, isPending, isSuccess, error }; // note: mutate now expects Partial<IRestaurant>
};


/**
 * This hook handles delete restaurant
 * @returns mutate: function to delete restaurant
 * @returns isPending: boolean
 * @returns isSuccess: boolean
 * @returns error: error object
 */
export const useDeleteRestaurant = () => {
  const addMessageBars = useAddMessageBars();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isSuccess, error } = useMutation({
    mutationKey: ["deleteRestaurant"],
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "restaurants", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Restaurant deleted successfully",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: (error) => {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Error deleting restaurant: " + error.message,
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });

  return { mutateAsync, isPending, isSuccess, error }; // note: mutate now expects id
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
      const q = query(collection(db, "restaurant-notes"), where("restaurantId", "==", restaurantId));
      const querySnapshot = await getDocs(q);
      const notes = querySnapshot.docs.map(
        (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as INote)
      );
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
  const addMessageBars = useAddMessageBars();
  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationKey: ["addNote", restaurantId],
    mutationFn: async (note: INote) => {
      await addDoc(collection(db, "restaurant-notes"), note);
    },
    onSuccess: () => {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Note added successfully",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: (error) => {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Error adding note: " + error.message,
          type: "error",
          autoDismiss: true,
        },
      ]);
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
  const addMessageBars = useAddMessageBars();
  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationKey: ["deleteNote"],
    mutationFn: async (noteId: string) => {
      await deleteDoc(doc(db, "restaurant-notes", noteId));
    },
    onSuccess: () => {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Note deleted successfully",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: (error) => {
      addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Error deleting note: " + error.message,
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });

  return { mutate, isPending, isSuccess, error }; // note: mutate now expects id
};

/**
 * This hook handles get restaurant location tags
 * @returns data: array of location tags
 * @returns isLoading: boolean
 * @returns error: error object
 */
export const useGetRestaurantLocationTags = () => {
  const { data, error, refetch, isFetching } = useQuery({
    queryKey: ["restaurant-location-tags"],
    queryFn: async () => {
      const q = query(collection(db, "restaurant-location-tags"));
      const querySnapshot = await getDocs(q);
      const locationTags = querySnapshot.docs.map(
        (doc) =>
        ({
          value: doc.data().value,
          count: doc.data().count,
        } as ILocationTag)
      );
      return locationTags || [];
    },
    refetchOnWindowFocus: false,
  });
  return { data, error, refetch, isFetching };
};

/**
 * This hook handles get restaurant recommendation based on user prompt
 * @param userPrompt: string, used by Gemini to generate restaurant recommendation
 * @returns data: object of restaurant recommendation
 * @returns isLoading: boolean
 * @returns error: error object
 */
export const useGetRestaurantRecommendationNL = (userPrompt?: string) => {
  const { data, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["restaurant-recommendation-nl", userPrompt],
    queryFn: async () => {
      if (!userPrompt) return null;
      const q = query(collection(db, "restaurants"));
      const querySnapshot = await getDocs(q);
      const restaurants = querySnapshot.docs.map(
        (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as IRestaurant)
      );
      const restaurantContext = restaurants.map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        price: restaurant.price,
        cityAndState: restaurant.cityAndState,
      }));
      const restaurantContextJson = JSON.stringify(restaurantContext);
      console.log(restaurantContextJson);
      const generateSuggestionBasedOnUserPrompt = httpsCallable<{ userPrompt: string, restaurants: string }, { restaurantId: string, reason: string }>(firebaseFunctions, "generateSuggestionBasedOnUserPrompt");
      const result = await generateSuggestionBasedOnUserPrompt({ userPrompt, restaurants: restaurantContextJson });

      const { restaurantId: pickedRestaurantId, reason } = result.data;

      const pickedRestaurant = restaurants.find((restaurant) => restaurant.id === pickedRestaurantId);
      console.log(pickedRestaurant);
      console.log(reason);

      const response = {
        restaurant: pickedRestaurant,
        reason,
      }
      if (!pickedRestaurant) {
        throw (new Error(reason));
      }
      return response;
    },
    refetchOnWindowFocus: false,
    enabled: !!userPrompt,

  });
  return { data, isError, error, refetch, isFetching };
};
