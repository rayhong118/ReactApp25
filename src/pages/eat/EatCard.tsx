import { faAngleDown, faAngleUp, faDirections, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { INotes, IRestaurant } from "./Eat.types";
import { StarRating } from "../experiments/StarRating";


export const EatCard = () => {
  const restaurant: IRestaurant = {
    id: "1",
    name: "Restaurant 1",
    displayName: "Restaurant 1 display name",
    description: "Description 1",
    address: "Address 1",
    price: 1,
    stars: { "1": 5, "2": 4, "3": 3, "4": 2, "5": 5 },
    notes: [
      {
        userId: "1",
        content: "Note 1",
        date: new Date()
      },
      {
        userId: "2",
        content: "Note 2",
        date: new Date()
      }
    ]
  };
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const averageRating: number | undefined = restaurant.stars ? Math.round(Object.values(restaurant.stars).reduce((curr, accu) => curr + accu, 0) / Object.values(restaurant.stars).length) : undefined;
  return (
    <div className='p-5 md:p-20'>
      <div className="border border-black p-4 rounded-md">
        <h1 className="text-lg font-bold">{restaurant.displayName || restaurant.name}</h1>
        {restaurant.displayName && <h2 className="font-bold">{restaurant.name}</h2>}
        <p>{restaurant.description}</p>
        <p>{restaurant.address}</p>
        <p>Price: {restaurant.price}</p>
        <p>Rating: <StarRating rating={averageRating} /></p>
        <div className="flex justify-between align-center">
          <div className="flex align-center">
            <button className="cursor-pointer border border-black p-2 rounded-md" onClick={() => setIsNotesExpanded(!isNotesExpanded)}>Notes {isNotesExpanded ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleUp} />}</button>
          </div>

          <div className="flex gap-2">
            <button className="cursor-pointer border border-black p-2 rounded-md"><FontAwesomeIcon icon={faEdit} />Edit</button>
            <button className="cursor-pointer border border-black p-2 rounded-md"><FontAwesomeIcon icon={faDirections} />Go</button>
          </div>
        </div>

        {isNotesExpanded && (
          <div>
            {restaurant.notes?.map((note, index) => (
              <Note key={index} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Note = ({ note }: { note: INotes }) => {
  return (
    <div className="border-l-solid border-l-gray-200 border-l-2 my-2">
      <p>{note.content}</p>
      <p>{note.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
  );
};