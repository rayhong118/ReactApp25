import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faFlask,
  faGear,
  faGift,
  faImage,
  faSignInAlt,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUser } from "../utils/AuthenticationAtoms";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { LanguageSettings, ThemeSettings } from "@/pages/auth/Settings";

const experimentsNavItems = [
  { label: "navbar.lab.formValidation", to: "/experiments/formValidation" },
  { label: "navbar.lab.moveLists", to: "/experiments/moveLists" },
  { label: "navbar.lab.stopWatch", to: "/experiments/stopWatch" },
  { label: "navbar.lab.imageCarousels", to: "/experiments/imageCarousels" },
  { label: "navbar.lab.fileUpload", to: "/experiments/fileUpload" },
  { label: "navbar.lab.ticTacToe", to: "/experiments/ticTacToe" },
];

const Navigation = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const getCurrentUser = useGetCurrentUser();
  const { t } = useTranslation();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  interface INavButtonProps {
    label: string;
    to: string;
    nested?: boolean;
    icon?: IconProp;
  }

  const navButton = ({ label, to, nested, icon }: INavButtonProps) => (
    <button
      onClick={() => {
        navigate(to);
        setMobileOpen(false);
        setDropdownOpen(false);
      }}
      key={label}
      className={`flex items-center px-3 py-2 rounded-md text-md font-medium 
         text-foreground hover:bg-brand-soft text-start whitespace-nowrap cursor-pointer ${
           nested ? "w-full" : ""
         }`}
    >
      {icon && <FontAwesomeIcon icon={icon} className="mr-2 pt-0.5" />}
      {t(label)}
    </button>
  );

  const authButtons = () => {
    // You can add authentication related buttons here
    if (!getCurrentUser) {
      return (
        <Tooltip>
          <TooltipTrigger>
            {navButton({
              label: "navbar.auth.login",
              to: "/auth",
              nested: true,
              icon: faSignInAlt,
            })}
          </TooltipTrigger>
          <TooltipContent>
            <ThemeSettings />
            <LanguageSettings />
          </TooltipContent>
        </Tooltip>
      );
    } else
      return (
        <Tooltip>
          <TooltipTrigger>
            {navButton({
              label: "navbar.auth.settings",
              to: "/settings",
              nested: true,
              icon: faGear,
            })}
          </TooltipTrigger>
          <TooltipContent>
            <ThemeSettings />
            <LanguageSettings />
          </TooltipContent>
        </Tooltip>
      );
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
              onClick={() => navigate("/")}
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
            {navButton({ label: "navbar.eat", to: "/eat", icon: faUtensils })}
            {navButton({
              label: "navbar.drawings",
              to: "/drawings",
              icon: faImage,
            })}
            {navButton({
              label: "navbar.gifts",
              to: "/gifts",
              icon: faGift,
            })}

            <div className="relative">
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
                  className="ml-2 h-4 w-4 text-gray-500"
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
                  {experimentsNavItems.map((item) =>
                    navButton({ label: item.label, to: item.to, nested: true }),
                  )}
                </div>
              )}
            </div>

            {authButtons()}
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
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navButton({
              label: "navbar.eat",
              to: "/eat",
              nested: true,
              icon: faUtensils,
            })}
            {navButton({
              label: "navbar.drawings",
              to: "/drawings",
              nested: true,
              icon: faImage,
            })}
            {navButton({
              label: "navbar.gifts",
              to: "/gifts",
              nested: true,
              icon: faGift,
            })}
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
                  className="h-4 w-4 text-foreground"
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
                  {experimentsNavItems.map((item) =>
                    navButton({
                      label: item.label,
                      to: item.to,
                      nested: true,
                    }),
                  )}
                </div>
              )}
            </div>

            {authButtons()}
          </div>
        </div>
      )}
    </div>
  );
};
export default Navigation;
