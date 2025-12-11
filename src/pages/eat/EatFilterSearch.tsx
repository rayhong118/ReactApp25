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
      const { name, value, valueAsNumber } = event.target;
      console.log("handleChange", name, value, typeof value, valueAsNumber);
      setTempQuery((prev) => ({ ...prev, [name]: valueAsNumber || value }));
    }, 500);
  };

  useEffect(() => {
    console.log("tempQuery", tempQuery);
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