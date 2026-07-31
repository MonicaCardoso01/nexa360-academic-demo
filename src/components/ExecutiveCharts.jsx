import React, { useMemo, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PERIODS = [3, 6, 12];
const OPPORTUNITY_STAGES = ["Qualificação", "Descoberta", "Proposta", "Negociação", "Fecho"];
const LEAD_STATUSES = ["Novo", "Contactado", "Em análise", "Qualificado", "Proposta enviada", "Em negociação", "Convertido", "Perdido"];
const PIE_COLORS = ["#287fd1", "#2c9fc2", "#30b7a2", "#42c982", "#79d99f", "#6b8fe7", "#8067c5", "#e57b79"];

function validDate(value) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function startOfPeriod(referenceDate, months) {
  return new Date(referenceDate.getFullYear(), referenceDate.getMonth() - months + 1, 1);
}

function latestDataDate(leads, opportunities) {
  const dates = [...leads, ...opportunities]
    .map((item) => validDate(item.createdAt))
    .filter(Boolean);
  const latest = dates.length ? new Date(Math.max(...dates.map((date) => date.getTime()))) : new Date();
  const today = new Date();
  return latest > today ? latest : today;
}

export default function ExecutiveCharts({ leads = [], opportunities = [] }) {
  const { t, locale } = useLanguage();
  const [period, setPeriod] = useState(6);

  const dashboard = useMemo(() => {
    const referenceDate = latestDataDate(leads, opportunities);
    const periodStart = startOfPeriod(referenceDate, period);
    const inPeriod = (item) => {
      const date = validDate(item.createdAt);
      return date && date >= periodStart && date <= referenceDate;
    };
    const periodLeads = leads.filter(inPeriod);
    const periodOpportunities = opportunities.filter(inPeriod);
    const openOpportunities = periodOpportunities.filter((item) => item.status === "Aberta");
    const pipelineValue = openOpportunities.reduce((sum, item) => sum + Number(item.value || 0), 0);
    const weightedPipeline = openOpportunities.reduce(
      (sum, item) => sum + Number(item.value || 0) * Number(item.probability || 0) / 100,
      0
    );

    const evolution = Array.from({ length: period }, (_, index) => {
      const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - period + index + 1, 1);
      const key = monthKey(date);
      return {
        key,
        month: new Intl.DateTimeFormat(locale, { month: "short" }).format(date),
        leads: periodLeads.filter((item) => monthKey(validDate(item.createdAt)) === key).length,
        clients: periodOpportunities.filter((item) => item.status === "Ganha" && monthKey(validDate(item.createdAt)) === key).length,
      };
    });

    const pipeline = OPPORTUNITY_STAGES.map((stage) => ({
      stage,
      label: t(`opportunities.stages.${stage}`),
      value: openOpportunities.filter((item) => item.stage === stage).length,
    }));

    const distribution = LEAD_STATUSES.map((status) => ({
      status,
      name: t(`leads.statuses.${status}`),
      value: periodLeads.filter((item) => item.status === status).length,
    })).filter((item) => item.value > 0);

    const currentMonth = evolution.at(-1) || { leads: 0, clients: 0 };
    const previousMonth = evolution.at(-2) || { leads: 0 };
    const leadChange = previousMonth.leads
      ? Math.round((currentMonth.leads - previousMonth.leads) / previousMonth.leads * 100)
      : currentMonth.leads > 0 ? 100 : 0;
    const leadingStage = [...pipeline].sort((a, b) => b.value - a.value)[0];
    const leadingStatus = [...distribution].sort((a, b) => b.value - a.value)[0];

    return {
      referenceDate,
      periodLeads,
      periodOpportunities,
      openOpportunities,
      pipelineValue,
      weightedPipeline,
      evolution,
      pipeline,
      distribution,
      currentMonth,
      leadChange,
      leadingStage,
      leadingStatus,
    };
  }, [leads, opportunities, period, locale, t]);

  const formatEuro = (value) => new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
  const formatDate = (date) => new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
  const changeTone = dashboard.leadChange >= 0 ? "positive" : "negative";
  const changeLabel = `${dashboard.leadChange >= 0 ? "+" : ""}${dashboard.leadChange}%`;
  const evolutionInsight = dashboard.currentMonth.leads
    ? t("executive.dynamicEvolution", { leads: dashboard.currentMonth.leads, clients: dashboard.currentMonth.clients })
    : t("executive.noEvolutionData");
  const pipelineInsight = dashboard.openOpportunities.length
    ? t("executive.dynamicPipeline", {
        count: dashboard.openOpportunities.length,
        stage: dashboard.leadingStage?.label || t("executive.notApplicable"),
      })
    : t("executive.noOpenOpportunities");
  const distributionInsight = dashboard.leadingStatus
    ? t("executive.dynamicDistribution", {
        status: dashboard.leadingStatus.name,
        count: dashboard.leadingStatus.value,
      })
    : t("executive.noLeadData");

  return (
    <section className="executive-intelligence">
      <header className="intelligence-heading">
        <div>
          <p className="aurora-eyebrow">{t("executive.intelligence")}</p>
          <h2>{t("executive.dashboard")}</h2>
          <p>{t("executive.description")}</p>
        </div>

        <div className="intelligence-controls">
          <div className="period-filter" role="group" aria-label={t("executive.period")}> 
            <span>{t("executive.period")}</span>
            {PERIODS.map((months) => (
              <button
                type="button"
                key={months}
                className={period === months ? "active" : ""}
                onClick={() => setPeriod(months)}
              >
                {t("executive.months", { count: months })}
              </button>
            ))}
          </div>
          <div className="intelligence-summary">
            <small>{t("executive.pipelineValue")}</small>
            <strong>{formatEuro(dashboard.pipelineValue)}</strong>
            <span>{t("executive.activeDeals", { count: dashboard.openOpportunities.length })}</span>
            <small>{t("executive.weightedValue", { value: formatEuro(dashboard.weightedPipeline) })}</small>
          </div>
        </div>
      </header>

      <div className="dashboard-data-note">
        <span>● {t("executive.liveData")}</span>
        <span>{t("executive.source")}</span>
        <span>{t("executive.updatedAt", { date: formatDate(new Date()) })}</span>
      </div>

      <div className="charts-grid">
        <article className="chart-card chart-card-large">
          <header className="chart-header">
            <div>
              <p className="aurora-eyebrow">{t("executive.evolution")}</p>
              <h3>{t("executive.leadsClients")}</h3>
            </div>
            <span className={`chart-badge ${changeTone}`}>{changeLabel}</span>
          </header>

          <div className="chart-insight"><span>✦</span><p>{evolutionInsight}</p></div>

          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard.evolution} margin={{ top: 12, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#287fd1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#287fd1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="clientsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dc98b" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2dc98b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8edf3" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#7c8b99", fontSize: 10 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#7c8b99", fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #dde6ee", boxShadow: "0 12px 30px rgba(20, 44, 70, 0.12)" }} />
                <Legend />
                <Area type="monotone" dataKey="leads" name="Leads" stroke="#287fd1" strokeWidth={3} fill="url(#leadsGradient)" />
                <Area type="monotone" dataKey="clients" name={t("executive.clients")} stroke="#2dc98b" strokeWidth={3} fill="url(#clientsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <footer className="chart-conclusion"><strong>{t("executive.insight")}</strong><p>{t("executive.automaticExplanation")}</p></footer>
        </article>

        <article className="chart-card">
          <header className="chart-header"><div><p className="aurora-eyebrow">{t("executive.funnel")}</p><h3>{t("executive.stages")}</h3></div></header>
          <div className="chart-area chart-area-small">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard.pipeline} layout="vertical" margin={{ top: 5, right: 20, left: 15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e8edf3" />
                <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#7c8b99", fontSize: 9 }} />
                <YAxis type="category" dataKey="label" width={82} axisLine={false} tickLine={false} tick={{ fill: "#536477", fontSize: 9 }} />
                <Tooltip cursor={{ fill: "rgba(40, 127, 209, 0.05)" }} contentStyle={{ borderRadius: "12px", border: "1px solid #dde6ee" }} />
                <Bar dataKey="value" name={t("executive.opportunities")} radius={[0, 8, 8, 0]}>
                  {dashboard.pipeline.map((entry, index) => <Cell key={entry.stage} fill={index < 2 ? "#287fd1" : "#2dbb91"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <footer className="chart-conclusion"><strong>{t("executive.recommendation")}</strong><p>{pipelineInsight}</p></footer>
        </article>

        <article className="chart-card">
          <header className="chart-header"><div><p className="aurora-eyebrow">{t("executive.leadStatus")}</p><h3>{t("executive.distribution")}</h3></div></header>
          <div className="chart-area chart-area-small">
            {dashboard.distribution.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dashboard.distribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={88} paddingAngle={3}>
                    {dashboard.distribution.map((entry, index) => <Cell key={entry.status} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #dde6ee" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "9px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="chart-empty">{t("executive.noLeadData")}</div>}
          </div>
          <footer className="chart-conclusion"><strong>{t("executive.strategic")}</strong><p>{distributionInsight}</p></footer>
        </article>
      </div>

      <footer className="dashboard-signature"><span className="signature-symbol">N</span><div><small>{t("executive.poweredBy")}</small><strong>NEXA360 Intelligence</strong></div></footer>
    </section>
  );
}
