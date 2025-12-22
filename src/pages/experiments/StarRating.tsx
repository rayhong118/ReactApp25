import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

interface IStarRatingProps {
  rating?: number;
  setRating?: (rating: number) => void;
}

const starArray = [1, 2, 3, 4, 5];

export const StarRating = React.memo(
  ({ rating = 0, setRating }: IStarRatingProps) => {
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const displayRating = hoverRating !== null ? hoverRating : rating;

    return (
      <div>
        <div className="flex" onMouseLeave={() => setHoverRating(null)}>
          {setRating
            ? starArray.map((star, index) => (
                <span
                  key={index}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  className="cursor-pointer px-2 text-lg"
                >
                  {star <= displayRating ? (
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
                <span key={index}>
                  {star <= displayRating ? (
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
  }
);
