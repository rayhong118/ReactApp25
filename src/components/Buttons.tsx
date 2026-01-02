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
        "bg-blue-500 text-white font-semibold py-" +
        paddingMultiplier +
        " px-" +
        paddingMultiplier * 2 +
        " rounded hover:bg-blue-600 disabled:bg-gray-400 " +
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
        "text-gray-600 font-semibold py-" +
        paddingMultiplier +
        " px-" +
        paddingMultiplier * 2 +
        " rounded text-gray-800 hover:bg-gray-100 disabled:bg-gray-300 " +
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
        " rounded text-gray-600 hover:bg-gray-100 disabled:bg-gray-300 " +
        props.className
      }
    >
      {props.children}
    </button>
  );
};
