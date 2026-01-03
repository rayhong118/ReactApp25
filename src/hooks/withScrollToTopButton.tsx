import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

const withScrollToTopButton = (children: ReactNode) => {
  return (
    <>
      {children}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-20 right-0 z-10 p-5
        rounded-md flex items-center justify-center 
        pointer-events-auto bg-black/20 hover:bg-black/40 
        text-white p-2"
      >
        <FontAwesomeIcon icon={faArrowUp} className="text-2xl" />
      </button>
    </>
  );
};

export default withScrollToTopButton;
