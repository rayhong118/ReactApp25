import { SecondaryButton } from "@/components/Buttons";
import { Loading } from "@/components/Loading";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import { useTranslation } from "react-i18next";
import type { IMenuItem, IRestaurant } from "./Eat.types";
import { EatMenuUpload } from "./EatMenuUpload";
import { getMenuData } from "./hooks/menuHooks";

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
  const { data: menuData, isLoading: menuDataLoading } = getMenuData(
    restaurant.id || "",
  );
  const currentUser = useGetCurrentUser();

  const { i18n } = useTranslation();
  const language: "en" | "zh" = i18n.language as "en" | "zh";

  return (
    <div>
      {currentUser && <EatMenuUpload restaurant={restaurant} />}
      {currentUser && <hr className="my-4" />}
      {menuDataLoading && <Loading />}
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
              <div key={categoryKey}>
                <h3 className="text-xl text-foreground font-bold">
                  {category.name[language] || category.name.en}
                </h3>

                <div className="flex flex-wrap">
                  {category.items.map((item: IMenuItem, index: number) => (
                    <div key={index} className="w-1/2 min-w-xs pb-2">
                      <div className="pl-4 w-full flex justify-between gap-10">
                        <h4 className="text-lg text-foreground font-semibold">
                          {item.name[language] || item.name.en}
                        </h4>
                        <p className="text-lg text-foreground font-semibold">
                          {item.price}
                        </p>
                      </div>
                      {item.description && (
                        <p className="pl-4">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      )}
      {closeDialog && (
        <SecondaryButton onClick={closeDialog}>Close</SecondaryButton>
      )}
    </div>
  );
};
