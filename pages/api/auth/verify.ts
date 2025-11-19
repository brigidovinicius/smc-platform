import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.query.token;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token inválido' });
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date()) {
    return res.status(400).json({ error: 'Token inválido ou expirado' });
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() }
  });

  await prisma.verificationToken.delete({ where: { token } });

  return res.redirect(302, '/auth/login?verified=1');
}
