// reorder menu categories with drag and drop
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import {
  faArrowRotateLeft,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { IMenu } from "./Eat.types";

interface CategoryEntry {
  key: string;
  categoryName: string;
  indexField: number;
}

interface EatMenuReorderProps {
  menuData: IMenu;
  onSave?: (orderedCategories: string[]) => void;
}

const EatMenuReorder = ({ menuData, onSave }: EatMenuReorderProps) => {
  const { i18n, t } = useTranslation();
  const language: "en" | "zh" = i18n.language as "en" | "zh";

  // Initialize state from menuData
  const initialCategories = () => {
    const entries = Object.entries(menuData.categories).map(([key, cat]) => ({
      key,
      category: cat,
    }));

    const sorted = entries
      .filter((e) => e.category.indexField !== undefined)
      .sort((a, b) => a.category.indexField! - b.category.indexField!)
      .map((e) => ({
        key: e.key,
        categoryName: e.category.name[language],
        indexField: e.category.indexField! + 1,
      }));
    const unsorted = entries
      .filter((e) => e.category.indexField === undefined)
      .map((e, index) => ({
        key: e.key,
        categoryName: e.category.name[language],
        indexField: sorted.length + index + 1,
      }));
    return [...sorted, ...unsorted];
  };

  const [allCategories, setAllCategories] =
    useState<CategoryEntry[]>(initialCategories());
  const [draggedItem, setDraggedItem] = useState<CategoryEntry | null>(null);

  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, item: CategoryEntry) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", item.key);
    // Add a slight delay to show the drag effect
    requestAnimationFrame(() => {
      (e.target as HTMLElement).style.opacity = "0.5";
    });
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = "1";
    setDraggedItem(null);
    setDropTargetIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTargetIndex(index);
  };

  const handleDragLeave = () => {
    setDropTargetIndex(null);
  };

  const handleDropOnSorted = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    const newSorted = [...allCategories];

    // Reorder within sorted
    const currentIndex = newSorted.findIndex((c) => c.key === draggedItem.key);
    if (currentIndex !== -1) {
      newSorted.splice(currentIndex, 1);
      // Adjust target index if moving down
      const adjustedIndex =
        currentIndex < targetIndex ? targetIndex - 1 : targetIndex;
      newSorted.splice(adjustedIndex, 0, draggedItem);
    }

    setAllCategories(newSorted);
    setDropTargetIndex(null);
    setDraggedItem(null);
  };

  const handleReset = () => {
    const categories = initialCategories();
    setAllCategories(categories);
    setDropTargetIndex(null);
    setDraggedItem(null);
  };

  const handleSave = () => {
    const orderedCategories = allCategories.map((entry) => entry.key);
    onSave?.(orderedCategories);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-foreground flex flex-col">
        <h2 className="text-sm mb-3 text-foreground/70">
          {t("eat.menu.sortInstruction")}
        </h2>
        {/* Sorted Categories Column */}
        <div
          className={`flex-1 min-h-[200px] p-4 rounded-lg border-2 border-dashed transition-colors 
            border-foreground/20`}
        >
          <div className="flex flex-col">
            {allCategories.map((entry, index) => (
              <div key={entry.key}>
                {/* Drop zone before each item */}
                <DropZone
                  isActive={dropTargetIndex === index}
                  isDragging={!!draggedItem}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDropOnSorted(e, index)}
                />
                <CategoryItem
                  entry={entry}
                  index={index + 1}
                  onDragStart={(e) => handleDragStart(e, entry)}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedItem?.key === entry.key}
                />
              </div>
            ))}

            {/* Drop zone after last item */}
            <DropZone
              isActive={dropTargetIndex === allCategories.length}
              isDragging={!!draggedItem}
              onDragOver={(e) => handleDragOver(e, allCategories.length)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDropOnSorted(e, allCategories.length)}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      {onSave && (
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={handleReset}>
            <FontAwesomeIcon icon={faArrowRotateLeft} className="pe-2" />{" "}
            {t("eat.menu.reset")}
          </SecondaryButton>
          <PrimaryButton onClick={handleSave}>
            {t("eat.menu.saveOrder")} ({allCategories.length})
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};

export default EatMenuReorder;

// Drop zone indicator component - larger and more visible during drag
const DropZone = ({
  isActive,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  isActive: boolean;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}) => (
  <div
    className={`transition-all duration-200 rounded ${
      isActive
        ? "h-12 bg-primary/30 border-2 border-dashed border-primary my-1"
        : isDragging
          ? "h-6 bg-foreground/10 border border-dashed border-foreground/30"
          : "h-1 bg-transparent"
    }`}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
  />
);

// Draggable category item component
const CategoryItem = ({
  entry,
  index,
  onDragStart,
  onDragEnd,
  isDragging,
}: {
  entry: CategoryEntry;
  index?: number;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  isDragging: boolean;
}) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`
        p-3 rounded-lg border-2 cursor-grab active:cursor-grabbing
        flex items-center gap-3 select-none transition-all duration-200
        ${
          isDragging
            ? "opacity-80 border-primary bg-primary/10 scale-95"
            : "border-foreground/20 bg-background hover:border-foreground/40 hover:shadow-md"
        }
      `}
    >
      <FontAwesomeIcon
        icon={faGripVertical}
        className="text-foreground/40 hover:text-foreground/60"
      />
      {index !== undefined && (
        <span className="text-sm font-bold text-primary">{index}.</span>
      )}
      <span className="flex-1">{entry.categoryName}</span>
    </div>
  );
};
