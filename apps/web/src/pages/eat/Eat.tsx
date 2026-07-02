import { SecondaryButton } from "@/components/Buttons";
import { withGoogleMapsApi } from "@/hooks/withGoogleMapsApi";
import {
  faAngleDown,
  faAngleUp,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Eat.scss";
import { EatFilterSearch } from "./EatFilterSearch";
import { EatList } from "./EatList";
import { withGoogleReCaptchaProvider } from "@/hooks/withGoogleReCaptchaProvider";
import withScrollToTopButton from "@/hooks/withScrollToTopButton";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";

const EatListWithMaps = withGoogleMapsApi(EatList);

const Eat = () => {
  const [showFilterSearch, setShowFilterSearch] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();

  useEffect(() => {
    const id = searchParam.get("id");
    if (id) {
      navigate(`/eat/${id}`, { replace: true });
    }
  }, [searchParam, navigate]);

  return withScrollToTopButton(
    <>
      <SEO 
        title="Find Restaurants" 
        description="Discover and rate the best restaurants around you with our curated restaurant finder."
      />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold py-2">{t("eat.title")}</h1>

        <div className="md:hidden">
          <SecondaryButton
            onClick={() => setShowFilterSearch(!showFilterSearch)}
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            {t("eat.filter.title")}
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
    </>,
  );
};

export default withGoogleReCaptchaProvider(Eat);
