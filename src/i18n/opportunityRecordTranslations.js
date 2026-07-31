export const opportunityRecordTranslations = {
  en: {
    1001: { title: "NEXA360 CRM Implementation", service: "Enterprise CRM", nextAction: "Start onboarding", notes: "Contract approved. Prepare the kick-off meeting." },
    1002: { title: "Commercial expansion into Portugal", service: "Strategic Marketing", nextAction: "Review commercial terms", notes: "The client intends to start the project next quarter." },
    1003: { title: "Internationalisation assessment", service: "Sales Intelligence", nextAction: "Follow up on proposal", notes: "Commercial proposal sent and currently under review." }
  },
  es: {
    1001: { title: "Implementación de NEXA360 CRM", service: "CRM Empresarial", nextAction: "Iniciar la incorporación", notes: "Contrato aprobado. Preparar la reunión de inicio." },
    1002: { title: "Expansión comercial a Portugal", service: "Marketing Estratégico", nextAction: "Revisar las condiciones comerciales", notes: "El cliente pretende iniciar el proyecto el próximo trimestre." },
    1003: { title: "Diagnóstico de internacionalización", service: "Inteligencia Comercial", nextAction: "Realizar seguimiento de la propuesta", notes: "Propuesta comercial enviada y actualmente en evaluación." }
  },
  zh: {
    1001: { title: "实施 NEXA360 CRM", service: "企业 CRM", nextAction: "开始客户导入", notes: "合同已获批准。准备项目启动会议。" },
    1002: { title: "拓展葡萄牙市场", service: "战略营销", nextAction: "审查商业条款", notes: "客户计划在下一季度启动项目。" },
    1003: { title: "国际化评估", service: "销售智能", nextAction: "跟进方案", notes: "商业方案已发送，目前正在审核。" }
  }
};

export function localizeOpportunity(item, language) {
  return { ...item, ...(opportunityRecordTranslations[language]?.[item.id] || {}) };
}
