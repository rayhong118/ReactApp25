import { SecondaryButton } from "@/components/Buttons";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import type { IEatQuery } from "./Eat.types";
import { getFilterSearchQuery, setFilterSearchQuery, useSetFilterSearchQueryCityAndState } from "./EatAtoms";
import { useGetRestaurantLocationTags } from "./hooks";
import "./EatFilterSearch.scss";

export const EatFilterSearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div>
      <div className="md:block hidden">
        <EatFilterSearchForm />
      </div>
      <div className="md:hidden flex flex-col justify-between gap-2">
        <SecondaryButton
          onClick={() => setIsExpanded(!isExpanded)}
        >
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
      <input type="text" disabled placeholder="Search - does not work" className="p-2 border border-black rounded-md" onChange={handleQueryChange} />
      firebase does not support partial string search.

      <label>Price Range</label>
      <div className="flex gap-2">
        <div className="material-labeled-input">
          <input
            type="number"
            id="priceRangeLower"
            placeholder=""
            onChange={handleQueryChange}
            value={tempQuery.priceRangeLower}
            name="priceRangeLower"
          />
          <label htmlFor="priceRangeLower">Price min</label>
        </div>
        <div className="material-labeled-input">
          <input
            type="number"
            id="priceRangeUpper"
            placeholder=""
            onChange={handleQueryChange}
            value={tempQuery.priceRangeUpper}
            name="priceRangeUpper"
          />
          <label htmlFor="priceRangeUpper">Price max</label>
        </div>
      </div>

      <LocationTagsList />
    </div>
  );
}

const LocationTagsList = () => {
  const { data } = useGetRestaurantLocationTags();
  const { cityAndState } = getFilterSearchQuery();
  const updateLocationTags = useSetFilterSearchQueryCityAndState();
  const [tagNameFilter, setTagNameFilter] = useState("");

  const handleTagToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagSelected = cityAndState?.includes(e.target.value);
    const newTagsList = tagSelected ? cityAndState?.filter(tag => tag !== e.target.value) : [...cityAndState || [], e.target.value];
    updateLocationTags(newTagsList || []);
  }

  const displayedData = data?.filter(tag => tag.count > 0 && tag.value.toLowerCase().includes(tagNameFilter.toLowerCase()));

  return (

    <div className="flex flex-wrap gap-2">
      <div className="material-labeled-input">
        <input type="text" id="tagNameFilter" placeholder="" onChange={(e) => setTagNameFilter(e.target.value)} value={tagNameFilter} />
        <label htmlFor="tagNameFilter">Location Tags</label>
      </div>
      {displayedData?.map((tag) => (
        <label className="flex gap-2 px-2 py-1 items-center rounded-md bg-gray-200 cursor-pointer text-sm" key={tag.value}>
          <input type="checkbox" className="w-4 h-4" value={tag.value} checked={cityAndState?.includes(tag.value)} onChange={handleTagToggle} />
          {tag.value} - {tag.count}
        </label>
      ))}
    </div>

  );
}