import React from "react";
import Logo from "./Logo.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const MENU = [
  ["command", "⌂", false],
  ["leads", "◎", false],
  ["partners", "🤝", false],
  ["opportunities", "◇", false],
  ["contacts", "◉", false],
  ["tasks", "✓", false],
  ["reports", "▥", true],
  ["settings", "⚙", true]
];

export default function Sidebar({ user, activePage, onNavigate, onLogout }) {
  const { t } = useLanguage();
  const role = t(`common.${user.profileKey}`);

  return (
    <aside className="sidebar">
      <Logo compact />

      <nav aria-label="Menu principal">
        <p>{t("menu.section")}</p>

        {MENU.map(([id, icon, future]) => {
          const label = t(`menu.${id}`);
          return (
          <button
            type="button"
            key={id}
            className={activePage === id ? "active" : ""}
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
        <div className="avatar">{user.initials}</div>
        <div>
          <b>{user.name}</b>
          <small>{role}</small>
        </div>
        <button type="button" onClick={onLogout} title={t("common.logout")}>↪</button>
      </div>
    </aside>
  );
}
