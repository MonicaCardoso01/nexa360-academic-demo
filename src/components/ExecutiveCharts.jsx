import React from "react";
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

const commercialEvolution = [
  { month: "Fev", leads: 18, clients: 4 },
  { month: "Mar", leads: 24, clients: 6 },
  { month: "Abr", leads: 29, clients: 8 },
  { month: "Mai", leads: 36, clients: 11 },
  { month: "Jun", leads: 43, clients: 14 },
  { month: "Jul", leads: 51, clients: 18 },
];

const pipelineData = [
  { stage: "Novos", value: 24 },
  { stage: "Qualificados", value: 15 },
  { stage: "Proposta", value: 9 },
  { stage: "Negociação", value: 6 },
  { stage: "Fechados", value: 4 },
];

const leadDistribution = [
  { name: "Novos", value: 32 },
  { name: "Contactados", value: 25 },
  { name: "Qualificados", value: 20 },
  { name: "Negociação", value: 15 },
  { name: "Convertidos", value: 8 },
];

const pieColors = [
  "#287fd1",
  "#2c9fc2",
  "#30b7a2",
  "#42c982",
  "#79d99f",
];

function euro(value) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ExecutiveCharts() {
  const { t, locale } = useLanguage();
  const formatEuro = (value) => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
  const translatedEvolution = commercialEvolution.map((item, index) => ({
    ...item,
    month: new Intl.DateTimeFormat(locale, { month: "short" }).format(new Date(2026, index + 1, 1))
  }));
  const translatedPipeline = pipelineData.map((item, index) => ({
    ...item,
    stage: [t("leads.new"), t("leads.qualified"), t("command.proposal"), t("command.negotiation"), t("command.closing")][index]
  }));
  const translatedDistribution = leadDistribution.map((item, index) => ({
    ...item,
    name: [t("leads.new"), t("leads.statuses.Contactado"), t("leads.qualified"), t("command.negotiation"), t("leads.converted")][index]
  }));
  return (
    <section className="executive-intelligence">
      <header className="intelligence-heading">
        <div>
          <p className="aurora-eyebrow">{t("executive.intelligence")}</p>
          <h2>{t("executive.dashboard")}</h2>
          <p>{t("executive.description")}</p>
        </div>

        <div className="intelligence-summary">
          <small>{t("executive.pipelineValue")}</small>
          <strong>{formatEuro(247500)}</strong>
          <span>{t("executive.monthlyRise")}</span>
        </div>
      </header>

      <div className="charts-grid">
        <article className="chart-card chart-card-large">
          <header className="chart-header">
            <div>
              <p className="aurora-eyebrow">{t("executive.evolution")}</p>
              <h3>{t("executive.leadsClients")}</h3>
            </div>

            <span className="chart-badge positive">+18%</span>
          </header>

          <div className="chart-insight">
            <span>✦</span>
            <p>
              {t("executive.positive")}
            </p>
          </div>

          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={translatedEvolution}
                margin={{ top: 12, right: 15, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#287fd1"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="#287fd1"
                      stopOpacity={0}
                    />
                  </linearGradient>

                  <linearGradient
                    id="clientsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#2dc98b"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="#2dc98b"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e8edf3" />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#7c8b99", fontSize: 10 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#7c8b99", fontSize: 10 }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #dde6ee",
                    boxShadow: "0 12px 30px rgba(20, 44, 70, 0.12)",
                  }}
                />

                <Legend />

                <Area
                  type="monotone"
                  dataKey="leads"
                  name="Leads"
                  stroke="#287fd1"
                  strokeWidth={3}
                  fill="url(#leadsGradient)"
                />

                <Area
                  type="monotone"
                  dataKey="clients"
                  name={t("executive.clients")}
                  stroke="#2dc98b"
                  strokeWidth={3}
                  fill="url(#clientsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <footer className="chart-conclusion">
            <strong>{t("executive.insight")}</strong>
            <p>{t("executive.conversion")}</p>
          </footer>
        </article>

        <article className="chart-card">
          <header className="chart-header">
            <div>
              <p className="aurora-eyebrow">{t("executive.funnel")}</p>
              <h3>{t("executive.stages")}</h3>
            </div>
          </header>

          <div className="chart-area chart-area-small">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={translatedPipeline}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#e8edf3"
                />

                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#7c8b99", fontSize: 9 }}
                />

                <YAxis
                  type="category"
                  dataKey="stage"
                  width={72}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#536477", fontSize: 9 }}
                />

                <Tooltip
                  cursor={{ fill: "rgba(40, 127, 209, 0.05)" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #dde6ee",
                  }}
                />

                <Bar
                  dataKey="value"
                  name={t("executive.opportunities")}
                  radius={[0, 8, 8, 0]}
                  fill="url(#pipelineGradient)"
                >
                  {translatedPipeline.map((entry, index) => (
                    <Cell
                      key={entry.stage}
                      fill={index < 2 ? "#287fd1" : "#2dbb91"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <footer className="chart-conclusion">
            <strong>{t("executive.recommendation")}</strong>
            <p>{t("executive.negotiation")}</p>
          </footer>
        </article>

        <article className="chart-card">
          <header className="chart-header">
            <div>
              <p className="aurora-eyebrow">{t("executive.leadStatus")}</p>
              <h3>{t("executive.distribution")}</h3>
            </div>
          </header>

          <div className="chart-area chart-area-small">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={translatedDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={88}
                  paddingAngle={3}
                >
                  {translatedDistribution.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #dde6ee",
                  }}
                />

                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: "9px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <footer className="chart-conclusion">
            <strong>{t("executive.strategic")}</strong>
            <p>{t("executive.qualification")}</p>
          </footer>
        </article>
      </div>

      <footer className="dashboard-signature">
        <span className="signature-symbol">N</span>

        <div>
          <small>{t("executive.poweredBy")}</small>
          <strong>NEXA360 Intelligence</strong>
        </div>
      </footer>
    </section>
  );
}
