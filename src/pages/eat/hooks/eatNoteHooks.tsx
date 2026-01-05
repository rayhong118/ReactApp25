import { db, firebaseFunctions } from "@/firebase";
import { useAddMessageBars } from "@/utils/MessageBarsAtom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useCallback, useRef, useState } from "react";
import type { INote, IRestaurant } from "../Eat.types";

/**
 * This hook handles get restaurant notes
 * @param restaurantId: string, used to query in db
 * @returns data: array of notes
 * @returns isLoading: boolean
 * @returns error: error object
 */
const NOTE_STALE_TIME = 5 * 60 * 1000;
export const useGetRestaurantNotes = (restaurantId: string) => {
  const { data, error, refetch, isFetching } = useQuery({
    queryKey: ["restaurant-notes", restaurantId],
    queryFn: async () => {
      const q = query(
        collection(db, "restaurant-notes"),
        where("restaurantId", "==", restaurantId)
      );
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
    refetchOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    staleTime: NOTE_STALE_TIME,
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

export const useGenerateNotesSummary = () => {
  const addMessageBars = useAddMessageBars();
  const [summary, setSummary] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateNotesSummary = useCallback(
    async (notes: INote[], restaurant: IRestaurant, language: string) => {
      setSummary("");
      setIsStreaming(true);

      const callable = httpsCallable<
        {
          notes: string[];
          restaurant: IRestaurant;
          language: string;
        },
        ReadableStream<Uint8Array>
      >(firebaseFunctions, "generateNotesSummary");

      try {
        const { stream, data } = await callable.stream({
          notes: notes.map((note) => note.content),
          restaurant,
          language,
        });

        for await (const chunk of stream) {
          setSummary((prev) => prev + chunk);
        }
        const finalData = await data;
        console.log(finalData);
      } catch (error) {
        addMessageBars([
          {
            id: new Date().toISOString(),
            message: "Error generating summary: " + error,
            type: "error",
            autoDismiss: true,
          },
        ]);
        throw error;
      } finally {
        setIsStreaming(false);
      }
    },
    [firebaseFunctions]
  );

  const stop = () => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  };

  return { generateNotesSummary, summary, isStreaming, stop };
};
