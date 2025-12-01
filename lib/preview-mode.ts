/**
 * Preview Mode Helper
 * 
 * Utilities for managing admin preview mode (viewing as normal user)
 */

export type PreviewMode = 'admin' | 'user';

export const PREVIEW_MODE_COOKIE = 'preview-mode';
export const PREVIEW_MODE_DEFAULT: PreviewMode = 'admin';

/**
 * Get preview mode from cookie value
 */
export function getPreviewModeFromCookie(cookieValue: string | undefined): PreviewMode {
  if (cookieValue === 'user' || cookieValue === 'admin') {
    return cookieValue;
  }
  return PREVIEW_MODE_DEFAULT;
}

/**
 * Check if user is in user preview mode
 */
export function isUserPreviewMode(mode: PreviewMode): boolean {
  return mode === 'user';
}

/**
 * Check if user is in admin preview mode
 */
export function isAdminPreviewMode(mode: PreviewMode): boolean {
  return mode === 'admin';
}


