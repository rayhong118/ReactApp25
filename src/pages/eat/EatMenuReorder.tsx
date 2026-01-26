// reorder menu categories with drag and drop
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import {
  faArrowRotateLeft,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ICategory, IMenu } from "./Eat.types";

interface CategoryEntry {
  key: string;
  category: ICategory;
}

interface EatMenuReorderProps {
  menuData: IMenu;
  onSave?: (orderedCategories: string[]) => void;
}

const EatMenuReorder = ({ menuData, onSave }: EatMenuReorderProps) => {
  const { i18n } = useTranslation();
  const language: "en" | "zh" = i18n.language as "en" | "zh";

  // Initialize state from menuData
  const initializeCategories = useCallback(() => {
    const entries = Object.entries(menuData.categories).map(([key, cat]) => ({
      key,
      category: cat,
    }));

    const unsorted = entries.filter((e) => e.category.indexField === undefined);
    const sorted = entries
      .filter((e) => e.category.indexField !== undefined)
      .sort((a, b) => a.category.indexField! - b.category.indexField!);

    return { unsorted, sorted };
  }, [menuData]);

  const [unsortedCategories, setUnsortedCategories] = useState<CategoryEntry[]>(
    initializeCategories().unsorted,
  );
  const [sortedCategories, setSortedCategories] = useState<CategoryEntry[]>(
    initializeCategories().sorted,
  );
  const [draggedItem, setDraggedItem] = useState<CategoryEntry | null>(null);
  const [dragSource, setDragSource] = useState<"unsorted" | "sorted" | null>(
    null,
  );
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const handleDragStart = (
    e: React.DragEvent,
    item: CategoryEntry,
    source: "unsorted" | "sorted",
  ) => {
    setDraggedItem(item);
    setDragSource(source);
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
    setDragSource(null);
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

    const newSorted = [...sortedCategories];
    let newUnsorted = [...unsortedCategories];

    if (dragSource === "unsorted") {
      // Remove from unsorted
      newUnsorted = newUnsorted.filter((c) => c.key !== draggedItem.key);
      // Insert into sorted at target position
      newSorted.splice(targetIndex, 0, draggedItem);
    } else if (dragSource === "sorted") {
      // Reorder within sorted
      const currentIndex = newSorted.findIndex(
        (c) => c.key === draggedItem.key,
      );
      if (currentIndex !== -1) {
        newSorted.splice(currentIndex, 1);
        // Adjust target index if moving down
        const adjustedIndex =
          currentIndex < targetIndex ? targetIndex - 1 : targetIndex;
        newSorted.splice(adjustedIndex, 0, draggedItem);
      }
    }

    setUnsortedCategories(newUnsorted);
    setSortedCategories(newSorted);
    setDropTargetIndex(null);
    setDraggedItem(null);
    setDragSource(null);
  };

  const handleDropOnUnsorted = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem || dragSource !== "sorted") return;

    // Move from sorted back to unsorted
    const newSorted = sortedCategories.filter((c) => c.key !== draggedItem.key);
    const newUnsorted = [...unsortedCategories, draggedItem];

    setSortedCategories(newSorted);
    setUnsortedCategories(newUnsorted);
    setDropTargetIndex(null);
    setDraggedItem(null);
    setDragSource(null);
  };

  const handleReset = () => {
    const { unsorted, sorted } = initializeCategories();
    setUnsortedCategories(unsorted);
    setSortedCategories(sorted);
    setDropTargetIndex(null);
    setDraggedItem(null);
    setDragSource(null);
  };

  const handleSave = () => {
    const orderedCategories = sortedCategories.map((entry) => entry.key);
    onSave?.(orderedCategories);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-foreground flex flex-col md:flex-row gap-4">
        {/* Unsorted Categories Column */}
        <div
          className={`flex-1 min-h-[200px] p-4 rounded-lg border-2 border-dashed transition-colors ${
            dragSource === "sorted"
              ? "border-amber-500 bg-amber-500/10"
              : "border-foreground/20"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={handleDropOnUnsorted}
        >
          <h2 className="text-lg font-semibold mb-3 text-foreground/70">
            Unsorted Categories
          </h2>
          {unsortedCategories.length === 0 ? (
            <p className="text-foreground/50 text-sm italic">
              All categories are sorted!
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {unsortedCategories.map((entry) => (
                <CategoryItem
                  key={entry.key}
                  entry={entry}
                  language={language}
                  onDragStart={(e) => handleDragStart(e, entry, "unsorted")}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedItem?.key === entry.key}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sorted Categories Column */}
        <div
          className={`flex-1 min-h-[200px] p-4 rounded-lg border-2 border-dashed transition-colors ${
            dragSource === "unsorted"
              ? "border-green-500 bg-green-500/10"
              : "border-foreground/20"
          }`}
        >
          <h2 className="text-lg font-semibold mb-3 text-foreground/70">
            Sorted Categories
          </h2>
          {sortedCategories.length === 0 ? (
            <div
              className="h-20 flex items-center justify-center border-2 border-dashed border-foreground/30 rounded-lg"
              onDragOver={(e) => handleDragOver(e, 0)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDropOnSorted(e, 0)}
            >
              <p className="text-foreground/50 text-sm italic">
                Drag categories here to sort
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {sortedCategories.map((entry, index) => (
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
                    language={language}
                    index={index + 1}
                    onDragStart={(e) => handleDragStart(e, entry, "sorted")}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedItem?.key === entry.key}
                  />
                </div>
              ))}
              {/* Drop zone after last item */}
              <DropZone
                isActive={dropTargetIndex === sortedCategories.length}
                isDragging={!!draggedItem}
                onDragOver={(e) => handleDragOver(e, sortedCategories.length)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDropOnSorted(e, sortedCategories.length)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      {onSave && (
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={handleReset}>
            <FontAwesomeIcon icon={faArrowRotateLeft} className="pe-2" /> Reset
          </SecondaryButton>
          <PrimaryButton onClick={handleSave}>
            Save Order ({sortedCategories.length} categories)
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
  language,
  index,
  onDragStart,
  onDragEnd,
  isDragging,
}: {
  entry: CategoryEntry;
  language: "en" | "zh";
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
        <span className="text-sm font-bold text-primary min-w-[1.5rem]">
          {index}.
        </span>
      )}
      <span className="flex-1">{entry.category.name[language]}</span>
    </div>
  );
};
