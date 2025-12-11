import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";

interface IDialogAction {
  label: string;
  onClick: () => void;
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
        className="border rounded-md p-5 flex flex-col justify-between gap-2 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 bg-white shadow-xl z-50 w-full max-w-lg"
      >
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-l font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="cursor-pointer hover:bg-gray-100 border-gray-200 border rounded-md"
          >
            <FontAwesomeIcon icon={faClose} className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="py-4">
          {children}
        </div>
        {actions && (
          <div className="flex flex-row justify-end gap-1">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="cursor-pointer hover:bg-gray-100 p-1 border-gray-200 border-1 rounded-md"
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
