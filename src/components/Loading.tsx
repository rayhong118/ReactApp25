import "./loading.css";

export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full">
      <div id="loading"></div>
      <p className="text-2xl font-bold">Loading...</p>
    </div>
  );
};
