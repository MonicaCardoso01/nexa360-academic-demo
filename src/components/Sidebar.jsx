import React from "react";
import Logo from "./Logo.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import UserAvatar from "./UserAvatar.jsx";

const MENU = [
  ["command", "⌂", false],
  ["leads", "◎", false],
  ["partners", "🤝", false],
  ["opportunities", "◇", false],
  ["contacts", "◉", false],
  ["tasks", "✓", false],
  ["reports", "▥", false],
  ["settings", "⚙", false]
];

export default function Sidebar({ user, activePage, onNavigate, onLogout }) {
  const { t } = useLanguage();
  const role = t(`common.${user.profileKey}`);

  return (
    <aside className="sidebar">
      <Logo compact />

      <nav aria-label={t("accessibility.mainNavigation")}>
        <p>{t("menu.section")}</p>

        {MENU.map(([id, icon, future]) => {
          const label = t(`menu.${id}`);
          return (
          <button
            type="button"
            key={id}
            className={activePage === id ? "active" : ""}
            aria-current={activePage === id ? "page" : undefined}
            onClick={() => !future && onNavigate(id)}
            title={future ? `${label} — ${t("common.future")}` : label}
          >
            <span>{icon}</span>
            <span>{label}</span>
            {future && <small>{t("common.future")}</small>}
          </button>
          );
        })}
      </nav>

      <div className="sideUser">
        <UserAvatar name={user.name} initials={user.initials} />
        <div>
          <b>{user.name}</b>
          <small>{role}</small>
        </div>
        <button type="button" onClick={onLogout} title={t("common.logout")} aria-label={t("accessibility.logout")}>↪</button>
      </div>
    </aside>
  );
}
