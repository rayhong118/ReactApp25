import { PrimaryButton } from "@/components/Buttons";
import { Dialog } from "@/components/Dialog";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import type { IRestaurant } from "./Eat.types";
import {
  useGetFilterSearchQuery,
  useSetCurrentUserRestaurantRatings,
} from "./EatAtoms";
import { EatCard } from "./EatCard.tsx";
import { EatEditForm } from "./EatEditForm";
import {
  useFetchCurrentUserRestaurantRatings,
  useGetRestaurants,
} from "./hooks";

import { Loading } from "@/components/Loading.tsx";
import { useEffect } from "react";

export const EatList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderBy, setOrderBy] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "",
    direction: "asc",
  });
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const eatQuery = useGetFilterSearchQuery();
  const {
    data: restaurants,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
    isFetchingNextPage,
  } = useGetRestaurants(eatQuery, orderBy);
  const { data: currentUserRatings } = useFetchCurrentUserRestaurantRatings();
  const setCurrentUserRatings = useSetCurrentUserRestaurantRatings();

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const User = useGetCurrentUser();

  const allRestaurants = restaurants?.pages.flatMap((page) => page.restaurants);

  useEffect(() => {
    // populate currentUserRatings for each restaurant
    if (currentUserRatings) {
      setCurrentUserRatings(currentUserRatings);
    }
  }, [currentUserRatings]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      refetch();
    }, 500);
  }, [orderBy]);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-5 w-full">
      <PrimaryButton disabled={!User} onClick={() => setIsDialogOpen(true)}>
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add Restaurant
      </PrimaryButton>
      <div className="flex gap-2 items-center">
        <div>Order by</div>
        <select
          onChange={(e) => {
            const [field, direction] = e.target.value.split(",");
            setOrderBy({
              field,
              direction: direction as "asc" | "desc",
            });
          }}
          value={orderBy.field + "," + orderBy.direction}
          className="border border-gray-300 rounded p-2"
        >
          <option className="p-2" value="">
            None
          </option>
          <option className="p-2" value={["averageStars", "desc"]}>
            Average Rating (high to low)
          </option>
          <option className="p-2" value={["averageStars", "asc"]}>
            Average Rating (low to high)
          </option>
          <option className="p-2" value={["price", "asc"]}>
            Price (low to high)
          </option>
          <option className="p-2" value={["price", "desc"]}>
            Price (high to low)
          </option>
        </select>
      </div>

      {allRestaurants?.map((restaurant: IRestaurant) => (
        <EatCard key={restaurant.id} restaurant={restaurant} />
      ))}

      <InfiniteScrollTrigger
        onIntersect={fetchNextPage}
        hasMore={hasNextPage}
        isLoading={isFetchingNextPage}
      />

      {!hasNextPage && <div>End of list</div>}

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        title="Add Restaurant"
      >
        <EatEditForm restaurant={undefined} closeDialog={handleDialogClose} />
      </Dialog>
    </div>
  );
};

const InfiniteScrollTrigger = ({
  onIntersect,
  hasMore,
  isLoading,
}: {
  onIntersect: () => void;
  hasMore: boolean;
  isLoading: boolean;
}) => {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onIntersect();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [onIntersect, hasMore, isLoading]);

  return (
    <div ref={observerTarget} style={{ height: "20px", margin: "10px 0" }}>
      {isLoading && <Loading />}
    </div>
  );
};
