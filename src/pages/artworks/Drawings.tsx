import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { useGetArtworks } from "./hooks";
import { useGetCategories } from "./hooks";
import { useState } from "react";
import "./Drawings.scss";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loading } from "@/components/Loading";

const Drawings = () => {
  const { categories } = useGetCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const {
    data: artworks,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetArtworks({ category: selectedCategory });
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Drawings</h1>
      <div className="flex gap-2">
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
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">{selectedCategory}</h2>
          <div className="artworks">
            {artworks?.pages
              .flatMap((page) => page.artworks)
              .map((artwork) => (
                <div key={artwork.id} className="artwork-container">
                  <img src={artwork.imageURL} alt={artwork.title} />
                  <div className="artwork-info">
                    <h3 className="text-lg font-bold">{artwork.title}</h3>
                    <p>{artwork.description}</p>
                    <p className="text-sm font-bold">
                      {artwork.date?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          {hasNextPage ? (
            <PrimaryButton
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              paddingMultiplier={2}
            >
              Load More
            </PrimaryButton>
          ) : (
            <h2 className="text-xl font-bold">End of list</h2>
          )}
        </div>
      )}
      {isFetchingNextPage && <Loading />}
    </div>
  );
};

export default Drawings;
