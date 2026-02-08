import { useGetCurrentUser } from "@/pages/auth/AuthenticationAtoms";
import EatNote from "./EatNote";
import { EatNoteInput } from "./EatNoteInput";
import EatNotesSummary from "./EatNotesSummary";
import { useGetRestaurantNotes } from "./hooks/eatNoteHooks";
import type { IRestaurant } from "./Eat.types";

/**
 * This component displays a panel for notes of a restaurant
 * @param restaurant - restaurant object
 */
const EatNotesPanel = ({ restaurant }: { restaurant: IRestaurant }) => {
  const User = useGetCurrentUser();
  const {
    data: notes,
    refetch,
    isFetching,
  } = useGetRestaurantNotes(restaurant.id!);

  if (!notes && !isFetching) return <div>No notes found</div>;

  return (
    <div className={"w-full min-h-0"}>
      <div className="flex flex-col min-h-0">
        {User ? (
          <EatNoteInput
            restaurantId={restaurant.id!}
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
            <EatNotesSummary notes={notes || []} restaurant={restaurant} />
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
