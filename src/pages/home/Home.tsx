import "./Home.scss";

export const Home = () => {
  return (
    <div className="homepage-container w-full">
      <div className=" homepage-panel bg-black overflow-hidden min-h-screen w-full max-h-screen flex justify-center items-center">
        <h1 id="homepage_title" className="font-bold p-20">
          HOMEPAGE
        </h1>
      </div>
      <div className=" homepage-panel bg-white min-h-screen w-full max-h-screen flex justify-center items-center">
        <h1 className="font-bold p-20">PANEL 2</h1>
      </div>
      <div className=" homepage-panel bg-gray-800 text-white min-h-screen w-full max-h-screen flex justify-center items-center">
        <h1 className="font-bold p-20">PANEL 3</h1>
      </div>
      <div className=" homepage-panel bg-white-800 min-h-screen w-full max-h-screen flex justify-center items-center">
        <h1 className="font-bold p-20">PANEL 4</h1>
      </div>
      <div className=" homepage-panel bg-gray-800 text-white min-h-screen w-full max-h-screen flex justify-center items-center">
        <h1 className="font-bold p-20">PANEL 5</h1>
      </div>
    </div>
  );
};
