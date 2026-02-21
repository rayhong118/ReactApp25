import { useEffect } from "react";
import { useThemeValue } from "../utils/UtilAtoms";

const ThemeHandler = () => {
  const theme = useThemeValue();

  useEffect(() => {
    // Apply the theme class to the document root
    document.documentElement.classList.toggle("dark", theme === "dark");
    // Also set the data-theme attribute for any other styling needs
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return null;
};

export default ThemeHandler;
