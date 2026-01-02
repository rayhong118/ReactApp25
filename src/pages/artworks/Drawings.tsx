import { CustomizedButton, PrimaryButton } from "@/components/Buttons";
import { ImageDisplay } from "@/components/ImageDisplay";
import { Loading } from "@/components/Loading";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { IArtwork } from "./Artworks.types";
import "./Drawings.scss";
import { useGetArtworks, useGetCategories } from "./hooks";
import withScrollToTopButton from "@/hooks/withScrollToTopButton";
import { useNavigate } from "react-router-dom";

const Drawings = () => {
  const navigate = useNavigate();

  const { categories } = useGetCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories?.[0]
  );
  const [selectedImage, setSelectedImage] = useState<IArtwork>();
  const {
    data: artworks,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetArtworks({ category: selectedCategory });
  return withScrollToTopButton(
    <div className="flex flex-col gap-4">
      <ImageDisplay
        open={!!selectedImage}
        onClose={() => setSelectedImage(undefined)}
        src={selectedImage?.imageURL || ""}
        alt={selectedImage?.title || ""}
        title={selectedImage?.title || ""}
      />
      <h1 className="text-2xl font-bold">Drawings</h1>
      <div className="flex gap-2 flex-wrap">
        {categories?.map((category) => (
          <CustomizedButton
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category ? "underline font-bold" : ""
            }
          >
            {category}
          </CustomizedButton>
        ))}
      </div>
      {selectedCategory && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">{selectedCategory}</h2>
          <div className="artworks">
            {artworks?.pages
              .flatMap((page) => page.artworks)
              .map((artwork) => (
                <div
                  key={artwork.id}
                  className="artwork-container"
                  tabIndex={0}
                  role="region"
                  aria-label="Artwork"
                  aria-description="Click to view artwork"
                  onClick={() => setSelectedImage(artwork)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedImage(artwork);
                    }
                  }}
                >
                  <img src={artwork.imageURL} alt={artwork.title} />
                  <div className="artwork-overlay">
                    <div className="artwork-actions">
                      <CustomizedButton
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`/drawings/upload?id=${artwork.id}`);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </CustomizedButton>
                    </div>
                    <div className="artwork-info">
                      <h3 className="text-lg font-bold">{artwork.title}</h3>
                      <p>{artwork.description}</p>
                      <p className="text-sm font-bold">
                        {artwork.date?.toLocaleDateString()}
                      </p>
                    </div>
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
