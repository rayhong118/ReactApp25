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
      <input
        ref={colorRef}
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="hidden"
        disabled={disabled}
      />

      <div
        onClick={handleClick}
        className={`w-20 h-20 rounded-full object-cover ${disabled ? "cursor-default" : "cursor-pointer"}`}
        style={{ backgroundColor: color }}
      />
    </div>
  );
};
