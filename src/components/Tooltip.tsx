import React, { createContext } from "react";
import { useState } from "react";

const TooltipContext = createContext({
  isVisible: false,
});

const Tooltip = ({ children }: { children: React.ReactNode }) => {
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
    <TooltipContext.Provider value={{ isVisible }}>
      <div
        className="relative inline-block"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
};

const Trigger = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: unknown;
}) => {
  return <div {...props}>{children}</div>;
};

const Content = ({ children }: { children: React.ReactNode }) => {
  const { isVisible } = React.useContext(TooltipContext);
  return (
    isVisible && (
      <div
        className="absolute left-1/2 -translate-x-1/2 p-2 rounded-md shadow-lg bg-background border border-foreground
    whitespace-nowrap"
      >
        <div className="p-2 rounded-md flex flex-col gap-4">{children}</div>
      </div>
    )
  );
};

Tooltip.Trigger = Trigger;
Tooltip.Content = Content;

export default Tooltip;
