import { PrimaryButton } from "@/components/Buttons";
import { Dialog } from "@/components/Dialog";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import InfiniteScrollTrigger from "@/utils/InfiniteScrollTrigger.tsx";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { IRestaurant } from "./Eat.types";
import { EatCard } from "./EatCard.tsx";
import { EatEditForm } from "./EatEditForm";
import { useEatListSort, useRestaurantList } from "./hooks/eatListHooks.tsx";
import { EatSort } from "./EatSort";

export const EatList = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { orderBy } = useEatListSort();
  const {
    restaurants: allRestaurants,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    eatQuery,
  } = useRestaurantList(orderBy);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const User = useGetCurrentUser();

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-5 w-full">
      <PrimaryButton disabled={!User} onClick={() => setIsDialogOpen(true)}>
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        {t("eat.list.addRestaurant")}
      </PrimaryButton>

      {!eatQuery.id && <EatSort />}

      {allRestaurants?.map((restaurant: IRestaurant) => (
        <EatCard key={restaurant.id} restaurant={restaurant} />
      ))}

      <InfiniteScrollTrigger
        onIntersect={fetchNextPage}
        hasMore={hasNextPage}
        isLoading={isFetchingNextPage}
      />

      {!hasNextPage && <div>{t("eat.list.endOfList")}</div>}

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        title={t("eat.list.addRestaurant")}
        customizedClassName="w-lg"
      >
        <EatEditForm restaurant={undefined} closeDialog={handleDialogClose} />
      </Dialog>
    </div>
  );
};
