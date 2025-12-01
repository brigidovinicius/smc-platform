import {
  SocialCardMode,
  PerformanceCardInput,
  IdentityCardInput,
  JourneyCardInput,
  InfluencerCardInput,
  DeveloperCardInput,
  SocialCardContent,
} from './socialCards.types';
import { Language, getTranslation, translations } from './socialCards.i18n';

function getFooterText(language: Language = 'en'): string {
  return language === 'pt' 
    ? 'Feito para founders com carinho por CounterX • counterx.io'
    : 'Made with 💜 for founders by CounterX • counterx.io';
}

export function buildPerformanceCardContent(input: PerformanceCardInput, language: Language = 'en'): SocialCardContent {
  const title = input.businessName || 'My SaaS';
  const subtitle = input.niche || 'Digital business';

  const mainMetrics: { label: string; value: string }[] = [];
  if (input.mrr != null) mainMetrics.push({ label: 'MRR', value: `$${input.mrr.toLocaleString()}` });
  if (input.marginPercent != null) mainMetrics.push({ label: 'Margin', value: `${input.marginPercent}%` });
  if (input.churnPercent != null) mainMetrics.push({ label: 'Churn', value: `${input.churnPercent}%` });
  if (input.growthPercent != null) mainMetrics.push({ label: 'Growth', value: `${input.growthPercent}%` });

  let highlight = '';
  if (input.valuationMin != null && input.valuationMax != null) {
    highlight = `Estimated valuation: $${input.valuationMin.toLocaleString()} – $${input.valuationMax.toLocaleString()}`;
  } else {
    highlight = 'Early-stage SaaS with growing potential.';
  }

  const shortCaption = `${title} is a SaaS in ${subtitle}, with recurring revenue and a market-based valuation estimate.`;

  const longCaption = `${title} is building recurring revenue in the ${subtitle} space. This snapshot summarizes current metrics and an estimated valuation range based on market multiples.\n\nGenerated with CounterX Tools • counterx.io`;

  return {
    title,
    subtitle,
    mainMetrics,
    highlight,
    footerNote: getFooterText(language),
    shortCaption,
    longCaption,
  };
}

export function buildIdentityCardContent(input: IdentityCardInput, language: Language = 'en'): SocialCardContent {
  const title = input.founderName || 'Founder';
  const subtitleParts = [];
  if (input.founderRole) subtitleParts.push(input.founderRole);
  if (input.businessName) subtitleParts.push(input.businessName);
  const subtitle = subtitleParts.join(' • ') || 'Digital founder';

  const mainMetrics: { label: string; value: string }[] = [];
  if (input.niche) mainMetrics.push({ label: 'Niche', value: input.niche });
  if (input.targetAudience) mainMetrics.push({ label: 'Audience', value: input.targetAudience });
  if (input.stage) {
    const stageLabelMap: Record<string, string> = {
      IDEA: 'Idea stage',
      MVP: 'MVP live',
      EARLY_TRACTION: 'Early traction',
      SCALING: 'Scaling',
    };
    mainMetrics.push({ label: 'Stage', value: stageLabelMap[input.stage] ?? input.stage });
  }

  const highlight = input.painSolved || input.tagline || 'Building something new in the digital space.';

  const shortCaption = `${title} is building ${input.businessName || 'a new digital product'} in the ${input.niche || 'online'} space.`;

  const longCaption = `${title}${input.founderRole ? ` (${input.founderRole})` : ''} is working on ${input.businessName || 'a new venture'} focused on ${input.niche || 'digital opportunities'}. Target audience: ${input.targetAudience || 'early adopters and niche users'}.\n\nGenerated with CounterX Tools • counterx.io`;

  return {
    title,
    subtitle,
    mainMetrics,
    highlight,
    footerNote: getFooterText(language),
    shortCaption,
    longCaption,
  };
}

