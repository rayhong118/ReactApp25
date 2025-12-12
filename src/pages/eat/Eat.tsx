import { EatFilterSearch } from "./EatFilterSearch";
import { EatList } from "./EatList";

export const Eat = () => {
  return (
    <>
      <h1 className="text-2xl font-bold py-5">Eat</h1>
      <div className='flex md:flex-row flex-col gap-5'>
        <EatFilterSearch />
        <EatList />
      </div>
    </>
  );
};
