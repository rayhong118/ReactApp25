import { Dialog } from "@/components/Dialog";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import {
  faDirections,
  faEdit
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { StarRating } from "../experiments/StarRating";
import type { IRestaurant } from "./Eat.types";
import { EatEditForm } from "./EatEditForm";

export const EatCard = ({ restaurant }: { restaurant: IRestaurant }) => {
  // const [isNotesExpanded, setIsNotesExpanded] = useState(false);
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
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <EatEditForm restaurant={restaurant} />
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
          <div className="text-xs">{restaurant.address}</div>
        </div>
        <div className="text-sm">Price Per Person: {restaurant.price}</div>
        <div className="flex flex-wrap">
          {userRating && <div className="flex items-center gap-2 pr-2 text-sm">Your Rating: <StarRating rating={userRating} /></div>}
          {averageRating && <div className="flex items-center gap-2 text-sm">Average: <StarRating rating={averageRating} /></div>}
        </div>
        <div className="flex justify-between align-center">
          <div className="flex align-center">
            {/* {restaurant.notes?.length && (
              <button
                className="cursor-pointer border border-black p-2 rounded-md disabled:bg-gray-200"
                onClick={() => setIsNotesExpanded(!isNotesExpanded)}
              >
                Notes
                {isNotesExpanded ? (
                  <FontAwesomeIcon icon={faAngleDown} />
                ) : (
                  <FontAwesomeIcon icon={faAngleUp} />
                )}
              </button>
            )} */}
          </div>

          <div className="flex gap-2">
            <button className="cursor-pointer border border-black p-2 rounded-md"
              onClick={() => setIsDialogOpen(true)}
            >
              <FontAwesomeIcon icon={faEdit} />
              Edit
            </button>
            <button className="cursor-pointer border border-black p-2 rounded-md"
              onClick={() => window.open(restaurant.url, "_blank")}
            >
              <FontAwesomeIcon icon={faDirections} />
              Go
            </button>
          </div>
        </div>

        {/* {isNotesExpanded && (
          <div>
          </div>
        )} */}
      </div>
    </div>
  );
};

// const Note = ({ note }: { note: INotes }) => {
//   return (
//     <div className="border-l-solid border-l-gray-200 border-l-2 my-2">
//       <p>{note.content}</p>
//       <p>
//         {note.date.toLocaleDateString("en-US", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//         })}
//       </p>
//     </div>
//   );
// };
