import {
  faClose,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FocusTrap } from "focus-trap-react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { CustomizedButton } from "./Buttons";

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
  const [displayScale, setDisplayScale] = useState(100);
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
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 
      overflow-y-scroll flex flex-col items-center "
      >
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
          className={`transition-transform duration-300 scale-[calc(var(--menu-scale)_/_100)] `}
          style={{ "--menu-scale": displayScale } as React.CSSProperties}
          src={src}
          alt={alt}
        />

        <div className="sticky bottom-0 z-50 bg-black/50 flex flex-row justify-center items-center rounded-xl">
          <CustomizedButton
            onClick={() =>
              setDisplayScale((prev) => (prev === 200 ? prev : prev + 25))
            }
            disabled={displayScale === 200}
            className="text-2xl pointer-events-auto hover:bg-black/40 
              text-white p-2 rounded-l-xl"
          >
            <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
          </CustomizedButton>
          <CustomizedButton
            onClick={() =>
              setDisplayScale((prev) => (prev === 50 ? prev : prev - 25))
            }
            disabled={displayScale === 50}
            className="text-2xl pointer-events-auto hover:bg-black/40 
              text-white p-2 rounded-r-xl"
          >
            <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
          </CustomizedButton>
        </div>
      </div>
    </FocusTrap>,
    document.body
  );
};
