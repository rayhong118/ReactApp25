import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { Dialog } from "@/components/Dialog";
import { useAddMessageBars } from "@/utils/MessageBarsAtom";
import {
  faClose,
  faLocation,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useRef, useState } from "react";
import type { IEatQuery, IRestaurant } from "./Eat.types";
import {
  useGetFilterSearchQuery,
  useSetFilterSearchQuery,
  useUpdateFilterSearchQueryCityAndState,
} from "./EatAtoms";
import { EatCard } from "./EatCard.tsx";
import "./EatFilterSearch.scss";
import {
  useGetRestaurantLocationTags,
  useGetRestaurantRecommendationNL,
  useGetUserLocation,
  useLocationTagAutoSelector,
} from "./hooks/hooks.tsx";
import { useTranslation } from "react-i18next";

export const EatFilterSearch = ({
  showFilterSearch,
}: {
  showFilterSearch: boolean;
}) => {
  return (
    <div
      className={
        "filter-panel-container md:block flex flex-col justify-between gap-2 " +
        (showFilterSearch ? "open" : "")
      }
    >
      <EatFilterSearchForm />
    </div>
  );
};

const EatFilterSearchForm = () => {
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const [tempQuery, setTempQuery] = useState<IEatQuery>({});
  const setFilterQuery = useSetFilterSearchQuery();
  const { t } = useTranslation();

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const { name, value, valueAsNumber, valueAsDate, type } = event.target;
    let actualValue;
    switch (type) {
      case "number":
        actualValue = isNaN(valueAsNumber)
          ? 0
          : valueAsNumber < 0
          ? 0
          : valueAsNumber;
        break;
      case "date":
        actualValue = valueAsDate;
        break;
      default:
        actualValue = value;
    }

    setTempQuery((prev) => ({ ...prev, [name]: actualValue }));
  };

  const clearPriceRange = () => {
    setTempQuery((prev) => ({
      ...prev,
      priceRangeLower: undefined,
      priceRangeUpper: undefined,
    }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilterQuery(tempQuery);
    }, 500);
    return () => clearTimeout(timeout);
  }, [tempQuery]);

  return (
    <div className="flex flex-col gap-2 md:max-w-sm min-h-0">
      <UserPromptSection />
      <hr className="w-full" />
      <label>{t("eat.filter.priceRange")}</label>
      <div className="flex gap-2">
        <div className="material-labeled-input">
          <input
            type="number"
            id="priceRangeLower"
            placeholder=""
            onChange={handleQueryChange}
            value={tempQuery.priceRangeLower ?? ""}
            name="priceRangeLower"
            min={0}
          />
          <label htmlFor="priceRangeLower">
            {t("eat.filter.priceRangeLower")}
          </label>
        </div>
        <div className="material-labeled-input">
          <input
            type="number"
            id="priceRangeUpper"
            placeholder=""
            onChange={handleQueryChange}
            value={tempQuery.priceRangeUpper ?? ""}
            name="priceRangeUpper"
            min={0}
          />
          <label htmlFor="priceRangeUpper">
            {t("eat.filter.priceRangeUpper")}
          </label>
        </div>
      </div>
      <div className="flex">
        <SecondaryButton onClick={clearPriceRange}>
          <FontAwesomeIcon icon={faClose} />
          {t("eat.filter.clear")}
        </SecondaryButton>
      </div>

      <LocationTagsList />
    </div>
  );
};

