import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, requireMethod, getUserFromSession, successResponse, errorResponse } from '@/lib/api';
import { addFavorite, removeFavorite, isFavorite } from '@/lib/services/favorites';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  // Validar método HTTP
  if (!requireMethod(req, res, ['GET', 'POST', 'DELETE'])) {
    return;
  }

  // Validar offerId
  const { offerId } = req.query;
  if (!offerId || typeof offerId !== 'string') {
    return errorResponse(res, 'offerId é obrigatório', 400, 'INVALID_OFFER_ID');
  }

  // Buscar usuário autenticado
  const user = await getUserFromSession(req, res);
  if (!user) return;

  // Processar requisição conforme método
  if (req.method === 'GET') {
    const favorited = await isFavorite(user.id, offerId);
    return successResponse(res, { favorited });
  }

  if (req.method === 'POST') {
    await addFavorite(user.id, offerId);
    return successResponse(res, { favorited: true });
  }

  if (req.method === 'DELETE') {
    await removeFavorite(user.id, offerId);
    return successResponse(res, { favorited: false });
  }
});

