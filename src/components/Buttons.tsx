interface IButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
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
