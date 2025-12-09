import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export const StarRating = () => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const starArray = [1, 2, 3, 4, 5];
    return (
        <div className='p-20'>
            <h1>Star Rating</h1>
            <div className="flex" onMouseLeave={() => setHover(rating)}>
                {starArray.map((star, index) => (
                    <span key={index} onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} className="cursor-pointer">
                        {star <= hover ? <FontAwesomeIcon icon={solidStar} className={`text-yellow-300`} /> : <FontAwesomeIcon icon={regularStar} className={`text-yellow-300`} />}
                    </span>
                ))}
            </div>
            <p>Rating: {rating}</p>
        </div>
    );
};