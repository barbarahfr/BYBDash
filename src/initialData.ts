import { Client, Department, Team, TeamMember } from './types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'design',
    name: 'Design',
    color: 'purple',
    tasks: [
      { id: 'paid_traffic_assets', name: 'Paid Traffic Assets', description: 'High-converting ad banners, reels ad hooks, stories layouts, and sizes for Meta/Google.' },
      { id: 'social_media_assets', name: 'Social Media Graphics', description: 'Instagram post grids, carousel templates, LinkedIn infographics, and story banners.' },
      { id: 'offline_mats', name: 'Offline & Print Materials', description: 'Corporate brochures, exhibition flyers, offline business cards, and print collateral.' },
      { id: 'brand_kit', name: 'Brand Guide Maintenance', description: 'Color system updates, font pairings, asset logos, and template consistency.' }
    ]
  },
  {
    id: 'paid_media',
    name: 'Mídias Pagas',
    color: 'blue',
    tasks: [
      { id: 'meta_ads', name: 'Meta Ads Setup & Optim', description: 'Targeting, custom audiences, pixel setups, and daily bidding rules on FB/IG.' },
      { id: 'google_ads', name: 'Google & YouTube Search', description: 'Keyword research, negative lists, search campaign triggers, and bidding strategies.' },
      { id: 'retargeting', name: 'Retargeting Funnels', description: 'Middle-of-funnel and bottom-of-funnel customer re-engagement setups.' }
    ]
  },
  {
    id: 'content_seo',
    name: 'Conteúdo e SEO',
    color: 'emerald',
    tasks: [
      { id: 'seo_content', name: 'SEO Web copy optimization', description: 'Optimizing existing or new landing pages, product pages, and service headers.' },
      { id: 'blog_posts', name: 'Blog Posts & Blog Management', description: 'SEO blog writing, publishing pipeline management, and uploading articles.' },
      { id: 'sales_funnels', name: 'High-Converting Sales Pages', description: 'Direct-response product copy designed to maximize customer conversion.' }
    ]
  },
  {
    id: 'social_media',
    name: 'Mídias Sociais',
    color: 'rose',
    tasks: [
      { id: 'scripts_reels', name: 'Video Reels & TikTok Scripts', description: 'Hook-oriented short video storylines, audio cues, and voiceover scripts.' },
      { id: 'editorial_calendar', name: 'Editorial Grid & Content Calendar', description: 'Monthly post calendar preparation, copywriting, and timing alignment.' },
      { id: 'lead_magnets', name: 'Lead Magnets & Landing Copy', description: 'Creating copy and content for gated opt-in guides and landing pages.' }
    ]
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Aura Premium Cosmetics',
    status: 'Active',
    ranking: 'A',
    responsibles: {
      serviceLiaison: 'Sofia Alarcon (Account Lead)',
      writer: 'Lucas Benitez',
      designer: 'Emma Watson',
      paidTrafficHandler: 'Carlos Ortiz',
      socialMedia: 'Valeria Rivas'
    },
    contactEmail: 'marketing@auracosmetics.com',
    marketApproach: 'B2C',
    segment: 'Beauty & Skincare',
    communicationObjectives: 'Increase brand awareness on Instagram, optimize CPA for Black Friday campaign, and build a monthly email newsletter routine.',
    driveFolderLink: 'https://drive.google.com/drive/folders/1AuraCosmeticsMarketingAssets2026',
    annualPlanningLink: 'https://docs.google.com/spreadsheets/d/1AuraCosmeticsAnnualStrategyPlan2026',
    scope: {
      design: ['paid_traffic_assets', 'social_media_assets'],
      paid_media: ['meta_ads', 'retargeting'],
      content_seo: ['blog_posts'],
      social_media: ['scripts_reels']
    },
    createdAt: '2026-01-10T10:00:00Z',
    notes: 'Prioritize beauty visual aesthetic. The client is highly responsive via WhatsApp but expects meticulous organization on Drive folders.',
    satisfactionRating: 5
  },
  {
    id: 'c2',
    name: 'Genesis Corp SaaS',
    status: 'Active',
    ranking: 'B',
    responsibles: {
      serviceLiaison: 'Martín Gomez',
      writer: 'Lucas Benitez',
      designer: 'Alan Cooper',
      paidTrafficHandler: 'Carlos Ortiz',
      socialMedia: 'Valeria Rivas'
    },
    contactEmail: 'contact@genesis-saas.io',
    marketApproach: 'B2B',
    segment: 'Enterprise Software',
    communicationObjectives: 'Acquire qualified enterprise leads, create quarterly e-books about operations, and write technical B2B blogs for LinkedIn.',
    driveFolderLink: 'https://drive.google.com/drive/folders/1GenesisCorpSaaSDriveFileStorage',
    annualPlanningLink: 'https://docs.google.com/spreadsheets/d/1GenesisCorpAnnualPlanners2026',
    scope: {
      design: ['social_media_assets'],
      paid_media: ['meta_ads', 'google_ads'],
      content_seo: ['blog_posts', 'seo_content', 'sales_funnels'],
      social_media: ['lead_magnets']
    },
    createdAt: '2026-02-15T11:30:00Z',
    notes: 'Focus purely on lead quality and premium aesthetics. Target market is primarily Latin America and USA enterprise managers.',
    satisfactionRating: 4
  },
  {
    id: 'c3',
    name: 'Educa Online Academy',
    status: 'Onboarding',
    ranking: 'C',
    responsibles: {
      serviceLiaison: 'Sofia Alarcon (Account Lead)',
      writer: 'Valeria Rivas',
      designer: 'Emma Watson',
      paidTrafficHandler: 'Unassigned',
      socialMedia: 'Valeria Rivas'
    },
    contactEmail: 'barbara@educaonline.net',
    marketApproach: 'B2C',
    segment: 'Education / Info-products',
    communicationObjectives: 'Prepare launch resources for the upcoming Master in Web3 Strategy. Produce high yields of video script hooks and e-books.',
    driveFolderLink: 'https://drive.google.com/drive/folders/1EducaOnlineLauncherResources',
    annualPlanningLink: 'https://docs.google.com/spreadsheets/d/1EducaOnlineMasterLaunchStrategy',
    scope: {
      design: ['paid_traffic_assets', 'social_media_assets'],
      paid_media: [],
      content_seo: ['sales_funnels'],
      social_media: ['scripts_reels']
    },
    createdAt: '2026-05-01T08:00:00Z',
    notes: 'Client is transitioning into scaling traffic, butcurrently focuses heavily on pre-launch organic scripts.',
    satisfactionRating: 3
  },
  {
    id: 'c4',
    name: 'Vortex Fitness Centers',
    status: 'Paused',
    ranking: 'D',
    responsibles: {
      serviceLiaison: 'Martín Gomez',
      writer: 'Valeria Rivas',
      designer: 'Alan Cooper',
      paidTrafficHandler: 'Carlos Ortiz',
      socialMedia: ''
    },
    contactEmail: 'hq@vortexfit.com',
    marketApproach: 'B2C',
    segment: 'Fitness & Physical Gyms',
    communicationObjectives: 'Increase regional gym memberships via local geo-targeted Meta campaigns and offline flyer promos.',
    driveFolderLink: 'https://drive.google.com/drive/folders/1VortexFitnessBrandCollateral',
    annualPlanningLink: 'https://docs.google.com/spreadsheets/d/1VortexFitnessAnnualPromotionCalendar',
    scope: {
      design: ['paid_traffic_assets', 'offline_mats'],
      paid_media: ['meta_ads'],
      content_seo: [],
      social_media: []
    },
    createdAt: '2026-03-20T14:45:00Z',
    notes: 'Temporarily paused due to remodeling of main hub, expected to restart full inbound copy & social media next month.',
    satisfactionRating: 2
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team_design',
    name: 'Design',
    coordinatorId: 'member_emma'
  },
  {
    id: 'team_atendimento',
    name: 'Atendimento',
    coordinatorId: 'member_sofia'
  },
  {
    id: 'team_paid_media',
    name: 'Mídias Pagas',
    coordinatorId: 'member_carlos'
  },
  {
    id: 'team_content_seo',
    name: 'Conteúdo e SEO',
    coordinatorId: 'member_lucas'
  },
  {
    id: 'team_social_media',
    name: 'Mídias Sociais',
    coordinatorId: 'member_valeria'
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'member_sofia',
    name: 'Sofia Alarcon',
    email: 'sofia@byb.ag',
    role: 'Account Lead / Directora',
    teamId: 'team_atendimento',
    isCoordinator: true,
    supervisedDepartmentIds: ['design', 'paid_media', 'content_seo', 'social_media']
  },
  {
    id: 'member_martin',
    name: 'Martín Gomez',
    email: 'martin@byb.ag',
    role: 'Account Manager',
    teamId: 'team_atendimento',
    isCoordinator: false
  },
  {
    id: 'member_lucas',
    name: 'Lucas Benitez',
    email: 'lucas@byb.ag',
    role: 'Senior Editor & Copywriter',
    teamId: 'team_content_seo',
    isCoordinator: true,
    supervisedDepartmentIds: ['content_seo']
  },
  {
    id: 'member_emma',
    name: 'Emma Watson',
    email: 'emma@byb.ag',
    role: 'Senior UI/UX Designer',
    teamId: 'team_design',
    isCoordinator: true,
    supervisedDepartmentIds: ['design']
  },
  {
    id: 'member_alan',
    name: 'Alan Cooper',
    email: 'alan@byb.ag',
    role: 'Graphic Designer',
    teamId: 'team_design',
    isCoordinator: false
  },
  {
    id: 'member_carlos',
    name: 'Carlos Ortiz',
    email: 'carlos@byb.ag',
    role: 'Paid Traffic Specialist',
    teamId: 'team_paid_media',
    isCoordinator: true,
    supervisedDepartmentIds: ['paid_media']
  },
  {
    id: 'member_valeria',
    name: 'Valeria Rivas',
    email: 'valeria@byb.ag',
    role: 'Content Assistant',
    teamId: 'team_social_media',
    isCoordinator: true,
    supervisedDepartmentIds: ['social_media']
  }
];


