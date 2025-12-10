import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface IStarRatingProps {
  rating?: number;
  setRating?: (rating: number) => void;
}
export const StarRating = ({ rating = 0, setRating }: IStarRatingProps) => {
  const [hover, setHover] = useState(rating);
  const starArray = [1, 2, 3, 4, 5];
  return (
    <div>
      <div className="flex" onMouseLeave={() => setHover(rating)}>
        {setRating
          ? starArray.map((star, index) => (
            <span
              key={index}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              className="cursor-pointer"
            >
              {star <= hover ? (
                <FontAwesomeIcon
                  icon={solidStar}
                  className={`text-yellow-300`}
                />
              ) : (
                <FontAwesomeIcon
                  icon={regularStar}
                  className={`text-yellow-300`}
                />
              )}
            </span>
          ))
          : starArray.map((star, index) => (
            <span key={index} className="cursor-pointer">
              {star <= hover ? (
                <FontAwesomeIcon
                  icon={solidStar}
                  className={`text-yellow-300`}
                />
              ) : (
                <FontAwesomeIcon
                  icon={regularStar}
                  className={`text-yellow-300`}
                />
              )}
            </span>
          ))}
      </div>
    </div>
  );
};
