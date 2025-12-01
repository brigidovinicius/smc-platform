'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SocialCardPreview } from './SocialCardPreview';
import { SocialCardShare } from './SocialCardShare';
import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { LanguageSelector } from './LanguageSelector';
import { LoginRequiredModal } from './LoginRequiredModal';
import { Language, getTranslation, translations, TranslationKey } from './socialCards.i18n';
import {
  SocialCardMode,
  PerformanceCardInput,
  IdentityCardInput,
  JourneyCardInput,
  InfluencerCardInput,
  DeveloperCardInput,
  SocialCardThemeId,
} from './socialCards.types';
import { buildSocialCardContent } from './socialCards.writer';
import { SOCIAL_CARD_THEMES } from './socialCards.themes';

interface SocialCardGeneratorProps {
  initialPerformanceData?: Partial<PerformanceCardInput>;
}

const STORAGE_KEY = 'socialCardGenerator_data';

export function SocialCardGenerator({ initialPerformanceData }: SocialCardGeneratorProps) {
  const { data: session } = useSession();
  const previewRef = useRef<HTMLDivElement>(null);
  
  // All state declarations first
  const [mode, setMode] = useState<SocialCardMode>('PERFORMANCE');
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<SocialCardThemeId>('NEOFINANCE');
  const [customPrimaryColor, setCustomPrimaryColor] = useState('');
  const [useCustomColors, setUseCustomColors] = useState(false);
  const [customBaseColor, setCustomBaseColor] = useState('#FFFFFF');
  const [customComplementaryColor, setCustomComplementaryColor] = useState('#F8F9FA');
  const [customAccentColor, setCustomAccentColor] = useState('#005CFF');
  const [founderPhotoUrl, setFounderPhotoUrl] = useState<string>('');
  const [businessLogoUrl, setBusinessLogoUrl] = useState<string>('');

  // Performance mode state
  const [performanceInput, setPerformanceInput] = useState<PerformanceCardInput>({
    businessName: initialPerformanceData?.businessName || '',
    niche: initialPerformanceData?.niche || '',
    mrr: initialPerformanceData?.mrr,
    marginPercent: initialPerformanceData?.marginPercent,
    churnPercent: initialPerformanceData?.churnPercent,
    growthPercent: initialPerformanceData?.growthPercent,
    valuationMin: initialPerformanceData?.valuationMin,
    valuationMax: initialPerformanceData?.valuationMax,
  });

  // Identity mode state
  const [identityInput, setIdentityInput] = useState<IdentityCardInput>({
    founderName: '',
    founderRole: '',
    businessName: '',
    tagline: '',
    painSolved: '',
    niche: '',
    targetAudience: '',
    stage: undefined,
  });

  // Journey mode state
  const [journeyInput, setJourneyInput] = useState<JourneyCardInput>({
    founderName: '',
    businessName: '',
    journeyStageTitle: '',
    journeyDescription: '',
    currentFocus: '',
    nextMilestone: '',
    mrr: undefined,
  });

  // Influencer mode state
  const [influencerInput, setInfluencerInput] = useState<InfluencerCardInput>({
    influencerName: '',
    niche: '',
    followerCount: undefined,
    engagementRate: undefined,
    platform: undefined,
    brand: '',
    tagline: '',
    achievements: '',
  });

  // Developer mode state
  const [developerInput, setDeveloperInput] = useState<DeveloperCardInput>({
    developerName: '',
    specialization: undefined,
    techStack: '',
    yearsOfExperience: undefined,
    githubStars: undefined,
    githubRepos: undefined,
    openSourceContributions: undefined,
    tagline: '',
    currentRole: '',
    languages: '',
  });

  const t = (key: TranslationKey) => getTranslation(language, key);
  
  // Helper for nested translation objects
  const getSpecializationLabel = (value: string) => {
    const options = translations[language].specializationOptions || translations.en.specializationOptions;
    return options[value as keyof typeof options] || value;
  };

  // Load saved data from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.mode) setMode(data.mode);
        if (data.performanceInput) setPerformanceInput(data.performanceInput);
        if (data.identityInput) setIdentityInput(data.identityInput);
        if (data.journeyInput) setJourneyInput(data.journeyInput);
        if (data.influencerInput) setInfluencerInput(data.influencerInput);
        if (data.developerInput) setDeveloperInput(data.developerInput);
        if (data.founderPhotoUrl) setFounderPhotoUrl(data.founderPhotoUrl);
        if (data.businessLogoUrl) setBusinessLogoUrl(data.businessLogoUrl);
        if (data.selectedThemeId) setSelectedThemeId(data.selectedThemeId);
        if (data.useCustomColors !== undefined) setUseCustomColors(data.useCustomColors);
        if (data.customBaseColor) setCustomBaseColor(data.customBaseColor);
        if (data.customComplementaryColor) setCustomComplementaryColor(data.customComplementaryColor);
        if (data.customAccentColor) setCustomAccentColor(data.customAccentColor);
        if (data.language) setLanguage(data.language);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      mode,
      performanceInput,
      identityInput,
      journeyInput,
      influencerInput,
      developerInput,
      founderPhotoUrl,
      businessLogoUrl,
      selectedThemeId,
      useCustomColors,
      customBaseColor,
      customComplementaryColor,
      customAccentColor,
      language,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [
    mode,
    performanceInput,
    identityInput,
    journeyInput,
    influencerInput,
    developerInput,
    founderPhotoUrl,
    businessLogoUrl,
    selectedThemeId,
    useCustomColors,
    customBaseColor,
    customComplementaryColor,
    customAccentColor,
    language,
  ]);

  // Save to database when user is authenticated (debounced)
  useEffect(() => {
    if (!session?.user?.email) return;

    // Debounce: wait 2 seconds after last change before saving to DB
    const timeoutId = setTimeout(async () => {
      try {
        const cardData =
          mode === 'PERFORMANCE'
            ? performanceInput
            : mode === 'IDENTITY'
            ? identityInput
            : mode === 'JOURNEY'
            ? journeyInput
            : mode === 'INFLUENCER'
            ? influencerInput
            : developerInput;

        const response = await fetch('/api/social-cards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mode,
            cardData,
            themeId: selectedThemeId,
            useCustomColors,
            customBaseColor,
            customComplementaryColor,
            customAccentColor,
            founderPhotoUrl,
            businessLogoUrl,
            language,
          }),
        });

        if (!response.ok) {
          console.error('Error saving card to database');
        }
      } catch (error) {
        console.error('Error saving card to database:', error);
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(timeoutId);
  }, [
    session,
    mode,
    performanceInput,
    identityInput,
    journeyInput,
    influencerInput,
    developerInput,
    founderPhotoUrl,
    businessLogoUrl,
    selectedThemeId,
    useCustomColors,
    customBaseColor,
    customComplementaryColor,
    customAccentColor,
    language,
  ]);

  // Generate card content based on current mode
  const cardContent = useMemo(() => {
    return buildSocialCardContent(mode, 
      mode === 'PERFORMANCE' ? performanceInput :
      mode === 'IDENTITY' ? identityInput :
      mode === 'JOURNEY' ? journeyInput :
      mode === 'INFLUENCER' ? influencerInput :
      developerInput,
      language
    );
  }, [mode, performanceInput, identityInput, journeyInput, influencerInput, developerInput, language]);

  // Copy text to clipboard
  const handleCopyText = async () => {
    const textParts = [
      cardContent.title,
      cardContent.subtitle && `\n${cardContent.subtitle}`,
      cardContent.mainMetrics &&
        cardContent.mainMetrics.length > 0 &&
        `\n\n${cardContent.mainMetrics.map((m) => `${m.label}: ${m.value}`).join('\n')}`,
      cardContent.highlight && `\n\n${cardContent.highlight}`,
      `\n\n${cardContent.footerNote}`,
    ]
      .filter(Boolean)
      .join('');

    try {
      await navigator.clipboard.writeText(textParts);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Mode Selector and Language */}
      <div className="flex items-center justify-between gap-4 border-b pb-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {(['PERFORMANCE', 'IDENTITY', 'JOURNEY', 'INFLUENCER', 'DEVELOPER'] as SocialCardMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {m === 'PERFORMANCE' 
                ? t('performance')
                : m === 'IDENTITY' 
                ? t('identity')
                : m === 'JOURNEY'
                ? t('journey')
                : t('influencer')}
            </button>
          ))}
        </div>
        <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('cardDetailsTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Performance Mode Form */}
            {mode === 'PERFORMANCE' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="perf-business-name">{t('businessName')} *</Label>
                    <HelpTooltip content={t('businessNameHint')} />
                  </div>
                  <Input
                    id="perf-business-name"
                    value={performanceInput.businessName}
                    onChange={(e) =>
                      setPerformanceInput({ ...performanceInput, businessName: e.target.value })
                    }
                    placeholder="My SaaS"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="perf-niche">{t('niche')}</Label>
                    <HelpTooltip content={t('nicheHint')} />
                  </div>
                  <Input
                    id="perf-niche"
                    value={performanceInput.niche || ''}
                    onChange={(e) =>
                      setPerformanceInput({ ...performanceInput, niche: e.target.value })
                    }
                    placeholder="B2B SaaS"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="perf-mrr">MRR ($)</Label>
                    <Input
                      id="perf-mrr"
                      type="number"
                      value={performanceInput.mrr || ''}
                      onChange={(e) =>
                        setPerformanceInput({
                          ...performanceInput,
                          mrr: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="perf-margin">Margin (%)</Label>
                    <Input
                      id="perf-margin"
                      type="number"
                      value={performanceInput.marginPercent || ''}
                      onChange={(e) =>
                        setPerformanceInput({
                          ...performanceInput,
                          marginPercent: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      placeholder="60"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="perf-churn">Churn (%)</Label>
                    <Input
                      id="perf-churn"
                      type="number"
                      value={performanceInput.churnPercent || ''}
                      onChange={(e) =>
                        setPerformanceInput({
                          ...performanceInput,
                          churnPercent: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="perf-growth">Growth (%)</Label>
                    <Input
                      id="perf-growth"
                      type="number"
                      value={performanceInput.growthPercent || ''}
                      onChange={(e) =>
                        setPerformanceInput({
                          ...performanceInput,
                          growthPercent: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      placeholder="50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="perf-val-min">Valuation Min ($)</Label>
                    <Input
                      id="perf-val-min"
                      type="number"
                      value={performanceInput.valuationMin || ''}
                      onChange={(e) =>
                        setPerformanceInput({
                          ...performanceInput,
                          valuationMin: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="perf-val-max">Valuation Max ($)</Label>
                    <Input
                      id="perf-val-max"
                      type="number"
                      value={performanceInput.valuationMax || ''}
                      onChange={(e) =>
                        setPerformanceInput({
                          ...performanceInput,
                          valuationMax: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      placeholder="100000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Identity Mode Form */}
            {mode === 'IDENTITY' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="identity-founder-name">Founder Name *</Label>
                  <Input
                    id="identity-founder-name"
                    value={identityInput.founderName}
                    onChange={(e) =>
                      setIdentityInput({ ...identityInput, founderName: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="identity-role">Founder Role</Label>
                  <Input
                    id="identity-role"
                    value={identityInput.founderRole || ''}
                    onChange={(e) =>
                      setIdentityInput({ ...identityInput, founderRole: e.target.value })
                    }
                    placeholder="Founder & CEO"
                  />
                </div>
                <div>
                  <Label htmlFor="identity-business-name">Business Name *</Label>
                  <Input
                    id="identity-business-name"
                    value={identityInput.businessName}
                    onChange={(e) =>
                      setIdentityInput({ ...identityInput, businessName: e.target.value })
                    }
                    placeholder="My Startup"
                  />
                </div>
                <div>
                  <Label htmlFor="identity-tagline">Tagline</Label>
                  <Input
                    id="identity-tagline"
                    value={identityInput.tagline || ''}
                    onChange={(e) =>
                      setIdentityInput({ ...identityInput, tagline: e.target.value })
                    }
                    placeholder="Building the future of..."
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="identity-pain-solved">{t('painSolved')}</Label>
                    <HelpTooltip content={t('painSolvedHint')} />
                  </div>
                  <Input
                    id="identity-pain-solved"
                    value={identityInput.painSolved || ''}
                    onChange={(e) =>
                      setIdentityInput({ ...identityInput, painSolved: e.target.value })
                    }
                    placeholder={language === 'pt' ? 'Ex: Problemas de gestão de tempo para freelancers' : 'E.g.: Time management problems for freelancers'}
                  />
                </div>
                <div>
                  <Label htmlFor="identity-niche">Niche</Label>
                  <Input
                    id="identity-niche"
                    value={identityInput.niche || ''}
                    onChange={(e) =>
                      setIdentityInput({ ...identityInput, niche: e.target.value })
                    }
                    placeholder="B2B SaaS"
                  />
                </div>
                <div>
                  <Label htmlFor="identity-audience">Target Audience</Label>
                  <Input
                    id="identity-audience"
                    value={identityInput.targetAudience || ''}
                    onChange={(e) =>
                      setIdentityInput({ ...identityInput, targetAudience: e.target.value })
                    }
                    placeholder="Small business owners"
                  />
                </div>
                <div>
                  <Label htmlFor="identity-stage">Stage</Label>
                  <select
                    id="identity-stage"
                    value={identityInput.stage || ''}
                    onChange={(e) =>
                      setIdentityInput({
                        ...identityInput,
                        stage: e.target.value as IdentityCardInput['stage'],
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select stage...</option>
                    <option value="IDEA">Idea stage</option>
                    <option value="MVP">MVP live</option>
                    <option value="EARLY_TRACTION">Early traction</option>
                    <option value="SCALING">Scaling</option>
                  </select>
                </div>
              </div>
            )}

            {/* Journey Mode Form */}
            {mode === 'JOURNEY' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="journey-founder-name">Founder Name</Label>
                  <Input
                    id="journey-founder-name"
                    value={journeyInput.founderName}
                    onChange={(e) =>
                      setJourneyInput({ ...journeyInput, founderName: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="journey-business-name">Business Name</Label>
                  <Input
                    id="journey-business-name"
                    value={journeyInput.businessName}
                    onChange={(e) =>
                      setJourneyInput({ ...journeyInput, businessName: e.target.value })
                    }
                    placeholder="My Startup"
                  />
                </div>
                <div>
                  <Label htmlFor="journey-stage-title">Journey Stage Title *</Label>
                  <Input
                    id="journey-stage-title"
                    value={journeyInput.journeyStageTitle}
                    onChange={(e) =>
                      setJourneyInput({ ...journeyInput, journeyStageTitle: e.target.value })
                    }
                    placeholder="First paying customer"
                  />
                </div>
                <div>
                  <Label htmlFor="journey-description">Journey Description</Label>
                  <textarea
                    id="journey-description"
                    value={journeyInput.journeyDescription || ''}
                    onChange={(e) =>
                      setJourneyInput({ ...journeyInput, journeyDescription: e.target.value })
                    }
                    placeholder="Sharing the journey of building..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="journey-focus">Current Focus</Label>
                  <Input
                    id="journey-focus"
                    value={journeyInput.currentFocus || ''}
                    onChange={(e) =>
                      setJourneyInput({ ...journeyInput, currentFocus: e.target.value })
                    }
                    placeholder="Improving onboarding"
                  />
                </div>
                <div>
                  <Label htmlFor="journey-milestone">Next Milestone</Label>
                  <Input
                    id="journey-milestone"
                    value={journeyInput.nextMilestone || ''}
                    onChange={(e) =>
                      setJourneyInput({ ...journeyInput, nextMilestone: e.target.value })
                    }
                    placeholder="100 customers"
                  />
                </div>
                <div>
                  <Label htmlFor="journey-mrr">MRR ($)</Label>
                  <Input
                    id="journey-mrr"
                    type="number"
                    value={journeyInput.mrr || ''}
                    onChange={(e) =>
                      setJourneyInput({
                        ...journeyInput,
                        mrr: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    placeholder="1000"
                  />
                </div>
              </div>
            )}

            {/* Influencer Mode Form */}
            {mode === 'INFLUENCER' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="influencer-name">Nome do Influenciador *</Label>
                  <Input
                    id="influencer-name"
                    value={influencerInput.influencerName}
                    onChange={(e) =>
                      setInfluencerInput({ ...influencerInput, influencerName: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="influencer-niche">Nicho</Label>
                  <Input
                    id="influencer-niche"
                    value={influencerInput.niche || ''}
                    onChange={(e) =>
                      setInfluencerInput({ ...influencerInput, niche: e.target.value })
                    }
                    placeholder="Tech, Lifestyle, Business"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="influencer-followers">Número de Seguidores</Label>
                    <Input
                      id="influencer-followers"
                      type="number"
                      value={influencerInput.followerCount || ''}
                      onChange={(e) =>
                        setInfluencerInput({
                          ...influencerInput,
                          followerCount: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="influencer-engagement">Taxa de Engajamento (%)</Label>
                    <Input
                      id="influencer-engagement"
                      type="number"
                      value={influencerInput.engagementRate || ''}
                      onChange={(e) =>
                        setInfluencerInput({
                          ...influencerInput,
                          engagementRate: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      placeholder="3.5"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="influencer-platform">Plataforma Principal</Label>
                  <select
                    id="influencer-platform"
                    value={influencerInput.platform || ''}
                    onChange={(e) =>
                      setInfluencerInput({
                        ...influencerInput,
                        platform: e.target.value as InfluencerCardInput['platform'],
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Selecione a plataforma...</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="TIKTOK">TikTok</option>
                    <option value="YOUTUBE">YouTube</option>
                    <option value="TWITTER">X/Twitter</option>
                    <option value="LINKEDIN">LinkedIn</option>
                    <option value="OTHER">Outra</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="influencer-brand">Marca/Parceiro</Label>
                  <Input
                    id="influencer-brand"
                    value={influencerInput.brand || ''}
                    onChange={(e) =>
                      setInfluencerInput({ ...influencerInput, brand: e.target.value })
                    }
                    placeholder="Parceiros principais"
                  />
                </div>
                <div>
                  <Label htmlFor="influencer-tagline">Tagline</Label>
                  <Input
                    id="influencer-tagline"
                    value={influencerInput.tagline || ''}
                    onChange={(e) =>
                      setInfluencerInput({ ...influencerInput, tagline: e.target.value })
                    }
                    placeholder="Criando conteúdo sobre..."
                  />
                </div>
                <div>
                  <Label htmlFor="influencer-achievements">Conquistas</Label>
                  <textarea
                    id="influencer-achievements"
                    value={influencerInput.achievements || ''}
                    onChange={(e) =>
                      setInfluencerInput({ ...influencerInput, achievements: e.target.value })
                    }
                    placeholder="Principais conquistas e marcos..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Developer Mode Form */}
            {mode === 'DEVELOPER' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="developer-name">{t('developerName')}</Label>
                    <HelpTooltip content={t('developerNameTooltip')} />
                  </div>
                  <Input
                    id="developer-name"
                    value={developerInput.developerName}
                    onChange={(e) =>
                      setDeveloperInput({ ...developerInput, developerName: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="developer-role">{t('currentRole')}</Label>
                    <HelpTooltip content={t('currentRoleTooltip')} />
                  </div>
                  <Input
                    id="developer-role"
                    value={developerInput.currentRole || ''}
                    onChange={(e) =>
                      setDeveloperInput({ ...developerInput, currentRole: e.target.value })
                    }
                    placeholder={language === 'pt' ? 'Ex: Engenheiro de Software Sênior na Google' : 'E.g.: Senior Software Engineer at Google'}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="developer-specialization">{t('specialization')}</Label>
                    <HelpTooltip content={t('specializationTooltip')} />
                  </div>
                  <select
                    id="developer-specialization"
                    value={developerInput.specialization || ''}
                    onChange={(e) =>
                      setDeveloperInput({
                        ...developerInput,
                        specialization: e.target.value as DeveloperCardInput['specialization'],
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">{language === 'pt' ? 'Selecione a especialização...' : 'Select specialization...'}</option>
                    <option value="FRONTEND">{getSpecializationLabel('frontend')}</option>
                    <option value="BACKEND">{getSpecializationLabel('backend')}</option>
                    <option value="FULLSTACK">{getSpecializationLabel('fullstack')}</option>
                    <option value="DEVOPS">{getSpecializationLabel('devops')}</option>
                    <option value="MOBILE">{getSpecializationLabel('mobile')}</option>
                    <option value="DATA_SCIENCE">{getSpecializationLabel('dataScience')}</option>
                    <option value="AI_ML">{getSpecializationLabel('aiMl')}</option>
                    <option value="OTHER">{getSpecializationLabel('other')}</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="developer-tech-stack">{t('techStack')}</Label>
                    <HelpTooltip content={t('techStackTooltip')} />
                  </div>
                  <Input
                    id="developer-tech-stack"
                    value={developerInput.techStack || ''}
                    onChange={(e) =>
                      setDeveloperInput({ ...developerInput, techStack: e.target.value })
                    }
                    placeholder={language === 'pt' ? 'Ex: React, Node.js, TypeScript' : 'E.g.: React, Node.js, TypeScript'}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="developer-languages">{t('programmingLanguages')}</Label>
                    <HelpTooltip content={t('programmingLanguagesTooltip')} />
                  </div>
                  <Input
                    id="developer-languages"
                    value={developerInput.languages || ''}
                    onChange={(e) =>
                      setDeveloperInput({ ...developerInput, languages: e.target.value })
                    }
                    placeholder={language === 'pt' ? 'Ex: JavaScript, Python, Go, Rust' : 'E.g.: JavaScript, Python, Go, Rust'}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="developer-experience">{t('yearsOfExperience')}</Label>
                      <HelpTooltip content={t('yearsOfExperienceTooltip')} />
                    </div>
                    <Input
                      id="developer-experience"
                      type="number"
                      value={developerInput.yearsOfExperience || ''}
                      onChange={(e) =>
                        setDeveloperInput({
                          ...developerInput,
                          yearsOfExperience: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="developer-github-stars">{t('githubStars')}</Label>
                      <HelpTooltip content={t('githubStarsTooltip')} />
                    </div>
                    <Input
                      id="developer-github-stars"
                      type="number"
                      value={developerInput.githubStars || ''}
                      onChange={(e) =>
                        setDeveloperInput({
                          ...developerInput,
                          githubStars: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      placeholder="1000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="developer-github-repos">{t('githubRepos')}</Label>
                      <HelpTooltip content={t('githubReposTooltip')} />
                    </div>
                    <Input
                      id="developer-github-repos"
                      type="number"
                      value={developerInput.githubRepos || ''}
                      onChange={(e) =>
                        setDeveloperInput({
                          ...developerInput,
                          githubRepos: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="developer-contributions">{t('openSourceContributions')}</Label>
                      <HelpTooltip content={t('openSourceContributionsTooltip')} />
                    </div>
                    <Input
                      id="developer-contributions"
                      type="number"
                      value={developerInput.openSourceContributions || ''}
                      onChange={(e) =>
                        setDeveloperInput({
                          ...developerInput,
                          openSourceContributions: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      placeholder="150"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="developer-tagline">{t('tagline')}</Label>
                  <Input
                    id="developer-tagline"
                    value={developerInput.tagline || ''}
                    onChange={(e) =>
                      setDeveloperInput({ ...developerInput, tagline: e.target.value })
                    }
                    placeholder={language === 'pt' ? 'Ex: Construindo soluções escaláveis' : 'E.g.: Building scalable solutions'}
                  />
                </div>
              </div>
            )}

            {/* Theme & Color Selection */}
            <div className="pt-4 border-t space-y-4">
              <div>
                <Label>{t('themePreset')}</Label>
                <select
                  value={selectedThemeId}
                  onChange={(e) => {
                    setSelectedThemeId(e.target.value as SocialCardThemeId);
                    setUseCustomColors(false);
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                  disabled={useCustomColors}
                >
                  {Object.values(SOCIAL_CARD_THEMES).map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggle para personalização */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="use-custom-colors"
                  checked={useCustomColors}
                  onChange={(e) => setUseCustomColors(e.target.checked)}
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="use-custom-colors" className="font-normal cursor-pointer">
                  Personalização extra
                </Label>
              </div>

              {/* Color Pickers - Sistema Chanel */}
              {useCustomColors && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
                  <div className="mb-3">
                    <p className="text-xs font-medium text-foreground mb-1">
                      🎨 Sistema de 3 Cores (Chanel)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Escolha 3 cores para criar uma paleta harmoniosa. Clique nas caixinhas de cores ou digite o código hexadecimal.
                    </p>
                  </div>
                  
                  {/* Cor Base */}
                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="base-color" className="text-sm font-medium">
                        Cor Base
                      </Label>
                      <HelpTooltip content="A cor base é usada como fundo principal do card. Escolha uma cor que combine bem com o texto e elementos visuais." />
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="color"
                        id="base-color"
                        value={customBaseColor}
                        onChange={(e) => setCustomBaseColor(e.target.value)}
                        className="h-12 w-20 rounded-md border-2 border-input cursor-pointer shadow-sm"
                        title="Clique para escolher a cor base"
                      />
                      <Input
                        type="text"
                        value={customBaseColor}
                        onChange={(e) => setCustomBaseColor(e.target.value)}
                        placeholder="#FFFFFF"
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>

                  {/* Cor Complementar */}
                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="complementary-color" className="text-sm font-medium">
                        Cor Complementar
                      </Label>
                      <HelpTooltip content="A cor complementar é usada em bordas, blocos de métricas e elementos secundários. Deve harmonizar com a cor base." />
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="color"
                        id="complementary-color"
                        value={customComplementaryColor}
                        onChange={(e) => setCustomComplementaryColor(e.target.value)}
                        className="h-12 w-20 rounded-md border-2 border-input cursor-pointer shadow-sm"
                        title="Clique para escolher a cor complementar"
                      />
                      <Input
                        type="text"
                        value={customComplementaryColor}
                        onChange={(e) => setCustomComplementaryColor(e.target.value)}
                        placeholder="#F8F9FA"
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>

                  {/* Cor com Acento */}
                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="accent-color" className="text-sm font-medium">
                        Cor com Acento
                      </Label>
                      <HelpTooltip content="A cor com acento é usada para destacar elementos importantes como avatares, highlights e botões. Escolha uma cor vibrante que chame atenção." />
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="color"
                        id="accent-color"
                        value={customAccentColor}
                        onChange={(e) => setCustomAccentColor(e.target.value)}
                        className="h-12 w-20 rounded-md border-2 border-input cursor-pointer shadow-sm"
                        title="Clique para escolher a cor com acento"
                      />
                      <Input
                        type="text"
                        value={customAccentColor}
                        onChange={(e) => setCustomAccentColor(e.target.value)}
                        placeholder="#005CFF"
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Fallback: Custom Primary Color (legacy) */}
              {!useCustomColors && (
                <div>
                  <Label htmlFor="custom-color">Cor Primária Customizada (opcional)</Label>
                  <Input
                    id="custom-color"
                    type="text"
                    value={customPrimaryColor}
                    onChange={(e) => setCustomPrimaryColor(e.target.value)}
                    placeholder="#005CFF"
                  />
                </div>
              )}
            </div>

            {/* Photo/Logo Upload */}
            <div className="pt-4 border-t space-y-4">
              <div>
                <Label htmlFor="founder-photo">Foto do Fundador</Label>
                <div className="mt-2">
                  <input
                    id="founder-photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFounderPhotoUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setFounderPhotoUrl('');
                      }
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground hover:file:bg-accent cursor-pointer"
                  />
                  {founderPhotoUrl && (
                    <div className="mt-2 relative inline-block">
                      <img
                        src={founderPhotoUrl}
                        alt="Founder preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-input"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFounderPhotoUrl('');
                          const input = document.getElementById('founder-photo') as HTMLInputElement;
                          if (input) input.value = '';
                        }}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-destructive/90"
                        title="Remover foto"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="business-logo">Logo da Empresa</Label>
                <div className="mt-2">
                  <input
                    id="business-logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setBusinessLogoUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setBusinessLogoUrl('');
                      }
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground hover:file:bg-accent cursor-pointer"
                  />
                  {businessLogoUrl && (
                    <div className="mt-2 relative inline-block">
                      <img
                        src={businessLogoUrl}
                        alt="Logo preview"
                        className="w-16 h-16 rounded-lg object-cover border-2 border-input"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setBusinessLogoUrl('');
                          const input = document.getElementById('business-logo') as HTMLInputElement;
                          if (input) input.value = '';
                        }}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-destructive/90"
                        title="Remover logo"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Copy Button */}
                <Button onClick={handleCopyText} className="w-full" variant="outline">
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {t('copied')}
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      {t('copyText')}
                    </>
                  )}
                </Button>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('preview')}</CardTitle>
            </CardHeader>
            <CardContent>
              <SocialCardPreview
                ref={previewRef}
                content={cardContent}
                mode={mode}
                founderPhotoUrl={founderPhotoUrl || undefined}
                businessLogoUrl={businessLogoUrl || undefined}
                themeId={useCustomColors ? undefined : selectedThemeId}
                customPrimaryColor={!useCustomColors ? (customPrimaryColor || undefined) : undefined}
                customBaseColor={useCustomColors ? customBaseColor : undefined}
                customComplementaryColor={useCustomColors ? customComplementaryColor : undefined}
                customAccentColor={useCustomColors ? customAccentColor : undefined}
              />
              
              <SocialCardShare
                cardElementRef={previewRef}
                cardTitle={cardContent.title}
                cardDescription={cardContent.shortCaption}
                language={language}
                isAuthenticated={!!session}
                onRequireLogin={() => setShowLoginModal(true)}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        language={language}
      />
    </div>
  );
}