export function buildJourneyCardContent(input: JourneyCardInput, language: Language = 'en'): SocialCardContent {
  const title = input.journeyStageTitle || 'Building in public';
  const subtitle = input.businessName || input.founderName || 'My journey';

  const mainMetrics: { label: string; value: string }[] = [];
  if (input.mrr != null) mainMetrics.push({ label: 'MRR', value: `$${input.mrr.toLocaleString()}` });
  if (input.currentFocus) mainMetrics.push({ label: 'Current focus', value: input.currentFocus });
  if (input.nextMilestone) mainMetrics.push({ label: 'Next milestone', value: input.nextMilestone });

  const highlight =
    input.journeyDescription ||
    'Sharing the journey of building a digital business, one step at a time.';

  const shortCaption = `${subtitle}: ${title}`;

  const longCaption = `${input.founderName || 'This founder'} is building ${input.businessName || 'a new product'} and sharing the journey openly.\n\nStage: ${title}\n${input.journeyDescription || ''}\n\nGenerated with CounterX Tools • counterx.io`;

  return {
    title,
    subtitle,
    mainMetrics,
    highlight,
    footerNote: getFooterText(language),
    shortCaption,
    longCaption,
  };
}

export function buildInfluencerCardContent(input: InfluencerCardInput, language: Language = 'en'): SocialCardContent {
  const title = input.influencerName || 'Influencer';
  const subtitle = input.niche || input.brand || 'Content Creator';

  const mainMetrics: { label: string; value: string }[] = [];
  if (input.followerCount != null) {
    const followers = input.followerCount >= 1000000
      ? `${(input.followerCount / 1000000).toFixed(1)}M`
      : input.followerCount >= 1000
      ? `${(input.followerCount / 1000).toFixed(1)}K`
      : input.followerCount.toString();
    mainMetrics.push({ label: 'Followers', value: followers });
  }
  if (input.engagementRate != null) {
    mainMetrics.push({ label: 'Engagement', value: `${input.engagementRate}%` });
  }
  if (input.platform) {
    const platformMap: Record<string, string> = {
      INSTAGRAM: 'Instagram',
      TIKTOK: 'TikTok',
      YOUTUBE: 'YouTube',
      TWITTER: 'X/Twitter',
      LINKEDIN: 'LinkedIn',
      OTHER: 'Other',
    };
    mainMetrics.push({ label: 'Platform', value: platformMap[input.platform] || input.platform });
  }

  const highlight = input.tagline || input.achievements || 'Building an engaged community and creating valuable content.';

  const shortCaption = `${title}${input.niche ? ` - ${input.niche}` : ''} influencer${input.followerCount ? ` with ${input.followerCount >= 1000000 ? (input.followerCount / 1000000).toFixed(1) + 'M' : input.followerCount >= 1000 ? (input.followerCount / 1000).toFixed(1) + 'K' : input.followerCount} followers` : ''}.`;

  const longCaption = `${title} is a content creator${input.niche ? ` in the ${input.niche} space` : ''}${input.brand ? ` partnered with ${input.brand}` : ''}. ${input.achievements || 'Building an engaged community through authentic content and meaningful connections.'}\n\nGenerated with CounterX Tools • counterx.io`;

  return {
    title,
    subtitle,
    mainMetrics,
    highlight,
    footerNote: getFooterText(language),
    shortCaption,
    longCaption,
  };
}

