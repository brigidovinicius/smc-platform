import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

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

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl.replace(/\/$/, '')}/auth/verify?token=${token}`;

  const transport = getTransporter();
  if (!transport) {
    console.warn('[email] SMTP settings missing, verification link:', verificationUrl);
    return false;
  }

  await transport.sendMail({
    from: process.env.EMAIL_FROM || 'SaaS Market Cap <no-reply@smc-platform.com>',
    to: email,
    subject: 'Confirme seu cadastro no SaaS Market Cap',
    text: `Bem-vindo(a)! Confirme seu e-mail acessando: ${verificationUrl}`,
    html: `
      <p>Bem-vindo(a) ao SaaS Market Cap!</p>
      <p>Para ativar sua conta, clique no botão abaixo:</p>
      <p><a href="${verificationUrl}" style="display:inline-block;padding:12px 20px;border-radius:8px;background:#6c5ce7;color:#ffffff;text-decoration:none;">Verificar e-mail</a></p>
      <p>Ou copie e cole este link no navegador: <br />${verificationUrl}</p>
    `
  });

  return true;
}
