import { getStorage } from "firebase/storage";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  doc,
  setDoc,
  QueryDocumentSnapshot,
  type DocumentData,
  where,
  query,
  limit,
  QueryConstraint,
  startAfter,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import type {
  IArtwork,
  IArtworksQuery,
  IUploadPayload,
} from "./Artworks.types";
import { useAddMessageBars } from "@/utils/MessageBarsAtom";

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
          uploadPayload.title +
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
 * This hook handles get categories
 * @returns categories: array of categories string
 */
export const useGetCategories = () => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const db = getFirestore();
      const categoriesRef = collection(db, "artwork-categories");
      const snapshot = await getDocs(categoriesRef);
      return snapshot.docs.map((doc) => doc.data().name);
    },
  });

  return { categories };
};

const PAGE_SIZE = 6;
/**
 * This hook handles get artworks
 * @returns artworks: array of artworks
 */
export const useGetArtworks = (artworksQuery?: IArtworksQuery) => {
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
        console.log(artworksQuery);
        if (artworksQuery?.category) {
          constraints.push(where("category", "==", artworksQuery.category));
        }
        if (pageParam) {
          constraints.push(startAfter(pageParam));
        }
        const q = query(artworksRef, ...constraints, limit(PAGE_SIZE));
        const snapshot = await getDocs(q);
        const lastVisible = snapshot.docs[snapshot.docs.length - 1];
        const artworks = snapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              date: doc.data().date.toDate(),
            } as IArtwork)
        );
        return { artworks, nextCursor: lastVisible };
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
