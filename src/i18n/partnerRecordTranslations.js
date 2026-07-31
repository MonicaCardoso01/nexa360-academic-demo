const countries = {
  en: { Portugal: "Portugal", França: "France", Alemanha: "Germany", Espanha: "Spain", Itália: "Italy" },
  es: { Portugal: "Portugal", França: "Francia", Alemanha: "Alemania", Espanha: "España", Itália: "Italia" },
  zh: { Portugal: "葡萄牙", França: "法国", Alemanha: "德国", Espanha: "西班牙", Itália: "意大利" }
};

const sectors = {
  en: { "Comércio Internacional": "International Trade", Consultoria: "Consulting", Indústria: "Industry", Alimentação: "Food", Design: "Design", "Moda Sustentável": "Sustainable Fashion", Tecnologia: "Technology", Joias: "Jewellery" },
  es: { "Comércio Internacional": "Comercio Internacional", Consultoria: "Consultoría", Indústria: "Industria", Alimentação: "Alimentación", Design: "Diseño", "Moda Sustentável": "Moda Sostenible", Tecnologia: "Tecnología", Joias: "Joyería" },
  zh: { "Comércio Internacional": "国际贸易", Consultoria: "咨询", Indústria: "工业", Alimentação: "食品", Design: "设计", "Moda Sustentável": "可持续时尚", Tecnologia: "科技", Joias: "珠宝" }
};

const records = {
  en: {
    1: { nextAction: "Resume contact and confirm meeting", relationship: "Prefers telephone contact in the morning. Values prompt responses and objective proposals.", notes: "Interested in internationalisation and sales intelligence solutions." },
    2: { nextAction: "Prepare follow-up meeting", relationship: "Prefers meetings scheduled in advance. Shows strong interest in sustainability.", notes: "Client converted after an international prospecting campaign." },
    3: { nextAction: "Send commercial proposal", relationship: "Values detailed technical information, deadline compliance and direct communication.", notes: "Strategic opportunity for the German market." },
    4: { nextAction: "Make first contact", relationship: "Lead received through a referral. Initial interest in ESG strategy.", notes: "Awaiting confirmation of the decision-maker." },
    5: { nextAction: "Reassess contact within 90 days", relationship: "Liked the proposal but postponed the investment due to budget constraints.", notes: "Do not close permanently; interest may return next quarter." },
    6: { nextAction: "Present expansion plan", relationship: "Seeks partners with clear social and environmental values. Cordial, collaborative communication.", notes: "Strong potential for internationalisation services." },
    7: { nextAction: "Schedule CRM demonstration", relationship: "Prefers short video calls and documents sent in advance.", notes: "Interested in the sales intelligence module." },
    8: { nextAction: "Send institutional presentation", relationship: "Discovered NEXA360 at a business event.", notes: "Lead still at an early stage." }
  },
  es: {
    1: { nextAction: "Retomar el contacto y confirmar la reunión", relationship: "Prefiere el contacto telefónico por la mañana. Valora respuestas rápidas y propuestas objetivas.", notes: "Interés en internacionalización y soluciones de inteligencia comercial." },
    2: { nextAction: "Preparar reunión de seguimiento", relationship: "Prefiere reuniones programadas con antelación. Muestra gran interés por la sostenibilidad.", notes: "Cliente convertido tras una campaña de prospección internacional." },
    3: { nextAction: "Enviar propuesta comercial", relationship: "Valora la información técnica detallada, el cumplimiento de plazos y la comunicación directa.", notes: "Oportunidad estratégica para el mercado alemán." },
    4: { nextAction: "Realizar el primer contacto", relationship: "Lead recibido por recomendación. Interés inicial en estrategia ESG.", notes: "A la espera de confirmar a la persona responsable de la decisión." },
    5: { nextAction: "Reevaluar el contacto en 90 días", relationship: "Le gustó la propuesta, pero aplazó la inversión por restricciones presupuestarias.", notes: "No cerrar definitivamente; podría recuperar el interés el próximo trimestre." },
    6: { nextAction: "Presentar el plan de expansión", relationship: "Busca socios con valores sociales y ambientales claros. Comunicación cordial y colaborativa.", notes: "Gran potencial para servicios de internacionalización." },
    7: { nextAction: "Programar una demostración del CRM", relationship: "Prefiere videollamadas breves y documentación enviada previamente.", notes: "Interesado en el módulo de inteligencia comercial." },
    8: { nextAction: "Enviar presentación institucional", relationship: "Conoció NEXA360 en un evento empresarial.", notes: "Lead todavía en fase inicial." }
  },
  zh: {
    1: { nextAction: "恢复联系并确认会议", relationship: "偏好上午电话联系，重视快速回复和明确的方案。", notes: "对国际化和销售智能解决方案感兴趣。" },
    2: { nextAction: "准备跟进会议", relationship: "偏好提前安排会议，对可持续发展表现出浓厚兴趣。", notes: "通过国际客户开发活动转化而来的客户。" },
    3: { nextAction: "发送商业方案", relationship: "重视详细技术信息、按期完成和直接沟通。", notes: "德国市场的战略机会。" },
    4: { nextAction: "进行首次联系", relationship: "通过推荐获得的潜在客户，初步关注 ESG 战略。", notes: "等待确认决策负责人。" },
    5: { nextAction: "90天后重新评估联系", relationship: "认可方案，但因预算限制推迟投资。", notes: "不要永久关闭；下季度可能重新产生兴趣。" },
    6: { nextAction: "介绍扩张计划", relationship: "寻找具有明确社会和环境价值观的合作伙伴，沟通友好且协作。", notes: "国际化服务潜力较高。" },
    7: { nextAction: "安排 CRM 演示", relationship: "偏好简短视频会议，并提前接收资料。", notes: "对销售智能模块感兴趣。" },
    8: { nextAction: "发送企业介绍", relationship: "在一次商业活动中了解到 NEXA360。", notes: "潜在客户仍处于初期阶段。" }
  }
};

export function localizePartner(partner, language) {
  if (!partner) return partner;
  return {
    ...partner,
    country: countries[language]?.[partner.country] || partner.country,
    sector: sectors[language]?.[partner.sector] || partner.sector,
    ...(records[language]?.[partner.id] || {})
  };
}
