import type { Lead, Asset } from '@prisma/client';
import { recordLeadEvent } from '@/lib/context7';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

interface LeadWithAsset extends Lead {
  asset?: Pick<Asset, 'id' | 'title' | 'slug'> & { ownerId?: string };
}

/**
 * Handle side effects after creating a new lead.
 * 
 * - Logs the lead creation
 * - Records analytics event
 * - Sends notification email to asset owner (if email is available)
 * - Optionally notifies admins
 */
export async function handleNewLeadSideEffects(lead: LeadWithAsset) {
  // Log lead creation
  // eslint-disable-next-line no-console
  console.log('[Lead] New lead created', {
    id: lead.id,
    assetId: lead.assetId,
    assetSlug: lead.asset?.slug,
    email: lead.email,
    status: lead.status,
  });

  // Record analytics event
  await recordLeadEvent({
    leadId: lead.id,
    assetId: lead.assetId,
    email: lead.email,
    status: lead.status,
    metadata: {
      assetSlug: lead.asset?.slug,
      assetTitle: lead.asset?.title
    }
  }).catch((error) => {
    // Don't fail if analytics fails
    console.error('[Lead] Error recording analytics event:', error);
  });

  // Load asset with owner if not provided
  let asset = lead.asset;
  if (!asset || !asset.ownerId) {
    const fullAsset = await prisma.asset.findUnique({
      where: { id: lead.assetId },
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

    if (!fullAsset) {
      console.error('[Lead] Asset not found for lead:', lead.id);
      return;
    }

    asset = {
      id: fullAsset.id,
      title: fullAsset.title,
      slug: fullAsset.slug,
      ownerId: fullAsset.ownerId,
    };
  }

  // Send notification email to asset owner
  if (asset.ownerId) {
    try {
      const owner = await prisma.user.findUnique({
        where: { id: asset.ownerId },
        select: {
          email: true,
          name: true,
        },
      });

      if (owner?.email) {
        // Send email notification (placeholder - implement actual email template)
        await sendEmail({
          to: owner.email,
          subject: `New Lead for ${asset.title}`,
          html: `
            <h2>New Lead Received</h2>
            <p>You have received a new lead for your asset: <strong>${asset.title}</strong></p>
            <p><strong>Lead Details:</strong></p>
            <ul>
              <li>Name: ${lead.name}</li>
              <li>Email: ${lead.email}</li>
              <li>Message: ${lead.message}</li>
            </ul>
            <p>Please log in to your dashboard to view and manage this lead.</p>
          `,
        }).catch((error) => {
          // Log but don't fail if email fails
          console.error('[Lead] Error sending notification email:', error);
        });
      }
    } catch (error) {
      // Log but don't fail if owner lookup fails
      console.error('[Lead] Error loading asset owner:', error);
    }
  }

  // Optionally notify admins (for now, just log)
  // In the future, this could send a notification to admin dashboard or email
  console.log('[Lead] Admin notification would be sent here for lead:', lead.id);
}


