import { setFilterSearchQuery } from "./EatAtoms";
import { useEffect, useRef, useState } from "react";
import type { IEatQuery } from "./Eat.types";
export const EatFilterSearch = () => {


  const setFilterQuery = setFilterSearchQuery();
  const timeoutRef = useRef<number | null>(null);
  const [tempQuery, setTempQuery] = useState<IEatQuery>({});

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
    <div className="flex flex-col gap-2">
      <input type="text" disabled placeholder="Search - does not work" className="p-2 border border-black rounded-md" onChange={handleQueryChange} />
      firebase does not support partial string search.

      <input type="number" placeholder="Price range lower bound" className="p-2 border border-black rounded-md" onChange={handleQueryChange} name="priceRangeLower" />
      <input type="number" placeholder="Price range upper bound" className="p-2 border border-black rounded-md" onChange={handleQueryChange} name="priceRangeUpper" />
    </div>
  );
};