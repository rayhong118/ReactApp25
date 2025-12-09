import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Navigation } from "./common/components/Navigation";
import { useSetCurrentUser } from "./common/utils/AuthenticationAtoms";
import { auth } from "./firebase";
import { About } from "./pages/about/About";
import { AuthPage } from "./pages/auth/Auth";
import { Experiments } from "./pages/experiments/Experiments";
import { FileUpload } from "./pages/experiments/FileUpload";
import { FormValidation } from "./pages/experiments/FormValidation";
import { ImageCarousel } from "./pages/experiments/ImageCarousel";
import { MoveLists } from "./pages/experiments/MoveLists";
import { StopWatch } from "./pages/experiments/StopWatch";
import { VanillaDialog } from "./pages/experiments/VanillaDialog";
import { Home } from "./pages/home/Home";

import { library } from "@fortawesome/fontawesome-svg-core";

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { WithAuthRequired } from "./common/components/WithAuthRequired";
import { JiZiQi } from "./pages/experiments/JiZiQi";
import { StarRating } from "./pages/experiments/StarRating";

library.add(fas, far, fab);

const App: React.FC = () => {
  const setCurrentUser = useSetCurrentUser();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setCurrentUser(currentUser);
    });
    return () => unsubscribe();
  }, [setCurrentUser]);

  return (
    <>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
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
          <Route
            path="/experiments/moveLists"
            element={<WithAuthRequired component={MoveLists} />}
          />
          <Route path="/experiments/stopWatch" element={<StopWatch />} />
          <Route
            path="/experiments/imageCarousels"
            element={<ImageCarousel />}
          />
          <Route path="/experiments/ticTacToe" element={<JiZiQi />} />
          <Route path="/experiments/starRating" element={<StarRating />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
