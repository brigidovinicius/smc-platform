/**
 * API Route: /api/assets/valuation
 * Calculate advisory valuation for an asset
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, requireMethod, successResponse, errorResponse } from '@/lib/api/helpers';
import type { ApiResponse } from '@/lib/api/helpers';
import { calculateValuation } from '@/lib/valuation';
import { z } from 'zod';

const ValuationRequestSchema = z.object({
  type: z.enum([
    'ECOMMERCE',
    'SAAS',
    'SOFTWARE',
    'WEBSITE_CONTENT',
    'SOCIAL_PROFILE',
    'NEWSLETTER',
    'COMMUNITY_MEMBERSHIP',
    'COURSE_INFOPRODUCT',
    'HYBRID_BUNDLE',
    'OTHER',
  ]),
  monthlyProfit: z.number().optional().nullable(),
  monthlyRevenue: z.number().optional().nullable(),
  mrr: z.number().optional().nullable(),
  arr: z.number().optional().nullable(),
  monthlyVisitors: z.number().optional().nullable(),
  emailSubscribers: z.number().optional().nullable(),
  socialFollowers: z.number().optional().nullable(),
});

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  if (!requireMethod(req, res, ['POST'])) {
    return;
  }

  // Validate request body
  const validation = ValuationRequestSchema.safeParse(req.body);
  if (!validation.success) {
    return errorResponse(
      res,
      `Validation error: ${validation.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
      400,
      'VALIDATION_ERROR'
    );
  }

  const input = validation.data;

  // Calculate valuation
  const result = calculateValuation({
    type: input.type,
    monthlyProfit: input.monthlyProfit || undefined,
    monthlyRevenue: input.monthlyRevenue || undefined,
    mrr: input.mrr || undefined,
    arr: input.arr || undefined,
    monthlyVisitors: input.monthlyVisitors || undefined,
    emailSubscribers: input.emailSubscribers || undefined,
    socialFollowers: input.socialFollowers || undefined,
  });

  return successResponse(res, result);
});

