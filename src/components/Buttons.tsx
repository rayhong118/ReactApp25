interface IButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  paddingMultiplier?: number;
}

export const PrimaryButton = (props: IButtonProps) => {
  const paddingMultiplier = props.paddingMultiplier
    ? props.paddingMultiplier
    : 1;
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
      className={
        "bg-brand-primary text-white font-semibold py-" +
        paddingMultiplier +
        " px-" +
        paddingMultiplier * 2 +
        " rounded hover:bg-brand-vibrant disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed " +
        (props.className || "")
      }
    >
      {props.children}
    </button>
  );
};

export const SecondaryButton = (props: IButtonProps) => {
  const paddingMultiplier = props.paddingMultiplier
    ? props.paddingMultiplier
    : 1;
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
      className={
        "font-semibold py-" +
        paddingMultiplier +
        " px-" +
        paddingMultiplier * 2 +
        " rounded text-gray-800 hover:bg-brand-soft disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed " +
        (props.className || "")
      }
    >
      {props.children}
    </button>
  );
};

export const CustomizedButton = (props: IButtonProps) => {
  const paddingMultiplier = props.paddingMultiplier
    ? props.paddingMultiplier
    : 1;
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
      className={
        "py-" +
        paddingMultiplier +
        " px-" +
        paddingMultiplier * 2 +
        " rounded text-gray-800 hover:bg-brand-soft disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed " +
        props.className
      }
    >
      {props.children}
    </button>
  );
};
