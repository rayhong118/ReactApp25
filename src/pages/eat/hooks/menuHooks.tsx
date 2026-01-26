import { db } from "@/firebase";
import { useAddMessageBars } from "@/utils/MessageBarsAtom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  type UploadMetadata,
} from "firebase/storage";
import type { IMenu, IMenuUploadPayload } from "../Eat.types";

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
      if (!menuDocSnapshot.exists()) {
        return null;
      }
      return menuDocSnapshot.data() as IMenu;
    },
    enabled: !!restaurantId,
    staleTime: 60 * 60 * 1000,
  });

  return { data, isLoading, error };
};

export const useUpdateMenuData = (restaurantId: string) => {
  const addMessageBar = useAddMessageBars();
  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationKey: ["menu-data", restaurantId],
    mutationFn: async (menuData: IMenu) => {
      const menuDoc = doc(db, MENU_COLLECTION, restaurantId);
      await setDoc(menuDoc, menuData);
    },
    onSuccess: () => {
      addMessageBar([
        {
          id: "update-success",
          message: "Menu updated successfully!",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: () => {
      addMessageBar([
        {
          id: "update-error",
          message: "Failed to update menu!",
          type: "error",
          autoDismiss: true,
        },
      ]);
    },
  });

  return { mutateAsync, isPending, isSuccess };
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
      // Write directly to Firestore - the trigger will process it
      const submissionRef = doc(collection(db, "menu-url-submissions"));
      await setDoc(submissionRef, {
        url,
        restaurantId,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      return { submissionId: submissionRef.id };
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
