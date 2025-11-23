import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, requireMethod, getUserFromSession, successResponse } from '@/lib/api';
import { getFavoriteOfferIds } from '@/lib/services/favorites';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  // Validar método HTTP
  if (!requireMethod(req, res, ['GET'])) {
    return;
  }

  // Buscar usuário autenticado
  const user = await getUserFromSession(req, res);
  if (!user) return;

  // Buscar favoritos
  const favoriteIds = await getFavoriteOfferIds(user.id);
  return successResponse(res, { favoriteIds });
});

