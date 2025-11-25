import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth/admin';
import { normalizeLeadStatus } from '@/lib/leads/constants';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const status = normalizeLeadStatus(body?.status);

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status inválido' },
        { status: 400 },
      );
    }

    const lead = await prisma.lead.update({
      where: { id: params.id },
      data: { status },
      include: {
        asset: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: { lead } });
  } catch (error) {
    console.error('[Lead] Failed to update lead', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar lead' },
      { status: 500 },
    );
  }
}