const UserPromptSection = () => {
  const [userPromptInput, setUserPromptInput] = useState<string>("");
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [useLocation, setUseLocation] = useState<boolean>(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<IRestaurant | null>(null);
  const { data, isError, error, isFetching, refetch } =
    useGetRestaurantRecommendationNL(userPrompt);
  const addMessageBars = useAddMessageBars();
  const {
    data: userCityAndStateData,
    refetch: refetchUserLocation,
    isFetching: isFetchingUserLocation,
  } = useGetUserLocation();
  const { t } = useTranslation();

  const handleUserPromptSubmit = async () => {
    if (!userPromptInput) return;

    const userPromptWithLocation =
      useLocation && userCityAndStateData
        ? `${userPromptInput}. Current location: ${userCityAndStateData}`
        : userPromptInput;
    setUserPrompt(userPromptWithLocation);
    if (userPrompt === userPromptWithLocation) refetch();
  };

  useEffect(() => {
    if (data && data.restaurant && !isFetching) {
      setSelectedRestaurant(data.restaurant);
    }
  }, [data, isFetching]);

  useEffect(() => {
    if (isError) {
      addMessageBars([
        {
          id: "error",
          message: error?.message || "Error fetching restaurant recommendation",
          type: "error",
          autoDismiss: true,
        },
      ]);
    }
  }, [isError, error]);

  useEffect(() => {
    if (useLocation) {
      refetchUserLocation();
    }
  }, [useLocation]);

  return (
    <>
      <Dialog
        open={!!selectedRestaurant}
        title="AI Recommendation"
        onClose={() => setSelectedRestaurant(null)}
        customizedClassName="max-w-lg"
      >
        <div>
          <p>{data?.reason}</p>
          <EatCard restaurant={selectedRestaurant!} />
        </div>
      </Dialog>
      <div className="flex flex-col gap-2">
        <p>{t("eat.filter.userPromptDescription")}</p>

        <div className="material-labeled-input">
          <textarea
            placeholder=""
            onChange={(e) => setUserPromptInput(e.target.value)}
            disabled={isFetching}
          />
          <label htmlFor="userPrompt">{t("eat.filter.userPrompt")}</label>
        </div>
        <div className="flex gap-2">
          <PrimaryButton
            type="button"
            onClick={handleUserPromptSubmit}
            disabled={isFetching || !userPromptInput || isFetchingUserLocation}
          >
            {isFetching && (
              <FontAwesomeIcon icon={faSpinner} spin={true} className="mr-2" />
            )}
            {t("eat.filter.pick")}
          </PrimaryButton>
          <label
            className="flex gap-2 px-2 py-1 items-center rounded-md cursor-pointer text-sm
            border-2 border-brand-soft bg-brand-light"
          >
            <input
              type="checkbox"
              className="w-4 h-4"
              onChange={(e) => setUseLocation(e.target.checked)}
            />
            {t("eat.filter.useLocation")}
            {isFetchingUserLocation && (
              <FontAwesomeIcon icon={faSpinner} spin={true} className="mr-2" />
            )}
          </label>
        </div>
      </div>
    </>
  );
};

const LocationTagsList = () => {
  const { data: locationTags } = useGetRestaurantLocationTags();
  const updateLocationTags = useUpdateFilterSearchQueryCityAndState();
  const filterSearchQuery = useGetFilterSearchQuery();
  const [tagNameFilter, setTagNameFilter] = useState("");
  const [selectedLocationTags, setSelectedLocationTags] = useState<string[]>(
    filterSearchQuery.cityAndState || []
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { selectNearby, inProgress } = useLocationTagAutoSelector(
    locationTags,
    setSelectedLocationTags
  );
  const { t } = useTranslation();

  const handleTagToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagSelected = selectedLocationTags.includes(e.target.value);
    const newTagsList = tagSelected
      ? selectedLocationTags.filter((tag) => tag !== e.target.value)
      : [...selectedLocationTags, e.target.value];
    setSelectedLocationTags(newTagsList);
  };

  const handleSelectNearby = () => {
    selectNearby();
  };

  // debounced update of location tags
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updateLocationTags(selectedLocationTags);
    }, 500);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [selectedLocationTags]);

  const displayedData = useMemo(
    () =>
      locationTags?.filter(
        (tag) =>
          tag.count > 0 &&
          tag.value.toLowerCase().includes(tagNameFilter.toLowerCase())
      ),
    [locationTags, tagNameFilter]
  );

  return (
    <div className="flex flex-wrap gap-2">
      <hr className="w-full my-2" />
      <div className="material-labeled-input">
        <input
          type="text"
          id="tagNameFilter"
          placeholder=""
          onChange={(e) => setTagNameFilter(e.target.value)}
          value={tagNameFilter}
        />
        <label htmlFor="tagNameFilter">{t("eat.filter.locationTags")}</label>
      </div>

      <SecondaryButton onClick={() => setSelectedLocationTags([])}>
        <FontAwesomeIcon icon={faClose} />
        {t("eat.filter.clear")}
      </SecondaryButton>

      <SecondaryButton
        onClick={() => handleSelectNearby()}
        disabled={inProgress}
      >
        {inProgress ? (
          <FontAwesomeIcon icon={faSpinner} spin={true} />
        ) : (
          <FontAwesomeIcon icon={faLocation} />
        )}
        {t("eat.filter.selectNearby")}
      </SecondaryButton>

      {inProgress ? (
        <p>Loading...</p>
      ) : (
        displayedData?.map((tag) => (
          <label
            className="flex gap-2 px-2 py-1 items-center rounded-md cursor-pointer 
            text-sm border-2 border-brand-soft bg-brand-light"
            key={tag.value}
          >
            <input
              type="checkbox"
              className="w-4 h-4"
              value={tag.value}
              checked={selectedLocationTags.includes(tag.value)}
              onChange={handleTagToggle}
            />
            {tag.value} - {tag.count}
          </label>
        ))
      )}
    </div>
  );
};
