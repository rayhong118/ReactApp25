import { setFilterSearchString } from "./EatAtoms";

export const EatFilterSearch = () => {


  const setFilterString = setFilterSearchString();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterString(event.target.value);
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="text" placeholder="Search" className="p-2 border border-black rounded-md" onChange={handleSearchChange} />

    </div>
  );
};