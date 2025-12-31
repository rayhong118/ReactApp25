import { SecondaryButton } from "@/components/Buttons";
import { useGetArtworks } from "./hooks";
import { useGetCategories } from "./hooks";
import { useState } from "react";
import "./Drawings.scss";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Drawings = () => {
  const { categories } = useGetCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const { data: artworks } = useGetArtworks({ category: selectedCategory });
  return (
    <div>
      <h1 className="text-2xl font-bold">Drawings</h1>
      <div>
        {categories?.map((category) => (
          <SecondaryButton
            key={category}
            onClick={() => setSelectedCategory(category)}
          >
            {selectedCategory === category && (
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
            )}
            {category}
          </SecondaryButton>
        ))}
      </div>
      {selectedCategory && (
        <div>
          <h2 className="text-xl font-bold">{selectedCategory}</h2>
          <div className="artworks">
            {artworks?.pages
              .flatMap((page) => page.artworks)
              .map((artwork) => (
                <div key={artwork.id} className="artwork-container">
                  <img src={artwork.imageURL} alt={artwork.title} />
                  <div className="artwork-info">
                    <h3 className="text-lg font-bold">{artwork.title}</h3>
                    <p className="text-sm">{artwork.description}</p>
                    <p className="text-sm font-bold">
                      {artwork.date?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Drawings;
