const countries = {
  en: { Portugal: "Portugal", Espanha: "Spain", França: "France", Alemanha: "Germany", Itália: "Italy" },
  es: { Portugal: "Portugal", Espanha: "España", França: "Francia", Alemanha: "Alemania", Itália: "Italia" },
  zh: { Portugal: "葡萄牙", Espanha: "西班牙", França: "法国", Alemanha: "德国", Itália: "意大利" }
};

const records = {
  en: {
    1: { role: "Sales Director", interest: "Enterprise CRM", nextAction: "Make first contact", notes: "Requested a demonstration through the website." },
    2: { role: "CEO", interest: "International Consulting", nextAction: "Send institutional presentation", notes: "Met at a business trade fair in Lisbon." },
    3: { role: "Expansion Manager", interest: "Internationalisation", nextAction: "Schedule strategic meeting", notes: "Strong alignment with sustainability and ESG." },
    4: { role: "Operations Director", interest: "Sales Intelligence", nextAction: "Follow up on proposal", notes: "Proposal worth €42,000 sent." },
    5: { role: "Founder", interest: "Strategic Marketing", nextAction: "Review commercial terms", notes: "Intends to start the project next quarter." },
    6: { role: "Managing Partner", interest: "Enterprise CRM", nextAction: "Start onboarding", notes: "Lead converted into an opportunity and contract approved." },
    7: { role: "CTO", interest: "Sales Automation", nextAction: "Send case study", notes: "Assessing integration with existing systems." },
    8: { role: "Managing Director", interest: "Business Mentoring", nextAction: "Resume in 90 days", notes: "Project postponed due to lack of budget." }
  },
  es: {
    1: { role: "Directora Comercial", interest: "CRM Empresarial", nextAction: "Realizar el primer contacto", notes: "Solicitó una demostración a través del sitio web." },
    2: { role: "CEO", interest: "Consultoría Internacional", nextAction: "Enviar presentación institucional", notes: "Conocido en una feria empresarial en Lisboa." },
    3: { role: "Responsable de Expansión", interest: "Internacionalización", nextAction: "Programar reunión estratégica", notes: "Gran afinidad con la sostenibilidad y ESG." },
    4: { role: "Director de Operaciones", interest: "Inteligencia Comercial", nextAction: "Realizar seguimiento de la propuesta", notes: "Propuesta enviada por valor de 42.000 €." },
    5: { role: "Fundadora", interest: "Marketing Estratégico", nextAction: "Revisar las condiciones comerciales", notes: "Pretende iniciar el proyecto el próximo trimestre." },
    6: { role: "Socia Directora", interest: "CRM Empresarial", nextAction: "Iniciar la incorporación", notes: "Lead convertido en oportunidad y contrato aprobado." },
    7: { role: "CTO", interest: "Automatización Comercial", nextAction: "Enviar estudio de caso", notes: "Evaluando la integración con los sistemas existentes." },
    8: { role: "Directora General", interest: "Mentoría Empresarial", nextAction: "Retomar en 90 días", notes: "Proyecto aplazado por falta de presupuesto." }
  },
  zh: {
    1: { role: "销售总监", interest: "企业 CRM", nextAction: "进行首次联系", notes: "通过网站申请了演示。" },
    2: { role: "首席执行官", interest: "国际咨询", nextAction: "发送企业介绍", notes: "在里斯本的一次商业展会上认识。" },
    3: { role: "扩张负责人", interest: "国际化", nextAction: "安排战略会议", notes: "与可持续发展及 ESG 高度契合。" },
    4: { role: "运营总监", interest: "销售智能", nextAction: "跟进方案", notes: "已发送价值42,000欧元的方案。" },
    5: { role: "创始人", interest: "战略营销", nextAction: "审查商业条款", notes: "计划在下一季度启动项目。" },
    6: { role: "执行合伙人", interest: "企业 CRM", nextAction: "开始客户导入", notes: "潜在客户已转化为商机，合同已获批准。" },
    7: { role: "首席技术官", interest: "销售自动化", nextAction: "发送案例研究", notes: "正在评估与现有系统的集成。" },
    8: { role: "总经理", interest: "企业辅导", nextAction: "90天后重新联系", notes: "项目因预算不足而推迟。" }
  }
};

export function localizeLead(lead, language) {
  if (!lead) return lead;
  return {
    ...lead,
    country: countries[language]?.[lead.country] || lead.country,
    ...(records[language]?.[lead.id] || {})
  };
}
