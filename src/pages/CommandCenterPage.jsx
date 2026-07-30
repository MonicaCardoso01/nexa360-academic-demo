import ExecutiveCharts from "../components/ExecutiveCharts.jsx";
import IntelligentWelcome from "../components/IntelligentWelcome.jsx";
import React from "react";
import AppLayout from "../layouts/AppLayout.jsx";
import { greeting, today } from "../utils/date.js";

const priorities = [
  ["red", "Atlântico Export", "Sem contacto há 18 dias", "Alta", "Retomar contacto"],
  ["green", "Lumière Conseil", "Reunião hoje às 14h00", "Hoje", "Preparar reunião"],
  ["blue", "NordWerk GmbH", "Proposta aguardada até amanhã", "Prazo", "Enviar proposta"]
];

const euro = (value) => new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
}).format(Number(value) || 0);

export default function CommandCenterPage({ user, leads, opportunities, onLogout, onNavigate }) {
  const admin = user.profileKey === "admin";
  const visibleOpportunities = admin
    ? opportunities
    : opportunities.filter((item) => item.owner === user.name);
  const open = visibleOpportunities.filter((item) => item.status === "Aberta");
  const pipelineValue = open.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const highPriority = leads.filter((item) => item.priority === "Alta" && item.status !== "Convertido").length;
  const metrics = [
    [String(leads.filter((item) => item.status !== "Convertido" && item.status !== "Perdido").length), "Leads ativos", `${highPriority} com prioridade alta`],
    [String(open.length), "Oportunidades abertas", `${euro(pipelineValue)} em pipeline`],
    [String(visibleOpportunities.filter((item) => item.status === "Ganha").length), "Negócios ganhos", euro(visibleOpportunities.filter((item) => item.status === "Ganha").reduce((sum, item) => sum + Number(item.value || 0), 0))],
    [`${Math.round(open.reduce((sum, item) => sum + Number(item.probability || 0), 0) / (open.length || 1))}%`, "Probabilidade média", "das oportunidades abertas"]
  ];
  const stageCounts = ["Qualificação", "Descoberta", "Proposta", "Negociação", "Fecho"]
    .map((stage) => [stage, open.filter((item) => item.stage === stage).length]);
  const maxStageCount = Math.max(...stageCounts.map(([, count]) => count), 1);

  return (
    <AppLayout
      user={user}
      activePage="command"
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Centro de Comando"
    >
      <div className="content">
        <IntelligentWelcome user={user} />
          
          
        

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
                  <p className="eyebrow">Prioridades</p>
                  <h2>O Meu Dia</h2>
                </div>
                <button type="button">Ver todas</button>
              </div>

              {priorities.map(([tone, company, note, label, action]) => (
                <div className="task" key={company}>
                  <i className={tone} />
                  <div><b>{company}</b><small>{note}</small></div>
                  <span className={tone}>{label}</span>
                  <button type="button">{action} →</button>
                </div>
              ))}
            </article>

            <article className="panel">
              <div className="panelHead">
                <div>
                  <p className="eyebrow">Funil comercial</p>
                  <h2>Pipeline de Vendas</h2>
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
                Abrir gestão de oportunidades →
              </button>
            </article>
          </div>

          <div className="small">
            <article className="insight">
              <div className="insightMark">N</div>
              <p className="eyebrow light">Insight NEXA360</p>
              <h2>Uma decisão simples pode gerar uma grande oportunidade.</h2>
              <p>
                Existem cinco clientes sem contacto há mais de 15 dias.
                Recomendamos começar pela Atlântico Export.
              </p>
              <button type="button" onClick={() => onNavigate("partners")}>
                Ver parceiros prioritários →
              </button>
            </article>

            <article className="panel goal">
              <div className="panelHead">
                <div>
                  <p className="eyebrow">Objetivo mensal</p>
                  <h2>Meta Comercial</h2>
                </div>
                <b>72%</b>
              </div>
              <div className="circle">
                <div><b>72%</b><small>concluído</small></div>
              </div>
              <p>Faltam € 28.000 para atingir a meta deste mês.</p>
            </article>

            {admin && (
              <article className="panel team">
                <p className="eyebrow">Visível apenas para você</p>
                <h2>Desenvolvimento da Equipa</h2>
                <div className="person">
                  <div className="avatar mini">JM</div>
                  <div><b>João Martins</b><small>Evolução positiva • 82%</small></div>
                  <strong>↗</strong>
                </div>
                <div className="person">
                  <div className="avatar mini">AS</div>
                  <div><b>Ana Silva</b><small>Preparada para novos desafios • 91%</small></div>
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
