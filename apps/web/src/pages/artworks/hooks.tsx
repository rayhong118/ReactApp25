import { useAddMessageBars } from "@/utils/MessageBarsAtom";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  setDoc,
  startAfter,
  where,
  type DocumentData,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import type {
  IArtwork,
  IArtworksQuery,
  IUpdatePayload,
  IUploadPayload,
} from "./Artworks.types";

/**
 * This hook handles upload file
 * @returns uploadFile: function to upload file
 * @returns isPending: boolean
 * @returns isSuccess: boolean
 */
export const useUploadFile = () => {
  const addMessageBar = useAddMessageBars();
  const {
    mutateAsync: uploadFile,
    isPending,
    isSuccess,
  } = useMutation({
    mutationKey: ["upload-file"],
    mutationFn: async (uploadPayload: IUploadPayload) => {
      const storage = getStorage();
      const db = getFirestore();
      const file = uploadPayload.file;
      const storageRef = ref(
        storage,
        "artworks/" +
          uploadPayload.category +
          "_" +
          uploadPayload.file.name +
          "_" +
          uploadPayload.date.getTime()
      );

      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        if (uploadPayload.category) {
          const categoryDocRef = doc(
            db,
            "artwork-categories",
            uploadPayload.category
          );
          await setDoc(
            categoryDocRef,
            {
              name: uploadPayload.category,
            },
            { merge: true }
          );
        }
        await addDoc(collection(db, "artworks"), {
          title: uploadPayload.title,
          description: uploadPayload.description,
          imageURL: downloadURL,
          category: uploadPayload.category,
          date: uploadPayload.date,
        });
        return downloadURL;
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: () => {
      addMessageBar([
        {
          id: "upload-success",
          message: "Upload successful!",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: () => {
      addMessageBar([
        {
          id: "upload-error",
          message: "Upload failed!",
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });

  return { uploadFile, isPending, isSuccess };
};

/**
 * This hook handles update artwork. If file is provided,
 * it will update the artwork with the new file.
 * @returns updateArtwork: function to update artwork
 * @returns isPending: boolean
 * @returns isSuccess: boolean
 */
export const useUpdateArtwork = () => {
  const addMessageBar = useAddMessageBars();
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateArtwork,
    isPending,
    isSuccess,
  } = useMutation({
    mutationKey: ["update-artwork"],
    mutationFn: async (payload: IUpdatePayload) => {
      const db = getFirestore();
      const artworkRef = doc(db, "artworks", payload.id);
      const updatePayload = {} as Record<string, any>;

      if (payload.title !== undefined) {
        updatePayload.title = payload.title;
      }
      if (payload.description !== undefined) {
        updatePayload.description = payload.description;
      }
      if (payload.category !== undefined) {
        updatePayload.category = payload.category;
      }
      if (payload.date !== undefined) {
        updatePayload.date = payload.date;
      }

      if (payload.file) {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          "artworks/" +
            payload.category +
            "_" +
            payload.file.name +
            "_" +
            payload.date.getTime()
        );
        try {
          const snapshot = await uploadBytes(storageRef, payload.file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          updatePayload.imageURL = downloadURL;
          const oldFileUrl = payload.imageURL;
          if (oldFileUrl) {
            const oldFileRef = ref(storage, oldFileUrl);
            await deleteObject(oldFileRef);
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

      if (payload.category) {
        const categoryDocRef = doc(db, "artwork-categories", payload.category);
        await setDoc(
          categoryDocRef,
          { name: payload.category },
          { merge: true }
        );
      }

      await setDoc(artworkRef, updatePayload, { merge: true });
      return { id: payload.id, ...updatePayload };
    },
    onSuccess: (updatedData) => {
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
      queryClient.invalidateQueries({ queryKey: ["artwork", updatedData.id] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      addMessageBar([
        {
          id: "update-success",
          message: "Update successful!",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: () => {
      addMessageBar([
        {
          id: "update-error",
          message: "Update failed!",
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });

  return { updateArtwork, isPending, isSuccess };
};

/**
 * This hook handles get specific artwork
 * @returns specificArtwork: specific artwork
 */
export const useFetchArtworkById = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["artwork", id],
    queryFn: async () => {
      const db = getFirestore();
      const artworkRef = doc(db, "artworks", id);
      const snapshot = await getDoc(artworkRef);
      if (!snapshot.exists()) {
        throw new Error("Artwork not found");
      }
      return {
        ...snapshot.data(),
        date: snapshot.data().date.toDate(),
        id: snapshot.id,
      } as IArtwork;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return { data, isLoading };
};

/**
 * This hook handles get categories
 * @returns categories: array of categories string
 */
export const useGetCategories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const db = getFirestore();
      const categoriesRef = collection(db, "artwork-categories");
      const snapshot = await getDocs(categoriesRef);
      return snapshot.docs.map((doc) => doc.data().name);
    },
  });

  return { categories, isLoading };
};

const PAGE_SIZE = 6;
/**
 * This hook handles get artworks
 * @returns artworks: array of artworks
 */
export const useGetArtworks = (artworksQuery?: IArtworksQuery) => {
  const addMessageBar = useAddMessageBars();
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["artworks", artworksQuery],
      queryFn: async ({
        pageParam,
      }: {
        pageParam: QueryDocumentSnapshot<DocumentData, DocumentData> | null;
      }) => {
        const db = getFirestore();
        const artworksRef = collection(db, "artworks");
        const constraints: QueryConstraint[] = [];
        if (artworksQuery?.category) {
          constraints.push(where("category", "==", artworksQuery.category));
        }
        constraints.push(orderBy("date", "desc"));
        if (pageParam) {
          constraints.push(startAfter(pageParam));
        }

        const q = query(artworksRef, ...constraints, limit(PAGE_SIZE));
        try {
          const snapshot = await getDocs(q);
          const lastVisible = snapshot.docs[snapshot.docs.length - 1];
          const artworks = snapshot.docs.map(
            (doc) =>
              ({
                ...doc.data(),
                date: doc.data().date.toDate(),
                id: doc.id,
              } as IArtwork)
          );
          return { artworks, nextCursor: lastVisible };
        } catch (error) {
          addMessageBar([
            {
              id: "get-artworks-error",
              message: "Failed to fetch artworks!" + error,
              type: "error",
              autoDismiss: true,
            },
          ]);
          return { artworks: [], nextCursor: null };
        }
      },
      initialPageParam: null,
      getNextPageParam: (lastPage) => {
        if (lastPage.artworks.length < PAGE_SIZE) {
          return undefined;
        }
        return lastPage.nextCursor;
      },
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    });

  return { data, isFetchingNextPage, fetchNextPage, hasNextPage, isFetching };
};
