// reorder menu categories
import { useTranslation } from "react-i18next";
import type { IMenu } from "./Eat.types";

const EatMenuReorder = ({ menuData }: { menuData: IMenu }) => {
  const { i18n } = useTranslation();
  const language: "en" | "zh" = i18n.language as "en" | "zh";
  const categories = Object.entries(menuData.categories);
  const unsortedCategories = categories.filter(
    (category) => category[1].indexField === undefined,
  );
  const sortedCategories = categories.filter(
    (category) => category[1].indexField !== undefined,
  );
  sortedCategories.sort((a, b) => a[1].indexField! - b[1].indexField!);

  return (
    <div className="text-foreground flex flex-row gap-4">
      {unsortedCategories.length > 0 && (
        <div>
          <h1>Unsorted Categories</h1>
          {unsortedCategories.map((category) => (
            <div key={category[0]}>
              {categoryItem({ categoryName: category[1].name[language] })}
            </div>
          ))}
        </div>
      )}
      <div>
        <h1>Sorted Categories</h1>
        {sortedCategories.map((category) => (
          <div key={category[0]}>
            {categoryItem({ categoryName: category[1].name[language] })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EatMenuReorder;

const categoryItem = ({ categoryName }: { categoryName: string }) => {
  return (
    <div className="p-2 m-2 border-2 border-foreground/20 rounded w-full">
      {categoryName}
    </div>
  );
};
