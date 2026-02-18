import { faFlask } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavButton } from "./NavButton";
import { experimentsNavItems } from "./NavItems";

export const NavDropdown = ({
  onItemClick,
  mobile,
}: {
  onItemClick: () => void;
  mobile?: boolean;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (mobile) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobile]);

  if (mobile) {
    return (
      <div>
        <button
          onClick={() => setDropdownOpen((s) => !s)}
          className="w-full text-left px-3 py-2 rounded-md text-md font-medium text-foreground 
          hover:bg-brand-soft flex items-center justify-between cursor-pointer"
        >
          <span>
            <FontAwesomeIcon icon={faFlask} className="mr-2 pt-0.5" />
            {t("navbar.lab.title")}
          </span>
          <svg
            className={`h-4 w-4 text-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="mt-1 space-y-1 pl-2">
            {experimentsNavItems.map((item) => (
              <NavButton
                key={item.to}
                {...item}
                nested
                onClick={() => {
                  onItemClick();
                  setDropdownOpen(false);
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((s) => !s)}
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
        className="inline-flex items-center px-3 py-2 rounded-md text-md font-medium
         text-foreground hover:bg-brand-soft whitespace-nowrap cursor-pointer"
      >
        <FontAwesomeIcon icon={faFlask} className="mr-2 pt-0.5" />
        {t("navbar.lab.title")}
        <svg
          className={`ml-2 h-4 w-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-60 bg-background ring-1 ring-black/5
         rounded-md shadow-lg py-1"
        >
          {experimentsNavItems.map((item) => (
            <NavButton
              key={item.to}
              {...item}
              nested
              onClick={() => {
                onItemClick();
                setDropdownOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
