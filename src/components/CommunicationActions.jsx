import React, { useMemo, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const HISTORY_KEY = "nexa360_communication_history_v1";

function readHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function validEmail(value) {
  return /^\S+@\S+\.\S+$/.test(String(value || "").trim());
}

function telephoneUri(value) {
  const cleaned = String(value || "").trim().replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : "";
}

function whatsappNumber(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length >= 8 ? digits : "";
}

export default function CommunicationActions({ entityType, entityId, name, company, email, phone }) {
  const { t, locale } = useLanguage();
  const [history, setHistory] = useState(readHistory);
  const [feedback, setFeedback] = useState("");
  const entityKey = `${entityType}:${entityId}`;
  const contactHistory = useMemo(
    () => history.filter((item) => item.entityKey === entityKey).slice(0, 5),
    [history, entityKey]
  );
  const canEmail = validEmail(email);
  const phoneUri = telephoneUri(phone);
  const whatsapp = whatsappNumber(phone);

  function register(action) {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      entityKey,
      action,
      initiatedAt: new Date().toISOString(),
    };
    const next = [entry, ...history].slice(0, 250);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    setHistory(next);
    const feedbackKey = action === "email" ? "openedEmail" : action === "whatsapp" ? "openedWhatsapp" : "openedCall";
    setFeedback(`${t(`communications.${feedbackKey}`)} — ${t("communications.registered")}`);
  }

  function openEmail() {
    if (!canEmail) return;
    const subject = t("communications.emailSubject", { company: company || name });
    const body = t("communications.emailBody", { name: name || company, company: company || name });
    register("email");
    const url = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(String(email).trim())}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function openWhatsapp() {
    if (!whatsapp) return;
    const message = t("communications.whatsappBody", { name: name || company, company: company || name });
    register("whatsapp");
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  function openCall() {
    if (!phoneUri) return;
    if (!window.confirm(t("communications.confirmCall", { name: name || company, phone }))) return;
    register("call");
    window.location.href = phoneUri;
  }

  const formatDate = (value) => new Intl.DateTimeFormat(locale, { dateStyle: "short", timeStyle: "short" }).format(new Date(value));

  return (
    <section className="communication-card">
      <header><div><p className="eyebrow">{t("communications.title")}</p><h3>{name || company}</h3></div></header>
      <div className="communication-buttons">
        <button type="button" className="communication-email" disabled={!canEmail} onClick={openEmail}>✉ <span>{canEmail ? t("communications.outlook") : t("communications.noEmail")}</span></button>
        <button type="button" className="communication-whatsapp" disabled={!whatsapp} onClick={openWhatsapp}>◉ <span>{whatsapp ? t("communications.whatsapp") : t("communications.noWhatsapp")}</span></button>
        <button type="button" className="communication-call" disabled={!phoneUri} onClick={openCall}>☎ <span>{phoneUri ? t("communications.call") : t("communications.noPhone")}</span></button>
      </div>
      {feedback && <p className="communication-feedback">✓ {feedback}</p>}
      <div className="communication-history">
        <strong>{t("communications.history")}</strong>
        {contactHistory.length ? contactHistory.map((item) => (
          <div key={item.id}><span>{item.action === "email" ? "✉" : item.action === "whatsapp" ? "◉" : "☎"} {t(item.action === "email" ? "communications.emailAction" : item.action === "whatsapp" ? "communications.whatsappAction" : "communications.callAction")}</span><time>{formatDate(item.initiatedAt)}</time></div>
        )) : <p>{t("communications.noHistory")}</p>}
      </div>
      <small>{t("communications.disclaimer")}</small>
    </section>
  );
}
