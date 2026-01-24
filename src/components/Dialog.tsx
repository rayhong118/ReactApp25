import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import { FocusTrap } from "focus-trap-react";
import { SecondaryButton } from "./Buttons";

export interface IDialogAction {
  label: string;
  onClick: () => void;
  color?: string;
  customizedClassName?: string;
}

interface IDialogProps {
  open: boolean;
  title?: string;
  actions?: IDialogAction[];
  onClose?: () => void;
  children?: React.ReactNode;
  customizedClassName?: string;
}

let scrollLockCount = 0;

export const Dialog: React.FC<IDialogProps> = (props: IDialogProps) => {
  const { title, actions, open, onClose, children, customizedClassName } =
    props;

  useEffect(() => {
    if (!open) {
      return;
    }
    scrollLockCount++;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      scrollLockCount--;
      if (scrollLockCount <= 0) {
        document.body.style.overflow = "unset";
        scrollLockCount = 0;
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 bg-black/25 backdrop-grayscale z-40" />
      <FocusTrap
        focusTrapOptions={{
          // This function allows clicks on the Google results to go through
          allowOutsideClick: (event: any) => {
            if (
              event.target?.classList.contains("pac-item") ||
              event.target?.classList.contains("pac-container") ||
              event.target?.closest(".pac-container")
            ) {
              return true;
            }
            return false;
          },
          escapeDeactivates: false,
        }}
      >
        <dialog
          id="dialog"
          open={open}
          aria-modal="true"
          role="dialog"
          className={`rounded-md flex flex-col space-around justify-between gap-0 
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 
          bg-[var(--color-background)] shadow-xl shadow-gray z-50 w-full md:w-[calc(100vw-2rem)] 
          max-w-7xl max-h-[calc(100vh-2rem)] ${customizedClassName}`}
        >
          <div className="flex flex-row justify-between items-center px-5 pt-5">
            <h1 className="text-xl font-bold text-[var(--color-foreground)]">
              {title}
            </h1>
            <SecondaryButton onClick={onClose} className="cursor-pointer">
              <FontAwesomeIcon icon={faClose} className="h-6 w-6" />
            </SecondaryButton>
          </div>

          <div className="p-5 overflow-y-scroll">{children}</div>
          {actions && (
            <div className="flex flex-row justify-end gap-2 px-5 pb-5">
              {actions.map((action, index) => (
                <SecondaryButton
                  key={index}
                  onClick={action.onClick}
                  className={action.customizedClassName}
                >
                  {action.label}
                </SecondaryButton>
              ))}
            </div>
          )}
        </dialog>
      </FocusTrap>
    </>,
    document.body,
  );
};
