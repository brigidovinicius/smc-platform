import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { apiHandler, requireMethod, successResponse, errorResponse } from '@/lib/api';
import type { ApiResponse } from '@/lib/api';
import type { PreviewMode } from '@/lib/preview-mode';
import { PREVIEW_MODE_COOKIE, PREVIEW_MODE_DEFAULT, getPreviewModeFromCookie } from '@/lib/preview-mode';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  // Only allow POST
  if (!requireMethod(req, res, ['POST'])) {
    return;
  }

  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return errorResponse(res, 'Unauthorized', 401, 'UNAUTHORIZED');
  }

  // Check if user is admin
  const user = session.user as { role?: string } | undefined;
  const userRole = user?.role ? String(user.role).toLowerCase() : '';
  if (userRole !== 'admin') {
    return errorResponse(res, 'Only admins can use preview mode', 403, 'FORBIDDEN');
  }

  // Validate mode
  const { mode } = req.body;
  if (mode !== 'admin' && mode !== 'user') {
    return errorResponse(res, 'Invalid mode. Must be "admin" or "user"', 400, 'VALIDATION_ERROR');
  }

  // Set cookie
  const cookieValue = mode as PreviewMode;
  const maxAge = 60 * 60 * 24; // 24 hours
  
  // Set cookie with proper attributes
  const cookieString = `${PREVIEW_MODE_COOKIE}=${cookieValue}; Path=/; Max-Age=${maxAge}; SameSite=Lax; HttpOnly=false; Secure=${process.env.NODE_ENV === 'production' ? 'true' : 'false'}`;
  
  res.setHeader('Set-Cookie', cookieString);

  // Also return the mode in the response
  return successResponse(res, { mode: cookieValue }, 200);
});

