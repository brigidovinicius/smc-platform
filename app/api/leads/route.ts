import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateEmail, validateName } from '@/lib/api/validators';
import { handleNewLeadSideEffects } from '@/lib/leads/sideEffects';
import { getAdminSession } from '@/lib/auth/admin';
import { normalizeLeadBuyerType, normalizeLeadStatus } from '@/lib/leads/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { assetId, assetSlug, name, email, buyerType, budgetRange, message, source } = body ?? {};

    if (!assetId && !assetSlug) {
      return NextResponse.json(
        { success: false, error: 'assetId ou assetSlug é obrigatório' },
        { status: 400 },
      );
    }

    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return NextResponse.json({ success: false, error: nameValidation.error }, { status: 400 });
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json({ success: false, error: emailValidation.error }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Mensagem é obrigatória e deve ter pelo menos 10 caracteres' },
        { status: 400 },
      );
    }

    const asset = await prisma.asset.findFirst({
      where: assetId
        ? { id: assetId, status: 'PUBLISHED' }
        : { slug: assetSlug, status: 'PUBLISHED' },
      select: { id: true, title: true, slug: true },
    });

    if (!asset) {
      return NextResponse.json(
        { success: false, error: 'Ativo não encontrado ou indisponível' },
        { status: 404 },
      );
    }

    const lead = await prisma.lead.create({
      data: {
        assetId: asset.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        buyerType: normalizeLeadBuyerType(buyerType),
        budgetRange: budgetRange?.toString().trim() || null,
        message: message.trim(),
        status: 'NEW',
        source: source?.toString().trim() || 'marketplace',
      },
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

    await handleNewLeadSideEffects(lead);

    return NextResponse.json({ success: true, data: { lead } }, { status: 201 });
  } catch (error) {
    console.error('[Lead] Failed to create lead', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar lead. Tente novamente em instantes.' },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusParam = normalizeLeadStatus(searchParams.get('status'));
    const assetId = searchParams.get('assetId');
    const slug = searchParams.get('assetSlug');

    const where: any = {};
    if (statusParam) {
      where.status = statusParam;
    }
    if (assetId) {
      where.assetId = assetId;
    }
    if (slug) {
      where.asset = { slug };
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
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lead.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        leads,
        total,
      },
    });
  } catch (error) {
    console.error('[Lead] Failed to list leads', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao carregar leads' },
      { status: 500 },
    );
  }
}

