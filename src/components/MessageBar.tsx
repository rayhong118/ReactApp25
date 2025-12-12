import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDismissMessageBar } from "../utils/MessageBarsAtom";

export interface IMessageBarProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  autoDismiss?: boolean;
  autoDismissTimeout?: number;
}

export const MessageBar = ({ id, type, message, autoDismiss, autoDismissTimeout }: IMessageBarProps) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const dismissMessageBar = useDismissMessageBar();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (autoDismiss) {
      timeout = setTimeout(() => {
        setIsDismissed(true);
      }, autoDismissTimeout || 5000);
    }
    return () => clearTimeout(timeout);
  }, [autoDismiss]);

  if (isDismissed) return null;

  const baseClass = "flex items-center justify-between gap-2 p-2 mx-5 rounded-md shadow-lg pointer-events-auto";
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
  }

  return (
    <div className={`
    ${baseClass} 
    ${typeClass()}
    `}>
      <p>{message}</p>
      <button onClick={() => dismissMessageBar(id)}><FontAwesomeIcon icon={faXmark} /></button>
    </div>
  );
};