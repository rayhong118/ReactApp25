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
  getStorage,
  ref,
  uploadBytes,
  type UploadMetadata,
} from "firebase/storage";
import type { IMenu, IMenuUploadPayload } from "../Eat.types";
import { useEatTestMode } from "./useEatTestMode";
import { MOCK_MENU } from "../EatMockData";

const MENU_IMAGES_COLLECTION = "menu-images";
/**
 * Upload menu images to Firebase Storage and create a menu-images document.
 * Firebase function will monitor the addtion to this collection and process the images.
 * @param uploadPayload - Menu image upload payload
 * @returns Upload menu image
 */
export const useUploadMenuImage = () => {
  const addMessageBar = useAddMessageBars();
  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationKey: ["upload-file"],
    mutationFn: async (uploadPayload: IMenuUploadPayload) => {
      const storage = getStorage();
      const currentDate = new Date().getTime();
      const storageRefs = uploadPayload.files.map((file) =>
        ref(
          storage,
          "menuImages/" +
            uploadPayload.restaurantId +
            "_" +
            file.name +
            "_" +
            currentDate,
        ),
      );
      const storagePaths = storageRefs.map((ref) => ref.fullPath);
      const metadata = {
        customMetadata: {
          restaurantId: uploadPayload.restaurantId,
          uploadTime: currentDate.toString(),
        },
      } as UploadMetadata;
      try {
        await Promise.all(
          storageRefs.map((storageRef, index) =>
            uploadBytes(storageRef, uploadPayload.files[index], metadata),
          ),
        );
        const menuImagesCollection = collection(db, MENU_IMAGES_COLLECTION);
        const menuImageDoc = doc(menuImagesCollection);
        await setDoc(menuImageDoc, {
          restaurantId: uploadPayload.restaurantId,
          uploadTime: currentDate,
          status: "pending",
          storagePaths,
        });

        return;
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
            "Menu images uploaded successfully! Check back soon for menu items.",
          type: "success",
          autoDismiss: true,
        },
      ]);
    },
    onError: () => {
      addMessageBar([
        {
          id: "upload-error",
          message: "Menu images upload failed!",
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
  const isTestMode = useEatTestMode();
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

  const menuData = isTestMode && !data ? MOCK_MENU : data;
  const menuLoading = isTestMode ? false : isLoading;

  return { data: menuData, isLoading: menuLoading, error };
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
