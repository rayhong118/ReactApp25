interface IButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const PrimaryButton = (props: IButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
      className={`
    bg-brand-primary text-white font-semibold py-1 px-2 rounded
    hover:bg-brand-vibrant 
    disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed 
    ${props.className || ""}
  `
        .replace(/\s+/g, " ")
        .trim()}
      data-testid="primary-button"
    >
      {props.children}
    </button>
  );
};

export const SecondaryButton = (props: IButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
      className={`
    bg-transparent text-gray-800 font-semibold py-1 px-2 rounded 
    border-2 border-transparent 
    hover:bg-brand-soft
    focus:border-brand-vibrant focus:outline-none focus:bg-brand-soft
    disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer
    ${props.className || ""}
  `
        .replace(/\s+/g, " ")
        .trim()}
      data-testid="secondary-button"
    >
      {props.children}
    </button>
  );
};

export const CustomizedButton = (props: IButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
      className={`
    rounded text-gray-800 transition-colors duration-200 cursor-pointer py-1 px-2 
    disabled:cursor-not-allowed 
    ${props.className || ""}
  `
        .replace(/\s+/g, " ")
        .trim()}
      data-testid="customized-button"
    >
      {props.children}
    </button>
  );
};
