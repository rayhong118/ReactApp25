import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import type { IRestaurant } from "./Eat.types";
import { SecondaryButton } from "@/components/Buttons";
import { useState } from "react";
import { useUploadMenuImage } from "./hooks/menuHooks";
import { Loading } from "@/components/Loading";

/**
 * Menu component:
 * Allow users to upload a menu image. Once image is uploaded, it will be processed by Gemini API to extract menu items.
 * Display menu items in a list.
 */
interface IEatMenuProps {
  restaurant: IRestaurant;
  closeDialog: () => void;
}
export const EatMenu = ({ restaurant, closeDialog }: IEatMenuProps) => {
  const currentUser = useGetCurrentUser();
  const [menuImage, setMenuImage] = useState<File>();
  const { mutateAsync: uploadMenuImage, isPending } = useUploadMenuImage();
  const handleUploadImage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!menuImage || !restaurant.id) return;

    uploadMenuImage({
      file: menuImage,
      restaurantId: restaurant.id,
    });
  };

  return (
    <div>
      {isPending && <Loading />}
      {currentUser && (
        <form onSubmit={handleUploadImage}>
          <input
            type="file"
            onChange={(e) => setMenuImage(e.target.files?.[0])}
          />
          <SecondaryButton type="submit">Upload</SecondaryButton>
        </form>
      )}
    </div>
  );
};
