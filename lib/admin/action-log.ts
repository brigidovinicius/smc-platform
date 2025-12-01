/**
 * Admin Action Log Helper
 * 
 * Centralized logging for admin actions
 */

import prisma from '@/lib/prisma';

export interface AdminActionDetails {
  [key: string]: any;
}

export interface LogAdminActionParams {
  adminId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: AdminActionDetails;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log an admin action to AdminActionLog
 */
export async function logAdminAction(params: LogAdminActionParams) {
  try {
    await prisma.adminActionLog.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        targetType: params.targetType || null,
        targetId: params.targetId || null,
        details: params.details ? JSON.stringify(params.details) : null,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
      },
    });
  } catch (error) {
    // Log but don't fail the operation
    console.error('[AdminActionLog] Failed to log action:', error);
  }
}

/**
 * Log asset status change
 */
export async function logAssetStatusChange(params: {
  adminId: string;
  assetId: string;
  oldStatus: string;
  newStatus: string;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  return logAdminAction({
    adminId: params.adminId,
    action: 'asset_status_changed',
    targetType: 'ASSET',
    targetId: params.assetId,
    details: {
      oldStatus: params.oldStatus,
      newStatus: params.newStatus,
      reason: params.reason,
    },
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
  });
}


