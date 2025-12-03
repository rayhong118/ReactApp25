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
          className="cursor-pointer hover:underline p-2 relative group"
        >
          Experiments
          <menu className="absolute top-10 left-0 bg-white ring-black ring-opacity-5 rounded-md shadow-md flex flex-col w-48 py-2 scale-0 group-hover:scale-100 group-focus:scale-100 duration-300 origin-top">
            <li className="block">
              <button className="block cursor-pointer hover:bg-gray-100 p-1 rounded-md w-full">
                Copy
              </button>
            </li>
            <li className="block">
              <button className="block cursor-pointer hover:bg-gray-100 p-1 rounded-md w-full">
                Cut
              </button>
            </li>
            <li className="block">
              <button className="block cursor-pointer hover:bg-gray-100 p-1 rounded-md w-full">
                Paste
              </button>
            </li>
          </menu>
        </button>
      </nav>
    </div>
  );
};
