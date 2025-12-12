import { useState } from "react";

interface IItem {
  name: string;
  isSelected: boolean;
  side: "left" | "right";
}
// TODO: should use diff
const MoveLists = () => {
  const [items, setItems] = useState<IItem[]>([
    { name: "Item 1", isSelected: false, side: "left" },
    { name: "Item 2", isSelected: false, side: "left" },
    { name: "Item 3", isSelected: false, side: "left" },
    { name: "Item 4", isSelected: false, side: "left" },
    { name: "Item 5", isSelected: false, side: "right" },
    { name: "Item 6", isSelected: false, side: "right" },
    { name: "Item 7", isSelected: false, side: "right" },
    { name: "Item 8", isSelected: false, side: "right" },
  ]);
  const moveItemLeft = () => {
    // get selected items on the right.
    const filteredItems = items.filter(
      (item) => item.side === "right" && item.isSelected
    );

    filteredItems.forEach((item) => {
      item.side = "left";
      item.isSelected = false;
    });
    setItems((items) => [...items]);
  };
  const moveItemRight = () => {
    // get selected items on the Left.
    const filteredItems = items.filter(
      (item) => item.side === "left" && item.isSelected
    );
    filteredItems.forEach((item) => {
      item.side = "right";
      item.isSelected = false;
    });
    setItems((items) => [...items]);
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    console.log(e.target.checked);
    const { value, checked } = e.target;
    // handle checkbox change
    const item = items.find((item) => item.name === value);

    if (item) {
      setItems((prevItems) =>
        prevItems.map((itm) =>
          itm.name === value ? { ...itm, isSelected: checked } : itm
        )
      );
    }
  };
  return (
    <div className={"p-20 flex flex-row gap-10"}>
      <div className="flex flex-col gap-4">
        {items
          .filter((item) => item.side === "left")
          .map((item, index) => (
            <label key={index} className={" p-2 border"}>
              <input
                type="checkbox"
                name={item.name}
                value={item.name}
                onChange={handleCheckboxChange}
                checked={item.isSelected}
              ></input>
              {item.name}
            </label>
          ))}
      </div>
      <div className="flex flex-col gap-4">
        <button className="cursor-pointer p-2 border" onClick={moveItemLeft}>
          Move Left
        </button>
        <button className="cursor-pointer p-2 border" onClick={moveItemRight}>
          Move Right
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {items
          .filter((item) => item.side === "right")
          .map((item, index) => (
            <label key={index} className={" p-2 border"}>
              <input
                type="checkbox"
                name={item.name}
                value={item.name}
                onChange={handleCheckboxChange}
                checked={item.isSelected}
              ></input>
              {item.name}
            </label>
          ))}
      </div>
    </div>
  );
};

export default MoveLists;
