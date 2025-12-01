'use client';

import React from 'react';
import { SocialCardContent, SocialCardMode, SocialCardThemeId } from './socialCards.types';
import { getSocialCardTheme } from './socialCards.themes';

interface SocialCardPreviewProps {
  content: SocialCardContent;
  mode: SocialCardMode;
  founderPhotoUrl?: string;
  businessLogoUrl?: string;
  themeId?: SocialCardThemeId;
  customPrimaryColor?: string;
  customBaseColor?: string;
  customComplementaryColor?: string;
  customAccentColor?: string;
}

export const SocialCardPreview = React.forwardRef<HTMLDivElement, SocialCardPreviewProps>(
  function SocialCardPreview(
    {
      content,
      mode,
      founderPhotoUrl,
      businessLogoUrl,
      themeId,
      customPrimaryColor,
      customBaseColor,
      customComplementaryColor,
      customAccentColor,
    },
    ref
  ) {
  const resolvedTheme = getSocialCardTheme(themeId ?? content.themeId ?? 'NEOFINANCE');
  
  // Se há cores customizadas (3 cores do sistema Chanel), usar elas
  const hasCustomColors = customBaseColor || customComplementaryColor || customAccentColor;
  
  // Cor base (background principal)
  const backgroundColor = customBaseColor && customBaseColor.trim() !== ''
    ? customBaseColor
    : resolvedTheme.backgroundColor;

  // Cor complementar (elementos secundários, bordas, fundo suave)
  const complementaryColor = customComplementaryColor && customComplementaryColor.trim() !== ''
    ? customComplementaryColor
    : resolvedTheme.softBackgroundColor;

  // Cor com acento (elementos destacados, botões, highlights)
  const accentColor = customAccentColor && customAccentColor.trim() !== ''
    ? customAccentColor
    : (customPrimaryColor && customPrimaryColor.trim() !== ''
      ? customPrimaryColor
      : resolvedTheme.primaryColor);

  // Texto: se background é escuro, texto claro; se claro, texto escuro
  const getContrastColor = (bgColor: string): string => {
    if (!bgColor) return '#0A0A0A';
    try {
      // Remove # se presente e garante 6 caracteres
      let hex = bgColor.replace('#', '').trim();
      if (hex.length === 3) {
        // Expande cores de 3 dígitos para 6
        hex = hex.split('').map(char => char + char).join('');
      }
      if (hex.length !== 6) {
        return '#0A0A0A'; // Fallback
      }
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128 ? '#0A0A0A' : '#FFFFFF';
    } catch {
      return '#0A0A0A'; // Fallback em caso de erro
    }
  };

  const textColor = hasCustomColors
    ? getContrastColor(backgroundColor)
    : resolvedTheme.textColor;

  const secondaryTextColor = hasCustomColors
    ? getContrastColor(complementaryColor)
    : resolvedTheme.secondaryTextColor;

  // Get initials for avatar fallback
  const getInitials = (title: string) => {
    const words = title.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return title.slice(0, 2).toUpperCase();
  };

  const avatarInitials = getInitials(content.title);

  return (
    <div
      ref={ref}
      className="aspect-square rounded-3xl border-2 shadow-xl p-8 flex flex-col relative overflow-hidden"
      style={{
        backgroundColor: backgroundColor || '#FFFFFF',
        color: textColor || '#0A0A0A',
        borderColor: complementaryColor || '#F8F9FA',
        boxShadow: `0 20px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px ${complementaryColor || '#F8F9FA'}40`,
      }}
    >
      {/* Decorative gradient overlay for depth */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${accentColor} 0%, transparent 50%)`,
        }}
      />
      {/* Header */}
      <div className="flex items-start gap-4 mb-6 relative z-10">
        {/* Avatar/Logo with enhanced styling - Photo has priority over logo */}
        <div className="flex-shrink-0">
          {founderPhotoUrl ? (
            <div
              className="w-20 h-20 rounded-full overflow-hidden shadow-xl"
              style={{ 
                border: `4px solid ${accentColor || '#005CFF'}`,
                boxShadow: `0 8px 20px ${accentColor || '#005CFF'}50, 0 0 0 4px ${accentColor || '#005CFF'}15`,
              }}
            >
              <img
                src={founderPhotoUrl}
                alt="Founder photo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : businessLogoUrl ? (
            <div
              className="w-14 h-14 rounded-xl overflow-hidden shadow-lg"
              style={{ 
                border: `2px solid ${accentColor || '#005CFF'}`,
                boxShadow: `0 4px 12px ${accentColor || '#005CFF'}40`,
              }}
            >
              <img
                src={businessLogoUrl}
                alt="Business logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl shadow-xl"
              style={{
                backgroundColor: accentColor || '#005CFF',
                color: getContrastColor(accentColor || '#005CFF'),
                boxShadow: `0 8px 20px ${accentColor || '#005CFF'}50`,
              }}
            >
              {avatarInitials}
            </div>
          )}
        </div>

        {/* Title and Subtitle with improved typography */}
        <div className="flex-1 min-w-0">
          <h2
            className="text-2xl font-bold mb-2 leading-tight"
            style={{ color: textColor }}
          >
            {content.title}
          </h2>
          {content.subtitle && (
            <p
              className="text-sm font-medium leading-relaxed"
              style={{ color: secondaryTextColor }}
            >
              {content.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Metrics with enhanced styling */}
      {content.mainMetrics && content.mainMetrics.length > 0 && (
        <div
          className="rounded-xl p-5 mb-5 relative z-10"
          style={{ 
            backgroundColor: complementaryColor ? `${complementaryColor}CC` : 'rgba(248, 249, 250, 0.8)',
            border: `1px solid ${complementaryColor ? `${complementaryColor}80` : 'rgba(248, 249, 250, 0.5)'}`,
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            {content.mainMetrics.map((metric, idx) => (
              <div key={idx} className="flex flex-col">
                <span
                  className="text-xs font-medium mb-2 uppercase tracking-wider"
                  style={{ color: secondaryTextColor }}
                >
                  {metric.label}
                </span>
                <span
                  className="text-2xl font-bold leading-tight"
                  style={{ color: textColor }}
                >
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Highlight with enhanced styling */}
      {content.highlight && (
        <div
          className="rounded-xl p-5 mb-5 flex-1 flex items-center justify-center text-center relative z-10"
          style={{
            backgroundColor: accentColor || '#005CFF',
            color: getContrastColor(accentColor || '#005CFF'),
            boxShadow: `0 4px 16px ${accentColor || '#005CFF'}30`,
          }}
        >
          <p className="text-base font-semibold leading-relaxed px-2">{content.highlight}</p>
        </div>
      )}

      {/* Footer with subtle branding */}
      <div 
        className="mt-auto pt-4 border-t relative z-10" 
        style={{ 
          borderColor: complementaryColor ? `${complementaryColor}60` : 'rgba(248, 249, 250, 0.4)',
        }}
      >
        <p
          className="text-xs text-center font-medium"
          style={{ 
            color: secondaryTextColor,
            opacity: 0.8,
          }}
        >
          {content.footerNote}
        </p>
      </div>
    </div>
  );
});

