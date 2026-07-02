import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareFromSquare } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowLeft,
  faEdit,
  faDirections,
  faChartBar,
  faAngleDown,
  faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import { useGetRestaurant } from "./hooks/hooks";
import { useGetCurrentUserRestaurantRating } from "./EatAtoms";
import { useGetCurrentUser } from "@/pages/auth/AuthenticationAtoms";
import { useAddMessageBars } from "@/utils/MessageBarsAtom";
import { StarRating } from "../experiments/StarRating";
import { EatRatingHistogram } from "./EatRatingHistogram";
import EatNotesPanel from "./EatNotesPanel";
import { EatMenu } from "./EatMenu";
import { EatEditForm } from "./EatEditForm";
import { Dialog } from "@/components/Dialog";
import { SecondaryButton } from "@/components/Buttons";
import SEO from "@/components/SEO";
import { Loading } from "@/components/Loading";

export const EatDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const User = useGetCurrentUser();
  const addMessageBars = useAddMessageBars();

  const { data: restaurant, isLoading, error } = useGetRestaurant(id);
  const currentUserRating = useGetCurrentUserRestaurantRating(id || "");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isHistogramExpanded, setIsHistogramExpanded] = useState(true);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loading />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-2xl font-bold text-red-500">
          {t("eat.notFound") || "Restaurant Not Found"}
        </h2>
        <Link
          to="/eat"
          className="text-brand-primary hover:underline flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          {t("eat.backToList") || "Back to Restaurants"}
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    const baseURL = window.location.origin;
    const shareURL = `${baseURL}/eat/${restaurant.id}`;

    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: "Check out this restaurant!",
        url: shareURL,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareURL);
      addMessageBars([
        {
          id: "share-success",
          message: "Link copied to clipboard",
          type: "success",
          autoDismiss: true,
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 py-6">
      <SEO
        title={`${restaurant.displayName || restaurant.name} - Restaurant Details`}
        description={restaurant.description || "View restaurant details, ratings, user notes, and menu."}
      />

      {/* Back button */}
      <div>
        <Link
          to="/eat"
          className={
            "inline-flex items-center gap-2 text-brand-primary " +
            "hover:text-brand-dark transition-colors font-medium"
          }
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          {t("eat.backToList") || "Back to Restaurants"}
        </Link>
      </div>

      {/* Main Glassmorphic Header Card */}
      <div
        className={
          "relative overflow-hidden rounded-2xl border border-gray-200 " +
          "dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md " +
          "p-6 md:p-8 shadow-xl flex flex-col md:flex-row justify-between " +
          "items-start md:items-center gap-6"
        }
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {restaurant.displayName || restaurant.name}
            </h1>
            {restaurant.cityAndState && (
              <span
                className={
                  "text-xs font-semibold px-2.5 py-1 bg-brand-light " +
                  "dark:bg-brand-dark/20 border border-brand-soft " +
                  "text-brand-vibrant dark:text-brand-light rounded-full"
                }
              >
                {restaurant.cityAndState}
              </span>
            )}
          </div>

          {restaurant.displayName && (
            <h2 className="text-lg text-gray-500 dark:text-gray-400 font-medium">
              {restaurant.name}
            </h2>
          )}

          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mt-2 leading-relaxed">
            {restaurant.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {t("eat.card.pricePerPerson") || "Price per person"}
              </span>
              : {restaurant.price}
            </div>
            {restaurant.address && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Address
                </span>
                : <span className="underline">{restaurant.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <SecondaryButton
            disabled={!User}
            onClick={() => setIsEditDialogOpen(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faEdit} />
            {t("eat.card.edit")}
          </SecondaryButton>

          <SecondaryButton
            onClick={() => window.open(restaurant.url, "_blank")}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faDirections} />
            {t("eat.card.go")}
          </SecondaryButton>

          <SecondaryButton
            onClick={handleShare}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faShareFromSquare} />
            {t("eat.card.share")}
          </SecondaryButton>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Details, Rating Histogram, and Menu) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Ratings & Histogram Section */}
          <div
            className={
              "bg-white dark:bg-gray-900 rounded-2xl border " +
              "border-gray-200 dark:border-gray-800 p-6 shadow-sm"
            }
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faChartBar} className="text-brand-primary" />
                Ratings Summary
              </h3>
              {restaurant.stars && (
                <SecondaryButton
                  onClick={() => setIsHistogramExpanded((prev) => !prev)}
                  className="py-1 px-2.5 text-xs"
                >
                  {isHistogramExpanded ? (
                    <>
                      Hide Details
                      <FontAwesomeIcon icon={faAngleDown} className="ml-1.5" />
                    </>
                  ) : (
                    <>
                      Show Details
                      <FontAwesomeIcon icon={faAngleUp} className="ml-1.5" />
                    </>
                  )}
                </SecondaryButton>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center justify-around">
              {/* Average Rating Block */}
              <div
                className={
                  "flex flex-col items-center justify-center p-4 " +
                  "bg-brand-light/20 dark:bg-gray-800/50 rounded-xl " +
                  "border border-brand-soft/35 min-w-[150px]"
                }
              >
                <div className="text-4xl font-extrabold text-brand-primary">
                  {restaurant.averageStars || "0.0"}
                </div>
                <div className="mt-2">
                  <StarRating rating={Number(restaurant.averageStars || 0)} />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {t("eat.card.averageRating") || "Average Rating"}
                </div>
              </div>

              {/* Current User's Rating Block */}
              {User && (
                <div
                  className={
                    "flex flex-col items-center justify-center p-4 " +
                    "bg-gray-50 dark:bg-gray-800/30 rounded-xl border " +
                    "border-gray-150 dark:border-gray-850 min-w-[150px]"
                  }
                >
                  <div className="text-4xl font-extrabold text-gray-700 dark:text-gray-300">
                    {currentUserRating || "-"}
                  </div>
                  <div className="mt-2">
                    <StarRating rating={currentUserRating || 0} />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {t("eat.card.yourRating") || "Your Rating"}
                  </div>
                </div>
              )}
            </div>

            {restaurant.stars && isHistogramExpanded && (
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-center">
                <div className="w-full max-w-md scale-95 origin-center">
                  <EatRatingHistogram ratings={restaurant.stars} />
                </div>
              </div>
            )}
          </div>

          {/* Menu Card */}
          <div
            className={
              "bg-white dark:bg-gray-900 rounded-2xl border " +
              "border-gray-200 dark:border-gray-800 p-6 shadow-sm"
            }
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Menu
            </h3>
            <EatMenu restaurant={restaurant} />
          </div>
        </div>

        {/* Right Column (Notes & Ratings) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div
            className={
              "bg-white dark:bg-gray-900 rounded-2xl border " +
              "border-gray-200 dark:border-gray-800 p-6 shadow-sm " +
              "flex flex-col h-full"
            }
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Notes & Ratings
            </h3>
            <div className="flex-1 overflow-y-auto">
              <EatNotesPanel restaurant={restaurant} />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        title="Edit Restaurant"
        customizedClassName="max-w-md"
      >
        <EatEditForm
          restaurant={restaurant}
          closeDialog={() => setIsEditDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default EatDetail;
