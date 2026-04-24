import { useTranslation } from "react-i18next";
import { useEatListSort } from "./hooks/eatListHooks";

const SORT_OPTIONS = [
  { key: "none", value: "", label: "eat.list.orderByNone" },
  { key: "rating", value: "averageStars,desc", label: "eat.list.orderByAverageRating" },
  { key: "price-asc", value: "price,asc", label: "eat.list.orderByPriceLowToHigh" },
  { key: "price-desc", value: "price,desc", label: "eat.list.orderByPriceHighToLow" },
];

export const EatSort = () => {
  const { t } = useTranslation();
  const { orderBy, handleSortChange } = useEatListSort();

  const currentValue = orderBy ? `${orderBy.field},${orderBy.direction}` : "";

  return (
    <div className="flex gap-2 items-center">
      <label htmlFor="eat-sort-select" className="text-sm font-medium">
        {t("eat.list.orderBy")}
      </label>
      <select
        id="eat-sort-select"
        onChange={(e) => {
          const val = e.target.value;
          if (!val) {
            handleSortChange(undefined);
            return;
          }
          const [field, direction] = val.split(",");
          handleSortChange({
            field,
            direction: direction as "asc" | "desc",
          });
        }}
        value={currentValue}
        className="border border-gray-300 rounded p-2 bg-white focus:ring-2 focus:ring-brand"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.key} value={opt.value}>
            {t(opt.label)}
          </option>
        ))}
      </select>
    </div>
  );
};
