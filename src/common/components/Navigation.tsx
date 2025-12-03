import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();
  const [isExperimentsOpen, setIsExperimentsOpen] = useState(false);
  return (
    <div className="fixed top-0 w-screen p-2 bg-white shadow-md flex flex-row px-10">
      <button onClick={() => navigate("/")} className="cursor-pointer p-2">
        App25
      </button>
      <nav className="flex flex-row gap-4 ml-10">
        <button
          onClick={() => navigate("/about")}
          className="cursor-pointer hover:underline p-2"
        >
          About
        </button>
        <button
          onClick={() => navigate("/experiments")}
          onMouseEnter={() => setIsExperimentsOpen(true)}
          onFocus={() => setIsExperimentsOpen(true)}
          onMouseLeave={() => setIsExperimentsOpen(false)}
          onBlur={() => setIsExperimentsOpen(false)}
          className="cursor-pointer hover:underline p-2 relative"
        >
          Experiments
          {isExperimentsOpen && (
            <menu className="absolute top-10 left-0 bg-white border rounded-md shadow-md flex flex-col ">
              <li>
                <button className=" cursor-pointer hover:bg-gray-100 p-1 rounded-md w-full">
                  Copy
                </button>
              </li>
              <li>
                <button className=" cursor-pointer hover:bg-gray-100 p-1 rounded-md w-full">
                  Cut
                </button>
              </li>
              <li>
                <button className=" cursor-pointer hover:bg-gray-100 p-1 rounded-md w-full">
                  Paste
                </button>
              </li>
            </menu>
          )}
        </button>
      </nav>
    </div>
  );
};
