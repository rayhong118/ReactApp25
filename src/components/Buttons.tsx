

interface IButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const PrimaryButton = (props: IButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
      className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
    >
      {props.children}
    </button>
  );
}

export const SecondaryButton = (props: IButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
      className="text-gray-600 font-semibold py-1 px-2 rounded hover:bg-gray-100"
    >
      {props.children}
    </button>
  );
}

export const CustomizedButton = (props: IButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
      className={"py-1 px-2 rounded hover:bg-gray-100 text-sm " + props.className}
    >
      {props.children}
    </button>
  );
}