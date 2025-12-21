import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDismissMessageBar } from "../utils/MessageBarsAtom";
import "./MessageBar.scss";

export interface IMessageBarProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  autoDismiss?: boolean;
  autoDismissTimeout?: number;
}

export const MessageBar = ({
  id,
  type,
  message,
  autoDismiss,
  autoDismissTimeout,
}: IMessageBarProps) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const dismissMessageBar = useDismissMessageBar();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let fadeOutTimeout: NodeJS.Timeout;
    const fadeOutTimeoutDuration = (autoDismissTimeout || 5000) - 1000;

    if (autoDismiss) {
      fadeOutTimeout = setTimeout(() => {
        setIsFadingOut(true);
      }, fadeOutTimeoutDuration);
      timeout = setTimeout(() => {
        dismissMessageBar(id);
      }, autoDismissTimeout || 5000);
    }
    return () => {
      clearTimeout(timeout);
      clearTimeout(fadeOutTimeout);
    };
  }, [autoDismiss, autoDismissTimeout, id]);

  const baseClass = `flex items-center justify-between gap-2 px-4 py-2 mx-5 rounded-md 
    shadow-lg pointer-events-auto`;
  const typeClass = () => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div
      className={`${baseClass} ${typeClass()} ${
        isFadingOut ? "message-bar-fade-out" : ""
      }`}
    >
      <p>{message}</p>
      <button onClick={() => dismissMessageBar(id)}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
};
