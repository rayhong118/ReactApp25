import { useTranslation } from "react-i18next";
import { useEatListSort } from "./hooks/eatListHooks";

export const EatSort = () => {
  const { t } = useTranslation();
  const { orderBy, handleSortChange } = useEatListSort();
  return (
    <div className="flex gap-2 items-center">
      <div>{t("eat.list.orderBy")}</div>
      <select
        onChange={(e) => {
          const value = e.target.value;
          if (!value) {
            handleSortChange(undefined);
            return;
          }
          const [field, direction] = value.split(",");

          handleSortChange({
            field,
            direction: direction as "asc" | "desc",
          });
        }}
        value={orderBy?.field + "," + orderBy?.direction}
        className="border border-gray-300 rounded p-2"
      >
        <option className="p-2" value={""}>
          {t("eat.list.orderByNone")}
        </option>
        <option className="p-2" value={"averageStars,desc"}>
          {t("eat.list.orderByAverageRating")}
        </option>
        <option className="p-2" value={"price,asc"}>
          {t("eat.list.orderByPriceLowToHigh")}
        </option>
        <option className="p-2" value={"price,desc"}>
          {t("eat.list.orderByPriceHighToLow")}
        </option>
      </select>
    </div>
  );
};
