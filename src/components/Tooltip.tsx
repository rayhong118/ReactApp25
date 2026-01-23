import React from "react";
import { useState } from "react";

export const Tooltip = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(false), 200);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TooltipContent) {
          return isVisible ? child : null;
        }
        return child;
      })}
    </div>
  );
};

export const TooltipTrigger = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: unknown;
}) => {
  return <div {...props}>{children}</div>;
};

export const TooltipContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 p-2 rounded-md shadow-lg bg-background border border-foreground
    whitespace-nowrap"
    >
      <div className="p-2 rounded-md flex flex-col gap-4">{children}</div>
    </div>
  );
};
