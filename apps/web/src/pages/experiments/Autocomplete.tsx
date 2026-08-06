import { useState } from "react";

import "./Autocomplete.scss";
// interface AutocompleteProps {
//   options: string[];
// }
const Autocomplete: React.FC = () => {
  const [userInput, setuserInput] = useState<string>("");
  const [isOptionsDisplayed, setIsOptionsDisplayed] = useState<boolean>(false);
  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setuserInput(value.trim());
  };

  const handleInputFocus = () => {
    setIsOptionsDisplayed(true);
  };
  const handleInputBlur = () => {
    setIsOptionsDisplayed(false);
  };

  const handleOptionSelect = (option: string) => {
    console.log(option);
    setuserInput(option);
    setIsOptionsDisplayed(false);
  };

  const options = ["apple", "orange", "fig", "grape"];

  const filteredItems = () => {
    if (!userInput) return options;
    const results = options.filter((option) =>
      option.toLowerCase().includes(userInput.toLocaleLowerCase()),
    );
    return results;
  };

  return (
    <div className="autocomplete-container">
      <label htmlFor="fruit-choice">Choose a fruit:</label>
      <input
        name="fruit-choice"
        className="autocomplete"
        onChange={handleInputValueChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        value={userInput}
        type="text"
      ></input>
      {isOptionsDisplayed && (
        <ul className="autocomplete-options">
          {filteredItems().map((item) => {
            return (
              <li key={item} onMouseDown={() => handleOptionSelect(item)}>
                {item}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
