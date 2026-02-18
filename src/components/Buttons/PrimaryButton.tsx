import type { IButtonProps } from "./util";

export const PrimaryButton = (props: IButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
      className={`
    bg-brand-primary text-white font-semibold py-1 px-2 rounded
    hover:bg-brand-vibrant 
    disabled:bg-brand-primary/50 cursor-pointer disabled:cursor-not-allowed 
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
