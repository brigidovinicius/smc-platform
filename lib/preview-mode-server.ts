/**
 * Preview Mode Server Helpers
 * 
 * Utilities for checking preview mode in Server Components
 */

import { cookies } from 'next/headers';
import type { PreviewMode } from './preview-mode';
import { PREVIEW_MODE_COOKIE, PREVIEW_MODE_DEFAULT, getPreviewModeFromCookie } from './preview-mode';

/**
 * Get preview mode from server-side cookies
 */
export async function getServerPreviewMode(): Promise<PreviewMode> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(PREVIEW_MODE_COOKIE)?.value;
  return getPreviewModeFromCookie(cookieValue);
}

/**
 * Check if user is in user preview mode (server-side)
 */
export async function isServerUserPreviewMode(): Promise<boolean> {
  const mode = await getServerPreviewMode();
  return mode === 'user';
}

/**
 * Check if user is in admin preview mode (server-side)
 */
export async function isServerAdminPreviewMode(): Promise<boolean> {
  const mode = await getServerPreviewMode();
  return mode === 'admin';
}

