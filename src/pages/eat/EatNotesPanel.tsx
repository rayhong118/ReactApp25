import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import EatNote from "./EatNote";
import { EatNoteInput } from "./EatNoteInput";
import { useGetRestaurantNotes } from "./hooks/eatNoteHooks";

interface INotesProps {
  restaurantId: string;
}

/**
 * This component displays a panel for notes of a restaurant
 * @param restaurantId - id of the restaurant
 */
const EatNotesPanel = ({ restaurantId }: INotesProps) => {
  const User = useGetCurrentUser();
  const {
    data: notes,
    refetch,
    isFetching,
  } = useGetRestaurantNotes(restaurantId);
  if (!notes && !isFetching) return <div>No notes found</div>;

  return (
    <div className={"w-full min-h-0"}>
      <div className="flex flex-col min-h-0">
        {User ? (
          <EatNoteInput
            restaurantId={restaurantId}
            onNoteAdded={refetch}
            userId={User.uid}
          />
        ) : (
          <div>Please login to add a note</div>
        )}
        {notes?.length === 0 ? (
          <div>No notes found</div>
        ) : (
          <div className="flex flex-col w-full gap-2">
            {notes?.map((note) => (
              <EatNote key={note.id} note={note} refetch={refetch} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EatNotesPanel;
