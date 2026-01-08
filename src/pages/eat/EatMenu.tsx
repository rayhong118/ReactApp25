import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { Loading } from "@/components/Loading";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { IMenuItem, IRestaurant } from "./Eat.types";
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

  const { t, i18n } = useTranslation();
  const language: "en" | "zh" = i18n.language as "en" | "zh";

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
            {t("eat.menu.uploadMenuImage")}
          </SecondaryButton>
          <PrimaryButton type="submit">{t("eat.menu.submit")}</PrimaryButton>
        </form>
      )}
      {menuDataLoading && <Loading />}
      {menuData && (
        <div>
          <h2>{t("eat.menu.title")}</h2>
          <ul>
            {Object.entries(menuData.categories).map(
              ([categoryName, items]) => (
                <li key={categoryName}>
                  <h3>{categoryName}</h3>
                  <ul>
                    {items.map((item: IMenuItem, index: number) => (
                      <li key={index}>
                        <h4>{item.name[language] || item.name.en}</h4>
                        <p>{item.price}</p>
                        <p>{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            )}
          </ul>
        </div>
      )}
      {closeDialog && (
        <SecondaryButton onClick={closeDialog}>Close</SecondaryButton>
      )}
    </div>
  );
};
