import { CustomizedButton } from "@/components/Buttons";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StarRating } from "../experiments/StarRating";
import { useGetCurrentUserRestaurantRating } from "./EatAtoms";
import { useAddRestaurantNote } from "./hooks/eatNoteHooks";
import { useSubmitRestaurantRating } from "./hooks/hooks";

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

  const { mutate: submitRestaurantRating, isPending: isSubmittingRating } =
    useSubmitRestaurantRating();

  const { mutate: addNote, isPending: isAddingNote } =
    useAddRestaurantNote(restaurantId);

  useEffect(() => {
    if (currentRating !== 0 && rating === 0) {
      setRating(currentRating);
    }
  }, [currentRating]);

  const onHandleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNote(e.target.value);
  };

  const onHandleNoteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newNote) return;
    addNote(
      {
        content: newNote,
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

  const handleRatingSubmit = (rating: number) => {
    if (rating === currentRating) return;
    setRating(rating);
    submitRestaurantRating({
      restaurantId,
      rating,
      userId,
    });
  };

  return (
    <form
      onSubmit={onHandleNoteSubmit}
      className="w-full py-2 flex flex-col gap-2"
    >
      <div className="flex items-center gap-2">
        Rate:{" "}
        {isSubmittingRating ? (
          <span>Submitting...</span>
        ) : (
          <StarRating rating={rating} setRating={handleRatingSubmit} />
        )}
      </div>
      <textarea
        name="note"
        value={newNote}
        onChange={onHandleChange}
        placeholder="Add a note"
        className="w-full border border-black p-2 rounded-md"
      />
      <div className="flex justify-between items-start">
        <CustomizedButton
          type="submit"
          disabled={
            isAddingNote || !newNote.trim() || newNote.trim().length > 250
          }
        >
          Add Note
        </CustomizedButton>
        <span
          className={`text-sm font-bold ${
            newNote.trim().length > 250 ? "text-red-500" : "text-gray-400"
          }`}
        >
          {newNote.trim().length}/250
        </span>
      </div>
    </form>
  );
};
