import { withGoogleMapsApi } from "@/hooks/withGoogleMapsApi";
import { EatFilterSearch } from "./EatFilterSearch";
import { EatList } from "./EatList";
import { useState } from "react";
import { SecondaryButton } from "@/components/Buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

const EatListWithMaps = withGoogleMapsApi(EatList);

const Eat = () => {
  const [showFilterSearch, setShowFilterSearch] = useState(true);
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold py-2">Eat</h1>
        <div className="md:hidden">
          <SecondaryButton
            onClick={() => setShowFilterSearch(!showFilterSearch)}
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            Filter
            {showFilterSearch ? (
              <FontAwesomeIcon icon={faAngleDown} className="ml-2" />
            ) : (
              <FontAwesomeIcon icon={faAngleUp} className="ml-2" />
            )}
          </SecondaryButton>
        </div>
      </div>

      <div className="flex md:flex-row flex-col gap-5 w-full">
        <EatFilterSearch showFilterSearch={showFilterSearch} />
        <EatListWithMaps />
      </div>
    </>
  );
};

export default Eat;
