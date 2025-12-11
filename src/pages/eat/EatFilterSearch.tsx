import { setFilterSearchQuery } from "./EatAtoms";
import { useEffect, useRef, useState } from "react";
import type { IEatQuery } from "./Eat.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

export const EatFilterSearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (<div>
    <div className="md:block hidden">
      <EatFilterSearchForm />
    </div>
    <div className="md:hidden">
      <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2 hover:bg-blue-600 rounded-md bg-blue-500 text-white p-2 mb-5">
        <FontAwesomeIcon icon={faFilter} />
        Filter
      </button>
      {isExpanded && <EatFilterSearchForm />}
    </div>
  </div>);
};

const EatFilterSearchForm = () => {

  const timeoutRef = useRef<number | null>(null);
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

  return (
    <div className="flex flex-col gap-2 max-w-sm">
      <input type="text" disabled placeholder="Search - does not work" className="p-2 border border-black rounded-md" onChange={handleQueryChange} />
      firebase does not support partial string search.

      <label>Price Range</label>
      <div className="flex gap-2">
        <input type="number" placeholder="Price min" className="p-2 border border-black w-1/2 rounded-md" onChange={handleQueryChange} name="priceRangeLower" />
        <input type="number" placeholder="Price max" className="p-2 border border-black w-1/2 rounded-md" onChange={handleQueryChange} name="priceRangeUpper" />
      </div>
    </div>
  );
}