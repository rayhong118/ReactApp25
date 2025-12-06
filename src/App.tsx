import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Navigation } from "./common/components/Navigation";
import { About } from "./pages/about/About";
import { Experiments } from "./pages/experiments/Experiments";
import { VanillaDialog } from "./pages/experiments/VanillaDialog";
import { Home } from "./pages/home/Home";
import { FileUpload } from "./pages/experiments/FileUpload";
import { FormValidation } from "./pages/experiments/FormValidation";
import { MoveLists } from "./pages/experiments/MoveLists";
import { StopWatch } from "./pages/experiments/StopWatch";
import { ImageCarousel } from "./pages/experiments/ImageCarousel";

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/experiments" element={<Experiments />} />
          <Route
            path="/experiments/vanillaDialog"
            element={<VanillaDialog />}
          />
          <Route path="/experiments/fileUpload" element={<FileUpload />} />
          <Route
            path="/experiments/formValidation"
            element={<FormValidation />}
          />
          <Route path="/experiments/moveLists" element={<MoveLists />} />
          <Route path="/experiments/stopWatch" element={<StopWatch />} />
          <Route
            path="/experiments/imageCarousels"
            element={<ImageCarousel />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
