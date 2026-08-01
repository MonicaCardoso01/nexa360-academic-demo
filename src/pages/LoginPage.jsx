import React, { useState } from "react";
import Logo from "../components/Logo.jsx";
import LanguageSelector from "../components/LanguageSelector.jsx";
import { USERS } from "../data/appData.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const PROFILE_KEY = "nexa360_profile_v1";
function savedAdmin() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
    return saved?.name && saved?.email ? saved : null;
  } catch {
    return null;
  }
}

function greetingKey() {
  const hour = new Date().getHours();
  if (hour < 12) return "login.morning";
  if (hour < 19) return "login.afternoon";
  return "login.evening";
}

export default function LoginPage({ onLogin, sessionExpired = false }) {
  const { t } = useLanguage();
  const storedAdmin = savedAdmin();
  const [profileKey, setProfileKey] = useState("admin");
  const [name, setName] = useState(storedAdmin?.name || USERS.admin.name);
  const [email, setEmail] = useState(storedAdmin?.email || USERS.admin.email);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const profile = USERS[profileKey];
  const role = t(`common.${profileKey}`);

  function choose(nextProfile) {
    setProfileKey(nextProfile);
    const saved = nextProfile === "admin" ? savedAdmin() : null;
    setName(saved?.name || USERS[nextProfile].name);
    setEmail(saved?.email || USERS[nextProfile].email);
    setPassword("");
    setMessage("");
  }

  function submit(event) {
    event.preventDefault();
    if (!name.trim()) return setMessage(t("login.nameError"));
    if (!email.includes("@")) return setMessage(t("login.emailError"));
    if (password.length < 8) return setMessage(t("login.passwordError"));
    onLogin({ ...profile, name: name.trim(), email: email.trim() });
  }

  return (
    <main className="login">
      <section className="identity">
        <Logo />
        <div className="identityText">
          <p className="eyebrow light">{t("login.pillars")}</p>
          <h1>{t("login.slogan")}</h1>
          <p>{t("login.purpose")}</p>
        </div>
        <div className="values">
          <article><span>01</span><div><b>{t("login.elegance")}</b><p>{t("login.eleganceText")}</p></div></article>
          <article><span>02</span><div><b>{t("login.intelligence")}</b><p>{t("login.intelligenceText")}</p></div></article>
          <article><span>03</span><div><b>{t("login.humanity")}</b><p>{t("login.humanityText")}</p></div></article>
        </div>
        <footer><span>NEXA360 CRM Enterprise</span><span>{t("login.foundation")}</span></footer>
      </section>

      <section className="access">
        <div className="card">
          <div className="login-language-row"><LanguageSelector /></div>
          <header>
            <p className="eyebrow">{t("login.access")}</p>
            <h2>{t("login.welcomeTitle")}</h2>
            <p>{t("login.welcomeText")}</p>
          </header>

          <div className="profiles">
            <button type="button" className={profileKey === "admin" ? "selected" : ""} onClick={() => choose("admin")}>
              ♛ <span><b>{t("common.admin")}</b><small>{t("login.adminDetail")}</small></span>
            </button>
            <button type="button" className={profileKey === "collaborator" ? "selected" : ""} onClick={() => choose("collaborator")}>
              ♟ <span><b>{t("common.collaborator")}</b><small>{t("login.collaboratorDetail")}</small></span>
            </button>
          </div>

          <div className="welcome">
            <span>{profileKey === "admin" ? "♛" : "♟"}</span>
            <div>
              <b>{t(greetingKey())}, {name || profile.name}.</b>
              <small>{t("login.enteringAs", { role })}</small>
            </div>
          </div>

          <form onSubmit={submit}>
            <label><span>{t("login.name")}</span><input maxLength="80" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></label>
            <label><span>{t("login.email")}</span><input type="email" maxLength="160" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label><span>{t("login.password")}</span><input type="password" minLength="8" maxLength="128" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t("login.passwordPlaceholder")} /></label>
            <div className="options">
              <label><input type="checkbox" defaultChecked /> {t("login.remember")}</label>
              <button type="button">{t("login.forgot")}</button>
            </div>
            <button className="enter">{t("login.enterAs", { role })}</button>
            <p className="feedback">{message || (sessionExpired ? t("security.sessionExpired") : t("login.demo"))}</p>
          </form>
          <aside className="security-login-notice" role="note">
            <strong>🛡 {t("security.demoTitle")}</strong>
            <p>{t("security.demoText")}</p>
          </aside>
          <div className="signature"><span /><em>{t("login.signature")}</em><span /></div>
        </div>
      </section>
    </main>
  );
}
