import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";
import { FocusTrap } from "focus-trap-react";
import { SecondaryButton } from "./Buttons";

export interface IDialogAction {
  label: string;
  onClick: () => void;
  color?: string;
}

interface IDialogProps {
  open: boolean;
  title?: string;
  actions?: IDialogAction[];
  onClose?: () => void;
  children?: React.ReactNode;
}

export const Dialog: React.FC<IDialogProps> = (props: IDialogProps) => {
  const { title, actions, open, onClose, children } = props;
  if (!open) return null;
  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-grayscale z-40" />
      <dialog
        id="dialog"
        open={open}
        aria-modal="true"
        role="dialog"
        className="border rounded-md flex flex-col space-around justify-between gap-0 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 bg-white shadow-xl z-50 w-full max-w-lg max-h-[calc(100vh-4rem)]"
      >
        <div className="flex flex-row justify-between items-center px-5 pt-5">
          <h1 className="text-xl font-bold">{title}</h1>
          <SecondaryButton
            onClick={onClose}
            className="cursor-pointer hover:bg-gray-100 border-gray-200 border rounded-md p-2"
          >
            <FontAwesomeIcon icon={faClose} className="h-6 w-6 text-gray-600" />
          </SecondaryButton>
        </div>

        <div className="p-5 overflow-y-scroll">
          {children}
        </div>
        {actions && (
          <div className="flex flex-row justify-end gap-2 px-5 pb-5">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="cursor-pointer hover:bg-gray-100 px-4 py-2 border-gray-200 border-1 rounded-md"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </dialog>

    </>
    , document.body);
};
