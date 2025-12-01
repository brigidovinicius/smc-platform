import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';
import { listLeads } from '@/src/core/leads/lead.service';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const assetId = searchParams.get('assetId') || undefined;

    // Get user's assets to filter leads
    const userAssets = await prisma.asset.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });
    const userAssetIds = userAssets.map((a) => a.id);

    // Get leads where user is asset owner (received) or lead creator (sent)
    // For now, we'll show leads where user is asset owner
    const where: any = {
      OR: [
        { assetId: { in: userAssetIds } }, // Leads received (user is asset owner)
        // TODO: Add leads sent (where user email matches lead email)
      ],
    };

    if (status) {
      where.status = status;
    }
    if (assetId) {
      where.assetId = assetId;
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          asset: {
            select: {
              id: true,
              title: true,
              slug: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lead.count({ where }),
    ]);

    // Separate received vs sent leads
    const received = leads.filter((lead) => userAssetIds.includes(lead.assetId));
    const userEmail = session.user.email?.toLowerCase();
    const sent = leads.filter((lead) => lead.email.toLowerCase() === userEmail);

    return NextResponse.json({
      success: true,
      data: {
        leads,
        received,
        sent,
        total,
      },
    });
  } catch (error) {
    console.error('[Leads] Failed to list user leads', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao carregar leads' },
      { status: 500 },
    );
  }
}


