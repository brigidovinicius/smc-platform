/**
 * Advisory Valuation Engine
 * 
 * Provides suggestive valuation ranges based on asset type and financial metrics.
 * These are ADVISORY ONLY - founders always control the asking price.
 */

import { AssetType } from './assetTypes';

export interface ValuationInput {
  type: AssetType | string;
  monthlyProfit?: number;
  monthlyRevenue?: number;
  mrr?: number;
  arr?: number;
  monthlyVisitors?: number;
  emailSubscribers?: number;
  socialFollowers?: number;
}

export interface ValuationResult {
  suggestedMin: number | null;
  suggestedMax: number | null;
  explanation: string;
}

/**
 * Calculate advisory valuation range based on asset type and metrics
 */
export function calculateValuation(input: ValuationInput): ValuationResult {
  const { type, monthlyProfit, monthlyRevenue, mrr, arr } = input;

  // Try to derive monthly profit from revenue if not provided
  const effectiveMonthlyProfit = monthlyProfit || 
    (monthlyRevenue ? monthlyRevenue * 0.3 : null); // Assume ~30% margin if revenue only

  // Use MRR for SaaS if available, otherwise calculate from ARR
  const effectiveMRR = mrr || (arr ? arr / 12 : null);

  switch (type) {
    case AssetType.ECOMMERCE:
      if (!effectiveMonthlyProfit) {
        return {
          suggestedMin: null,
          suggestedMax: null,
          explanation: 'Valuation requires basic revenue/profit data.',
        };
      }
      // Ecommerce: 2-4x monthly profit
      return {
        suggestedMin: effectiveMonthlyProfit * 2,
        suggestedMax: effectiveMonthlyProfit * 4,
        explanation: 'Ecommerce businesses typically sell for 2-4x monthly profit, depending on growth, traffic quality, and scalability.',
      };

    case AssetType.SAAS:
      if (!effectiveMRR) {
        return {
          suggestedMin: null,
          suggestedMax: null,
          explanation: 'Valuation requires MRR or ARR data for SaaS assets.',
        };
      }
      // SaaS: 3-6x MRR
      return {
        suggestedMin: effectiveMRR * 3,
        suggestedMax: effectiveMRR * 6,
        explanation: 'SaaS businesses typically sell for 3-6x MRR, depending on churn, growth rate, and customer quality.',
      };

    case AssetType.SOFTWARE:
      if (!effectiveMRR && !effectiveMonthlyProfit) {
        return {
          suggestedMin: null,
          suggestedMax: null,
          explanation: 'Valuation requires MRR or monthly profit data.',
        };
      }
      // Software: Use MRR if available, otherwise profit-based
      if (effectiveMRR) {
        return {
          suggestedMin: effectiveMRR * 2.5,
          suggestedMax: effectiveMRR * 5,
          explanation: 'Software businesses typically sell for 2.5-5x MRR, slightly lower than SaaS due to potentially less recurring nature.',
        };
      }
      return {
        suggestedMin: effectiveMonthlyProfit! * 3,
        suggestedMax: effectiveMonthlyProfit! * 5,
        explanation: 'Software businesses typically sell for 3-5x monthly profit.',
      };

    case AssetType.WEBSITE_CONTENT:
      if (!effectiveMonthlyProfit) {
        return {
          suggestedMin: null,
          suggestedMax: null,
          explanation: 'Valuation requires monthly profit data.',
        };
      }
      // Content sites: 10-20x monthly profit
      return {
        suggestedMin: effectiveMonthlyProfit * 10,
        suggestedMax: effectiveMonthlyProfit * 20,
        explanation: 'Content websites typically sell for 10-20x monthly profit, depending on traffic quality, SEO authority, and monetization stability.',
      };

    case AssetType.SOCIAL_PROFILE:
      if (!effectiveMonthlyProfit) {
        return {
          suggestedMin: null,
          suggestedMax: null,
          explanation: 'Valuation requires monthly profit data.',
        };
      }
      // Social profiles: 12-30x monthly profit
      return {
        suggestedMin: effectiveMonthlyProfit * 12,
        suggestedMax: effectiveMonthlyProfit * 30,
        explanation: 'Social media profiles typically sell for 12-30x monthly profit, depending on follower quality, engagement rate, and niche.',
      };

    case AssetType.NEWSLETTER:
      if (!effectiveMonthlyProfit) {
        return {
          suggestedMin: null,
          suggestedMax: null,
          explanation: 'Valuation requires monthly profit data.',
        };
      }
      // Newsletters: 15-30x monthly profit
      return {
        suggestedMin: effectiveMonthlyProfit * 15,
        suggestedMax: effectiveMonthlyProfit * 30,
        explanation: 'Newsletters typically sell for 15-30x monthly profit, depending on subscriber quality, open rates, and revenue diversification.',
      };

    case AssetType.COMMUNITY_MEMBERSHIP:
      if (!effectiveMonthlyProfit) {
        return {
          suggestedMin: null,
          suggestedMax: null,
          explanation: 'Valuation requires monthly profit data.',
        };
      }
      // Communities: 12-24x monthly profit
      return {
        suggestedMin: effectiveMonthlyProfit * 12,
        suggestedMax: effectiveMonthlyProfit * 24,
        explanation: 'Communities typically sell for 12-24x monthly profit, depending on member retention, engagement, and growth potential.',
      };

    case AssetType.COURSE_INFOPRODUCT:
      if (!effectiveMonthlyProfit) {
        return {
          suggestedMin: null,
          suggestedMax: null,
          explanation: 'Valuation requires monthly profit data.',
        };
      }
      // Courses/Info products: 10-20x monthly profit
      return {
        suggestedMin: effectiveMonthlyProfit * 10,
        suggestedMax: effectiveMonthlyProfit * 20,
        explanation: 'Courses and info products typically sell for 10-20x monthly profit, depending on content quality, sales velocity, and evergreen nature.',
      };

    case AssetType.HYBRID_BUNDLE:
      // Hybrid: Combine relevant rules and return wider range
      if (effectiveMRR) {
        return {
          suggestedMin: effectiveMRR * 2,
          suggestedMax: effectiveMRR * 7,
          explanation: 'Hybrid bundles combine multiple asset types. Valuation ranges are wider (2-7x MRR) depending on the mix of components.',
        };
      }
      if (effectiveMonthlyProfit) {
        return {
          suggestedMin: effectiveMonthlyProfit * 5,
          suggestedMax: effectiveMonthlyProfit * 25,
          explanation: 'Hybrid bundles combine multiple asset types. Valuation ranges are wider (5-25x monthly profit) depending on the mix of components.',
        };
      }
      return {
        suggestedMin: null,
        suggestedMax: null,
        explanation: 'Valuation requires basic revenue/profit data.',
      };

    case AssetType.OTHER:
      // Generic fallback: 6-18x monthly profit
      if (!effectiveMonthlyProfit) {
        return {
          suggestedMin: null,
          suggestedMax: null,
          explanation: 'Valuation requires basic revenue/profit data.',
        };
      }
      return {
        suggestedMin: effectiveMonthlyProfit * 6,
        suggestedMax: effectiveMonthlyProfit * 18,
        explanation: 'Generic digital assets typically sell for 6-18x monthly profit. Actual valuation depends heavily on asset specifics.',
      };

    default:
      return {
        suggestedMin: null,
        suggestedMax: null,
        explanation: 'Invalid asset type or insufficient data for valuation.',
      };
  }
}

/**
 * Format valuation result for display
 */
export function formatValuationRange(result: ValuationResult): string {
  if (!result.suggestedMin || !result.suggestedMax) {
    return 'Valuation not available';
  }
  return `$${formatCurrency(result.suggestedMin)} – $${formatCurrency(result.suggestedMax)}`;
}

/**
 * Format currency for display
 */
function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}k`;
  }
  return amount.toFixed(0);
}



