import { useEffect, useRef, useState } from "react";
import "./imageCarousel.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle as regularCircle } from "@fortawesome/free-regular-svg-icons";
import { faCircle as solidCircle } from "@fortawesome/free-solid-svg-icons";

const images = [
  {
    src: "https://picsum.photos/id/600/600/400",
    alt: "Forest",
  },
  {
    src: "https://picsum.photos/id/100/600/400",
    alt: "Beach",
  },
  {
    src: "https://picsum.photos/id/200/600/400",
    alt: "Yak",
  },
  {
    src: "https://picsum.photos/id/300/600/400",
    alt: "Hay",
  },
  {
    src: "https://picsum.photos/id/400/600/400",
    alt: "Plants",
  },
  {
    src: "https://picsum.photos/id/500/600/400",
    alt: "Building",
  },
];

export const ImageCarousel = () => {
  const imageDisplayArray = [...images];
  // const imageDisplayArray = [...images];
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const firstImageRef = useRef<HTMLImageElement>(null);

  const moveToIndex = (index: number) => {

    if (carouselRef.current) {
      if (currentIndex === 0 || currentIndex === imageDisplayArray.length - 1) {
        carouselRef.current.style.transform = `translateX(-${index * 100}% )`;
        carouselRef.current.style.transition = "0.5s ease-in-out";

      } else {
        carouselRef.current.style.transform = `translateX(-${index * 100}% )`;
        carouselRef.current.style.transition = "0.5s ease-in-out";
      }
    }
    setCurrentIndex(index);
  };

  const handleLeftClick = () => {
    moveToIndex(currentIndex === 0 ? imageDisplayArray.length - 1 : currentIndex - 1);
  };

  const handleRightClick = () => {
    moveToIndex(currentIndex === imageDisplayArray.length - 1 ? 0 : currentIndex + 1);
  };

  useEffect(() => {
    if (firstImageRef.current) {
      firstImageRef.current.style.position = 'absolute';
      firstImageRef.current.style.transform = `translateX(-${currentIndex * 100}% )`;
    }
  }, [currentIndex]);

  return (
    <div className="p-20" id="imageCarousel">
      <h1 className="text-2xl font-bold mb-4">Image Carousel</h1>
      <span>{currentIndex}</span>
      <div className="flex flex-row align-center justify-center border ">
        <button className="p-4" onClick={() => handleLeftClick()}>{"<"}</button>
        <div className="w-100 overflow-hidden">
          <div className="flex flex-row " ref={carouselRef}>
            {imageDisplayArray.map((image, index) => (
              <img key={index} src={image.src} alt={image.alt} />
            ))}
          </div>
        </div>
        <button className="p-4" onClick={() => handleRightClick()}>{">"}</button>
      </div>
      <span className="flex flex-row align-center justify-center">{images.map((_, index) => (
        <span key={index} className="p-2 " onClick={() => moveToIndex(index)}>{index === currentIndex ? (<FontAwesomeIcon className='cursor-pointer' icon={solidCircle} />) : (<FontAwesomeIcon className='cursor-pointer' icon={regularCircle} />)}</span>
      ))}</span>
    </div>
  );
};
