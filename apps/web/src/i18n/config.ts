import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslations from "./locales/en/translation.json";
import zhTranslations from "./locales/zh/translation.json";

i18n
  .use(LanguageDetector) // Detects user browser language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    supportedLngs: ["en", "zh"],
    nonExplicitSupportedLngs: true,
    detection: {
      order: [
        "localStorage",
        "cookie",
        "navigator",
        "htmlTag",
        "subdomain",
        "path",
        "querystring",
        "reactRouter",
      ],
      caches: ["localStorage", "cookie"],
    },
    resources: {
      en: { translation: enTranslations },
      zh: { translation: zhTranslations },
    },
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
