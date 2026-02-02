import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";

export const ColorPicker = ({
  color,
  setColor,
  disabled,
}: {
  color: string;
  setColor: (color: string) => void;
  disabled?: boolean;
}) => {
  const colorRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    if (!disabled) {
      colorRef.current?.click();
    }
  };
  return (
    <div>
      <div
        onClick={handleClick}
        className={`w-20 h-20 flex items-center justify-center
           rounded-full object-cover ${disabled ? "cursor-default" : "cursor-pointer"}`}
        style={{ backgroundColor: color }}
      >
        <input
          ref={colorRef}
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="hidden"
          disabled={disabled}
        />
        {!disabled && (
          <FontAwesomeIcon
            className="text-white text-4xl drop-shadow-lg"
            icon={faEdit}
          />
        )}
      </div>
    </div>
  );
};
