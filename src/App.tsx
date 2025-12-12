import { onAuthStateChanged } from "firebase/auth";
import { lazy, Suspense, useEffect } from "react";
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

import { Loading } from "./components/Loading";
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
        <Suspense fallback={withDefaultPagePadding(<Loading />)}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/about" element={withDefaultPagePadding(<About />)} />

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
            <Route path="/eat" element={withDefaultPagePadding(<Eat />)} />

          </Routes>
        </Suspense>
      </BrowserRouter >
    </>
  );
};

export default withFontAwesome(withFooter(App));
