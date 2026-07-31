import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const DEFAULT_METRICS = {
  communication: 95,
  deadlines: 98,
  profitability: 91,
  growth: 89,
  satisfaction: 94,
  risk: 87,
};

const METRIC_DEFINITIONS = [
  { key: "communication", weight: 20 },
  { key: "deadlines", weight: 20 },
  { key: "profitability", weight: 20 },
  { key: "growth", weight: 15 },
  { key: "satisfaction", weight: 15 },
  { key: "risk", labelKey: "trust", weight: 10 },
];

function calculateRelationshipScore(metrics) {
  const weights = {
    communication: 0.2,
    deadlines: 0.2,
    profitability: 0.2,
    growth: 0.15,
    satisfaction: 0.15,
    risk: 0.1,
  };

  const score = Object.entries(weights).reduce(
    (total, [key, weight]) => total + Number(metrics[key] || 0) * weight,
    0
  );

  return Math.round(score);
}

function getScoreAnalysis(score) {
  if (score >= 85) {
    return {
      level: "Excelente",
      tone: "excellent",
      message:
        "Esta parceria apresenta um elevado potencial de crescimento. Recomenda-se reforçar o relacionamento através de reuniões estratégicas trimestrais.",
      actions: [
        "Agendar reunião estratégica trimestral",
        "Apresentar serviços complementares",
        "Criar plano de crescimento conjunto",
      ],
    };
  }

  if (score >= 70) {
    return {
      level: "Saudável",
      tone: "healthy",
      message:
        "A parceria mantém-se saudável. Existem oportunidades para aumentar o volume de negócio através de novas propostas comerciais.",
      actions: [
        "Solicitar feedback do parceiro",
        "Identificar novas necessidades",
        "Reforçar o acompanhamento comercial",
      ],
    };
  }

  if (score >= 50) {
    return {
      level: "Atenção",
      tone: "attention",
      message:
        "Observa-se uma redução da interação comercial. Recomenda-se implementar um plano de reaproximação.",
      actions: [
        "Contactar o parceiro esta semana",
        "Reavaliar expectativas e necessidades",
        "Definir um plano de recuperação",
      ],
    };
  }

  return {
    level: "Risco elevado",
    tone: "risk",
    message:
      "Existe um risco elevado de perda desta parceria. O contacto deve ser priorizado nas próximas 48 horas.",
    actions: [
      "Realizar contacto prioritário",
      "Identificar a origem da insatisfação",
      "Criar um plano de retenção",
    ],
  };
}

