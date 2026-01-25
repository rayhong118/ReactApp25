import { db, firebaseFunctions } from "@/firebase";
import { useAddMessageBars } from "@/utils/MessageBarsAtom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  type UploadMetadata,
} from "firebase/storage";
import type { IMenu, IMenuUploadPayload } from "../Eat.types";
import { httpsCallable } from "firebase/functions";

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
          currentDate,
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
          metadata,
        );
        const downloadURL = await getDownloadURL(snapshot.ref);

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

export const useSubmitMenuURL = () => {
  const addMessageBar = useAddMessageBars();
  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationKey: ["submit-menu-url"],
    mutationFn: async ({
      restaurantId,
      url,
    }: {
      restaurantId: string;
      url: string;
    }) => {
      const getMenuItemsFromURL = httpsCallable<
        {
          restaurantId: string;
          url: string;
        },
        string
      >(firebaseFunctions, "getMenuItemsFromURL");
      const response = await getMenuItemsFromURL({
        restaurantId,
        url,
      });
      return response.data;
    },
    onSuccess: () => {
      addMessageBar([
        {
          id: "submit-success",
          message:
            "Menu URL submitted successfully! Check back soon for menu items.",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: () => {
      addMessageBar([
        {
          id: "submit-error",
          message: "Failed to submit menu URL!",
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });

  return { mutateAsync, isPending, isSuccess };
};
