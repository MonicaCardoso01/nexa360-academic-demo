import ExecutiveCharts from "../components/ExecutiveCharts.jsx";
import IntelligentWelcome from "../components/IntelligentWelcome.jsx";
import React from "react";
import AppLayout from "../layouts/AppLayout.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const priorities = [
  ["red", "Atlântico Export", "noContact18", "high", "resumeContact"],
  ["green", "Lumière Conseil", "meetingToday", "today", "prepareMeeting"],
  ["blue", "NordWerk GmbH", "proposalTomorrow", "deadline", "sendProposal"]
];

export default function CommandCenterPage({ user, leads, opportunities, onLogout, onNavigate }) {
  const { t, locale } = useLanguage();
  const euro = (value) => new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
  const admin = user.profileKey === "admin";
  const visibleOpportunities = admin
    ? opportunities
    : opportunities.filter((item) => item.owner === user.name);
  const open = visibleOpportunities.filter((item) => item.status === "Aberta");
  const pipelineValue = open.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const highPriority = leads.filter((item) => item.priority === "Alta" && item.status !== "Convertido").length;
  const metrics = [
    [String(leads.filter((item) => item.status !== "Convertido" && item.status !== "Perdido").length), t("command.activeLeads"), t("command.highPriority", { count: highPriority })],
    [String(open.length), t("command.openOpportunities"), t("command.inPipeline", { value: euro(pipelineValue) })],
    [String(visibleOpportunities.filter((item) => item.status === "Ganha").length), t("command.wonDeals"), euro(visibleOpportunities.filter((item) => item.status === "Ganha").reduce((sum, item) => sum + Number(item.value || 0), 0))],
    [`${Math.round(open.reduce((sum, item) => sum + Number(item.probability || 0), 0) / (open.length || 1))}%`, t("command.averageProbability"), t("command.openOpportunityDetail")]
  ];
  const stageCounts = [
    ["Qualificação", "qualification"], ["Descoberta", "discovery"], ["Proposta", "proposal"],
    ["Negociação", "negotiation"], ["Fecho", "closing"]
  ].map(([stage, translationKey]) => [t(`command.${translationKey}`), open.filter((item) => item.stage === stage).length]);
  const maxStageCount = Math.max(...stageCounts.map(([, count]) => count), 1);

  return (
    <AppLayout
      user={user}
      activePage="command"
      onNavigate={onNavigate}
      onLogout={onLogout}
      title={t("command.title")}
    >
      <div className="content">
        <IntelligentWelcome user={user} onNavigate={onNavigate} />
          
          
        

        <section className="metrics">
          {metrics.map(([value, label, detail]) => (
            <article key={label}>
              <b>{value}</b>
              <h3>{label}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </section>

        <section className="columns">
          
          <div className="large">
            <article className="panel">
              <div className="panelHead">
                <div>
                  <p className="eyebrow">{t("command.priorities")}</p>
                  <h2>{t("command.myDay")}</h2>
                </div>
                <button type="button">{t("common.viewAll")}</button>
              </div>

              {priorities.map(([tone, company, noteKey, labelKey, actionKey]) => (
                <div className="task" key={company}>
                  <i className={tone} />
                  <div><b>{company}</b><small>{t(`command.${noteKey}`)}</small></div>
                  <span className={tone}>{t(`command.${labelKey}`)}</span>
                  <button
                    type="button"
                    onClick={() => onNavigate("partners", { partnerName: company })}
                    aria-label={t("command.openCompany", { company })}
                  >
                    {t(`command.${actionKey}`)} →
                  </button>
                </div>
              ))}
            </article>

            <article className="panel">
              <div className="panelHead">
                <div>
                  <p className="eyebrow">{t("command.salesFunnel")}</p>
                  <h2>{t("command.salesPipeline")}</h2>
                </div>
                <b className="money">{euro(pipelineValue)}</b>
              </div>

              {stageCounts.map(([label, value]) => (
                <div className="pipe" key={label}>
                  <div><span>{label}</span><b>{value}</b></div>
                  <div className="bar"><span style={{ width: `${value ? Math.max(12, value / maxStageCount * 100) : 0}%` }} /></div>
                </div>
              ))}
              <button className="dashboard-pipeline-button" type="button" onClick={() => onNavigate("opportunities")}>
                {t("command.openOpportunityManagement")}
              </button>
            </article>
          </div>

          <div className="small">
            <article className="insight">
              <div className="insightMark">N</div>
              <p className="eyebrow light">Insight NEXA360</p>
              <h2>{t("command.insightTitle")}</h2>
              <p>{t("command.insightText")}</p>
              <button type="button" onClick={() => onNavigate("partners")}>
                {t("command.viewPriorityPartners")}
              </button>
            </article>

            <article className="panel goal">
              <div className="panelHead">
                <div>
                  <p className="eyebrow">{t("command.monthlyGoal")}</p>
                  <h2>{t("command.commercialGoal")}</h2>
                </div>
                <b>72%</b>
              </div>
              <div className="circle">
                <div><b>72%</b><small>{t("common.completed")}</small></div>
              </div>
              <p>{t("command.remainingGoal")}</p>
            </article>

            {admin && (
              <article className="panel team">
                <p className="eyebrow">{t("command.adminOnly")}</p>
                <h2>{t("command.teamDevelopment")}</h2>
                <div className="person">
                  <div className="avatar mini">JM</div>
                  <div><b>João Martins</b><small>{t("command.positiveEvolution")}</small></div>
                  <strong>↗</strong>
                </div>
                <div className="person">
                  <div className="avatar mini">AS</div>
                  <div><b>Ana Silva</b><small>{t("command.readyChallenges")}</small></div>
                  <strong>↗</strong>
                </div>
              </article>
            )}
          </div>
        </section>
        <ExecutiveCharts />
      </div>
    </AppLayout>
  );
}
