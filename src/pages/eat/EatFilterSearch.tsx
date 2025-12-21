import { SecondaryButton } from "@/components/Buttons";
import {
  faClose,
  faFilter,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import type { IEatQuery, IRestaurant } from "./Eat.types";
import {
  getFilterSearchQuery,
  setFilterSearchQuery,
  useSetFilterSearchQueryCityAndState,
} from "./EatAtoms";
import "./EatFilterSearch.scss";
import {
  useGetRestaurantLocationTags,
  useGetRestaurantRecommendationNL,
} from "./hooks";
import { Dialog } from "@/components/Dialog";
import { EatCard } from "./EatCard";
import { useAddMessageBars } from "@/utils/MessageBarsAtom";

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
  const setFilterQuery = setFilterSearchQuery();

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
  const [userPromptInput, setUserPromptInput] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<IRestaurant | null>(null);
  const { data, isError, error, isFetching } =
    useGetRestaurantRecommendationNL(userPrompt);
  const addMessageBars = useAddMessageBars();

  const handleUserPromptSubmit = async () => {
    if (!userPromptInput) return;
    setUserPrompt(userPromptInput);
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
        <div>
          <SecondaryButton
            onClick={handleUserPromptSubmit}
            disabled={isFetching || !userPromptInput}
          >
            {isFetching && (
              <FontAwesomeIcon icon={faSpinner} spin={true} className="mr-2" />
            )}
            Pick
          </SecondaryButton>
        </div>
      </div>
    </>
  );
};

const LocationTagsList = () => {
  const { data } = useGetRestaurantLocationTags();
  const { cityAndState } = getFilterSearchQuery();
  const updateLocationTags = useSetFilterSearchQueryCityAndState();
  const [tagNameFilter, setTagNameFilter] = useState("");

  const handleTagToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagSelected = cityAndState?.includes(e.target.value);
    const newTagsList = tagSelected
      ? cityAndState?.filter((tag) => tag !== e.target.value)
      : [...(cityAndState || []), e.target.value];
    updateLocationTags(newTagsList || []);
  };

  const displayedData = data?.filter(
    (tag) =>
      tag.count > 0 &&
      tag.value.toLowerCase().includes(tagNameFilter.toLowerCase())
  );

  return (
    <div className="flex flex-wrap gap-2">
      <div className="material-labeled-input">
        <input
          type="text"
          id="tagNameFilter"
          placeholder=""
          onChange={(e) => setTagNameFilter(e.target.value)}
          value={tagNameFilter}
        />
        <label htmlFor="tagNameFilter">Location Tags</label>
      </div>

      <SecondaryButton onClick={() => updateLocationTags([])}>
        <FontAwesomeIcon icon={faClose} />
        Clear
      </SecondaryButton>

      {displayedData?.map((tag) => (
        <label
          className="flex gap-2 px-2 py-1 items-center rounded-md bg-gray-200 cursor-pointer
            text-sm"
          key={tag.value}
        >
          <input
            type="checkbox"
            className="w-4 h-4"
            value={tag.value}
            checked={cityAndState?.includes(tag.value)}
            onChange={handleTagToggle}
          />
          {tag.value} - {tag.count}
        </label>
      ))}
    </div>
  );
};
