import React from "react";
import type { IButtonProps } from "./util";

export const SecondaryButton = (
  props: IButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  const { className, onClick, disabled, type, children, ...rest } = props;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`
    bg-transparent text-[var(--color-foreground)] font-semibold py-1 px-2 rounded 
    border-2 border-transparent 
    hover:bg-brand-soft
    focus:border-brand-vibrant focus:outline-none focus:bg-brand-soft 
    disabled:bg-foreground/20 disabled:cursor-not-allowed cursor-pointer 
    ${className || ""}
  `
        .replace(/\s+/g, " ")
        .trim()}
      data-testid="secondary-button"
      {...rest}
    >
      {children}
    </button>
  );
};
