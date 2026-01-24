import { CustomizedButton, PrimaryButton } from "@/components/Buttons";
import { Dialog } from "@/components/Dialog";
import {
  faCheck,
  faSearch,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import type { IRestaurant } from "./Eat.types";
import "./EatEditDialog.scss";
import {
  useAddRestaurant,
  useDeleteRestaurant,
  useEditRestaurant,
} from "./hooks/hooks";
import { useTranslation } from "react-i18next";

interface IEatEditFormProps {
  restaurant?: IRestaurant;
  closeDialog: () => void;
}

export const EatEditForm = (props: IEatEditFormProps) => {
  const { restaurant, closeDialog } = props;
  const [eatData, setEatData] = useState<Partial<IRestaurant> | undefined>(
    restaurant,
  );
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const placeAutocompleteRef = useRef<HTMLInputElement | null>(null);
  const {
    mutateAsync: addRestaurantMutate,
    isPending: addRestaurantIsPending,
  } = useAddRestaurant();
  const {
    mutateAsync: editRestaurantMutate,
    isPending: editRestaurantIsPending,
  } = useEditRestaurant();
  const {
    mutateAsync: deleteRestaurantMutate,
    isPending: deleteRestaurantIsPending,
  } = useDeleteRestaurant();

  const administrativeAreaLevel1 = "administrative_area_level_1";
  const locality = "locality";

  const { t } = useTranslation();

  useEffect(() => {
    if (!placeAutocompleteRef.current) {
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(
      placeAutocompleteRef.current,
      {
        /**
         * Restrict the autocomplete to restaurants
         */
        types: ["restaurant"],
        fields: [
          "name",
          "formatted_address",
          "address_components",
          "place_id",
          "url",
          "formatted_phone_number",
        ],
        /**
         * Restrict the autocomplete to the United States
         */
        componentRestrictions: { country: "us" },
      },
    );

    if (!autocomplete) {
      return;
    }
    const placeChangedListener = autocomplete.addListener(
      "place_changed",
      () => {
        const place = autocomplete.getPlace();
        if (place) {
          const city = place.address_components?.find((component) =>
            component.types.includes(locality),
          )?.short_name;
          const state = place.address_components?.find((component) =>
            component.types.includes(administrativeAreaLevel1),
          )?.short_name;
          const cityAndState = `${city}, ${state}`;

          setEatData((prev) => ({
            ...prev,
            name: place.name || "",
            address: place.formatted_address || "",
            url: place.url,
            phoneNumber: place.formatted_phone_number || "",
            cityAndState: cityAndState,
          }));
        }
      },
    );

    return () => {
      placeChangedListener.remove();
    };
  }, [placeAutocompleteRef]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, valueAsNumber, type } = event.target;
    const actualValue = type === "number" ? valueAsNumber.toFixed(0) : value;
    setEatData((prev) => ({ ...prev, [name]: actualValue }));
  };

  const isFormValid = !!(
    eatData?.name &&
    eatData?.address &&
    eatData?.price &&
    eatData?.price !== 0
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (isFormValid && eatData) {
        if (eatData.id) {
          await editRestaurantMutate(eatData);
          closeDialog();
        } else {
          await addRestaurantMutate(eatData);
          closeDialog();
        }
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const handleDelete = async () => {
    if (restaurant?.id) {
      try {
        await deleteRestaurantMutate(restaurant.id);
        closeDialog();
      } catch (error) {
        console.error("Error deleting restaurant", error);
      }
    }
  };

  return (
    <div>
      <Dialog
        open={showDeleteConfirmation}
        title={t("eat.editForm.deleteConfirmationTitle")}
        onClose={() => setShowDeleteConfirmation(false)}
        actions={[
          {
            label: "Delete",
            onClick: handleDelete,
          },
          {
            label: "Cancel",
            onClick: () => setShowDeleteConfirmation(false),
          },
        ]}
      >
        {t("eat.editForm.deleteConfirmation")}
      </Dialog>
      <div className="eat-edit-dialog">
        <form onSubmit={handleSubmit}>
          <div className="labeled-input">
            <input
              type="text"
              id="googleSearch"
              placeholder=""
              ref={placeAutocompleteRef}
            />
            <label htmlFor="googleSearch">
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              {t("eat.editForm.searchForRestaurant")}
            </label>
          </div>

          <div className="labeled-input">
            <input
              disabled
              type="text"
              id="name"
              name="name"
              placeholder=""
              value={eatData?.name || ""}
            />
            <label htmlFor="name">
              {t("eat.editForm.name")} -{" "}
              <span className="text-xs">{t("eat.editForm.nameComment")}</span>
            </label>
          </div>
          <div className="labeled-input">
            <input
              type="text"
              id="displayName"
              name="displayName"
              placeholder=""
              value={eatData?.displayName || ""}
              onChange={handleChange}
            />
            <label htmlFor="displayName">{t("eat.editForm.displayName")}</label>
          </div>
          <div className="labeled-input">
            <input
              type="text"
              id="description"
              name="description"
              placeholder=""
              value={eatData?.description || ""}
              onChange={handleChange}
            />
            <label htmlFor="description">{t("eat.editForm.description")}</label>
          </div>
          <div className="labeled-input">
            <input
              disabled
              type="text"
              id="address"
              placeholder=""
              value={eatData?.address || ""}
            />
            <label htmlFor="address">
              {t("eat.editForm.address")} -{" "}
              <span className="text-xs">
                {t("eat.editForm.addressComment")}
              </span>
            </label>
          </div>
          <div className="labeled-input">
            <input
              type="number"
              id="price"
              name="price"
              placeholder=""
              value={eatData?.price || ""}
              onChange={handleChange}
            />
            <label htmlFor="price">
              {t("eat.editForm.price")}
              <span className="text-red-500 font-bold">*</span>
            </label>
          </div>
          <div className="labeled-input">
            <input
              disabled
              type="text"
              id="phoneNumber"
              placeholder=""
              value={eatData?.phoneNumber || ""}
            />
            <label htmlFor="phoneNumber">
              {t("eat.editForm.phoneNumber")} -{" "}
              <span className="text-xs">
                {t("eat.editForm.phoneNumberComment")}
              </span>
            </label>
          </div>
          <div className="labeled-input">
            <input
              disabled
              type="text"
              id="cityAndState"
              placeholder=""
              value={eatData?.cityAndState || ""}
              onChange={handleChange}
            />
            <label htmlFor="cityAndState">
              {t("eat.editForm.cityAndState")} -{" "}
              <span className="text-xs">
                {t("eat.editForm.cityAndStateComment")}
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2">
            {restaurant && (
              <CustomizedButton
                type="button"
                disabled={
                  addRestaurantIsPending ||
                  editRestaurantIsPending ||
                  deleteRestaurantIsPending
                }
                onClick={() => setShowDeleteConfirmation(true)}
                className="text-base border-red-500 border-2 text-red-500 font-semibold 
                cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 "
              >
                {deleteRestaurantIsPending ? (
                  <FontAwesomeIcon icon={faSpinner} spin={true} />
                ) : (
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                )}
                {t("eat.editForm.delete")}
              </CustomizedButton>
            )}
            <PrimaryButton
              disabled={
                !isFormValid ||
                addRestaurantIsPending ||
                editRestaurantIsPending ||
                deleteRestaurantIsPending
              }
              type="submit"
            >
              {addRestaurantIsPending || editRestaurantIsPending ? (
                <FontAwesomeIcon icon={faSpinner} spin={true} />
              ) : (
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
              )}
              {t("eat.editForm.submit")}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};
