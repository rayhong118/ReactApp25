import { SecondaryButton } from "@/components/Buttons";
import { Dialog } from "@/components/Dialog";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import { useAddMessageBars } from "@/utils/MessageBarsAtom";
import {
  faChartBar,
  faShareFromSquare,
} from "@fortawesome/free-regular-svg-icons";
import {
  faAngleDown,
  faAngleUp,
  faBookOpen,
  faDirections,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { lazy, useCallback, useState } from "react";
import { StarRating } from "../experiments/StarRating";
import type { IRestaurant } from "./Eat.types";
import { useGetCurrentUserRestaurantRating } from "./EatAtoms";
import { EatEditForm } from "./EatEditForm";
import "./EatNotesPanel.scss";
import { EatRatingHistogram } from "./EatRatingHistogram";
import { withComponentSuspense } from "@/hooks/withSuspense";
import { useTranslation } from "react-i18next";
import { EatMenu } from "./EatMenu";

const EatNotesPanel = lazy(() => import("./EatNotesPanel"));

export const EatCard = React.memo(
  ({ restaurant }: { restaurant: IRestaurant }) => {
    const [isNotesExpanded, setIsNotesExpanded] = useState(false);
    const [isHistogramExpanded, setIsHistogramExpanded] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
    const [wasNotesInitialized, setWasNotesInitialized] = useState(false);

    const { t } = useTranslation();
    const User = useGetCurrentUser();
    const currentUserRating = useGetCurrentUserRestaurantRating(
      restaurant.id || ""
    );
    const addMessageBars = useAddMessageBars();

    const toggleNotes = useCallback(() => {
      setIsNotesExpanded((prev) => !prev);
      if (!wasNotesInitialized) {
        setWasNotesInitialized(true);
      }
    }, []);

    const openEditDialog = useCallback(() => {
      setIsEditDialogOpen(true);
    }, []);

    const closeEditDialog = useCallback(() => {
      setIsEditDialogOpen(false);
    }, []);

    const openMenuDialog = useCallback(() => {
      setIsMenuDialogOpen(true);
    }, []);

    const closeMenuDialog = useCallback(() => {
      setIsMenuDialogOpen(false);
    }, []);

    const handleShare = useCallback(() => {
      const baseURL = window.location.origin;
      navigator.clipboard.writeText(`${baseURL}/eat?id=${restaurant.id}`);

      // if Share API is available (mobile)
      if (navigator.share) {
        navigator.share({
          title: restaurant.name,
          text: "Share this restaurant",
          url: `${baseURL}/eat?id=${restaurant.id}`,
        });
      } else {
        // fallback to copy to clipboard
        navigator.clipboard.writeText(`${baseURL}/eat?id=${restaurant.id}`);
        addMessageBars([
          {
            id: "share-success",
            message: "Link copied to clipboard",
            type: "success",
          },
        ]);
      }
    }, []);

    return (
      <div>
        <Dialog
          open={isEditDialogOpen}
          onClose={closeEditDialog}
          title="Edit Restaurant"
          customizedClassName="max-w-md"
        >
          <EatEditForm restaurant={restaurant} closeDialog={closeEditDialog} />
        </Dialog>
        <Dialog
          open={isMenuDialogOpen}
          onClose={closeMenuDialog}
          title={t("eat.menu.title")}
          customizedClassName="max-w-3xl"
        >
          <EatMenu restaurant={restaurant} closeDialog={closeMenuDialog} />
        </Dialog>
        <div className="border border-gray-300 p-4 rounded-md">
          <h1 className="text-xl font-bold">
            {restaurant.displayName || restaurant.name}
          </h1>

          {restaurant.displayName && (
            <h2 className="text-lg font-bold">{restaurant.name}</h2>
          )}
          <div>{restaurant.description}</div>

          <div className="flex justify-between items-center w-full">
            {restaurant.cityAndState && (
              <span className="px-2 py-0.5 bg-brand-light border-2 border-brand-soft text-brand-vibrant rounded-md">
                {restaurant.cityAndState}
              </span>
            )}
            <SecondaryButton onClick={handleShare}>
              <FontAwesomeIcon icon={faShareFromSquare} className="mr-2" />
              {t("eat.card.share")}
            </SecondaryButton>
          </div>
          <div>{restaurant.address}</div>
          <div>
            {t("eat.card.pricePerPerson")}: {restaurant.price}
          </div>

          <div className="flex items-center gap-2">
            {t("eat.card.averageRating")}:{" "}
            <StarRating rating={Number(restaurant.averageStars)} />{" "}
            {restaurant.averageStars}
            {restaurant.stars && (
              <SecondaryButton
                onClick={() => setIsHistogramExpanded((prev) => !prev)}
              >
                <FontAwesomeIcon icon={faChartBar} />
                {isHistogramExpanded ? (
                  <FontAwesomeIcon icon={faAngleDown} />
                ) : (
                  <FontAwesomeIcon icon={faAngleUp} />
                )}
              </SecondaryButton>
            )}
          </div>

          {restaurant.stars && isHistogramExpanded && (
            <div className="flex items-start gap-2 md:scale-90 bg-gray-100 p-2 rounded-md">
              <EatRatingHistogram ratings={restaurant.stars} />
            </div>
          )}

          {User && (
            <div className="flex items-center gap-2">
              {t("eat.card.yourRating")}:{" "}
              <StarRating rating={currentUserRating} />
            </div>
          )}

          <div className="flex justify-between align-center">
            <div className="flex align-center">
              <SecondaryButton onClick={toggleNotes}>
                {t("eat.card.notesAndRatings")}
                {isNotesExpanded ? (
                  <FontAwesomeIcon icon={faAngleDown} className="ml-2" />
                ) : (
                  <FontAwesomeIcon icon={faAngleUp} className="ml-2" />
                )}
              </SecondaryButton>
            </div>

            {/* Action buttons: Edit, Go, Menu */}
            <div className="flex">
              <SecondaryButton onClick={openMenuDialog}>
                <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
                {t("eat.card.menu")}
              </SecondaryButton>
              <SecondaryButton disabled={!User} onClick={openEditDialog}>
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                {t("eat.card.edit")}
              </SecondaryButton>
              <SecondaryButton
                onClick={() => window.open(restaurant.url, "_blank")}
              >
                <FontAwesomeIcon icon={faDirections} className="mr-2" />
                {t("eat.card.go")}
              </SecondaryButton>
            </div>
          </div>

          <div
            className={"eat-note-container " + (isNotesExpanded ? "open" : "")}
          >
            {wasNotesInitialized &&
              withComponentSuspense(<EatNotesPanel restaurant={restaurant} />)}
          </div>
        </div>
      </div>
    );
  }
);
