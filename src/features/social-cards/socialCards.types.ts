export type SocialCardMode = 'PERFORMANCE' | 'IDENTITY' | 'JOURNEY' | 'INFLUENCER' | 'DEVELOPER';

export interface PerformanceCardInput {
  businessName: string;
  niche?: string;
  mrr?: number;
  marginPercent?: number;
  churnPercent?: number;
  growthPercent?: number;
  valuationMin?: number;
  valuationMax?: number;
}

export interface IdentityCardInput {
  founderName: string;
  founderRole?: string; // e.g. "Founder & CEO"
  businessName: string;
  tagline?: string; // one-line pitch
  painSolved?: string; // What pain/problem do you solve?
  niche?: string;
  targetAudience?: string;
  stage?: 'IDEA' | 'MVP' | 'EARLY_TRACTION' | 'SCALING';
}

export interface JourneyCardInput {
  founderName: string;
  businessName: string;
  journeyStageTitle: string; // "First paying customer", "MVP live", etc.
  journeyDescription?: string;
  currentFocus?: string;
  nextMilestone?: string;
  mrr?: number; // optional
}

export interface InfluencerCardInput {
  influencerName: string;
  niche?: string;
  followerCount?: number;
  engagementRate?: number;
  platform?: 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE' | 'TWITTER' | 'LINKEDIN' | 'OTHER';
  brand?: string;
  tagline?: string;
  achievements?: string;
}

export interface DeveloperCardInput {
  developerName: string;
  specialization?: 'FRONTEND' | 'BACKEND' | 'FULLSTACK' | 'DEVOPS' | 'MOBILE' | 'DATA_SCIENCE' | 'AI_ML' | 'OTHER';
  techStack?: string; // e.g. "React, Node.js, TypeScript"
  yearsOfExperience?: number;
  githubStars?: number;
  githubRepos?: number;
  openSourceContributions?: number;
  tagline?: string; // e.g. "Building scalable web applications"
  currentRole?: string; // e.g. "Senior Software Engineer at Company"
  languages?: string; // e.g. "JavaScript, Python, Go"
}

export interface SocialCardContent {
  title: string;
  subtitle?: string;
  mainMetrics?: { label: string; value: string }[];
  highlight?: string;
  footerNote: string;
  shortCaption?: string;
  longCaption?: string;
  themeId?: SocialCardThemeId;
}

export type SocialCardThemeId = 'NEOFINANCE' | 'DARK' | 'LIGHT_MINIMAL' | 'VIBRANT';

export interface SocialCardTheme {
  id: SocialCardThemeId;
  name: string;
  description?: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  softBackgroundColor: string;
  secondaryTextColor: string;
}

