/**
 * Middlewares para API Routes
 * Funções reutilizáveis para processar requisições
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiResponse } from './helpers';

/**
 * Rate limiting simples em memória
 * ⚠️ Para produção, use Redis ou serviço dedicado
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Limpa entradas expiradas do rate limit
 */
function cleanExpiredEntries() {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < now) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * Rate limiting simples
 * @param maxRequests Número máximo de requisições
 * @param windowMs Janela de tempo em milissegundos
 */
export function rateLimit(maxRequests: number = 100, windowMs: number = 60 * 1000) {
  return (req: NextApiRequest, res: NextApiResponse<ApiResponse>): boolean => {
    // Limpar entradas expiradas periodicamente
    if (Math.random() < 0.1) {
      cleanExpiredEntries();
    }

    const identifier = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const key = `${identifier}-${req.url}`;
    const now = Date.now();

    const record = rateLimitMap.get(key);

    if (!record || record.resetTime < now) {
      // Nova janela
      rateLimitMap.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (record.count >= maxRequests) {
      res.status(429).json({
        success: false,
        error: 'Muitas requisições. Tente novamente mais tarde.',
        code: 'RATE_LIMIT_EXCEEDED'
      });
      return false;
    }

    record.count++;
    return true;
  };
}

/**
 * CORS simples
 * Para produção, configure adequadamente
 */
export function cors(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedOrigins: string[] = ['*']
) {
  const origin = req.headers.origin;

  if (allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return false;
  }

  return true;
}

/**
 * Logging de requisições
 */
export function logRequest(req: NextApiRequest) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
}

