import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useGetCurrentUser } from "@/pages/auth/AuthenticationAtoms";
import "./Notification.scss";
import { SecondaryButton } from "../Buttons";

export const Notification = () => {
  const currentUser = useGetCurrentUser();

  if (!currentUser) return null;

  return (
    <SecondaryButton onClick={() => {}}>
      <div className="notification-wrapper">
        <FontAwesomeIcon icon={faBell} />
        <span className="dot"></span>
      </div>
    </SecondaryButton>
  );
};
