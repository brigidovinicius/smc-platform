import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';
import { apiHandler, requireAuth, successResponse, errorResponse } from '@/lib/api';
import type { ApiResponse } from '@/lib/api';

// GET: List all social cards for the authenticated user
// POST: Create a new social card
export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  const session = await requireAuth(req, res);
  if (!session) {
    return; // requireAuth já retornou o erro 401
  }

  // Get user ID
  const userEmail = session.user.email;
  if (!userEmail) {
    return errorResponse(res, 'User email not found', 400, 'VALIDATION_ERROR');
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return errorResponse(res, 'User not found', 404, 'USER_NOT_FOUND');
  }

  if (req.method === 'GET') {
    const cards = await prisma.socialCard.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(
      res,
      {
        cards: cards.map((card) => ({
          ...card,
          cardData: JSON.parse(card.cardData),
        })),
      },
      200
    );
  }

  if (req.method === 'POST') {
    const {
      mode,
      cardData,
      themeId,
      useCustomColors,
      customBaseColor,
      customComplementaryColor,
      customAccentColor,
      founderPhotoUrl,
      businessLogoUrl,
      language,
    } = req.body;

    if (!mode || !cardData) {
      return errorResponse(res, 'Mode and cardData are required', 400, 'VALIDATION_ERROR');
    }

    const validModes = ['PERFORMANCE', 'IDENTITY', 'JOURNEY', 'INFLUENCER', 'DEVELOPER'];
    if (!validModes.includes(mode)) {
      return errorResponse(res, 'Invalid mode', 400, 'VALIDATION_ERROR');
    }

    const card = await prisma.socialCard.create({
      data: {
        userId: user.id,
        mode,
        cardData: JSON.stringify(cardData),
        themeId: themeId || null,
        useCustomColors: useCustomColors || false,
        customBaseColor: customBaseColor || null,
        customComplementaryColor: customComplementaryColor || null,
        customAccentColor: customAccentColor || null,
        founderPhotoUrl: founderPhotoUrl || null,
        businessLogoUrl: businessLogoUrl || null,
        language: language || 'en',
      },
    });

    return successResponse(
      res,
      {
        card: {
          ...card,
          cardData: JSON.parse(card.cardData),
        },
      },
      201
    );
  }

  return errorResponse(res, 'Method not allowed', 405, 'METHOD_NOT_ALLOWED');
});

