export const LANGUAGES = [
  { code: "pt", label: "PT", name: "Português", locale: "pt-PT" },
  { code: "en", label: "EN", name: "English", locale: "en-GB" },
  { code: "es", label: "ES", name: "Español", locale: "es-ES" },
  { code: "zh", label: "中文", name: "简体中文", locale: "zh-CN" }
];

export const translations = {
  pt: {
    common: {
      future: "Em breve", logout: "Terminar sessão", admin: "Administradora",
      collaborator: "Colaborador", viewAll: "Ver todas", completed: "concluído"
    },
    menu: {
      section: "Gestão comercial", command: "Centro de Comando", leads: "Leads",
      partners: "Parceiros", opportunities: "Oportunidades", contacts: "Contactos",
      tasks: "Tarefas", reports: "Relatórios", settings: "Definições"
    },
    login: {
      pillars: "Estratégia • Inteligência • Humanidade",
      slogan: "Transformando Relações em Resultados",
      purpose: "Uma plataforma criada para organizar oportunidades, fortalecer relações e ajudar empresas e pessoas a crescer.",
      elegance: "Elegância", eleganceText: "Clareza, equilíbrio e organização em cada detalhe.",
      intelligence: "Inteligência", intelligenceText: "Informação transformada em orientação e ação.",
      humanity: "Humanidade", humanityText: "Tecnologia que respeita, acolhe e desenvolve pessoas.",
      foundation: "Fundação v1.0", access: "Acesso à plataforma",
      welcomeTitle: "Bem-vinda à NEXA360 CRM Enterprise",
      welcomeText: "Hoje começa mais um dia para criar oportunidades, fortalecer relações e ajudar empresas a crescer.",
      adminDetail: "Visão completa da empresa", collaboratorDetail: "Minha rotina e clientes",
      enteringAs: "Está a entrar como {role}.", name: "Nome", email: "Email",
      password: "Palavra-passe", passwordPlaceholder: "Digite pelo menos 4 caracteres",
      remember: "Lembrar-me", forgot: "Esqueci a palavra-passe", enterAs: "Entrar como {role} →",
      demo: "Use uma palavra-passe de demonstração, como 1234.",
      signature: "Excelência em evolução contínua.",
      nameError: "Por favor, indique o seu nome para continuar.",
      emailError: "Por favor, indique um email válido.",
      passwordError: "A palavra-passe deve ter pelo menos quatro caracteres.",
      morning: "Bom dia", afternoon: "Boa tarde", evening: "Boa noite"
    },
    command: {
      title: "Centro de Comando", slogan: "Transformando Relações em Resultados",
      purpose: "Hoje é uma excelente oportunidade para fortalecer relações e criar novos resultados.",
      dailyStrong: "Existem 3 clientes prioritários para contactar hoje.",
      dailyText: "Organize o seu dia começando pelas relações com maior potencial de evolução.",
      guidance: "Orientação inteligente", prioritiesToday: "Prioridades de hoje", actions: "3 ações",
      openCompany: "Abrir ficha de {company}", noContact18: "Sem contacto há 18 dias",
      contactToday: "Contactar hoje", meetingTomorrow: "Reunião amanhã às 10h00",
      prepareMeeting: "Preparar reunião", followUpPending: "Acompanhamento comercial pendente",
      prepareContact: "Preparar contacto", activeLeads: "Leads ativos",
      highPriority: "{count} com prioridade alta", openOpportunities: "Oportunidades abertas",
      inPipeline: "{value} em pipeline", wonDeals: "Negócios ganhos",
      averageProbability: "Probabilidade média", openOpportunityDetail: "das oportunidades abertas",
      priorities: "Prioridades", myDay: "O Meu Dia", high: "Alta", resumeContact: "Retomar contacto",
      meetingToday: "Reunião hoje às 14h00", today: "Hoje", proposalTomorrow: "Proposta aguardada até amanhã",
      deadline: "Prazo", sendProposal: "Enviar proposta", salesFunnel: "Funil comercial",
      salesPipeline: "Pipeline de Vendas", openOpportunityManagement: "Abrir gestão de oportunidades →",
      qualification: "Qualificação", discovery: "Descoberta", proposal: "Proposta",
      negotiation: "Negociação", closing: "Fecho", insightTitle: "Uma decisão simples pode gerar uma grande oportunidade.",
      insightText: "Existem cinco clientes sem contacto há mais de 15 dias. Recomendamos começar pela Atlântico Export.",
      viewPriorityPartners: "Ver parceiros prioritários →", monthlyGoal: "Objetivo mensal",
      commercialGoal: "Meta Comercial", remainingGoal: "Faltam € 28.000 para atingir a meta deste mês.",
      adminOnly: "Visível apenas para si", teamDevelopment: "Desenvolvimento da Equipa",
      positiveEvolution: "Evolução positiva • 82%", readyChallenges: "Preparada para novos desafios • 91%"
    }
  },
  en: {
    common: {
      future: "Coming soon", logout: "Sign out", admin: "Administrator",
      collaborator: "Collaborator", viewAll: "View all", completed: "completed"
    },
    menu: {
      section: "Sales management", command: "Command Centre", leads: "Leads",
      partners: "Partners", opportunities: "Opportunities", contacts: "Contacts",
      tasks: "Tasks", reports: "Reports", settings: "Settings"
    },
    login: {
      pillars: "Strategy • Intelligence • Humanity", slogan: "Turning Relationships into Results",
      purpose: "A platform designed to organise opportunities, strengthen relationships and help businesses and people grow.",
      elegance: "Elegance", eleganceText: "Clarity, balance and organisation in every detail.",
      intelligence: "Intelligence", intelligenceText: "Information transformed into guidance and action.",
      humanity: "Humanity", humanityText: "Technology that respects, supports and develops people.",
      foundation: "Foundation v1.0", access: "Platform access", welcomeTitle: "Welcome to NEXA360 CRM Enterprise",
      welcomeText: "Today is another opportunity to create value, strengthen relationships and help businesses grow.",
      adminDetail: "Complete company overview", collaboratorDetail: "My routine and clients",
      enteringAs: "You are signing in as {role}.", name: "Name", email: "Email", password: "Password",
      passwordPlaceholder: "Enter at least 4 characters", remember: "Remember me", forgot: "Forgot password",
      enterAs: "Sign in as {role} →", demo: "Use a demonstration password, such as 1234.",
      signature: "Excellence through continuous evolution.", nameError: "Please enter your name to continue.",
      emailError: "Please enter a valid email address.", passwordError: "The password must contain at least four characters.",
      morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening"
    },
    command: {
      title: "Command Centre", slogan: "Turning Relationships into Results",
      purpose: "Today is an excellent opportunity to strengthen relationships and create new results.",
      dailyStrong: "There are 3 priority clients to contact today.",
      dailyText: "Organise your day by starting with the relationships that have the greatest growth potential.",
      guidance: "Smart guidance", prioritiesToday: "Today's priorities", actions: "3 actions",
      openCompany: "Open {company} profile", noContact18: "No contact for 18 days", contactToday: "Contact today",
      meetingTomorrow: "Meeting tomorrow at 10:00", prepareMeeting: "Prepare meeting",
      followUpPending: "Commercial follow-up pending", prepareContact: "Prepare contact",
      activeLeads: "Active leads", highPriority: "{count} high priority", openOpportunities: "Open opportunities",
      inPipeline: "{value} in pipeline", wonDeals: "Won deals", averageProbability: "Average probability",
      openOpportunityDetail: "across open opportunities", priorities: "Priorities", myDay: "My Day", high: "High",
      resumeContact: "Resume contact", meetingToday: "Meeting today at 14:00", today: "Today",
      proposalTomorrow: "Proposal due tomorrow", deadline: "Deadline", sendProposal: "Send proposal",
      salesFunnel: "Sales funnel", salesPipeline: "Sales Pipeline",
      openOpportunityManagement: "Open opportunity management →", qualification: "Qualification",
      discovery: "Discovery", proposal: "Proposal", negotiation: "Negotiation", closing: "Closing",
      insightTitle: "One simple decision can create a major opportunity.",
      insightText: "Five clients have had no contact for over 15 days. We recommend starting with Atlântico Export.",
      viewPriorityPartners: "View priority partners →", monthlyGoal: "Monthly objective",
      commercialGoal: "Sales Goal", remainingGoal: "€28,000 remaining to reach this month's goal.",
      adminOnly: "Visible only to you", teamDevelopment: "Team Development",
      positiveEvolution: "Positive progress • 82%", readyChallenges: "Ready for new challenges • 91%"
    }
  },
  es: {
    common: {
      future: "Próximamente", logout: "Cerrar sesión", admin: "Administradora",
      collaborator: "Colaborador", viewAll: "Ver todo", completed: "completado"
    },
    menu: {
      section: "Gestión comercial", command: "Centro de Mando", leads: "Leads",
      partners: "Socios", opportunities: "Oportunidades", contacts: "Contactos",
      tasks: "Tareas", reports: "Informes", settings: "Configuración"
    },
    login: {
      pillars: "Estrategia • Inteligencia • Humanidad", slogan: "Transformando Relaciones en Resultados",
      purpose: "Una plataforma creada para organizar oportunidades, fortalecer relaciones y ayudar a empresas y personas a crecer.",
      elegance: "Elegancia", eleganceText: "Claridad, equilibrio y organización en cada detalle.",
      intelligence: "Inteligencia", intelligenceText: "Información transformada en orientación y acción.",
      humanity: "Humanidad", humanityText: "Tecnología que respeta, acoge y desarrolla a las personas.",
      foundation: "Fundación v1.0", access: "Acceso a la plataforma",
      welcomeTitle: "Bienvenida a NEXA360 CRM Enterprise",
      welcomeText: "Hoy comienza otro día para crear oportunidades, fortalecer relaciones y ayudar a las empresas a crecer.",
      adminDetail: "Visión completa de la empresa", collaboratorDetail: "Mi rutina y clientes",
      enteringAs: "Está entrando como {role}.", name: "Nombre", email: "Email", password: "Contraseña",
      passwordPlaceholder: "Escriba al menos 4 caracteres", remember: "Recordarme", forgot: "Olvidé la contraseña",
      enterAs: "Entrar como {role} →", demo: "Utilice una contraseña de demostración, como 1234.",
      signature: "Excelencia en evolución continua.", nameError: "Indique su nombre para continuar.",
      emailError: "Indique un email válido.", passwordError: "La contraseña debe tener al menos cuatro caracteres.",
      morning: "Buenos días", afternoon: "Buenas tardes", evening: "Buenas noches"
    },
    command: {
      title: "Centro de Mando", slogan: "Transformando Relaciones en Resultados",
      purpose: "Hoy es una excelente oportunidad para fortalecer relaciones y crear nuevos resultados.",
      dailyStrong: "Hay 3 clientes prioritarios para contactar hoy.",
      dailyText: "Organice su día empezando por las relaciones con mayor potencial de evolución.",
      guidance: "Orientación inteligente", prioritiesToday: "Prioridades de hoy", actions: "3 acciones",
      openCompany: "Abrir ficha de {company}", noContact18: "Sin contacto desde hace 18 días",
      contactToday: "Contactar hoy", meetingTomorrow: "Reunión mañana a las 10:00",
      prepareMeeting: "Preparar reunión", followUpPending: "Seguimiento comercial pendiente",
      prepareContact: "Preparar contacto", activeLeads: "Leads activos",
      highPriority: "{count} con prioridad alta", openOpportunities: "Oportunidades abiertas",
      inPipeline: "{value} en pipeline", wonDeals: "Negocios ganados", averageProbability: "Probabilidad media",
      openOpportunityDetail: "de las oportunidades abiertas", priorities: "Prioridades", myDay: "Mi Día", high: "Alta",
      resumeContact: "Retomar contacto", meetingToday: "Reunión hoy a las 14:00", today: "Hoy",
      proposalTomorrow: "Propuesta pendiente para mañana", deadline: "Plazo", sendProposal: "Enviar propuesta",
      salesFunnel: "Embudo comercial", salesPipeline: "Pipeline de Ventas",
      openOpportunityManagement: "Abrir gestión de oportunidades →", qualification: "Cualificación",
      discovery: "Descubrimiento", proposal: "Propuesta", negotiation: "Negociación", closing: "Cierre",
      insightTitle: "Una decisión sencilla puede generar una gran oportunidad.",
      insightText: "Hay cinco clientes sin contacto desde hace más de 15 días. Recomendamos comenzar por Atlântico Export.",
      viewPriorityPartners: "Ver socios prioritarios →", monthlyGoal: "Objetivo mensual",
      commercialGoal: "Meta Comercial", remainingGoal: "Faltan 28.000 € para alcanzar la meta de este mes.",
      adminOnly: "Visible solo para usted", teamDevelopment: "Desarrollo del Equipo",
      positiveEvolution: "Evolución positiva • 82%", readyChallenges: "Preparada para nuevos desafíos • 91%"
    }
  },
  zh: {
    common: {
      future: "即将推出", logout: "退出登录", admin: "管理员",
      collaborator: "协作人员", viewAll: "查看全部", completed: "已完成"
    },
    menu: {
      section: "销售管理", command: "指挥中心", leads: "潜在客户", partners: "合作伙伴",
      opportunities: "商机", contacts: "联系人", tasks: "任务", reports: "报告", settings: "设置"
    },
    login: {
      pillars: "战略 • 智能 • 人文", slogan: "将关系转化为成果",
      purpose: "一个用于管理商机、加强关系并帮助企业和个人成长的平台。",
      elegance: "优雅", eleganceText: "每个细节都清晰、平衡且井然有序。",
      intelligence: "智能", intelligenceText: "将信息转化为指导和行动。",
      humanity: "人文", humanityText: "尊重、支持并发展人才的技术。",
      foundation: "基础版 v1.0", access: "平台登录", welcomeTitle: "欢迎使用 NEXA360 CRM Enterprise",
      welcomeText: "今天又是创造机会、加强关系并帮助企业成长的一天。",
      adminDetail: "完整的企业视图", collaboratorDetail: "我的日程与客户",
      enteringAs: "您正在以{role}身份登录。", name: "姓名", email: "电子邮箱", password: "密码",
      passwordPlaceholder: "请输入至少4个字符", remember: "记住我", forgot: "忘记密码",
      enterAs: "以{role}身份登录 →", demo: "可使用演示密码，例如 1234。",
      signature: "持续进步，追求卓越。", nameError: "请输入姓名后继续。",
      emailError: "请输入有效的电子邮箱。", passwordError: "密码至少需要四个字符。",
      morning: "早上好", afternoon: "下午好", evening: "晚上好"
    },
    command: {
      title: "指挥中心", slogan: "将关系转化为成果",
      purpose: "今天是加强关系并创造新成果的好机会。",
      dailyStrong: "今天有3位重点客户需要联系。",
      dailyText: "请从最具发展潜力的客户关系开始安排今天的工作。",
      guidance: "智能指导", prioritiesToday: "今日重点", actions: "3项行动",
      openCompany: "打开{company}档案", noContact18: "已有18天未联系", contactToday: "今天联系",
      meetingTomorrow: "明天10:00开会", prepareMeeting: "准备会议",
      followUpPending: "商业跟进待处理", prepareContact: "准备联系",
      activeLeads: "活跃潜在客户", highPriority: "{count}个高优先级", openOpportunities: "开放商机",
      inPipeline: "销售管道金额 {value}", wonDeals: "已赢得业务", averageProbability: "平均成功率",
      openOpportunityDetail: "开放商机平均值", priorities: "优先事项", myDay: "我的一天", high: "高",
      resumeContact: "恢复联系", meetingToday: "今天14:00开会", today: "今天",
      proposalTomorrow: "提案明天到期", deadline: "截止日期", sendProposal: "发送提案",
      salesFunnel: "销售漏斗", salesPipeline: "销售管道",
      openOpportunityManagement: "打开商机管理 →", qualification: "资格评估",
      discovery: "需求发现", proposal: "提案", negotiation: "谈判", closing: "成交",
      insightTitle: "一个简单的决定也能创造重大机会。",
      insightText: "有五位客户超过15天未联系。建议从 Atlântico Export 开始。",
      viewPriorityPartners: "查看重点合作伙伴 →", monthlyGoal: "月度目标",
      commercialGoal: "销售目标", remainingGoal: "本月目标还差 €28,000。",
      adminOnly: "仅您可见", teamDevelopment: "团队发展",
      positiveEvolution: "进展良好 • 82%", readyChallenges: "已准备迎接新挑战 • 91%"
    }
  }
};