export function buildDeveloperCardContent(input: DeveloperCardInput, language: Language = 'en'): SocialCardContent {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
  const title = input.developerName || t('developer');
  const subtitleParts = [];
  if (input.currentRole) subtitleParts.push(input.currentRole);
  if (input.specialization) {
    const options = translations[language].specializationOptions || translations.en.specializationOptions;
    const specMap: Record<string, string> = {
      FRONTEND: options.frontend || 'Frontend Developer',
      BACKEND: options.backend || 'Backend Developer',
      FULLSTACK: options.fullstack || 'Full Stack Developer',
      DEVOPS: options.devops || 'DevOps Engineer',
      MOBILE: options.mobile || 'Mobile Developer',
      DATA_SCIENCE: options.dataScience || 'Data Scientist',
      AI_ML: options.aiMl || 'AI/ML Engineer',
      OTHER: options.other || 'Other',
    };
    subtitleParts.push(specMap[input.specialization] || input.specialization);
  }
  const subtitle = subtitleParts.join(' • ') || t('softwareDeveloper');

  const mainMetrics: { label: string; value: string }[] = [];
  if (input.yearsOfExperience != null) {
    mainMetrics.push({ label: t('yearsExperience'), value: `${input.yearsOfExperience}+ ${t('years')}` });
  }
  if (input.githubStars != null) {
    mainMetrics.push({ label: t('githubStars'), value: input.githubStars.toLocaleString() });
  }
  if (input.githubRepos != null) {
    mainMetrics.push({ label: t('githubRepos'), value: input.githubRepos.toString() });
  }
  if (input.openSourceContributions != null) {
    mainMetrics.push({ label: t('openSourceContributions'), value: input.openSourceContributions.toString() });
  }
  if (input.languages) {
    mainMetrics.push({ label: t('programmingLanguages'), value: input.languages });
  }
  if (input.techStack) {
    mainMetrics.push({ label: t('techStack'), value: input.techStack });
  }

  const highlight = input.tagline || t('developerHighlight');

  const shortCaption = `${title}${input.currentRole ? ` - ${input.currentRole}` : ''} ${input.techStack ? `• ${input.techStack}` : ''}`;

  const longCaption = `${title} ${t('isA')} ${input.specialization ? (() => {
    const options = translations[language].specializationOptions || translations.en.specializationOptions;
    const specMap: Record<string, string> = {
      FRONTEND: options.frontend || 'Frontend Developer',
      BACKEND: options.backend || 'Backend Developer',
      FULLSTACK: options.fullstack || 'Full Stack Developer',
      DEVOPS: options.devops || 'DevOps Engineer',
      MOBILE: options.mobile || 'Mobile Developer',
      DATA_SCIENCE: options.dataScience || 'Data Scientist',
      AI_ML: options.aiMl || 'AI/ML Engineer',
      OTHER: options.other || 'Other',
    };
    return specMap[input.specialization] || input.specialization;
  })() : t('softwareDeveloper')}${input.techStack ? ` ${t('specializedIn')} ${input.techStack}` : ''}${input.yearsOfExperience ? ` ${t('with')} ${input.yearsOfExperience}+ ${t('years')} ${t('ofExperience')}` : ''}.\n\n${input.tagline || ''}\n\n${getFooterText(language)}`;

  return {
    title,
    subtitle,
    mainMetrics,
    highlight,
    footerNote: getFooterText(language),
    shortCaption,
    longCaption,
  };
}

export function buildSocialCardContent(
  mode: SocialCardMode,
  input: PerformanceCardInput | IdentityCardInput | JourneyCardInput | InfluencerCardInput | DeveloperCardInput,
  language: Language = 'en'
): SocialCardContent {
  switch (mode) {
    case 'PERFORMANCE':
      return buildPerformanceCardContent(input as PerformanceCardInput, language);
    case 'IDENTITY':
      return buildIdentityCardContent(input as IdentityCardInput, language);
    case 'JOURNEY':
      return buildJourneyCardContent(input as JourneyCardInput, language);
    case 'INFLUENCER':
      return buildInfluencerCardContent(input as InfluencerCardInput, language);
    case 'DEVELOPER':
      return buildDeveloperCardContent(input as DeveloperCardInput, language);
    default:
      return {
        title: getTranslation(language, 'myBusinessSnapshot'),
        subtitle: getTranslation(language, 'generatedWithCounterXTools'),
        mainMetrics: [],
        highlight: getTranslation(language, 'digitalBusinessOverview'),
        footerNote: getFooterText(language),
      };
  }
}

