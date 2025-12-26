import { CustomizedButton } from "@/components/Buttons";
import { type IDialogAction, Dialog } from "@/components/Dialog";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StarRating } from "../experiments/StarRating";
import type { INote } from "./Eat.types";
import { useGetCurrentUserRestaurantRating } from "./EatAtoms";
import {
  useAddRestaurantNote,
  useDeleteRestaurantNote,
  useGetRestaurantNotes,
  useSubmitRestaurantRating,
} from "./hooks";

interface INotesProps {
  restaurantId: string;
}

const EatNotesPanel = ({ restaurantId }: INotesProps) => {
  const {
    data: notes,
    refetch,
    isFetching,
  } = useGetRestaurantNotes(restaurantId);
  const [newNote, setNewNote] = useState("");
  const User = useGetCurrentUser();

  const { mutate: submitRestaurantRating, isPending: isSubmittingRating } =
    useSubmitRestaurantRating();

  const currentRating = useGetCurrentUserRestaurantRating(restaurantId);

  const { mutate: addNote, isPending: isAddingNote } =
    useAddRestaurantNote(restaurantId);

  if (!notes && !isFetching) return <div>No notes found</div>;

  const onHandleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNote(e.target.value);
  };

  const [rating, setRating] = useState(currentRating || 0);

  useEffect(() => {
    if (currentRating !== 0 && rating === 0) {
      setRating(currentRating);
    }
  }, [currentRating]);

  const onHandleNoteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newNote) return;
    addNote({
      content: newNote,
      userId: User?.uid || "",
      date: Timestamp.now(),
      restaurantId,
    });
    setNewNote("");
    refetch();
  };

  const handleRatingSubmit = (rating: number) => {
    if (rating === currentRating) return;
    setRating(rating);
    submitRestaurantRating({
      restaurantId,
      rating,
      userId: User?.uid || "",
    });
  };

  return (
    <div className="flex flex-col w-full">
      {User && (
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
      )}
      {notes?.length === 0 ? (
        <div>No notes found</div>
      ) : (
        <div className="flex flex-col w-full gap-2">
          {notes?.map((note) => (
            <Note key={note.id} note={note} refetch={refetch} />
          ))}
        </div>
      )}
    </div>
  );
};

const Note = ({ note, refetch }: { note: INote; refetch: () => void }) => {
  const User = useGetCurrentUser();
  const { mutate: deleteNote, isPending: isDeletingNote } =
    useDeleteRestaurantNote();

  const handleDelete = () => {
    deleteNote(note.id!);
    refetch();
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogActions: IDialogAction[] = [
    {
      label: "Yes",
      onClick: handleDelete,
    },
    {
      label: "No",
      onClick: () => setIsDialogOpen(false),
    },
  ];

  return (
    <div className="border-l-solid border-l-gray-200 border-l-5 px-2">
      <p>{note.content}</p>
      <div className="flex justify-between items-center">
        <p className="text-sm font-bold">
          {note.date.toDate().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        {User?.uid === note.userId && (
          <CustomizedButton
            onClick={() => setIsDialogOpen(true)}
            disabled={isDeletingNote}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2 " />
            Delete
          </CustomizedButton>
        )}
      </div>
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        actions={dialogActions}
        title="Delete Note"
      >
        Do you want to delete this note?
      </Dialog>
    </div>
  );
};

export default EatNotesPanel;
