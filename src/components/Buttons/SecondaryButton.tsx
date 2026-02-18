import type { IButtonProps } from "./util";

export const SecondaryButton = (props: IButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
      className={`
    bg-transparent text-[var(--color-foreground)] font-semibold py-1 px-2 rounded 
    border-2 border-transparent 
    hover:bg-brand-soft
    focus:border-brand-vibrant focus:outline-none focus:bg-brand-soft 
    disabled:bg-foreground/20 disabled:cursor-not-allowed cursor-pointer 
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
