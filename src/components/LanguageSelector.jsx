import React from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function LanguageSelector({ compact = false }) {
  const { language, languages, setLanguage } = useLanguage();

  return (
    <div className={compact ? "language-selector compact" : "language-selector"} aria-label="Language selector">
      {languages.map((item) => (
        <button
          type="button"
          key={item.code}
          className={language === item.code ? "active" : ""}
          onClick={() => setLanguage(item.code)}
          title={item.name}
          lang={item.code === "zh" ? "zh-CN" : item.code}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
