import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

/**
 * Verifica se SMTP está configurado
 */
export function isSmtpConfigured(): boolean {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  return !!(host && port && user && pass);
}

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    }
  });
  return transporter;
};

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl.replace(/\/$/, '')}/auth/verify?token=${token}`;

    const transport = getTransporter();
    if (!transport) {
      console.warn('[email] SMTP settings missing, verification link:', verificationUrl);
      return false;
    }

    await transport.sendMail({
      from: process.env.EMAIL_FROM || 'CounterX <no-reply@counterx.io>',
      to: email,
      subject: 'Confirme seu cadastro no CounterX',
      text: `Bem-vindo(a)! Confirme seu e-mail acessando: ${verificationUrl}`,
      html: `
        <p>Bem-vindo(a) ao CounterX!</p>
        <p>Para ativar sua conta, clique no botão abaixo:</p>
        <p><a href="${verificationUrl}" style="display:inline-block;padding:12px 20px;border-radius:8px;background:#6c5ce7;color:#ffffff;text-decoration:none;">Verificar e-mail</a></p>
        <p>Ou copie e cole este link no navegador: <br />${verificationUrl}</p>
      `
    });

    return true;
  } catch (error) {
    console.error('[email] Erro ao enviar email de verificação:', error);
    return false;
  }
}

/**
 * Envia email de boas-vindas quando o cadastro é concluído
 * (usado quando SMTP está configurado mas verificação não é obrigatória)
 */
export async function sendWelcomeEmail(email: string, name?: string): Promise<boolean> {
  try {
    const transport = getTransporter();
    if (!transport) {
      console.warn('[email] SMTP settings missing, não foi possível enviar email de boas-vindas');
      return false;
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const loginUrl = `${baseUrl.replace(/\/$/, '')}/auth/login`;

    await transport.sendMail({
      from: process.env.EMAIL_FROM || 'CounterX <no-reply@counterx.io>',
      to: email,
      subject: 'Bem-vindo(a) ao CounterX!',
      text: `Olá${name ? ` ${name}` : ''}!\n\nBem-vindo(a) ao CounterX! Sua conta foi criada com sucesso.\n\nVocê já pode fazer login e começar a usar a plataforma: ${loginUrl}\n\nAtenciosamente,\nEquipe CounterX`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6c5ce7; margin-bottom: 20px;">Bem-vindo(a) ao CounterX!</h1>
          <p>Olá${name ? ` <strong>${name}</strong>` : ''}!</p>
          <p>Sua conta foi criada com sucesso. Você já pode fazer login e começar a usar a plataforma.</p>
          <p style="margin: 30px 0;">
            <a href="${loginUrl}" style="display:inline-block;padding:12px 24px;border-radius:8px;background:#6c5ce7;color:#ffffff;text-decoration:none;font-weight:bold;">Fazer Login</a>
          </p>
          <p>Ou acesse: <a href="${loginUrl}">${loginUrl}</a></p>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:30px 0;" />
          <p style="color:#666;font-size:12px;">Atenciosamente,<br />Equipe CounterX</p>
        </div>
      `
    });

    return true;
  } catch (error) {
    console.error('[email] Erro ao enviar email de boas-vindas:', error);
    return false;
  }
}

/**
 * Envia email de recuperação de senha
 */
export async function sendPasswordResetEmail(email: string, token: string, name?: string): Promise<boolean> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl.replace(/\/$/, '')}/auth/reset-password?token=${token}`;

    const transport = getTransporter();
    if (!transport) {
      console.warn('[email] SMTP settings missing, reset link:', resetUrl);
      return false;
    }

    await transport.sendMail({
      from: process.env.EMAIL_FROM || 'CounterX <no-reply@counterx.io>',
      to: email,
      subject: 'Redefinir sua senha - CounterX',
      text: `Olá${name ? ` ${name}` : ''}!\n\nVocê solicitou a redefinição de senha. Clique no link abaixo para criar uma nova senha:\n\n${resetUrl}\n\nEste link expira em 1 hora.\n\nSe você não solicitou esta redefinição, ignore este email.\n\nAtenciosamente,\nEquipe CounterX`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6c5ce7; margin-bottom: 20px;">Redefinir senha</h1>
          <p>Olá${name ? ` <strong>${name}</strong>` : ''}!</p>
          <p>Você solicitou a redefinição de senha. Clique no botão abaixo para criar uma nova senha:</p>
          <p style="margin: 30px 0;">
            <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;border-radius:8px;background:#6c5ce7;color:#ffffff;text-decoration:none;font-weight:bold;">Redefinir senha</a>
          </p>
          <p>Ou copie e cole este link no navegador:<br /><a href="${resetUrl}">${resetUrl}</a></p>
          <p style="color:#666;font-size:14px;margin-top:30px;">Este link expira em <strong>1 hora</strong>.</p>
          <p style="color:#999;font-size:12px;margin-top:20px;">Se você não solicitou esta redefinição, ignore este email.</p>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:30px 0;" />
          <p style="color:#666;font-size:12px;">Atenciosamente,<br />Equipe CounterX</p>
        </div>
      `
    });

    return true;
  } catch (error) {
    console.error('[email] Erro ao enviar email de reset de senha:', error);
    return false;
  }
}
