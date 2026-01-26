import { SecondaryButton } from "@/components/Buttons";
import { Loading } from "@/components/Loading";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import { faArrowLeft, faShuffle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { IMenuItem, IRestaurant } from "./Eat.types";
import { EatMenuUpload } from "./EatMenuUpload";
import { getMenuData } from "./hooks/menuHooks";
import EatMenuReorder from "./EatMenuReorder";

/**
 * Menu component:
 * Allow users to upload a menu image. Once image is uploaded, it will be processed by Gemini API to extract menu items.
 * Display menu items in a list.
 */
interface IEatMenuProps {
  restaurant: IRestaurant;
}
export const EatMenu = ({ restaurant }: IEatMenuProps) => {
  const { data: menuData, isLoading: menuDataLoading } = getMenuData(
    restaurant.id || "",
  );
  const currentUser = useGetCurrentUser();
  const [isReorderPanelOpen, setIsReorderPanelOpen] = useState(false);

  const { i18n } = useTranslation();
  const language: "en" | "zh" = i18n.language as "en" | "zh";

  if (!menuData) {
    return <Loading />;
  }

  if (isReorderPanelOpen) {
    const handleSaveOrder = async (
      orderedCategories: { key: string; index: number }[],
    ) => {
      // TODO: Implement Firestore update to save the order
      console.log("Saving order:", orderedCategories);
      // For now, just close the panel after save
      setIsReorderPanelOpen(false);
    };

    return (
      <div className="flex flex-col gap-4 text-foreground">
        <SecondaryButton
          onClick={() => setIsReorderPanelOpen(false)}
          aria-label="Back"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="pe-2" /> Back
        </SecondaryButton>
        <h1 className="text-xl font-bold">Reorder Menu Categories</h1>

        <EatMenuReorder menuData={menuData} onSave={handleSaveOrder} />
      </div>
    );
  }

  return (
    <div>
      {currentUser && <EatMenuUpload restaurant={restaurant} />}
      {currentUser && <hr className="my-4 border-foreground" />}
      {menuDataLoading && <Loading />}
      {menuData && currentUser && (
        <SecondaryButton onClick={() => setIsReorderPanelOpen(true)}>
          <FontAwesomeIcon icon={faShuffle} className="pe-2" /> Reorder menu
          categories
        </SecondaryButton>
      )}
      {menuData && (
        <div className="flex flex-col gap-4">
          {menuData.isAYCE && (
            <div className="text-lg">
              <h2 className="text-xl text-foreground font-bold">
                All you can eat pricing
              </h2>
              {menuData.aycePrices?.map((price) => (
                <div key={price.timePeriod}>
                  {price.price} {price.timePeriod} {price.additionalInfo}
                </div>
              ))}
            </div>
          )}

          {Object.entries(menuData.categories).map(
            ([categoryKey, category]) => (
              <div key={categoryKey} className="flex flex-col gap-2">
                <h3 className="text-xl text-foreground font-bold">
                  {category.name[language] || category.name.en}
                </h3>

                <div className="flex flex-wrap">
                  {category.items.map((item: IMenuItem, index: number) => (
                    <div
                      key={index}
                      className="w-1/2 min-w-xs pb-2 text-foreground"
                    >
                      <div className="pl-4 w-full flex justify-between gap-10">
                        <h4 className="text-lg font-semibold">
                          {item.name[language] || item.name.en}
                        </h4>
                        <p className="text-lg font-semibold">{item.price}</p>
                      </div>
                      {item.description && (
                        <p className="pl-4">
                          {typeof item.description === "string"
                            ? item.description
                            : item.description[language] || item.description.en}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
};
