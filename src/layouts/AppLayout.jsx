import React from "react";
import Sidebar from "../components/Sidebar.jsx";

export default function AppLayout({
  user,
  activePage,
  onNavigate,
  onLogout,
  title,
  children
}) {
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
            <small>NEXA360 / {title}</small>
            <h1>{title}</h1>
          </div>

          <div className="topUser">
            <div className="avatar">{user.initials}</div>
            <div>
              <b>{user.name}</b>
              <small>{user.role}</small>
            </div>
          </div>
        </header>

        {children}
      </section>
    </main>
  );
}
