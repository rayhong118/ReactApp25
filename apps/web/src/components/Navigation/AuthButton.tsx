import { useGetCurrentUser } from "@/pages/auth/AuthenticationAtoms";
import { ThemeSettings, LanguageSettings } from "@/pages/auth/Settings";
import { faSignInAlt, faGear } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "../Tooltip";
import { NavButton } from "./NavButton";

export const AuthButton = ({ onClick }: { onClick: () => void }) => {
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
