import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { NavItemProps } from "./NavItems";

export const NavButton = ({
  label,
  to,
  icon,
  nested,
  onClick,
}: NavItemProps) => {
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
