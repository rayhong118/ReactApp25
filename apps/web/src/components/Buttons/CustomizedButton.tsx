import type { IButtonProps } from "./util";

export const CustomizedButton = (props: IButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
      className={`
    rounded text-[var(--color-foreground)] transition-colors duration-200 cursor-pointer py-1 px-2 
    disabled:cursor-not-allowed disabled:bg-foreground/20
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
