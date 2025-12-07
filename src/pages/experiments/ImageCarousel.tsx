import { useState } from "react";
import "./imageCarousel.scss";

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
  //   const imageDisplayArray = [images[images.length - 1], ...images, images[0]];
  const imageDisplayArray = [...images];
  const [currentIndex, setCurrentIndex] = useState(1);
  return (
    <div className="p-20" id="imageCarousel">
      <h1 className="text-2xl font-bold mb-4">Image Carousel</h1>
      <div className="flex flex-row align-center justify-center border ">
        <button className="p-4">{"<"}</button>
        <div className="w-100 overflow-hidden">
          <div className="flex flex-row ">
            {imageDisplayArray.map((image, index) => (
              <img key={index} src={image.src} alt={image.alt} />
            ))}
          </div>
        </div>
        <button className="p-4">{">"}</button>
      </div>
    </div>
  );
};
