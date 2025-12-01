export type Language = 'en' | 'pt';

export const translations = {
  en: {
    pageTitle: 'Social Card Generator',
    pageDescription: 'Create shareable cards about your business: performance, identity, or journey. Customize colors, add photos, and share your achievements.',
    cardDetailsTitle: 'Share who you are, your product, and your numbers',
    
    // Modes
    performance: 'Performance',
    identity: 'Identity',
    journey: 'Journey',
    influencer: 'Influencer',
    developer: 'Developer',
    
    // Theme
    themePreset: 'Theme',
    extraCustomization: 'Extra Customization',
    system3Colors: '3-Color System (Chanel)',
    system3ColorsDesc: 'Choose 3 colors to create a harmonious palette. Click on the color boxes or type the hex code.',
    baseColor: 'Base Color',
    baseColorTooltip: 'The base color is used as the main background of the card. Choose a color that works well with text and visual elements.',
    complementaryColor: 'Complementary Color',
    complementaryColorTooltip: 'The complementary color is used for borders, metric blocks, and secondary elements. Should harmonize with the base color.',
    accentColor: 'Accent Color',
    accentColorTooltip: 'The accent color is used to highlight important elements like avatars, highlights, and buttons. Choose a vibrant color that catches attention.',
    customPrimaryColor: 'Custom Primary Color (optional)',
    
    // Photo/Logo
    founderPhoto: 'Founder Photo',
    businessLogo: 'Business Logo',
    
    // Performance mode
    businessName: 'Business Name',
    businessNameHint: 'Enter your business or product name',
    niche: 'Niche',
    nicheHint: 'e.g., B2B SaaS, E-commerce, FinTech',
    mrr: 'MRR ($)',
    mrrHint: 'Monthly Recurring Revenue in USD',
    margin: 'Margin (%)',
    marginHint: 'Profit margin percentage',
    churn: 'Churn (%)',
    churnHint: 'Monthly customer churn rate',
    growth: 'Growth (%)',
    growthHint: 'Monthly growth rate',
    valuationMin: 'Valuation Min ($)',
    valuationMinHint: 'Minimum estimated valuation',
    valuationMax: 'Valuation Max ($)',
    valuationMaxHint: 'Maximum estimated valuation',
    
    // Identity mode
    founderName: 'Founder Name',
    founderNameHint: 'Your full name or founder name',
    founderRole: 'Founder Role',
    founderRoleHint: 'e.g., Founder & CEO, Co-founder, Creator',
    tagline: 'Tagline',
    taglineHint: 'A short, memorable description of your business',
    painSolved: 'What pain do you solve?',
    painSolvedHint: 'Describe the main problem or pain point your business solves for customers',
    targetAudience: 'Target Audience',
    targetAudienceHint: 'Who is your ideal customer? e.g., Small business owners, Freelancers',
    stage: 'Stage',
    stageOptions: {
      idea: 'Idea stage',
      mvp: 'MVP live',
      earlyTraction: 'Early traction',
      scaling: 'Scaling',
    },
    
    // Journey mode
    journeyStageTitle: 'Journey Stage Title',
    journeyDescription: 'Journey Description',
    currentFocus: 'Current Focus',
    nextMilestone: 'Next Milestone',
    
    // Influencer mode
    influencerName: 'Influencer Name',
    followers: 'Number of Followers',
    engagementRate: 'Engagement Rate (%)',
    platform: 'Main Platform',
    platformOptions: {
      instagram: 'Instagram',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      twitter: 'X/Twitter',
      linkedin: 'LinkedIn',
      other: 'Other',
    },
    brand: 'Brand/Partner',
    achievements: 'Achievements',
    
    // Developer mode
    softwareDeveloper: 'Software Developer',
    isA: 'is a',
    specializedIn: 'specialized in',
    with: 'with',
    years: 'years',
    ofExperience: 'of experience',
    developerHighlight: 'Building innovative solutions through code.',
    developerName: 'Developer Name',
    developerNameTooltip: 'Your name or GitHub username.',
    specialization: 'Specialization',
    specializationTooltip: 'Your area of expertise in software development.',
    specializationOptions: {
      frontend: 'Frontend Developer',
      backend: 'Backend Developer',
      fullstack: 'Full Stack Developer',
      devops: 'DevOps Engineer',
      mobile: 'Mobile Developer',
      dataScience: 'Data Scientist',
      aiMl: 'AI/ML Engineer',
      other: 'Other',
    },
    techStack: 'Tech Stack',
    techStackTooltip: 'Main technologies and frameworks you work with (e.g., React, Node.js, TypeScript).',
    yearsOfExperience: 'Years of Experience',
    yearsOfExperienceTooltip: 'How many years have you been programming professionally?',
    githubStars: 'GitHub Stars',
    githubStarsTooltip: 'Total number of stars across your GitHub repositories.',
    githubRepos: 'GitHub Repositories',
    githubReposTooltip: 'Number of public repositories you maintain.',
    openSourceContributions: 'Open Source Contributions',
    openSourceContributionsTooltip: 'Number of contributions to open source projects.',
    programmingLanguages: 'Programming Languages',
    programmingLanguagesTooltip: 'Languages you code in (e.g., JavaScript, Python, Go, Rust).',
    currentRole: 'Current Role',
    currentRoleTooltip: 'Your current job title and company (e.g., Senior Software Engineer at Google).',
    
    // Actions
    copyText: 'Copy Text',
    copied: 'Copied!',
    preview: 'Preview',
    shareOnSocial: 'Share on social media',
    createPost: 'Create Post',
    downloadForInstagram: 'Download for Instagram',
    
    // Footer
    madeWithLove: 'Made with 💜 for founders by CounterX',
  },
  pt: {
    pageTitle: 'Gerador de Cards Sociais',
    pageDescription: 'Crie cards compartilháveis sobre seu negócio: performance, identidade ou jornada. Personalize cores, adicione fotos e compartilhe suas conquistas.',
    cardDetailsTitle: 'Compartilhe Quem é você, seu produto e seus números',
    
    // Modes
    performance: 'Performance',
    identity: 'Identidade',
    journey: 'Jornada',
    influencer: 'Influenciador',
    developer: 'Desenvolvedor',
    
    // Theme
    themePreset: 'Tema',
    extraCustomization: 'Personalização extra',
    system3Colors: 'Sistema de 3 Cores (Chanel)',
    system3ColorsDesc: 'Escolha 3 cores para criar uma paleta harmoniosa. Clique nas caixinhas de cores ou digite o código hexadecimal.',
    baseColor: 'Cor Base',
    baseColorTooltip: 'A cor base é usada como fundo principal do card. Escolha uma cor que combine bem com o texto e elementos visuais.',
    complementaryColor: 'Cor Complementar',
    complementaryColorTooltip: 'A cor complementar é usada em bordas, blocos de métricas e elementos secundários. Deve harmonizar com a cor base.',
    accentColor: 'Cor com Acento',
    accentColorTooltip: 'A cor com acento é usada para destacar elementos importantes como avatares, highlights e botões. Escolha uma cor vibrante que chame atenção.',
    customPrimaryColor: 'Cor Primária Customizada (opcional)',
    
    // Photo/Logo
    founderPhoto: 'Foto do Fundador',
    businessLogo: 'Logo da Empresa',
    
    // Performance mode
    businessName: 'Nome do Negócio',
    businessNameHint: 'Digite o nome do seu negócio ou produto',
    niche: 'Nicho',
    nicheHint: 'Ex: B2B SaaS, E-commerce, FinTech',
    mrr: 'MRR ($)',
    mrrHint: 'Receita Recorrente Mensal em dólares',
    margin: 'Margem (%)',
    marginHint: 'Percentual de margem de lucro',
    churn: 'Churn (%)',
    churnHint: 'Taxa mensal de cancelamento de clientes',
    growth: 'Crescimento (%)',
    growthHint: 'Taxa de crescimento mensal',
    valuationMin: 'Valuation Mínimo ($)',
    valuationMinHint: 'Valuation mínimo estimado',
    valuationMax: 'Valuation Máximo ($)',
    valuationMaxHint: 'Valuation máximo estimado',
    
    // Identity mode
    founderName: 'Nome do Fundador',
    founderNameHint: 'Seu nome completo ou nome do fundador',
    founderRole: 'Cargo do Fundador',
    founderRoleHint: 'Ex: Fundador & CEO, Co-fundador, Criador',
    tagline: 'Tagline',
    taglineHint: 'Uma descrição curta e memorável do seu negócio',
    painSolved: 'Qual dor você resolve?',
    painSolvedHint: 'Descreva o principal problema ou dor que seu negócio resolve para os clientes',
    targetAudience: 'Público-alvo',
    targetAudienceHint: 'Quem é seu cliente ideal? Ex: Pequenos empresários, Freelancers',
    stage: 'Estágio',
    stageOptions: {
      idea: 'Fase de ideia',
      mvp: 'MVP lançado',
      earlyTraction: 'Tração inicial',
      scaling: 'Escalando',
    },
    
    // Journey mode
    journeyStageTitle: 'Título da Etapa da Jornada',
    journeyDescription: 'Descrição da Jornada',
    currentFocus: 'Foco Atual',
    nextMilestone: 'Próximo Marco',
    
    // Influencer mode
    influencerName: 'Nome do Influenciador',
    followers: 'Número de Seguidores',
    engagementRate: 'Taxa de Engajamento (%)',
    platform: 'Plataforma Principal',
    platformOptions: {
      instagram: 'Instagram',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      twitter: 'X/Twitter',
      linkedin: 'LinkedIn',
      other: 'Outra',
    },
    brand: 'Marca/Parceiro',
    achievements: 'Conquistas',
    
    // Developer mode
    softwareDeveloper: 'Desenvolvedor de Software',
    isA: 'é um',
    specializedIn: 'especializado em',
    with: 'com',
    years: 'anos',
    ofExperience: 'de experiência',
    developerHighlight: 'Construindo soluções inovadoras através de código.',
    developerName: 'Nome do Desenvolvedor',
    developerNameTooltip: 'Seu nome ou username do GitHub.',
    specialization: 'Especialização',
    specializationTooltip: 'Sua área de expertise em desenvolvimento de software.',
    specializationOptions: {
      frontend: 'Desenvolvedor Frontend',
      backend: 'Desenvolvedor Backend',
      fullstack: 'Desenvolvedor Full Stack',
      devops: 'Engenheiro DevOps',
      mobile: 'Desenvolvedor Mobile',
      dataScience: 'Cientista de Dados',
      aiMl: 'Engenheiro de IA/ML',
      other: 'Outro',
    },
    techStack: 'Stack Tecnológica',
    techStackTooltip: 'Principais tecnologias e frameworks com os quais você trabalha (ex: React, Node.js, TypeScript).',
    yearsOfExperience: 'Anos de Experiência',
    yearsOfExperienceTooltip: 'Quantos anos você programa profissionalmente?',
    githubStars: 'Estrelas no GitHub',
    githubStarsTooltip: 'Total de estrelas em seus repositórios no GitHub.',
    githubRepos: 'Repositórios no GitHub',
    githubReposTooltip: 'Número de repositórios públicos que você mantém.',
    openSourceContributions: 'Contribuições Open Source',
    openSourceContributionsTooltip: 'Número de contribuições para projetos open source.',
    programmingLanguages: 'Linguagens de Programação',
    programmingLanguagesTooltip: 'Linguagens que você programa (ex: JavaScript, Python, Go, Rust).',
    currentRole: 'Cargo Atual',
    currentRoleTooltip: 'Seu cargo atual e empresa (ex: Engenheiro de Software Sênior na Google).',
    
    // Actions
    copyText: 'Copiar Texto',
    copied: 'Copiado!',
    preview: 'Preview',
    shareOnSocial: 'Compartilhar nas redes sociais',
    createPost: 'Criar Post',
    downloadForInstagram: 'Baixar para Instagram',
    
    // Footer
    madeWithLove: 'Feito para founders com carinho por CounterX',
  },
};

// Excluir chaves que são objetos
type StringTranslationKeys = {
  [K in keyof typeof translations.en]: typeof translations.en[K] extends string ? K : never;
}[keyof typeof translations.en];

export type TranslationKey = StringTranslationKeys;

export function getTranslation(lang: Language, key: TranslationKey): string {
  const value = translations[lang][key];
  if (typeof value === 'string') {
    return value;
  }
  const fallback = translations.en[key];
  if (typeof fallback === 'string') {
    return fallback;
  }
  return String(key);
}

