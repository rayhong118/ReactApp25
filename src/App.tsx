import { onAuthStateChanged } from "firebase/auth";
import { lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Navigation } from "./components/Navigation";
import { auth } from "./firebase";
import { About } from "./pages/about/About";
import { Home } from "./pages/home/Home";
import { useSetCurrentUser } from "./utils/AuthenticationAtoms";

import { WithAuthRequired } from "./components/WithAuthRequired";
import { MessageBarsContainer } from "./hooks/MessageBarsContainer";
import { withDefaultPagePadding } from "./hooks/withDefaultPagePadding";
import { withFontAwesome } from "./hooks/withFontAwesome";
import { withFooter } from "./hooks/withFooter";

import { withSuspense } from "./hooks/withSuspense";
import ScrollToTop from "./utils/ScrollToTop";

const JiZiQi = lazy(() => import("./pages/experiments/JiZiQi"));
const Eat = lazy(() => import("./pages/eat/Eat"));
const StopWatch = lazy(() => import("./pages/experiments/StopWatch"));
const FileUpload = lazy(() => import("./pages/experiments/FileUpload"));
const FormValidation = lazy(() => import("./pages/experiments/FormValidation"));
const ImageCarousel = lazy(() => import("./pages/experiments/imageCarousel/ImageCarousel"));
const MoveLists = lazy(() => import("./pages/experiments/MoveLists"));
const AuthPage = lazy(() => import("./pages/auth/Auth"));

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
          <Route path="/auth" element={withSuspense(<AuthPage />)} />
          <Route path="/about" element={withDefaultPagePadding(<About />)} />

          <Route path="/experiments/fileUpload" element={withSuspense(<FileUpload />)} />
          <Route
            path="/experiments/formValidation"
            element={withSuspense(<FormValidation />)}
          />
          <Route
            path="/experiments/moveLists"
            element={withSuspense(<WithAuthRequired component={MoveLists} />)}
          />
          <Route path="/experiments/stopWatch" element={withSuspense(withDefaultPagePadding(<StopWatch />))} />
          <Route
            path="/experiments/imageCarousels"
            element={withSuspense(withDefaultPagePadding(<ImageCarousel />))}
          />
          <Route path="/experiments/ticTacToe" element={withSuspense(withDefaultPagePadding(<JiZiQi />))} />
          <Route path="/eat" element={withSuspense(withDefaultPagePadding(<Eat />))} />

        </Routes>

      </BrowserRouter >
    </>
  );
};

export default withFontAwesome(withFooter(App));
