import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, successResponse, errorResponse } from '@/lib/api';
import { requireAdmin } from '@/lib/api/admin';
import prisma from '@/lib/prisma';
import type { ApiResponse } from '@/lib/api';

const DEFAULT_SETTINGS = {
  commissionPercentage: 5,
  premiumPlans: {
    titanium: 29,
    neodymium: 99,
    graphene: 299,
  },
  stealthModeEnabled: false,
  valuationAutoEnabled: true,
  seo: {
    title: 'CounterX - Marketplace de Assets Digitais',
    description: 'Compre e venda assets digitais prontos para escalar',
  },
  socialLinks: {},
  featureFlags: {},
};

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  const session = await requireAdmin(req, res);
  if (!session) return;

  if (req.method === 'GET') {
    // Buscar todas as settings
    const settings = await prisma.setting.findMany({
      where: {
        category: 'platform',
      },
    });

    // Transformar em objeto
    const settingsObj: any = { ...DEFAULT_SETTINGS };
    settings.forEach(setting => {
      try {
        const value = JSON.parse(setting.valueJson);
        settingsObj[setting.key] = value;
      } catch (e) {
        settingsObj[setting.key] = setting.valueJson;
      }
    });

    return successResponse(res, settingsObj);
  }

  if (req.method === 'PUT') {
    const settings = req.body;
    const adminId = (session.user as { id?: string })?.id;

    // Salvar cada setting
    for (const [key, value] of Object.entries(settings)) {
      await prisma.setting.upsert({
        where: { key },
        create: {
          key,
          valueJson: JSON.stringify(value),
          category: 'platform',
          updatedBy: adminId || undefined,
        },
        update: {
          valueJson: JSON.stringify(value),
          updatedBy: adminId || undefined,
        },
      });
    }

    // Log da ação admin (opcional - pode falhar se migrations não foram executadas)
    if (adminId) {
      try {
        await prisma.adminActionLog.create({
          data: {
            adminId,
            action: 'SETTINGS_UPDATED',
            targetType: 'SETTINGS',
            details: JSON.stringify({ keys: Object.keys(settings) }),
          },
        });
      } catch (error: any) {
        console.warn('[Admin] Failed to log admin action:', error?.message);
      }
    }

    return successResponse(res, { success: true });
  }

  return errorResponse(res, 'Método não permitido', 405, 'METHOD_NOT_ALLOWED');
});

