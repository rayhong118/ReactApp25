import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthButton } from "./AuthButton";
import { NavButton } from "./NavButton";
import { NavDropdown } from "./NavDropdown";
import { mainNavItems } from "./NavItems";

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
