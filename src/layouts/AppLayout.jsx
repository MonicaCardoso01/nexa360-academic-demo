import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import LanguageSelector from "../components/LanguageSelector.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function AppLayout({
  user,
  activePage,
  onNavigate,
  onLogout,
  title,
  children
}) {
  const { t } = useLanguage();
  const translatedTitle = activePage ? t(`menu.${activePage}`) : title;
  const role = t(`common.${user.profileKey}`);

  return (
    <main className="shell">
      <Sidebar
        user={user}
        activePage={activePage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <section className="main">
        <header className="top">
          <div>
            <small>NEXA360 / {translatedTitle}</small>
            <h1>{translatedTitle}</h1>
          </div>

          <div className="top-actions">
            <LanguageSelector compact />
            <div className="topUser">
            <div className="avatar">{user.initials}</div>
            <div>
              <b>{user.name}</b>
              <small>{role}</small>
            </div>
            </div>
          </div>
        </header>

        <div className="security-demo-banner" role="status">
          <span>🛡</span>
          <p><strong>{t("security.protectedDemo")}</strong> {t("security.noRealData")}</p>
        </div>

        {children}
      </section>
    </main>
  );
}
