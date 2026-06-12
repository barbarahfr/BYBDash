import { Client, Department, Team, TeamMember, CustomColumn } from './types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'design',
    name: 'Design',
    color: 'purple',
    tasks: [
      { id: 'paid_traffic_assets', name: 'Paid Traffic Assets', description: 'Artes, banners e reels para Meta/Google.' },
      { id: 'social_media_assets', name: 'Social Media Graphics', description: 'Grades de post do Instagram, carrosséis e posts.' },
      { id: 'web_design', name: 'Web Design / Landings', description: 'Desenvolvimento e design de páginas de vendas e landing pages.' },
      { id: 'brand_kit', name: 'Identidade Visual & Brand Kit', description: 'Logotipos, fontes, paletas de cores e guias de marca.' }
    ]
  },
  {
    id: 'paid_media',
    name: 'Mídias Pagas',
    color: 'blue',
    tasks: [
      { id: 'meta_ads', name: 'Tráfego Pago (Meta Ads)', description: 'Segmentação, lances diários, criativos e distribuição no Facebook/Instagram.' },
      { id: 'google_ads', name: 'Tráfego Pago (Google Ads)', description: 'Pesquisa de palavras-chave, anúncios de rede de pesquisa e campanhas no YouTube.' }
    ]
  },
  {
    id: 'content_seo',
    name: 'Conteúdo e SEO',
    color: 'emerald',
    tasks: [
      { id: 'seo_content', name: 'Otimização de SEO', description: 'Redação SEO de cabeçalhos, otimização de páginas de vendas ou blogs.' },
      { id: 'blog_posts', name: 'Redação & Criação de Artigos', description: 'Blogposts semanais otimizados para busca orgânica.' }
    ]
  },
  {
    id: 'social_media',
    name: 'Mídias Sociais',
    color: 'rose',
    tasks: [
      { id: 'scripts_reels', name: 'Roteiros de Reels / Redes', description: 'Ganchos, legendas, áudios recomendados e roteiros para vídeos curtos.' },
      { id: 'editorial_calendar', name: 'Calendário Editorial', description: 'Cronograma mensal de posts orgânicos para o Instagram.' }
    ]
  },
  {
    id: 'automations_crm',
    name: 'Automações & CRM',
    color: 'amber',
    tasks: [
      { id: 'automacao', name: 'Automação de Marketing', description: 'Fluxos de e-mail marketing, integrações Webhook e réguas de relacionamento CRM.' },
      { id: 'byb_conversas', name: 'BYB Conversas', description: 'Fluxos conversacionais automáticos, chatbots e automações no WhatsApp.' }
    ]
  }
];

