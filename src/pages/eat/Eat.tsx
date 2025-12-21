import { withGoogleMapsApi } from "@/hooks/withGoogleMapsApi";
import { EatFilterSearch } from "./EatFilterSearch";
import { EatList } from "./EatList";

const EatListWithMaps = withGoogleMapsApi(EatList);

const Eat = () => {
  return (
    <>
      <h1 className="text-2xl font-bold py-5">Eat</h1>
      <div className="flex md:flex-row flex-col gap-5 w-full">
        <EatFilterSearch />
        <EatListWithMaps />
      </div>
    </>
  );
};

export default Eat;
