/**
 * API Route temporária para configurar usuário admin em produção
 * REMOVER APÓS USO!
 * 
 * Uso: POST /api/admin/setup-user
 * Body: { email: "brigido254@gmail.com", password: "admin123456" }
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Apenas em produção e com método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Senha deve ter no mínimo 8 caracteres' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    // Buscar usuário
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true },
    });

    if (!user) {
      // Criar usuário
      const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
      
      user = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: normalizedEmail,
          password: hashedPassword,
          emailVerified: new Date(),
          profile: {
            create: {
              role: 'ADMIN',
            },
          },
        },
        include: { profile: true },
      });
      
      return res.status(200).json({
        success: true,
        message: 'Usuário criado com sucesso',
        email: user.email,
        role: user.profile?.role,
      });
    } else {
      // Verificar senha
      const isValid = user.password ? await bcrypt.compare(normalizedPassword, user.password) : false;
      
      if (!isValid || !user.password) {
        // Atualizar senha
        const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
        
        await prisma.user.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            emailVerified: user.emailVerified || new Date(),
            email: normalizedEmail,
          },
        });
      }
      
      // Garantir perfil
      if (!user.profile) {
        await prisma.profile.upsert({
          where: { userId: user.id },
          update: { role: 'ADMIN' },
          create: {
            userId: user.id,
            role: 'ADMIN',
          },
        });
      } else if (user.profile.role !== 'ADMIN') {
        await prisma.profile.update({
          where: { userId: user.id },
          data: { role: 'ADMIN' },
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Usuário atualizado com sucesso',
        email: normalizedEmail,
        role: 'ADMIN',
      });
    }
  } catch (error: any) {
    console.error('Erro ao configurar usuário:', error);
    return res.status(500).json({
      error: 'Erro ao configurar usuário',
      message: error.message,
    });
  }
}

