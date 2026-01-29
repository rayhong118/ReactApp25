import { onAuthStateChanged } from "firebase/auth";
import { lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { auth } from "./firebase";
import { useSetCurrentUser } from "./utils/AuthenticationAtoms";

import { withDefaultPagePadding } from "./hooks/withDefaultPagePadding";
import { withSuspense } from "./hooks/withSuspense";

import ScrollToTop from "./utils/ScrollToTop";
import ThemeHandler from "./components/ThemeHandler";

const Navigation = lazy(() => import("./components/Navigation"));
const Home = lazy(() => import("./pages/home/Home"));
const About = lazy(() => import("./pages/about/About"));

const JiZiQi = lazy(() => import("./pages/experiments/JiZiQi"));
const Eat = lazy(() => import("./pages/eat/Eat"));
const StopWatch = lazy(() => import("./pages/experiments/StopWatch"));
const FileUpload = lazy(() => import("./pages/experiments/FileUpload"));
const FormValidation = lazy(() => import("./pages/experiments/FormValidation"));
const ImageCarousel = lazy(
  () => import("./pages/experiments/imageCarousel/ImageCarousel"),
);
const MoveLists = lazy(() => import("./pages/experiments/MoveLists"));
const AuthPage = lazy(() => import("./pages/auth/Auth"));
const Settings = lazy(() => import("./pages/auth/Settings"));
const NotFound = lazy(() => import("./pages/notFound/NotFound"));
const MessageBarsContainer = lazy(() => import("./hooks/MessageBarsContainer"));
const Drawings = lazy(() => import("./pages/artworks/Drawings"));
const SingleDrawing = lazy(() => import("./pages/artworks/SingleDrawing"));
const Upload = lazy(() => import("./pages/artworks/Upload"));
const Footer = lazy(() => import("./components/Footer"));
const GiftPage = lazy(() => import("./pages/gift/GiftPage"));
const FriendsPage = lazy(() => import("./pages/friends/Friends"));

const WithAuthRequired = lazy(() => import("./components/WithAuthRequired"));

const App: React.FC = () => {
  const setCurrentUser = useSetCurrentUser();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setCurrentUser(currentUser);
    });
    return () => unsubscribe();
  }, [setCurrentUser]);

  return (
    <BrowserRouter>
      <ThemeHandler />
      <ScrollToTop />
      <Navigation />
      {withSuspense(<MessageBarsContainer />)}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={withSuspense(<AuthPage />)} />
        <Route
          path="/settings"
          element={withSuspense(withDefaultPagePadding(<Settings />))}
        />
        <Route path="/about" element={withDefaultPagePadding(<About />)} />

        <Route
          path="/experiments/fileUpload"
          element={withSuspense(withDefaultPagePadding(<FileUpload />))}
        />
        <Route
          path="/experiments/formValidation"
          element={withSuspense(withDefaultPagePadding(<FormValidation />))}
        />
        <Route
          path="/experiments/moveLists"
          element={withSuspense(
            withDefaultPagePadding(<WithAuthRequired component={MoveLists} />),
          )}
        />
        <Route
          path="/experiments/stopWatch"
          element={withSuspense(withDefaultPagePadding(<StopWatch />))}
        />
        <Route
          path="/experiments/imageCarousels"
          element={withSuspense(withDefaultPagePadding(<ImageCarousel />))}
        />
        <Route
          path="/experiments/ticTacToe"
          element={withSuspense(withDefaultPagePadding(<JiZiQi />))}
        />
        <Route
          path="/eat"
          element={withSuspense(withDefaultPagePadding(<Eat />))}
        />
        <Route
          path="/drawings"
          element={withSuspense(withDefaultPagePadding(<Drawings />))}
        />
        <Route
          path="/drawings/upload"
          element={withSuspense(
            withDefaultPagePadding(<WithAuthRequired component={Upload} />),
          )}
        />
        <Route
          path="/drawings/:id"
          element={withSuspense(
            withDefaultPagePadding(
              <WithAuthRequired component={SingleDrawing} />,
            ),
          )}
        />
        <Route path="/gift" element={<Navigate to="/gifts" replace />} />
        <Route
          path="/gifts"
          element={withSuspense(
            withDefaultPagePadding(<WithAuthRequired component={GiftPage} />),
          )}
        />
        <Route
          path="/friends"
          element={withSuspense(
            withDefaultPagePadding(
              <WithAuthRequired component={FriendsPage} />,
            ),
          )}
        />
        <Route
          path="*"
          element={withSuspense(withDefaultPagePadding(<NotFound />))}
        />
      </Routes>
      {withSuspense(<Footer />)}
    </BrowserRouter>
  );
};

export default App;
