import { SecondaryButton } from "@/components/Buttons";
import { Dialog } from "@/components/Dialog";
import { useAddMessageBars } from "@/utils/MessageBarsAtom";
import {
  faClose,
  faFilter,
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
import { EatCard } from "./EatCard";
import "./EatFilterSearch.scss";
import {
  useGetRestaurantLocationTags,
  useGetRestaurantRecommendationNL,
  useGetUserLocation,
  useLocationTagAutoSelector,
} from "./hooks";

export const EatFilterSearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div>
      <div className="md:block hidden">
        <EatFilterSearchForm />
      </div>
      <div className="md:hidden flex flex-col justify-between gap-2">
        <SecondaryButton onClick={() => setIsExpanded(!isExpanded)}>
          <FontAwesomeIcon icon={faFilter} className="mr-2" />
          Filter
        </SecondaryButton>
        {isExpanded && <EatFilterSearchForm />}
      </div>
    </div>
  );
};

const EatFilterSearchForm = () => {
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const [tempQuery, setTempQuery] = useState<IEatQuery>({});
  const setFilterQuery = useSetFilterSearchQuery();

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      const { name, value, valueAsNumber, valueAsDate, type } = event.target;
      let actualValue;
      switch (type) {
        case "number":
          actualValue = valueAsNumber < 0 ? 0 : valueAsNumber;
          break;
        case "date":
          actualValue = valueAsDate;
          break;
        default:
          actualValue = value;
      }

      setTempQuery((prev) => ({ ...prev, [name]: actualValue }));
    }, 500);
  };

  useEffect(() => {
    setFilterQuery(tempQuery);
  }, [tempQuery]);

  return (
    <div className="flex flex-col gap-2 md:max-w-sm">
      <UserPromptSection />
      <hr className="w-full" />
      <label>Price Range</label>
      <div className="flex gap-2">
        <div className="material-labeled-input">
          <input
            type="number"
            id="priceRangeLower"
            placeholder=""
            onChange={handleQueryChange}
            name="priceRangeLower"
            min={0}
          />
          <label htmlFor="priceRangeLower">Price min</label>
        </div>
        <div className="material-labeled-input">
          <input
            type="number"
            id="priceRangeUpper"
            placeholder=""
            onChange={handleQueryChange}
            name="priceRangeUpper"
            min={0}
          />
          <label htmlFor="priceRangeUpper">Price max</label>
        </div>
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
  const { data, isError, error, isFetching } =
    useGetRestaurantRecommendationNL(userPrompt);
  const addMessageBars = useAddMessageBars();
  const {
    data: userCityAndStateData,
    refetch: refetchUserLocation,
    isFetching: isFetchingUserLocation,
  } = useGetUserLocation();

  const handleUserPromptSubmit = async () => {
    if (!userPromptInput) return;
    const userPromptWithLocation =
      useLocation && userCityAndStateData
        ? `${userPromptInput}. Current location: ${userCityAndStateData}`
        : userPromptInput;
    setUserPrompt(userPromptWithLocation);
  };

  useEffect(() => {
    if (data && data.restaurant) {
      setSelectedRestaurant(data.restaurant);
    }
  }, [data]);

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
      >
        <div>
          <p>{data?.reason}</p>
          <EatCard restaurant={selectedRestaurant!} />
        </div>
      </Dialog>
      <div className="flex flex-col gap-2">
        <p>
          Ask AI for a restaurant recommendation based on your preferences. If
          there are multiple options, AI will pick the "best" one (not
          randomly).
        </p>
        <div className="material-labeled-input">
          <textarea
            placeholder=""
            onChange={(e) => setUserPromptInput(e.target.value)}
            disabled={isFetching}
          />
          <label htmlFor="userPrompt">Your Prompt</label>
        </div>
        <div className="flex gap-2">
          <SecondaryButton
            onClick={handleUserPromptSubmit}
            disabled={isFetching || !userPromptInput || isFetchingUserLocation}
          >
            {isFetching && (
              <FontAwesomeIcon icon={faSpinner} spin={true} className="mr-2" />
            )}
            Pick
          </SecondaryButton>
          <label
            className="flex gap-2 px-2 py-1 items-center rounded-md bg-gray-200 cursor-pointer
            text-sm"
          >
            <input
              type="checkbox"
              className="w-4 h-4"
              onChange={(e) => setUseLocation(e.target.checked)}
            />
            Use my location{" "}
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
        <label htmlFor="tagNameFilter">Filter Location Tags</label>
      </div>

      <SecondaryButton onClick={() => setSelectedLocationTags([])}>
        <FontAwesomeIcon icon={faClose} />
        Clear
      </SecondaryButton>

      <SecondaryButton
        onClick={() => handleSelectNearby()}
        disabled={inProgress}
      >
        <FontAwesomeIcon icon={faLocation} />
        Select Nearby Cities
      </SecondaryButton>

      {inProgress ? (
        <p>Loading...</p>
      ) : (
        displayedData?.map((tag) => (
          <label
            className="flex gap-2 px-2 py-1 items-center rounded-md bg-gray-200 cursor-pointer
              text-sm"
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
