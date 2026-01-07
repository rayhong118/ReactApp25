import { useAddMessageBars } from "@/utils/MessageBarsAtom";
import { useMutation } from "@tanstack/react-query";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import type { IMenuUploadPayload } from "../Eat.types";

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
      try {
        const snapshot = await uploadBytes(storageRef, uploadPayload.file);
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
