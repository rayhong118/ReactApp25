import { CustomizedButton, PrimaryButton } from "@/components/Buttons";
import { Loading } from "@/components/Loading";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Drawings.scss";
import { useGetArtworks, useGetCategories } from "./hooks";
import { Dialog } from "@/components/Dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";

const Drawings = () => {
  const { categories } = useGetCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    categories?.[0]
  );
  const [selectedImageId, setSelectedImageId] = useState<string>();
  const navigate = useNavigate();
  const {
    data: artworks,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetArtworks({ category: selectedCategory });
  return (
    <div className="flex flex-col gap-4">
      <Dialog
        open={!!selectedImageId}
        onClose={() => setSelectedImageId(undefined)}
      >
        <img
          src={
            artworks?.pages
              .flatMap((page) => page.artworks)
              .find((artwork) => artwork.id === selectedImageId)?.imageURL
          }
          alt={
            artworks?.pages
              .flatMap((page) => page.artworks)
              .find((artwork) => artwork.id === selectedImageId)?.title
          }
        />
      </Dialog>
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
                  onClick={() => setSelectedImageId(artwork.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedImageId(artwork.id);
                    }
                  }}
                >
                  <img src={artwork.imageURL} alt={artwork.title} />
                  <div className="artwork-overlay">
                    <div className="artwork-actions">
                      <button onClick={() => setSelectedImageId(artwork.id)}>
                        <FontAwesomeIcon icon={faEye} /> View
                      </button>
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
