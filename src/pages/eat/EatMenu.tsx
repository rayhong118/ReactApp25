import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { Loading } from "@/components/Loading";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import { useRef, useState } from "react";
import type { IMenuItem, IMenuItemByCategory, IRestaurant } from "./Eat.types";
import { getMenuData, useUploadMenuImage } from "./hooks/menuHooks";

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
  const { data: menuData, isLoading: menuDataLoading } = getMenuData(
    restaurant.id || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      {menuImage && <img src={URL.createObjectURL(menuImage)} alt="Menu" />}
      {currentUser && (
        <form onSubmit={handleUploadImage}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setMenuImage(e.target.files?.[0])}
            accept="image/*"
            className="hidden"
          />
          <SecondaryButton onClick={() => fileInputRef.current?.click()}>
            Upload Menu Image
          </SecondaryButton>
          <PrimaryButton type="submit">Submit</PrimaryButton>
        </form>
      )}
      {menuDataLoading && <Loading />}
      {menuData && (
        <div>
          <h2>Menu</h2>
          <ul>
            {menuData.categories.map((category: IMenuItemByCategory) => (
              <li key={category.name}>
                <h3>{category.name}</h3>
                <ul>
                  {category.items.map((item: IMenuItem) => (
                    <li key={item.name}>
                      <h4>{item.name}</h4>
                      <p>{item.price}</p>
                      <p>{item.description}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
      {closeDialog && (
        <SecondaryButton onClick={closeDialog}>Close</SecondaryButton>
      )}
    </div>
  );
};
