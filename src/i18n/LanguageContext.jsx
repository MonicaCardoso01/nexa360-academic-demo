import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LANGUAGES, translations } from "./translations.js";
import { moduleTranslations } from "./moduleTranslations.js";
import { communicationTranslations } from "./communicationTranslations.js";
import { contactTranslations } from "./contactTranslations.js";
import { taskTranslations } from "./taskTranslations.js";
import { reportTranslations } from "./reportTranslations.js";
import { settingsTranslations } from "./settingsTranslations.js";
import { accessibilityTranslations } from "./accessibilityTranslations.js";

const STORAGE_KEY = "nexa360_language";
const LanguageContext = createContext(null);

function interpolate(text, variables = {}) {
  return Object.entries(variables).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    text
  );
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = typeof localStorage === "undefined" ? null : localStorage.getItem(STORAGE_KEY);
    return translations[saved] ? saved : "pt";
  });

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : language;
  }, [language]);

  function setLanguage(nextLanguage) {
    if (!translations[nextLanguage]) return;
    if (typeof localStorage !== "undefined") localStorage.setItem(STORAGE_KEY, nextLanguage);
    if (typeof document !== "undefined") document.documentElement.lang = nextLanguage === "zh" ? "zh-CN" : nextLanguage;
    setLanguageState(nextLanguage);
  }

  const value = useMemo(() => {
    const locale = LANGUAGES.find((item) => item.code === language)?.locale || "pt-PT";
    const t = (key, variables) => {
      const catalogue = { ...translations[language], ...moduleTranslations[language], ...communicationTranslations[language], ...contactTranslations[language], ...taskTranslations[language], ...reportTranslations[language], ...settingsTranslations[language], ...accessibilityTranslations[language] };
      const fallbackCatalogue = { ...translations.pt, ...moduleTranslations.pt, ...communicationTranslations.pt, ...contactTranslations.pt, ...taskTranslations.pt, ...reportTranslations.pt, ...settingsTranslations.pt, ...accessibilityTranslations.pt };
      const text = key.split(".").reduce((current, part) => current?.[part], catalogue);
      const fallback = key.split(".").reduce((current, part) => current?.[part], fallbackCatalogue);
      return interpolate(text || fallback || key, variables);
    };
    return { language, locale, languages: LANGUAGES, setLanguage, t };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
