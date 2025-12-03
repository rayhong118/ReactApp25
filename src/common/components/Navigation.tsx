import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 w-screen p-2 bg-white shadow-md flex flex-row px-10">
      <button onClick={() => navigate("/")} className="cursor-pointer p-2">
        App25
      </button>
    </div>
  );
};
