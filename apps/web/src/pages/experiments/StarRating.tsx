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
    const displayRating =
      hoverRating !== null ? hoverRating : Math.round(rating);

    const isInteractive = !!setRating;

    return (
      <div
        className="flex"
        onMouseLeave={isInteractive ? () => setHoverRating(null) : undefined}
      >
        {starArray.map((star) => (
          <span
            key={star}
            role={isInteractive ? "button" : undefined}
            tabIndex={isInteractive ? 0 : undefined}
            aria-label={isInteractive ? `Rate ${star} out of 5 stars` : undefined}
            onClick={isInteractive ? () => setRating(star) : undefined}
            onMouseEnter={isInteractive ? () => setHoverRating(star) : undefined}
            onKeyDown={
              isInteractive
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setRating(star);
                    }
                  }
                : undefined
            }
            className={`${
              isInteractive ? "cursor-pointer px-2" : ""
            } text-lg transition-colors`}
          >
            <FontAwesomeIcon
              icon={star <= displayRating ? solidStar : regularStar}
              className="text-[var(--color-brand-vibrant)]"
            />
          </span>
        ))}
      </div>
    );
  },
);
