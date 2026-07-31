import ExecutiveCharts from "../components/ExecutiveCharts.jsx";
import IntelligentWelcome from "../components/IntelligentWelcome.jsx";
import React, { useState } from "react";
import AppLayout from "../layouts/AppLayout.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const priorities = [
  ["red", "Atlântico Export", "noContact18", "high", "resumeContact"],
  ["green", "Lumière Conseil", "meetingToday", "today", "prepareMeeting"],
  ["blue", "NordWerk GmbH", "proposalTomorrow", "deadline", "sendProposal"]
];

const MONTHLY_TARGET_KEY = "nexa360_monthly_sales_target_v1";

function loadMonthlyTarget() {
  try {
    const saved = Number(localStorage.getItem(MONTHLY_TARGET_KEY));
    return saved > 0 ? saved : 100000;
  } catch {
    return 100000;
  }
}

export default function CommandCenterPage({ user, leads, opportunities, onLogout, onNavigate }) {
  const { t, locale } = useLanguage();
  const [monthlyTarget, setMonthlyTarget] = useState(loadMonthlyTarget);
  const [targetDraft, setTargetDraft] = useState(monthlyTarget);
  const [editingTarget, setEditingTarget] = useState(false);
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
  const now = new Date();
  const monthlyWonValue = visibleOpportunities
    .filter((item) => {
      if (item.status !== "Ganha") return false;
      const dateValue = item.expectedClose || item.createdAt;
      if (!dateValue) return false;
      const date = new Date(`${dateValue}T12:00:00`);
      return !Number.isNaN(date.getTime())
        && date.getFullYear() === now.getFullYear()
        && date.getMonth() === now.getMonth();
    })
    .reduce((sum, item) => sum + Number(item.value || 0), 0);
  const goalProgress = Math.min(100, Math.round(monthlyWonValue / monthlyTarget * 100));
  const remainingGoal = Math.max(0, monthlyTarget - monthlyWonValue);

  function saveMonthlyTarget() {
    const nextTarget = Math.max(1, Number(targetDraft) || 0);
    setMonthlyTarget(nextTarget);
    localStorage.setItem(MONTHLY_TARGET_KEY, String(nextTarget));
    setEditingTarget(false);
  }
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
                <b>{goalProgress}%</b>
              </div>
              <div className="goal-values">
                <span>{t("command.wonThisMonth")}</span>
                <strong>{euro(monthlyWonValue)} / {euro(monthlyTarget)}</strong>
              </div>
              <div className="circle" style={{ background: `conic-gradient(#1ca26d 0 ${goalProgress}%, #e8edf2 ${goalProgress}% 100%)` }}>
                <div><b>{goalProgress}%</b><small>{t("common.completed")}</small></div>
              </div>
              <p>{remainingGoal > 0
                ? t("command.remainingGoal", { value: euro(remainingGoal) })
                : t("command.goalReached")}</p>
              {admin && !editingTarget && (
                <button className="goal-edit-button" type="button" onClick={() => { setTargetDraft(monthlyTarget); setEditingTarget(true); }}>
                  {t("command.editMonthlyTarget")}
                </button>
              )}
              {admin && editingTarget && (
                <div className="goal-editor">
                  <label>
                    <span>{t("command.monthlyTargetValue")}</span>
                    <input type="number" min="1" step="1000" value={targetDraft} onChange={(event) => setTargetDraft(event.target.value)} />
                  </label>
                  <div>
                    <button type="button" onClick={() => setEditingTarget(false)}>{t("command.cancelTarget")}</button>
                    <button type="button" onClick={saveMonthlyTarget}>{t("command.saveTarget")}</button>
                  </div>
                </div>
              )}
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
        <ExecutiveCharts leads={leads} opportunities={visibleOpportunities} />
      </div>
    </AppLayout>
  );
}