export default function RelationshipScore({
  partnerName = "NordWerk GmbH",
  metrics = DEFAULT_METRICS,
  evaluation,
  onSaveEvaluation,
  onViewPlan,
}) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [draftMetrics, setDraftMetrics] = useState(metrics);
  const [draftNotes, setDraftNotes] = useState(evaluation?.notes || "");

  useEffect(() => {
    setIsEditing(false);
    setDraftMetrics(metrics);
    setDraftNotes(evaluation?.notes || "");
  }, [partnerName]);

  function beginEditing() {
    setDraftMetrics(metrics);
    setDraftNotes(evaluation?.notes || "");
    setIsEditing(true);
  }

  function updateMetric(key, value) {
    const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
    setDraftMetrics((current) => ({ ...current, [key]: safeValue }));
  }

  function saveEvaluation() {
    onSaveEvaluation?.({
      metrics: draftMetrics,
      notes: draftNotes.trim(),
      evaluator: evaluation?.evaluator || t("relationship.defaultEvaluator"),
      evaluatedAt: new Date().toISOString().slice(0, 10),
    });
    setIsEditing(false);
  }
  const score = useMemo(
    () => calculateRelationshipScore(metrics),
    [metrics]
  );

  const analysis = getScoreAnalysis(score);
  const translatedAnalysis = {
    level: t(`relationship.scoreStates.${analysis.tone}.level`),
    message: t(`relationship.scoreStates.${analysis.tone}.message`),
    actions: [0, 1, 2].map((index) => t(`relationship.scoreStates.${analysis.tone}.actions.${index}`))
  };

  const radarData = [
    { metric: t("relationship.communication"), value: metrics.communication },
    { metric: t("relationship.deadlines"), value: metrics.deadlines },
    { metric: t("relationship.profitability"), value: metrics.profitability },
    { metric: t("relationship.growth"), value: metrics.growth },
    { metric: t("relationship.satisfaction"), value: metrics.satisfaction },
    { metric: t("relationship.trust"), value: metrics.risk },
  ];

  return (
    <section className="relationship-intelligence">
      <header className="relationship-header">
        <div>
          <p className="aurora-eyebrow">{t("relationship.intelligence")}</p>
          <h2>{partnerName}</h2>
          <p>{t("relationship.integratedAssessment")}</p>
        </div>

        <div className={`relationship-score ${analysis.tone}`}>
          <strong>{score}</strong>
          <span>/100</span>
          <small>{translatedAnalysis.level}</small>
        </div>
      </header>

      <section className="relationship-methodology">
        <div>
          <p className="aurora-eyebrow">{t("relationship.methodology")}</p>
          <h3>{t("relationship.thermometer")}</h3>
          <p>{t("relationship.methodologyText")}</p>
        </div>
        <div className="relationship-evaluation-meta">
          <span>{t("relationship.lastEvaluation")}</span>
          <strong>{evaluation?.evaluatedAt || t("relationship.notEvaluated")}</strong>
          <small>{evaluation?.evaluatedAt ? evaluation?.evaluator : t("relationship.suggestedValues")}</small>
        </div>
        <button type="button" className="secondary-button" onClick={beginEditing}>
          {t("relationship.editEvaluation")}
        </button>
      </section>

      {isEditing && (
        <section className="relationship-evaluation-editor">
          <header>
            <div>
              <p className="aurora-eyebrow">{t("relationship.transparentAssessment")}</p>
              <h3>{t("relationship.evaluatePartner", { partner: partnerName })}</h3>
            </div>
            <span>{t("relationship.scaleHelp")}</span>
          </header>

          <div className="relationship-parameter-grid">
            {METRIC_DEFINITIONS.map((definition) => {
              const labelKey = definition.labelKey || definition.key;
              return (
                <label className="relationship-parameter" key={definition.key}>
                  <span>
                    <strong>{t(`relationship.${labelKey}`)}</strong>
                    <small>{t("relationship.weight", { value: definition.weight })}</small>
                  </span>
                  <p>{t(`relationship.parameterHelp.${definition.key}`)}</p>
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={draftMetrics[definition.key] || 0}
                      onChange={(event) => updateMetric(definition.key, event.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={draftMetrics[definition.key] || 0}
                      onChange={(event) => updateMetric(definition.key, event.target.value)}
                    />
                  </div>
                </label>
              );
            })}
          </div>

          <label className="relationship-evaluation-notes">
            <span>{t("relationship.evaluationNotes")}</span>
            <textarea
              rows="3"
              value={draftNotes}
              placeholder={t("relationship.evaluationNotesPlaceholder")}
              onChange={(event) => setDraftNotes(event.target.value)}
            />
          </label>

          <footer>
            <button type="button" className="secondary-button" onClick={() => setIsEditing(false)}>
              {t("relationship.cancel")}
            </button>
            <button type="button" className="primary-action" onClick={saveEvaluation}>
              {t("relationship.saveEvaluation")}
            </button>
          </footer>
        </section>
      )}

      <div className="relationship-grid">
        <article className="relationship-radar-card">
          <div className="relationship-card-heading">
            <div>
              <p className="aurora-eyebrow">{t("relationship.vision")}</p>
              <h3>{t("relationship.health")}</h3>
            </div>

            <span className={`health-badge ${analysis.tone}`}>
              {translatedAnalysis.level}
            </span>
          </div>

          <div className="relationship-radar">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#dfe8ef" />

                <PolarAngleAxis
                  dataKey="metric"
                  tick={{
                    fill: "#5f7183",
                    fontSize: 10,
                  }}
                />

                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />

                <Tooltip
                  formatter={(value) => [`${value}/100`, t("relationship.evaluation")]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #dce6ee",
                    boxShadow: "0 12px 30px rgba(20, 44, 70, 0.12)",
                  }}
                />

                <Radar
                  name="Relationship Score"
                  dataKey="value"
                  stroke="#287fd1"
                  fill="#2dc98b"
                  fillOpacity={0.3}
                  strokeWidth={3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="relationship-analysis-card">
          <div className="relationship-ai-mark">N</div>

          <p className="aurora-eyebrow">
            Insight NEXA360
          </p>

          <h3>{t("relationship.strategicAnalysis")}</h3>

          <p className="relationship-message">
            {translatedAnalysis.message}
          </p>

          <div className="relationship-actions">
            <strong>{t("relationship.recommendations")}</strong>

            {translatedAnalysis.actions.map((action) => (
              <div className="relationship-action" key={action}>
                <span>✓</span>
                <p>{action}</p>
              </div>
            ))}
          </div>

      <button
        type="button"
        className="relationship-button"
        onClick={() => onViewPlan?.(partnerName)}
        aria-label={`${t("relationship.viewPlan")} ${partnerName}`}
      >
        {t("relationship.viewPlan")}
      </button>

          <footer className="relationship-signature">
            <small>{t("relationship.poweredBy")}</small>
            <strong>NEXA360 Intelligence</strong>
          </footer>
        </article>
      </div>

      <div className="relationship-metrics">
        <article>
          <span>{t("relationship.communication")}</span>
          <strong>{metrics.communication}%</strong>
          <div><i style={{ width: `${metrics.communication}%` }} /></div>
        </article>

        <article>
          <span>{t("relationship.deadlines")}</span>
          <strong>{metrics.deadlines}%</strong>
          <div><i style={{ width: `${metrics.deadlines}%` }} /></div>
        </article>

        <article>
          <span>{t("relationship.profitability")}</span>
          <strong>{metrics.profitability}%</strong>
          <div><i style={{ width: `${metrics.profitability}%` }} /></div>
        </article>

        <article>
          <span>{t("relationship.growth")}</span>
          <strong>{metrics.growth}%</strong>
          <div><i style={{ width: `${metrics.growth}%` }} /></div>
        </article>
      </div>
    </section>
  );
}
