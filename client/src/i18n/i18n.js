import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import EN from "./locales/en.json";
import VI from "./locales/vi.json";

const resources = {
  en: {
    translation: EN,
  },
  vi: {
    translation: VI,
  },
};
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "vi",
    lng: "vi",

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
