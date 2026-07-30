import React from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

function getGreetingKey() {
  const hour = new Date().getHours();

  if (hour < 12) return "login.morning";
  if (hour < 19) return "login.afternoon";
  return "login.evening";
}

const priorities = [
  {
    icon: "☎",
    title: "Atlântico Export",
    descriptionKey: "noContact18",
    recommendationKey: "contactToday",
    tone: "blue",
  },
  {
    icon: "◷",
    title: "NordWerk GmbH",
    descriptionKey: "meetingTomorrow",
    recommendationKey: "prepareMeeting",
    tone: "green",
  },
  {
    icon: "€",
    title: "Lumière Conseil",
    descriptionKey: "followUpPending",
    recommendationKey: "prepareContact",
    tone: "gold",
  },
];

export default function IntelligentWelcome({ user, onNavigate }) {
  const { t } = useLanguage();
  const firstName = user?.name?.split(" ")[0] || "Mónica";

  return (
    <section className="intelligent-welcome">
      <div className="welcome-main">
        <p className="aurora-eyebrow">
          {t("command.slogan")}
        </p>

        <h2>
          {t(getGreetingKey())}, {firstName}.
        </h2>

        <p className="welcome-purpose">
          {t("command.purpose")}
        </p>

        <div className="daily-message">
          <span>✦</span>

          <div>
            <strong>
              {t("command.dailyStrong")}
            </strong>

            <p>
              {t("command.dailyText")}
            </p>
          </div>
        </div>

        <footer className="intelligence-signature">
          <span className="signature-symbol">N</span>

          <div>
            <small>Powered by</small>
            <strong>NEXA360 Intelligence</strong>
          </div>
        </footer>
      </div>

      <div className="welcome-priorities">
        <div className="priorities-heading">
          <div>
            <p className="aurora-eyebrow">{t("command.guidance")}</p>
            <h3>{t("command.prioritiesToday")}</h3>
          </div>

          <span className="priority-count">{t("command.actions")}</span>
        </div>

        <div className="aurora-priority-list">
          {priorities.map((priority) => (
            <article
              className={`aurora-priority ${priority.tone}`}
              key={priority.title}
            >
              <span className="priority-icon">{priority.icon}</span>

              <div>
                <strong>{priority.title}</strong>
                <p>{t(`command.${priority.descriptionKey}`)}</p>
                <small>{t(`command.${priority.recommendationKey}`)}</small>
              </div>

              <button
                type="button"
                onClick={() => onNavigate("partners", { partnerName: priority.title })}
                aria-label={t("command.openCompany", { company: priority.title })}
              >
                →
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
