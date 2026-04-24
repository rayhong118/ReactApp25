import { CustomizedButton } from "@/components/Buttons";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StarRating } from "../experiments/StarRating";
import { useGetCurrentUserRestaurantRating } from "./EatAtoms";
import { useAddRestaurantNote } from "./hooks/eatNoteHooks";
import { useSubmitRestaurantRating } from "./hooks/hooks";
import { useTranslation } from "react-i18next";

interface IEatNoteInputProps {
  restaurantId: string;
  userId: string;
  onNoteAdded: () => void;
}

export const EatNoteInput = ({
  restaurantId,
  userId,
  onNoteAdded,
}: IEatNoteInputProps) => {
  const [newNote, setNewNote] = useState("");
  const currentRating = useGetCurrentUserRestaurantRating(restaurantId);
  const [rating, setRating] = useState(currentRating || 0);
  const { t } = useTranslation();

  const { mutate: submitRestaurantRating, isPending: isSubmittingRating } =
    useSubmitRestaurantRating();

  const { mutate: addNote, isPending: isAddingNote } =
    useAddRestaurantNote(restaurantId);

  useEffect(() => {
    if (currentRating !== 0 && rating === 0) {
      setRating(currentRating);
    }
  }, [currentRating]);

  const onHandleNoteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = newNote.trim();
    if (!content) return;

    addNote(
      {
        content,
        userId,
        date: Timestamp.now(),
        restaurantId,
      },
      {
        onSuccess: () => {
          setNewNote("");
          onNoteAdded();
        },
      }
    );
  };

  const handleRatingSubmit = (newRating: number) => {
    if (newRating === currentRating) return;
    setRating(newRating);
    submitRestaurantRating({
      restaurantId,
      rating: newRating,
      userId,
    });
  };

  // Derived state for cleaner JSX
  const trimmedLength = newNote.trim().length;
  const isOverLimit = trimmedLength > 250;
  const isValid = trimmedLength > 0 && !isOverLimit;

  return (
    <form
      onSubmit={onHandleNoteSubmit}
      className="w-full py-2 flex flex-col gap-2"
    >
      <div className="flex items-center gap-2">
        {t("eat.notes.rate")}:{" "}
        {isSubmittingRating ? (
          <span>{t("eat.notes.submitting")}</span>
        ) : (
          <StarRating rating={rating} setRating={handleRatingSubmit} />
        )}
      </div>
      <textarea
        name="note"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder={t("eat.notes.addNote")}
        className="w-full border border-black p-2 rounded-md"
      />
      <div className="flex justify-between items-start">
        <CustomizedButton
          type="submit"
          disabled={isAddingNote || !isValid}
        >
          {t("eat.notes.addNote")}
        </CustomizedButton>
        <span
          className={`text-sm font-bold ${
            isOverLimit ? "text-red-500" : "text-gray-400"
          }`}
        >
          {trimmedLength}/250
        </span>
      </div>
    </form>
  );
};
