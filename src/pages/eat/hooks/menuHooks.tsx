import { useAddMessageBars } from "@/utils/MessageBarsAtom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  type UploadMetadata,
} from "firebase/storage";
import type { IMenu, IMenuUploadPayload } from "../Eat.types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

export const useUploadMenuImage = () => {
  const addMessageBar = useAddMessageBars();
  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationKey: ["upload-file"],
    mutationFn: async (uploadPayload: IMenuUploadPayload) => {
      const storage = getStorage();
      const currentDate = new Date().getTime();
      const storageRef = ref(
        storage,
        "menuImages/" +
          uploadPayload.restaurantId +
          "_" +
          uploadPayload.file.name +
          "_" +
          currentDate
      );
      const metadata = {
        customMetadata: {
          restaurantId: uploadPayload.restaurantId,
          uploadTime: currentDate.toString(),
        },
      } as UploadMetadata;
      try {
        const snapshot = await uploadBytes(
          storageRef,
          uploadPayload.file,
          metadata
        );
        const downloadURL = await getDownloadURL(snapshot.ref);
        // In firestore menu collection, add a document with the restaurant ID and the image URL
        const menuDoc = doc(db, "menu-images", uploadPayload.restaurantId);
        await setDoc(menuDoc, {
          restaurantId: uploadPayload.restaurantId,
          imageUrl: downloadURL,
          menuStatus: "pending",
          createdAt: currentDate,
        });
        return downloadURL;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      addMessageBar([
        {
          id: "upload-success",
          message:
            "Menu image uploaded successfully! Check back soon for menu items.",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: () => {
      addMessageBar([
        {
          id: "upload-error",
          message: "Menu image upload failed!",
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });

  return { mutateAsync, isPending, isSuccess };
};

export const MENU_COLLECTION = "restaurant-menus";

export const getMenuData = (restaurantId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["menu-data", restaurantId],
    queryFn: async () => {
      const menuDoc = doc(db, MENU_COLLECTION, restaurantId);
      const menuDocSnapshot = await getDoc(menuDoc);
      return menuDocSnapshot.data() as IMenu;
    },
    enabled: !!restaurantId,
    staleTime: 60 * 60 * 1000,
  });

  return { data, isLoading, error };
};
