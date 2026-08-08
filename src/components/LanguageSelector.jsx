import React from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function LanguageSelector({ compact = false }) {
  const { language, languages, setLanguage, t } = useLanguage();

  return (
    <div className={compact ? "language-selector compact" : "language-selector"} role="group" aria-label={t("accessibility.languageSelector")}>
      {languages.map((item) => (
        <button
          type="button"
          key={item.code}
          className={language === item.code ? "active" : ""}
          aria-pressed={language === item.code}
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
