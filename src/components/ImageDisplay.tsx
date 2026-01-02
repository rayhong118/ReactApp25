import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { CustomizedButton } from "./Buttons";
import { useEffect } from "react";
import { FocusTrap } from "focus-trap-react";

interface ImageDisplayProps {
  src: string;
  alt: string;
  title?: string;
  open: boolean;
  onClose: () => void;
}
export const ImageDisplay = ({
  src,
  alt,
  title,
  open,
  onClose,
}: ImageDisplayProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <FocusTrap
      focusTrapOptions={{
        allowOutsideClick: true,
        escapeDeactivates: false,
      }}
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 overflow-y-auto">
        <div className="flex flex-col items-center min-h-full w-full relative">
          <div
            className="sticky top-0 left-0 p-4 w-full flex flex-row justify-between 
            items-center pointer-events-none px-4 md:px-10 bg-black/50 z-50"
          >
            {title && (
              <h1 className="text-2xl font-bold text-white pointer-events-auto">
                {title}
              </h1>
            )}
            <CustomizedButton
              onClick={onClose}
              className="pointer-events-auto bg-black/20 hover:bg-black/40 
              text-white p-2"
            >
              <FontAwesomeIcon icon={faClose} className="text-xl" />
            </CustomizedButton>
          </div>
          <img
            className="m-auto object-contain max-w-full p-5 md:p-10"
            src={src}
            alt={alt}
          />
        </div>
      </div>
    </FocusTrap>,
    document.body
  );
};