export const INITIAL_CUSTOM_COLUMNS: CustomColumn[] = [
  {
    id: 'col_operand',
    name: 'Operand',
    type: 'link'
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team_content_seo',
    name: 'Otimização e SEO',
    coordinatorId: 'member_barbarah'
  },
  {
    id: 'team_automations_crm',
    name: 'Automações e CRM',
    coordinatorId: 'member_barbarah'
  },
  {
    id: 'team_social_media',
    name: 'Mídias Sociais',
    coordinatorId: 'member_barbarah'
  },
  {
    id: 'team_design',
    name: 'Design',
    coordinatorId: 'member_emma'
  },
  {
    id: 'team_paid_media',
    name: 'Mídias Pagas',
    coordinatorId: 'member_barbarah'
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'member_glauber',
    name: 'Glauber Moraes',
    email: 'glauber@byb.ag',
    role: 'Gestor de Contas / Tráfego',
    teamId: 'team_paid_media',
    isCoordinator: false
  },
  {
    id: 'member_mauricio',
    name: 'Maurício',
    email: 'mauricio@byb.ag',
    role: 'Estrategista Digital / Tráfego',
    teamId: 'team_paid_media',
    isCoordinator: false
  },
  {
    id: 'member_ed',
    name: 'Ed',
    email: 'ed@byb.ag',
    role: 'Sócio / Atendimento',
    teamId: 'team_automations_crm',
    isCoordinator: false
  },
  {
    id: 'member_clara',
    name: 'Clara',
    email: 'clara@byb.ag',
    role: 'Gestora de Redes Sociais / CS',
    teamId: 'team_social_media',
    isCoordinator: false
  },
  {
    id: 'member_barbarah',
    name: 'Barbarah',
    email: 'barbarah@byb.ag',
    role: 'Diretora de Operações',
    teamId: 'team_automations_crm',
    isCoordinator: true,
    supervisedDepartmentIds: ['design', 'paid_media', 'content_seo', 'social_media', 'automations_crm']
  },
  {
    id: 'member_lucas',
    name: 'Lucas Benitez',
    email: 'lucas@byb.ag',
    role: 'Copywriter Sênior',
    teamId: 'team_content_seo',
    isCoordinator: false
  },
  {
    id: 'member_emma',
    name: 'Emma Watson',
    email: 'emma@byb.ag',
    role: 'Designer UI/UX',
    teamId: 'team_design',
    isCoordinator: true,
    supervisedDepartmentIds: ['design']
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c_3be',
    name: '3BE',
    status: 'Active',
    ranking: 'D',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Lucas Benitez',
      designer: 'Emma Watson',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'am@3be.com.br',
    marketApproach: 'B2B',
    segment: 'Marketing & Indústria',
    communicationObjectives: 'Alavancar leads via tráfego pago e configurar réguas de automação de marketing integradas comercialmente.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads'],
      automations_crm: ['automacao']
    },
    notes: 'Contatos adicionais: ec@3be.com.br',
    createdAt: new Date().toISOString(),
    satisfactionRating: 3,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_7m_boots',
    name: '7M Boots',
    status: 'Active',
    ranking: 'D',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@7mboots.com.br',
    marketApproach: 'B2C',
    segment: 'Moda & Calçados',
    communicationObjectives: 'Atração de clientes para e-commerce de calçados de couro, implementando canais automatizados do BYB Conversas.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads'],
      automations_crm: ['byb_conversas']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 3,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_aditek',
    name: 'Aditek',
    status: 'Active',
    ranking: 'A',
    responsibles: {
      serviceLiaison: 'Maurício',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Maurício',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@aditek.com.br',
    marketApproach: 'B2B',
    segment: 'Saúde & Odontologia',
    communicationObjectives: 'Geração de leads corporativos qualificados interessados em tecnologia ortodôntica de ponta, acoplada a fluxos automatizados.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads'],
      automations_crm: ['automacao']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 4,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_andreza_castro',
    name: 'Andreza Castro',
    status: 'Active',
    ranking: 'D',
    responsibles: {
      serviceLiaison: 'Ed',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Unassigned',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@andrezacastro.com.br',
    marketApproach: 'B2C',
    segment: 'Moda & Estilo',
    communicationObjectives: 'Crescimento de presença nas redes sociais promovendo peças de moda autoral combinada com campanhas de captação localizada (Física e E-commerce).',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      social_media: ['scripts_reels', 'editorial_calendar'],
      paid_media: ['meta_ads']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 4,
    customFields: {
      'col_operand': 'https://app4.operand.com.br/projetos/388/'
    }
  },
  {
    id: 'c_angel_aligner',
    name: 'Angel Aligner',
    status: 'Active',
    ranking: 'A',
    responsibles: {
      serviceLiaison: 'Maurício',
      writer: 'Unassigned',
      designer: 'Emma Watson',
      paidTrafficHandler: 'Maurício',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@angelaligner.com.br',
    marketApproach: 'B2B',
    segment: 'Equipamento Médico',
    communicationObjectives: 'Posicionamento premium institucional para cirurgiões dentistas credenciados de todo o país, otimizando canais de tráfego, automação e SEO orgânico.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads', 'google_ads'],
      automations_crm: ['automacao'],
      content_seo: ['seo_content']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 4,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_aubra_joias',
    name: 'Aubra Joias',
    status: 'Active',
    ranking: 'C',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@aubrajoias.com.br',
    marketApproach: 'B2C',
    segment: 'Joias & Acessórios',
    communicationObjectives: 'Aumentar a conversão de e-commerce e faturamento expandindo públicos frios no Meta Ads.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 4,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_aurea_derma',
    name: 'Aurea Dermatologia',
    status: 'Active',
    ranking: 'A',
    responsibles: {
      serviceLiaison: 'Maurício',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Maurício',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'francisamado@somahub.com.br',
    marketApproach: 'B2C',
    segment: 'Saúde & Estética',
    communicationObjectives: 'Atração de pacientes altamente qualificados na clínica dermatológica trabalhando criativos avançados, SEO local e nutrição no CRM.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads', 'google_ads'],
      content_seo: ['seo_content'],
      automations_crm: ['automacao']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 4, 
    customFields: {
      'col_operand': 'https://app3.operand.com.br/cliente/92'
    }
  },
  {
    id: 'c_avora',
    name: 'Avora',
    status: 'Active',
    ranking: 'B',
    responsibles: {
      serviceLiaison: 'Clara',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Unassigned',
      socialMedia: 'Clara'
    },
    contactEmail: 'contato@avora.com.br',
    marketApproach: 'B2C',
    segment: 'Cosméticos & Beleza',
    communicationObjectives: 'Incrementar interações em lançamentos capilares via Instagram orgânico, somando esforços em campanhas patrocinadas direcionadas.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads'],
      social_media: ['scripts_reels', 'editorial_calendar']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 3,
    customFields: {
      'col_operand': 'https://app4.operand.com.br/projetos/389/'
    }
  },
  {
    id: 'c_bt_creditos',
    name: 'BT Créditos',
    status: 'Active',
    ranking: 'A',
    responsibles: {
      serviceLiaison: 'Maurício',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Maurício',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@btcreditos.com.br',
    marketApproach: 'B2B',
    segment: 'Serviços Financeiros',
    communicationObjectives: 'Estruturação de portais corporativos de crédito, captação orgânica via SEO e campanhas assertivas em mídias de alta conversão.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      content_seo: ['seo_content'],
      social_media: ['scripts_reels', 'editorial_calendar'],
      paid_media: ['meta_ads', 'google_ads']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 3,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_byb',
    name: 'BYB',
    status: 'Active',
    ranking: 'A',
    responsibles: {
      serviceLiaison: 'Clara',
      writer: 'Lucas Benitez',
      designer: 'Emma Watson',
      paidTrafficHandler: 'Unassigned',
      socialMedia: 'Clara'
    },
    contactEmail: 'contato@byb.ag',
    marketApproach: 'B2B',
    segment: 'Marketing & Comunicação',
    communicationObjectives: 'Casa de ferreiro, espeto de ferro! Desenvolver e consolidar todos os canais institucionais, mídias orgânicas, conversões pagas e nossa própria infraestrutura de produtos.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      social_media: ['scripts_reels', 'editorial_calendar'],
      automations_crm: ['automacao', 'byb_conversas'],
      paid_media: ['meta_ads', 'google_ads'],
      content_seo: ['seo_content'],
      design: ['social_media_assets', 'web_design']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 2,
    customFields: {
      'col_operand': 'https://app4.operand.com.br/projetos/393/'
    }
  },
  {
    id: 'c_ce_g',
    name: 'C&G',
    status: 'Active',
    ranking: 'C',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@ceg.com.br',
    marketApproach: 'B2B',
    segment: 'Comércio & Indústria',
    communicationObjectives: 'Otimizar investimentos publicitários no Google/Meta para geração de leads comerciais diretos.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads', 'google_ads']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 4,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_cafe_ponta',
    name: 'Café Ponta da Serra',
    status: 'Active',
    ranking: 'C',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@cafepontadaserra.com.br',
    marketApproach: 'B2C',
    segment: 'Alimentos & Bebidas',
    communicationObjectives: 'Campanhas geolocalizadas na região para distribuição e branding de café especial.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 4,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_carbuy',
    name: 'Carbuy',
    status: 'Active',
    ranking: 'A',
    responsibles: {
      serviceLiaison: 'Maurício',
      writer: 'Unassigned',
      designer: 'Emma Watson',
      paidTrafficHandler: 'Maurício',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@carbuy.com.br',
    marketApproach: 'B2C',
    segment: 'Automotivo',
    communicationObjectives: 'Criar e consolidar criativos e landings de conversão de leads automobilísticos interessados em negociação facilitada de carros seminovos.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      design: ['social_media_assets', 'paid_traffic_assets'],
      paid_media: ['meta_ads'],
      social_media: ['scripts_reels']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 3,
    customFields: {
      'col_operand': 'https://app4.operand.com.br/projetos/379/'
    }
  },
  {
    id: 'c_casari',
    name: 'Casari',
    status: 'Active',
    ranking: 'C',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@casari.com.br',
    marketApproach: 'B2C',
    segment: 'Imobiliário',
    communicationObjectives: 'Expandir o inventário de imóveis gerindo criativos regionais inteligentes no Meta Ads para locação e compra de imóveis.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 5,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_claudia_fernandes',
    name: 'Claudia Fernandes',
    status: 'Paused',
    ranking: 'D',
    responsibles: {
      serviceLiaison: 'Maurício',
      writer: 'Unassigned',
      designer: 'Emma Watson',
      paidTrafficHandler: 'Unassigned',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@claudiafernandes.com.br',
    marketApproach: 'B2C',
    segment: 'Arquitetura / Premium',
    communicationObjectives: 'Lançar portfólio visual com acabamento estético sofisticado no novo canal web institucional.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      design: ['web_design']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 3,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_cleaner',
    name: 'Cleaner Indústria',
    status: 'Active',
    ranking: 'D',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@cleaner.com.br',
    marketApproach: 'B2B',
    segment: 'Indústria Química',
    communicationObjectives: 'Atração de distribuidores corporativos nas regiões de atuação logística via criativos direcionados no Meta Ads.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 4,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_consed',
    name: 'Consed',
    status: 'Active',
    ranking: 'D',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'afonso.adv9@gmail.com',
    marketApproach: 'B2B',
    segment: 'Consultoria / Direito',
    communicationObjectives: 'Campanha integrada de posicionamento e captação de contatos corporativos para soluções tributárias.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      social_media: ['scripts_reels', 'editorial_calendar'],
      paid_media: ['meta_ads']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 5,
    customFields: {
      'col_operand': 'https://app4.operand.com.br/projetos/385/'
    }
  },
  {
    id: 'c_ecoflooring',
    name: 'Ecoflooring',
    status: 'Active',
    ranking: 'D',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@ecoflooring.com.br',
    marketApproach: 'B2C',
    segment: 'Construção & Lojas',
    communicationObjectives: 'Divulgação de Pisos Ecológicos e Vinílicos locais ampliando tráfego no PDV e e-commerce.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 2,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_eucalyptus',
    name: 'Eucalyptus',
    status: 'Active',
    ranking: 'D',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@eucalyptus.com.br',
    marketApproach: 'B2C',
    segment: 'Moda Alternativa',
    communicationObjectives: 'Criação de campanhas sazonais de conversão vinculadas a cronogramas ativos nas redes sociais.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads'],
      social_media: ['scripts_reels', 'editorial_calendar']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 3,
    customFields: {
      'col_operand': 'https://app4.operand.com.br/projeto/382'
    }
  },
  {
    id: 'c_fastbio',
    name: 'FastBio',
    status: 'Active',
    ranking: 'D',
    responsibles: {
      serviceLiaison: 'Barbarah',
      writer: 'Lucas Benitez',
      designer: 'Emma Watson',
      paidTrafficHandler: 'Unassigned',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'hanna@fastbio.com.br',
    marketApproach: 'B2B',
    segment: 'Biologia & Lab',
    communicationObjectives: 'Atrair pedidos de laboratórios, otimizar catálogos e reformular designs de portfólio de produtos e mídias sociais.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads'],
      design: ['social_media_assets'],
      social_media: ['scripts_reels']
    },
    notes: 'Outro contato: galetti@fastbio.com.br',
    createdAt: new Date().toISOString(),
    satisfactionRating: 2,
    customFields: {
      'col_operand': 'https://app4.operand.com.br/projetos/409/'
    }
  },
  {
    id: 'c_gold_tradu',
    name: 'Gold Traduções',
    status: 'Active',
    ranking: 'C',
    responsibles: {
      serviceLiaison: 'Clara',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Unassigned',
      socialMedia: 'Clara'
    },
    contactEmail: 'gabriel.delbello@goldlanguages.com.br',
    marketApproach: 'B2B',
    segment: 'Tradução Corporal',
    communicationObjectives: 'Reforçar presença de marca para tradução juramentada de alta relevância, mesclando publicações editoriais e canais pagos.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      social_media: ['scripts_reels', 'editorial_calendar'],
      paid_media: ['meta_ads']
    },
    notes: 'Contatos adicionais: camila.araujo@goldtraducoes.com.br, gabriel.borges@goldlanguages.com.br',
    createdAt: new Date().toISOString(),
    satisfactionRating: 3,
    customFields: {
      'col_operand': 'https://app4.operand.com.br/projeto/367'
    }
  },
  {
    id: 'c_grad',
    name: 'Grad',
    status: 'Active',
    ranking: 'B',
    responsibles: {
      serviceLiaison: 'Clara',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Unassigned',
      socialMedia: 'Clara'
    },
    contactEmail: 'contato@grad.com.br',
    marketApproach: 'B2B',
    segment: 'Tecnologia / ERP',
    communicationObjectives: 'Campanhas focadas em atração orgânica editorial junto a anúncios segmentados no Meta.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      social_media: ['scripts_reels', 'editorial_calendar'],
      paid_media: ['meta_ads']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 4,
    customFields: {
      'col_operand': 'https://app4.operand.com.br/projetos/387/'
    }
  },
  {
    id: 'c_grupo_vip',
    name: 'Grupo VIP',
    status: 'Active',
    ranking: 'A',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@grupovip.com.br',
    marketApproach: 'B2B',
    segment: 'Segurança & Monitoramento',
    communicationObjectives: 'Atração de clientes residenciais e corporativos via campanhas de tráfego ultra-locais integradas a esforços de SEO.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads', 'google_ads'],
      content_seo: ['seo_content']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 4,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_haskell',
    name: 'Haskell',
    status: 'Active',
    ranking: 'B',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@haskell.com.br',
    marketApproach: 'B2C',
    segment: 'Cosméticos Sazonais',
    communicationObjectives: 'Distribuição massiva de público e fortalecimento de posicionamento de lançamentos capilares regionais no Meta Ads.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 5,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_horientah',
    name: 'HorientaH',
    status: 'Active',
    ranking: 'D',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@horientah.com.br',
    marketApproach: 'B2C',
    segment: 'Recrutamento & Carreira',
    communicationObjectives: 'Integrar calendário orgânico corporativo no Instagram a anúncios patrocinados de vagas e fluxos de e-mail marketing / automação ativa.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads'],
      social_media: ['scripts_reels', 'editorial_calendar'],
      automations_crm: ['automacao']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 3,
    customFields: {
      'col_operand': 'https://app4.operand.com.br/projetos/405/'
    }
  },
  {
    id: 'c_instituto_indec',
    name: 'Instituto Indec',
    status: 'Active',
    ranking: 'C',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'jessicavanzolin@hotmail.com',
    marketApproach: 'B2C',
    segment: 'Treinamento & Saúde',
    communicationObjectives: 'Campanhas locais frequentes para turmas de pós-graduação e procedimentos médicos locais em tráfego segmentado.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads']
    },
    notes: 'Outros contatos: luizantoniolara@gmail.com',
    createdAt: new Date().toISOString(),
    satisfactionRating: 5,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_lu_bagulhao',
    name: 'Lu Bagulhão',
    status: 'Active',
    ranking: 'D',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@lubagulhao.com.br',
    marketApproach: 'B2C',
    segment: 'Alimentos & Festas',
    communicationObjectives: 'Ampliar fluxo comercial via Meta Ads para engajamento e captação localizada de buffet em datas festivas.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 5,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_mauricio_arias',
    name: 'Maurício Arias',
    status: 'Active',
    ranking: 'B',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@mauricioarias.com.br',
    marketApproach: 'B2C',
    segment: 'Odontologia Avançada',
    communicationObjectives: 'Consolidação de mídias de alto padrão, branding no reels e tráfego direto de pacientes qualificados integrados por SEO local.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      social_media: ['scripts_reels', 'editorial_calendar'],
      paid_media: ['meta_ads', 'google_ads'],
      content_seo: ['seo_content']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 3,
    customFields: {
      'col_operand': 'https://app4.operand.com.br/projetos/411/'
    }
  },
  {
    id: 'c_meirelles_law',
    name: 'Meirelles Law',
    status: 'Active',
    ranking: 'D',
    responsibles: {
      serviceLiaison: 'Clara',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Unassigned',
      socialMedia: 'Clara'
    },
    contactEmail: 'sergio@meirelleslaw.com',
    marketApproach: 'B2B',
    segment: 'Suporte Jurídico',
    communicationObjectives: 'Criação de artigos e posts com linguagem informativa corporativa impecável nas mídias orgânicas.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      social_media: ['scripts_reels', 'editorial_calendar']
    },
    notes: 'Outro contato: rafael@meirelleslaw.com',
    createdAt: new Date().toISOString(),
    satisfactionRating: 5,
    customFields: {
      'col_operand': 'https://app4.operand.com.br/projetos/386/'
    }
  },
  {
    id: 'c_nanosens',
    name: 'Nanosens',
    status: 'Active',
    ranking: 'C',
    responsibles: {
      serviceLiaison: 'Barbarah',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Unassigned',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@nanosens.com.br',
    marketApproach: 'B2B',
    segment: 'Tecnologia Avançada',
    communicationObjectives: 'Campanha estruturada de anúncios Meta em cobrimento geográfico junto a presença de carrosséis instrutivos orgânicos sobre semicondutores e nanotecnologia.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      social_media: ['scripts_reels', 'editorial_calendar'],
      paid_media: ['meta_ads']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 4,
    customFields: {
      'col_operand': 'https://app4.operand.com.br/projeto/381'
    }
  },
  {
    id: 'c_todo_anel',
    name: 'Todo Anel',
    status: 'Active',
    ranking: 'D',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@todoanel.com.br',
    marketApproach: 'B2C',
    segment: 'Moda Acessórios',
    communicationObjectives: 'Escalar vendas através de público frio no Meta Ads de forma contínua.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 5,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_oh_my_brazil',
    name: 'OhMy!Brazil',
    status: 'Paused',
    ranking: 'C',
    responsibles: {
      serviceLiaison: 'Maurício',
      writer: 'Unassigned',
      designer: 'Emma Watson',
      paidTrafficHandler: 'Unassigned',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@ohmybrazil.com',
    marketApproach: 'B2C',
    segment: 'Branding / Consultoria',
    communicationObjectives: 'Revisão estratégica da arquitetura web de marca junto ao crivo de SEO básico.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      content_seo: ['seo_content'],
      design: ['web_design']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 4,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_omnik',
    name: 'Omnik',
    status: 'Active',
    ranking: 'B',
    responsibles: {
      serviceLiaison: 'Clara',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Unassigned',
      socialMedia: 'Clara'
    },
    contactEmail: 'matheus.pedralli@omnik.com.br',
    marketApproach: 'B2B',
    segment: 'Tecnologia / Software',
    communicationObjectives: 'Atrair decisores de e-commerce e varejo, combinando produção orgânica frequente de alto valor técnico e otimizações de cópias para busca orgânica.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      social_media: ['scripts_reels', 'editorial_calendar'],
      content_seo: ['seo_content']
    },
    notes: 'Outro contato: heloisa.gentil@omnik.com.br',
    createdAt: new Date().toISOString(),
    satisfactionRating: 3,
    customFields: {
      'col_operand': 'https://app4.operand.com.br/projetos/391/'
    }
  },
  {
    id: 'c_polotrial',
    name: 'Polotrial',
    status: 'Active',
    ranking: 'C',
    responsibles: {
      serviceLiaison: 'Clara',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Unassigned',
      socialMedia: 'Clara'
    },
    contactEmail: 'gabriela@polotrial.com',
    marketApproach: 'B2C',
    segment: 'Vestuário / E-commerce',
    communicationObjectives: 'Engajamento de canais sociais e cronograma mensal recorrente de posts corporativos.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      social_media: ['scripts_reels', 'editorial_calendar']
    },
    notes: 'Outros contatos: emersonaredes@polotrial.com, patricia@polotrial.com',
    createdAt: new Date().toISOString(),
    satisfactionRating: 4,
    customFields: {
      'col_operand': 'https://app4.operand.com.br/projetos/390/'
    }
  },
  {
    id: 'c_senziani',
    name: 'Senziani',
    status: 'Active',
    ranking: 'C',
    responsibles: {
      serviceLiaison: 'Clara',
      writer: 'Unassigned',
      designer: 'Emma Watson',
      paidTrafficHandler: 'Unassigned',
      socialMedia: 'Clara'
    },
    contactEmail: 'carolina.pacheco@senziani.com',
    marketApproach: 'B2C',
    segment: 'Decoração & Design',
    communicationObjectives: 'Design gráfico conceitual de alto nível e calendarização de lançamentos de luxo nas mídias sociais.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      design: ['social_media_assets'],
      social_media: ['scripts_reels', 'editorial_calendar']
    },
    notes: 'Outro contato: fabio.leati@senziani.com',
    createdAt: new Date().toISOString(),
    satisfactionRating: 4,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_smartmetrics',
    name: 'SmartMetrics',
    status: 'Paused',
    ranking: 'C',
    responsibles: {
      serviceLiaison: 'Maurício',
      writer: 'Unassigned',
      designer: 'Emma Watson',
      paidTrafficHandler: 'Unassigned',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@smartmetrics.com',
    marketApproach: 'B2B',
    segment: 'Tecnologia / Métricas',
    communicationObjectives: 'Design de novas telas institucionais de conversão integrado com plano de atração orgânica via blogs corporativos.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      content_seo: ['seo_content'],
      design: ['web_design']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 4,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_teddy_love',
    name: 'Teddy to Love',
    status: 'Active',
    ranking: 'D',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'thalitazaffalon@gmail.com',
    marketApproach: 'B2C',
    segment: 'Moda Infantil',
    communicationObjectives: 'Implementação de campanhas pontuais no Meta Ads de alta distribuição para captação direta de mães e famílias no e-commerce.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads']
    },
    notes: 'Outro contato: contato@teddytolove.com.br',
    createdAt: new Date().toISOString(),
    satisfactionRating: 2,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_usual_brinq',
    name: 'Usual Brinquedos',
    status: 'Active',
    ranking: 'A',
    responsibles: {
      serviceLiaison: 'Maurício',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Maurício',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@usualbrinquedos.com.br',
    marketApproach: 'B2C',
    segment: 'Brinquedos & Lazer',
    communicationObjectives: 'Estruturação de criativos periódicos Meta junto com calendarização de lançamentos e distribuição em pontos de revenda física e e-commerce.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads', 'google_ads'],
      social_media: ['scripts_reels', 'editorial_calendar']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 3,
    customFields: {
      'col_operand': 'https://app4.operand.com.br/projetos/380/'
    }
  },
  {
    id: 'c_varejao_rodas',
    name: 'Varejão das Rodas',
    status: 'Active',
    ranking: 'D',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Unassigned',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'varejaodasrodaserodiziosbh@gmail.com',
    marketApproach: 'B2C',
    segment: 'Auto Peças / Rodas',
    communicationObjectives: 'Campanhas regionais Meta Ads e desenvolvimento contínuo de fluxo orgânico de mídias para expandir visibilidade do catálogo físico de rodas e rodízios.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads'],
      social_media: ['scripts_reels', 'editorial_calendar']
    },
    notes: 'Outros contatos: fabiorabelo@varejaodasrodaserodizios.com.br, fabiopinhorabelo93@gmail.com',
    createdAt: new Date().toISOString(),
    satisfactionRating: 5,
    customFields: {
      'col_operand': ''
    }
  },
  {
    id: 'c_vitta',
    name: 'Vitta',
    status: 'Active',
    ranking: 'A',
    responsibles: {
      serviceLiaison: 'Glauber Moraes',
      writer: 'Unassigned',
      designer: 'Emma Watson',
      paidTrafficHandler: 'Glauber Moraes',
      socialMedia: 'Unassigned'
    },
    contactEmail: 'contato@vitta.com.br',
    marketApproach: 'B2C',
    segment: 'Saúde & Nutrologia',
    communicationObjectives: 'Design estético impecável de criativos de captação localizada premium na clínica, alinhando decolagem em Meta Ads de conversão direta.',
    driveFolderLink: '',
    annualPlanningLink: '',
    scope: {
      paid_media: ['meta_ads', 'google_ads'],
      design: ['paid_traffic_assets']
    },
    notes: '',
    createdAt: new Date().toISOString(),
    satisfactionRating: 3,
    customFields: {
      'col_operand': ''
    }
  }
];
