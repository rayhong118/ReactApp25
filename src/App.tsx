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
import { Home } from "./pages/home/Home";
import { useSetCurrentUser } from "./utils/AuthenticationAtoms";

import { WithAuthRequired } from "./components/WithAuthRequired";
import { MessageBarsContainer } from "./hooks/MessageBarsContainer";
import { withDefaultPagePadding } from "./hooks/withDefaultPagePadding";
import { withFontAwesome } from "./hooks/withFontAwesome";
import { withFooter } from "./hooks/withFooter";
import { withGoogleMapsApi } from "./hooks/withGoogleMapsApi";
import { Eat } from "./pages/eat/Eat";
import { EatEditForm } from "./pages/eat/EatEditForm";
import { JiZiQi } from "./pages/experiments/JiZiQi";
import { StarRating } from "./pages/experiments/StarRating";
import ScrollToTop from "./utils/ScrollToTop";


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
        <ScrollToTop />
        <Navigation />
        <MessageBarsContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/about" element={withDefaultPagePadding(<About />)} />
          <Route path="/experiments" element={<Experiments />} />

          <Route path="/experiments/fileUpload" element={<FileUpload />} />
          <Route
            path="/experiments/formValidation"
            element={<FormValidation />}
          />
          <Route
            path="/experiments/moveLists"
            element={<WithAuthRequired component={MoveLists} />}
          />
          <Route path="/experiments/stopWatch" element={withDefaultPagePadding(<StopWatch />)} />
          <Route
            path="/experiments/imageCarousels"
            element={withDefaultPagePadding(<ImageCarousel />)}
          />
          <Route path="/experiments/ticTacToe" element={withDefaultPagePadding(<JiZiQi />)} />
          <Route path="/experiments/starRating" element={<StarRating />} />
          <Route path="/eat" element={withDefaultPagePadding(<Eat />)} />
          <Route path="/eatCard/edit" element={<EatEditForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default withFontAwesome(withGoogleMapsApi(withFooter(App)));
