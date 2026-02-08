import { PrimaryButton } from "@/components/Buttons";
import { ImageDisplay } from "@/components/ImageDisplay";
import { Loading } from "@/components/Loading";
import withScrollToTopButton from "@/hooks/withScrollToTopButton";
import { useAddMessageBars } from "@/utils/MessageBarsAtom";
import { faEdit, faShareSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IArtwork } from "./Artworks.types";
import "./Drawings.scss";
import { useGetArtworks, useGetCategories } from "./hooks";
import { useGetCurrentUser } from "@/pages/auth/AuthenticationAtoms";
import TabList from "@/components/TabList";

const Drawings = () => {
  const navigate = useNavigate();
  const currentUser = useGetCurrentUser();

  const { categories, isLoading } = useGetCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories?.[0],
  );
  const [selectedImage, setSelectedImage] = useState<IArtwork>();
  const {
    data: artworks,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetArtworks({ category: selectedCategory });
  const addMessageBars = useAddMessageBars();
  return withScrollToTopButton(
    <div className="flex flex-col gap-4">
      {isLoading && <Loading />}
      <ImageDisplay
        open={!!selectedImage}
        onClose={() => setSelectedImage(undefined)}
        src={selectedImage?.imageURL || ""}
        alt={selectedImage?.title || ""}
        title={selectedImage?.title || ""}
      />
      <h1 className="text-2xl font-bold">Drawings</h1>
      <div className="flex gap-2 flex-wrap">
        {categories && (
          <TabList
            tabs={categories}
            onTabSelect={(category: string) => setSelectedCategory(category)}
            selectedTab={selectedCategory}
          />
        )}
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
                      {currentUser && (
                        <button
                          className="p-1 text-white bg-black/30 hover:bg-black/50"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/drawings/upload?id=${artwork.id}`);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} /> Edit
                        </button>
                      )}
                      <button
                        className="p-1 text-white bg-black/30 hover:bg-black/50"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const baseURL = window.location.origin;
                          if (navigator.share) {
                            navigator.share({
                              title: artwork.title,
                              text: "Share this artwork",
                              url: `${baseURL}/drawings?id=${artwork.id}`,
                            });
                          } else {
                            navigator.clipboard.writeText(
                              `${baseURL}/drawings?id=${artwork.id}`,
                            );
                            addMessageBars([
                              {
                                id: "share-success",
                                message: "Link copied to clipboard",
                                type: "success",
                              },
                            ]);
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faShareSquare} /> Share
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
          {hasNextPage && !isFetchingNextPage ? (
            <PrimaryButton
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              Load More
            </PrimaryButton>
          ) : (
            <h2 className="text-xl font-bold">End of list</h2>
          )}
        </div>
      )}
      {isFetchingNextPage && <Loading />}
    </div>,
  );
};

export default Drawings;
