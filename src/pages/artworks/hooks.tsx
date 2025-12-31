import { getStorage } from "firebase/storage";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { IUploadPayload } from "./Artworks.types";
import { useAddMessageBars } from "@/utils/MessageBarsAtom";

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
