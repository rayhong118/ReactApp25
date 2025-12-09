import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Navigation } from "./components/Navigation";
import { auth } from "./firebase";
import { About } from "./pages/about/About";
import { AuthPage } from "./pages/auth/Auth";
import { Experiments } from "./pages/experiments/Experiments";
import { FileUpload } from "./pages/experiments/FileUpload";
import { FormValidation } from "./pages/experiments/FormValidation";
import { ImageCarousel } from "./pages/experiments/imageCarousel/ImageCarousel";
import { MoveLists } from "./pages/experiments/MoveLists";
import { StopWatch } from "./pages/experiments/StopWatch";
import { VanillaDialog } from "./pages/experiments/VanillaDialog";
import { Home } from "./pages/home/Home";
import { useSetCurrentUser } from "./utils/AuthenticationAtoms";


import { WithAuthRequired } from "./components/WithAuthRequired";
import { withFontAwesome } from "./hooks/withFontAwesome";
import { withGoogleMapsApi } from "./hooks/withGoogleMapsApi";
import { EatCard } from "./pages/eat/EatCard";
import { EatEditDialog } from "./pages/eat/EatEditForm";
import { JiZiQi } from "./pages/experiments/JiZiQi";
import { StarRating } from "./pages/experiments/StarRating";

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
          <Route path="/eatCard" element={<EatCard />} />
          <Route path="/eatCard/edit" element={<EatEditDialog />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default withFontAwesome(withGoogleMapsApi(App));
