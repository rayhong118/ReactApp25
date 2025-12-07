import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUser } from "../utils/AuthenticationAtoms";

const experimentsNavItems = [
  { label: "Form Validation", to: "/experiments/formValidation" },
  { label: "Move Lists", to: "/experiments/moveLists" },
  { label: "Stop Watch 秒表", to: "/experiments/stopWatch" },
  { label: "Image Carousel", to: "/experiments/imageCarousels" },
  { label: "File Upload", to: "/experiments/fileUpload" },
  { label: "Tic Tac Toe 五子棋", to: "/experiments/ticTacToe" },
];

export const Navigation = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const getCurrentUser = useGetCurrentUser();

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

  const navButton = (label: string, to: string, nested: boolean = false) => (
    <button
      onClick={() => {
        navigate(to);
        setMobileOpen(false);
        setDropdownOpen(false);
      }}
      key={label}
      className={`block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 text-start ${
        nested ? "w-full" : ""
      }`}
    >
      {label}
    </button>
  );

  const authButtons = () => {
    // You can add authentication related buttons here
    if (!getCurrentUser) {
      return navButton("Log in / Sign Up", "/auth");
    } else return navButton("User Settings", "/auth");
  };

  return (
    <div
      ref={wrapperRef}
      className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="text-lg font-semibold text-gray-900 hover:text-gray-700"
              aria-label="Go to home"
            >
              App25
            </button>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {navButton("About", "/about")}

            <div className="relative">
              <button
                onClick={() => setDropdownOpen((s) => !s)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Experiments
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
                <div className="absolute right-0 mt-2 w-48 bg-white ring-1 ring-black/5 rounded-md shadow-lg py-1">
                  {experimentsNavItems.map((item) =>
                    navButton(item.label, item.to, true)
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
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
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navButton("About", "/about")}

            <div>
              <button
                onClick={() => setDropdownOpen((s) => !s)}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center justify-between"
              >
                Experiments
                <svg
                  className="h-4 w-4 text-gray-500"
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
                    navButton(item.label, item.to, true)
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
