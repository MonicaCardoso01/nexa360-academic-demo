import React from "react";
import Logo from "./Logo.jsx";

const MENU = [
  ["command", "⌂", "Centro de Comando", false],
  ["leads", "◎", "Leads", false],
  ["partners", "🤝", "Parceiros", false],
  ["opportunities", "◇", "Oportunidades", true],
  ["contacts", "○", "Contactos", true],
  ["tasks", "✓", "Tarefas", true],
  ["reports", "▥", "Relatórios", true],
  ["settings", "⚙", "Definições", true]
];

export default function Sidebar({ user, activePage, onNavigate, onLogout }) {
  return (
    <aside className="sidebar">
      <Logo compact />

      <nav aria-label="Menu principal">
        <p>Gestão comercial</p>

        {MENU.map(([id, icon, label, future]) => (
          <button
            type="button"
            key={id}
            className={activePage === id ? "active" : ""}
            onClick={() => !future && onNavigate(id)}
            title={future ? `${label} — módulo futuro` : label}
          >
            <span>{icon}</span>
            <span>{label}</span>
            {future && <small>Em breve</small>}
          </button>
        ))}
      </nav>

      <div className="sideUser">
        <div className="avatar">{user.initials}</div>
        <div>
          <b>{user.name}</b>
          <small>{user.role}</small>
        </div>
        <button type="button" onClick={onLogout} title="Terminar sessão">↪</button>
      </div>
    </aside>
  );
}
