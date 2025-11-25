/**
 * Risk & Verification Flags System
 * 
 * Automated checks that identify potential issues with asset listings.
 * Flags are advisory - they don't block submission or publishing.
 */

export type VerificationFlagSeverity = 'low' | 'medium' | 'high';

export interface VerificationFlag {
  code: string;
  severity: VerificationFlagSeverity;
  message: string;
}

export interface VerificationInput {
  type: string;
  askingPrice?: number;
  suggestedMinPrice?: number;
  suggestedMaxPrice?: number;
  monthlyRevenue?: number;
  monthlyProfit?: number;
  monthlyVisitors?: number;
  websiteUrl?: string;
  mediaCount?: number;
  createdAt?: Date;
}

/**
 * Run verification checks on an asset
 */
export function runVerificationChecks(input: VerificationInput): VerificationFlag[] {
  const flags: VerificationFlag[] = [];

  // Price vs valuation flags
  if (input.askingPrice && input.suggestedMinPrice && input.suggestedMaxPrice) {
    if (input.askingPrice > input.suggestedMaxPrice * 2) {
      flags.push({
        code: 'price_above_recommended_range',
        severity: 'medium',
        message: `Asking price ($${formatPrice(input.askingPrice)}) is more than 2x the recommended maximum ($${formatPrice(input.suggestedMaxPrice)}). This may reduce buyer interest.`,
      });
    }

    if (input.askingPrice < input.suggestedMinPrice * 0.5) {
      flags.push({
        code: 'price_below_recommended_range',
        severity: 'low',
        message: `Asking price ($${formatPrice(input.askingPrice)}) is significantly below the recommended minimum ($${formatPrice(input.suggestedMinPrice)}). Consider verifying your valuation data.`,
      });
    }
  }

  // Traffic/revenue mismatch
  if (input.monthlyRevenue && input.monthlyVisitors) {
    const revenuePerVisitor = input.monthlyRevenue / input.monthlyVisitors;
    // Very high revenue per visitor might indicate data issues
    if (input.monthlyVisitors < 1000 && input.monthlyRevenue > 10000) {
      flags.push({
        code: 'traffic_revenue_mismatch',
        severity: 'high',
        message: 'Very high revenue reported for low traffic. Please verify your metrics are accurate.',
      });
    }
  }

  // Missing proof/media
  if ((input.mediaCount || 0) === 0) {
    flags.push({
      code: 'missing_proof',
      severity: 'high',
      message: 'No media or proof documents uploaded. Buyers typically require screenshots, revenue reports, or other proof of performance.',
    });
  }

  // Type specificity
  if (input.type === 'OTHER') {
    flags.push({
      code: 'low_type_specificity',
      severity: 'low',
      message: 'Asset type is set to "Other". Consider if a more specific category would better describe your asset.',
    });
  }

  // Domain age (if websiteUrl provided, we'd need to check this externally)
  // For now, we'll skip domain age checks as they require external API calls

  // Missing key financial data
  if (!input.monthlyRevenue && !input.monthlyProfit) {
    flags.push({
      code: 'missing_financial_data',
      severity: 'medium',
      message: 'No revenue or profit data provided. Financial metrics help buyers make informed decisions.',
    });
  }

  return flags;
}

/**
 * Format price for display
 */
function formatPrice(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}k`;
  }
  return amount.toFixed(0);
}

/**
 * Get severity badge color
 */
export function getSeverityColor(severity: VerificationFlagSeverity): string {
  switch (severity) {
    case 'high':
      return 'red';
    case 'medium':
      return 'yellow';
    case 'low':
      return 'blue';
    default:
      return 'gray';
  }
}

/**
 * Sort flags by severity (high first)
 */
export function sortFlagsBySeverity(flags: VerificationFlag[]): VerificationFlag[] {
  const severityOrder = { high: 0, medium: 1, low: 2 };
  return [...flags].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}


