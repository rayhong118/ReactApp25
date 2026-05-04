import "./Home.scss";
import SEO from "../../components/SEO";

const Home = () => {
  return (
    <div className="homepage-container w-full">
      <SEO
        title="Home"
        description="Welcome to Doghead portal 2025 - Your hub for Food, Comics, and more."
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Doghead portal 2025",
          url: "https://dogheadportal.web.app/",
        }}
      />
      <div
        className="homepage-panel homepage-main-panel bg-black overflow-hidden min-h-screen
       w-full max-h-screen flex flex-col justify-center items-center"
      >
        <h1 id="homepage_title" className="font-bold">
          FOOD, COMICS & MORE
        </h1>
        <h2 id="homepage_subtitle" className="text-2xl text-white">
          Doghead portal 2025
        </h2>
      </div>
      <div
        className=" homepage-panel bg-white min-h-screen w-full max-h-screen 
        flex flex-col justify-center items-center"
        id="houdini"
      >
        <div className="card">
          <div
            className="content flex items-center flex-col gap-10 p-10 
          md:p-20"
          >
            <img
              className="w-1/3 h-1/3 rounded-full md:w-1/2 md:h-1/2"
              src="2017dh.png"
              alt="Doghead"
            />
            <h2 className="font-bold text-2xl">Doghead</h2>
          </div>
        </div>
      </div>
      <div
        className="homepage-panel bg-white min-h-screen w-full max-h-screen 
        flex flex-col justify-center items-center"
      >
        <div id="animatedGrid">
          {[...Array(9)].map((_, index) => (
            <div key={index} className="card">
              <h3 className="font-bold text-2xl">{index}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
