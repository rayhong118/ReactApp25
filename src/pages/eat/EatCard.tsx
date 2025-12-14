import { Dialog, type IDialogAction } from "@/components/Dialog";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import {
  faAngleDown,
  faAngleUp,
  faDirections,
  faEdit,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { StarRating } from "../experiments/StarRating";
import type { INote, IRestaurant } from "./Eat.types";
import { EatEditForm } from "./EatEditForm";
import { useAddRestaurantNote, useDeleteRestaurantNote, useGetRestaurantNotes } from "./hooks";
import { CustomizedButton } from "@/components/Buttons";

export const EatCard = ({ restaurant }: { restaurant: IRestaurant }) => {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const User = useGetCurrentUser();
  const averageRating: number | undefined = restaurant.stars
    ? Math.round(
      Object.values(restaurant.stars).reduce((curr, accu) => curr + accu, 0) /
      Object.values(restaurant.stars).length
    )
    : undefined;

  const userRating: number | undefined = restaurant.stars && User?.uid
    ? restaurant.stars[User?.uid]
    : undefined;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Edit Restaurant"
      >
        <EatEditForm restaurant={restaurant} closeDialog={() => setIsDialogOpen(false)} />
      </Dialog>
      <div className="border border-black p-4 rounded-md">
        <h1 className="text-lg font-bold">
          {restaurant.displayName || restaurant.name}
        </h1>
        {restaurant.displayName && (
          <h2 className="text-xs font-bold">{restaurant.name}</h2>
        )}
        <div>{restaurant.description}</div>
        <div className="flex flex-wrap align-center items-center">
          {restaurant.cityAndState && <div className="text-sm px-2 py-0.5 bg-blue-200 rounded-md">
            {restaurant.cityAndState}
          </div>}
          <div className="text-sm">{restaurant.address}</div>
        </div>
        <div className="text-sm">Price Per Person: {restaurant.price}</div>
        <div className="flex flex-wrap">
          {userRating && <div className="flex items-center gap-2 pr-2 text-sm">Your Rating: <StarRating rating={userRating} /></div>}
          {averageRating && <div className="flex items-center gap-2 text-sm">Average: <StarRating rating={averageRating} /></div>}
        </div>
        <div className="flex justify-between align-center">
          <div className="flex align-center">

            <CustomizedButton
              onClick={() => setIsNotesExpanded(!isNotesExpanded)}
            >
              Notes
              {isNotesExpanded ? (
                <FontAwesomeIcon icon={faAngleDown} className="ml-2" />
              ) : (
                <FontAwesomeIcon icon={faAngleUp} className="ml-2" />
              )}
            </CustomizedButton>

          </div>

          <div className="flex gap-2">
            <CustomizedButton
              disabled={!User}
              onClick={() => setIsDialogOpen(true)}
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Edit
            </CustomizedButton>
            <CustomizedButton
              onClick={() => window.open(restaurant.url, "_blank")}
            >
              <FontAwesomeIcon icon={faDirections} className="mr-2" />
              Go
            </CustomizedButton>
          </div>
        </div>

        {isNotesExpanded && (
          <div>
            <Notes restaurantId={restaurant.id!} />
          </div>
        )}
      </div>
    </div>
  );
};

interface INotesProps {
  restaurantId: string;
}

const Notes = ({ restaurantId }: INotesProps) => {
  const { data: notes, refetch, isFetching } = useGetRestaurantNotes(restaurantId);
  const [newNote, setNewNote] = useState("");
  const User = useGetCurrentUser();

  const { mutate: addNote, isPending: isAddingNote } = useAddRestaurantNote(restaurantId);

  if (!notes && !isFetching) return <div>No notes found</div>;

  const onHandleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNote(e.target.value);
  }

  const onHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newNote) return;
    addNote({
      content: newNote,
      userId: User?.uid!,
      date: Timestamp.now(),
      restaurantId
    });
    setNewNote("");
    refetch();
  }

  return (
    <div className='flex flex-col w-full'>
      {User && <form onSubmit={onHandleSubmit} className="w-full py-5">
        <textarea
          name="note"
          value={newNote}
          onChange={onHandleChange}
          placeholder="Add a note"
          className="w-full border border-black p-2 mb-2 rounded-md"
        />
        <div className="flex justify-between items-start">
          <CustomizedButton
            type="submit"
            disabled={isAddingNote || !newNote.trim() || newNote.trim().length > 250}
          >
            Add Note
          </CustomizedButton>
          <span
            className={`text-sm font-bold ${newNote.trim().length > 250 ? "text-red-500" : "text-gray-400"}`}
          >
            {newNote.trim().length}/250
          </span>
        </div>
      </form>}
      {notes?.length === 0 ? <div>No notes found</div> : <div className="flex flex-col w-full gap-5">
        {notes?.map((note) => (
          <Note key={note.id} note={note} refetch={refetch} />
        ))}
      </div>}

    </div>
  )
}

const Note = ({ note, refetch }: { note: INote, refetch: () => void }) => {
  const User = useGetCurrentUser();
  const { mutate: deleteNote, isPending: isDeletingNote } = useDeleteRestaurantNote();

  const handleDelete = () => {
    deleteNote(note.id!);
    refetch();
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogActions: IDialogAction[] = [
    {
      label: "Yes",
      onClick: handleDelete,
    },
    {
      label: "No",
      onClick: () => setIsDialogOpen(false)
    }
  ];

  return (
    <div className="border-l-solid border-l-gray-200 border-l-5 px-2">
      <p>{note.content}</p>
      <div className="flex justify-between items-center">
        <p>
          {note.date.toDate().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        {User?.uid === note.userId && (
          <div className="flex gap-2">
            <CustomizedButton
              onClick={() => setIsDialogOpen(true)}
              disabled={isDeletingNote}
              className="bg-red-500 text-white hover:bg-red-700"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2 " />
              Delete
            </CustomizedButton>
          </div>
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
