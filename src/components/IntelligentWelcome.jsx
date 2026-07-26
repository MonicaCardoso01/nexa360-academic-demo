import React from "react";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Bom dia";
  if (hour < 19) return "Boa tarde";
  return "Boa noite";
}

const priorities = [
  {
    icon: "☎",
    title: "Atlântico Export",
    description: "Sem contacto há 18 dias",
    recommendation: "Contactar hoje",
    tone: "blue",
  },
  {
    icon: "◷",
    title: "NordWerk GmbH",
    description: "Reunião amanhã às 10h00",
    recommendation: "Preparar reunião",
    tone: "green",
  },
  {
    icon: "€",
    title: "Lusitana Tech",
    description: "Proposta comercial pendente",
    recommendation: "Valor potencial: € 18.500",
    tone: "gold",
  },
];

export default function IntelligentWelcome({ user }) {
  const firstName = user?.name?.split(" ")[0] || "Mónica";

  return (
    <section className="intelligent-welcome">
      <div className="welcome-main">
        <p className="aurora-eyebrow">
          Transformando Relações em Resultados
        </p>

        <h2>
          {getGreeting()}, {firstName}.
        </h2>

        <p className="welcome-purpose">
          Hoje é uma excelente oportunidade para fortalecer relações
          e criar novos resultados.
        </p>

        <div className="daily-message">
          <span>✦</span>

          <div>
            <strong>
              Existem 3 clientes prioritários para contactar hoje.
            </strong>

            <p>
              Organize o seu dia começando pelas relações com maior
              potencial de evolução.
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
            <p className="aurora-eyebrow">Orientação inteligente</p>
            <h3>Prioridades de hoje</h3>
          </div>

          <span className="priority-count">3 ações</span>
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
                <p>{priority.description}</p>
                <small>{priority.recommendation}</small>
              </div>

              <button type="button" aria-label={`Abrir ${priority.title}`}>
                →
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
