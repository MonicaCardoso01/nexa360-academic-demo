export const OPPORTUNITY_STAGES = [
  "Qualificação",
  "Descoberta",
  "Proposta",
  "Negociação",
  "Fecho"
];

export const OPPORTUNITY_STATUSES = ["Aberta", "Ganha", "Perdida"];

export const INITIAL_OPPORTUNITIES = [
  {
    id: 1001,
    leadId: 6,
    title: "Implementação NEXA360 CRM",
    company: "Lisboa Prime",
    contactName: "Rita Marques",
    email: "rita@lisboaprime.pt",
    service: "CRM Enterprise",
    value: 36000,
    probability: 90,
    stage: "Fecho",
    status: "Ganha",
    owner: "Mônica Cardoso",
    expectedClose: "2026-07-31",
    createdAt: "2026-07-12",
    nextAction: "Iniciar onboarding",
    notes: "Contrato aprovado. Preparar reunião de arranque."
  },
  {
    id: 1002,
    leadId: null,
    title: "Expansão comercial para Portugal",
    company: "Bella Forma SRL",
    contactName: "Giulia Rossi",
    email: "giulia@bellaforma.it",
    service: "Marketing Estratégico",
    value: 28500,
    probability: 65,
    stage: "Negociação",
    status: "Aberta",
    owner: "Mônica Cardoso",
    expectedClose: "2026-09-15",
    createdAt: "2026-07-13",
    nextAction: "Rever condições comerciais",
    notes: "Cliente pretende iniciar o projeto no próximo trimestre."
  },
  {
    id: 1003,
    leadId: null,
    title: "Diagnóstico de internacionalização",
    company: "NordWerk GmbH",
    contactName: "Lukas Weber",
    email: "lukas@nordwerk.de",
    service: "Inteligência Comercial",
    value: 42000,
    probability: 50,
    stage: "Proposta",
    status: "Aberta",
    owner: "João Martins",
    expectedClose: "2026-08-28",
    createdAt: "2026-07-15",
    nextAction: "Acompanhar proposta",
    notes: "Proposta comercial enviada e em avaliação."
  }
];
