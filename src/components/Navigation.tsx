import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faFlask,
  faGear,
  faGift,
  faImage,
  faSignInAlt,
  faUtensils,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUser } from "../pages/auth/AuthenticationAtoms";
import Tooltip from "./Tooltip";
import { LanguageSettings, ThemeSettings } from "@/pages/auth/Settings";

const mainNavItems = [
  { label: "navbar.eat", to: "/eat", icon: faUtensils },
  { label: "navbar.drawings", to: "/drawings", icon: faImage },
  { label: "navbar.gifts", to: "/gifts", icon: faGift },
  { label: "navbar.friends", to: "/friends", icon: faUserGroup },
];

const experimentsNavItems = [
  { label: "navbar.lab.formValidation", to: "/experiments/formValidation" },
  { label: "navbar.lab.moveLists", to: "/experiments/moveLists" },
  { label: "navbar.lab.stopWatch", to: "/experiments/stopWatch" },
  { label: "navbar.lab.imageCarousels", to: "/experiments/imageCarousels" },
  { label: "navbar.lab.fileUpload", to: "/experiments/fileUpload" },
  {
    label: "navbar.lab.calendarEventGenerator",
    to: "/experiments/calendarEventGenerator",
  },
  { label: "navbar.lab.ticTacToe", to: "/experiments/ticTacToe" },
];

interface NavItemProps {
  label: string;
  to: string;
  icon?: IconProp;
  nested?: boolean;
  onClick?: () => void;
}

const NavButton = ({ label, to, icon, nested, onClick }: NavItemProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <button
      onClick={() => {
        navigate(to);
        if (onClick) onClick();
      }}
      className={`flex items-center px-3 py-2 rounded-md text-md font-medium 
         text-foreground hover:bg-brand-soft text-start whitespace-nowrap cursor-pointer ${
           nested ? "w-full" : ""
         }`}
    >
      {icon && <FontAwesomeIcon icon={icon} className="mr-2 pt-0.5" />}
      {t(label)}
    </button>
  );
};

const AuthButton = ({ onClick }: { onClick: () => void }) => {
  const getCurrentUser = useGetCurrentUser();

  const buttonProps = !getCurrentUser
    ? {
        label: "navbar.auth.login",
        to: "/auth",
        icon: faSignInAlt,
      }
    : {
        label: "navbar.auth.settings",
        to: "/settings",
        icon: faGear,
      };

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <NavButton {...buttonProps} nested onClick={onClick} />
      </Tooltip.Trigger>
      <Tooltip.Content>
        <ThemeSettings />
        <LanguageSettings />
      </Tooltip.Content>
    </Tooltip>
  );
};

const NavDropdown = ({
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

const Navigation = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenus = () => {
    setMobileOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className="fixed top-0 w-full bg-background shadow-md z-40 shadow-foreground/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => {
                navigate("/");
                closeMenus();
              }}
              className="flex items-center gap-2 text-md font-semibold text-foreground 
              hover:text-gray-700 cursor-pointer px-3 py-2"
              aria-label="Go to home"
            >
              <img
                className="w-8 h-8"
                src="2017dh.png"
                alt="DogheadPortal logo"
              />
              DogheadPortal
            </button>
          </div>

          <div className="hidden md:flex md:items-center">
            {mainNavItems.map((item) => (
              <NavButton key={item.to} {...item} onClick={closeMenus} />
            ))}
            <NavDropdown onItemClick={closeMenus} />
            <AuthButton onClick={closeMenus} />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center p-2 rounded-md 
              text-foreground hover:bg-brand-soft"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden bg-background">
          <div className="px-2 pt-2 pb-3 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
            {mainNavItems.map((item) => (
              <NavButton key={item.to} {...item} nested onClick={closeMenus} />
            ))}
            <NavDropdown mobile onItemClick={closeMenus} />
            <AuthButton onClick={closeMenus} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;
