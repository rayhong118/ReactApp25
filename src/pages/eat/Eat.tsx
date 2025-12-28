import { CustomizedButton, SecondaryButton } from "@/components/Buttons";
import { withGoogleMapsApi } from "@/hooks/withGoogleMapsApi";
import {
  faAngleDown,
  faAngleUp,
  faFilter,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Eat.scss";
import { useSetFilterSearchQuery } from "./EatAtoms";
import { EatFilterSearch } from "./EatFilterSearch";
import { EatList } from "./EatList";
import { withGoogleReCaptchaProvider } from "@/hooks/withGoogleReCaptchaProvider";

const EatListWithMaps = withGoogleMapsApi(EatList);

const Eat = () => {
  const [showFilterSearch, setShowFilterSearch] = useState(false);
  const [specificRestaurantId, setSpecificRestaurantId] = useState<
    string | null
  >(null);

  const [searchParam, setSearchParams] = useSearchParams();

  const setFilterQuery = useSetFilterSearchQuery();

  useEffect(() => {
    const id = searchParam.get("id");
    if (id) {
      setFilterQuery({
        id,
      });
      setSpecificRestaurantId(id);
    }
  }, [searchParam]);

  const clearFilterQueryId = () => {
    searchParam.delete("id");
    setSearchParams(searchParam);
    setFilterQuery((prev) => ({ ...prev, id: undefined }));
    setSpecificRestaurantId(null);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold py-2">Eat</h1>
        {specificRestaurantId && (
          <CustomizedButton
            onClick={clearFilterQueryId}
            className="show-full-list"
          >
            <FontAwesomeIcon icon={faList} className="mr-2" />
            Show full list
          </CustomizedButton>
        )}

        {!specificRestaurantId && (
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
        )}
      </div>

      <div className="flex md:flex-row flex-col gap-5 w-full">
        {!specificRestaurantId && (
          <EatFilterSearch showFilterSearch={showFilterSearch} />
        )}
        <EatListWithMaps />
      </div>
    </>
  );
};

export default withGoogleReCaptchaProvider(Eat);
