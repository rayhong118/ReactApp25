import { setFilterSearchQuery } from "./EatAtoms";
import { useEffect, useRef, useState } from "react";
import type { IEatQuery } from "./Eat.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { SecondaryButton } from "@/components/Buttons";
import { useGetRestaurantLocationTags } from "./hooks";

export const EatFilterSearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (<div>
    <div className="md:block hidden">
      <EatFilterSearchForm />
    </div>
    <div className="md:hidden">
      <SecondaryButton
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <FontAwesomeIcon icon={faFilter} className="mr-2" />
        Filter
      </SecondaryButton>
      {isExpanded && <EatFilterSearchForm />}
    </div>
  </div>);
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
          actualValue = valueAsNumber;
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

  const { data } = useGetRestaurantLocationTags();

  return (
    <div className="flex flex-col gap-2 max-w-sm">
      <input type="text" disabled placeholder="Search - does not work" className="p-2 border border-black rounded-md" onChange={handleQueryChange} />
      firebase does not support partial string search.

      <label>Price Range</label>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Price min"
          className="p-2 border border-black w-1/2 rounded-md"
          onChange={handleQueryChange}
          name="priceRangeLower"
        />
        <input
          type="number"
          placeholder="Price max"
          className="p-2 border border-black w-1/2 rounded-md"
          onChange={handleQueryChange}
          name="priceRangeUpper"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {data?.map((tag) => (
          <label className="flex gap-2 px-2 py-1 rounded-md bg-gray-200 cursor-pointer text-sm" key={tag.value}>
            {tag.value} - {tag.count}
          </label>
        ))}
      </div>
    </div>
  );
}