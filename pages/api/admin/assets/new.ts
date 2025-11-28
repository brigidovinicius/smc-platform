import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, successResponse, errorResponse } from '@/lib/api';
import { requireAdmin } from '@/lib/api/admin';
import prisma from '@/lib/prisma';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  const session = await requireAdmin(req, res);
  if (!session) return;

  if (req.method === 'POST') {
    const {
      title,
      slug,
      shortDescription,
      fullDescription,
      type,
      askingPrice,
      currency = 'USD',
      ownerId,
      autoPublish = false,
    } = req.body;

    // Validações básicas
    if (!title || !slug || !shortDescription || !fullDescription || !type || !ownerId) {
      return errorResponse(res, 'Campos obrigatórios faltando', 400, 'VALIDATION_ERROR');
    }

    // Verificar se o owner existe
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return errorResponse(res, 'Usuário proprietário não encontrado', 404, 'OWNER_NOT_FOUND');
    }

    // Verificar se o slug já existe
    const existingAsset = await prisma.asset.findUnique({
      where: { slug },
    });

    if (existingAsset) {
      return errorResponse(res, 'Slug já existe', 400, 'SLUG_EXISTS');
    }

    // Criar asset
    const asset = await prisma.asset.create({
      data: {
        title,
        slug,
        shortDescription,
        fullDescription,
        type,
        askingPrice: parseFloat(askingPrice) || 0,
        currency,
        ownerId,
        status: autoPublish ? 'PUBLISHED' : 'DRAFT',
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log da ação admin (opcional - pode falhar se migrations não foram executadas)
    const adminId = (session.user as { id?: string })?.id;
    if (adminId) {
      try {
        await prisma.adminActionLog.create({
          data: {
            adminId,
            action: 'ASSET_CREATED',
            targetType: 'ASSET',
            targetId: asset.id,
            details: JSON.stringify({ title, slug, ownerId }),
          },
        });
      } catch (error: any) {
        // Ignorar erro se a tabela não existir (migrations não executadas)
        console.warn('[Admin] Failed to log admin action:', error?.message);
      }
    }

    return successResponse(res, asset, 201);
  }

  return errorResponse(res, 'Método não permitido', 405, 'METHOD_NOT_ALLOWED');
});

