/**
 * Email Service
 * 
 * Handles all email sending functionality using Nodemailer.
 * Supports verification emails, welcome emails, and password reset emails.
 * 
 * Configuration via environment variables:
 * - SMTP_HOST: SMTP server hostname
 * - SMTP_PORT: SMTP server port (default: 587 for TLS, 465 for SSL)
 * - SMTP_USER: SMTP authentication username
 * - SMTP_PASS: SMTP authentication password
 * - EMAIL_FROM: Sender email address (default: CounterX <no-reply@counterx.io>)
 * 
 * @module lib/email
 * @example
 * import { sendVerificationEmail } from '@/lib/email';
 * await sendVerificationEmail('user@example.com', 'token123');
 */

import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

/**
 * Checks if SMTP is configured
 * @returns {boolean} True if all SMTP variables are configured
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
      subject: 'Confirm your CounterX registration',
      text: `Welcome! Confirm your email by accessing: ${verificationUrl}`,
      html: `
        <p>Welcome to CounterX!</p>
        <p>To activate your account, click the button below:</p>
        <p><a href="${verificationUrl}" style="display:inline-block;padding:12px 20px;border-radius:8px;background:#6c5ce7;color:#ffffff;text-decoration:none;">Verify email</a></p>
        <p>Or copy and paste this link into your browser: <br />${verificationUrl}</p>
      `
    });

    return true;
  } catch (error) {
    console.error('[email] Error sending verification email:', error);
    return false;
  }
}

/**
 * Sends welcome email when registration is completed
 * (used when SMTP is configured but verification is not required)
 * 
 * @param {string} email - User email
 * @param {string} [name] - User name (optional)
 * @returns {Promise<boolean>} True if email was sent successfully
 */
export async function sendWelcomeEmail(email: string, name?: string): Promise<boolean> {
  try {
    const transport = getTransporter();
    if (!transport) {
      console.warn('[email] SMTP settings missing, could not send welcome email');
      return false;
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const loginUrl = `${baseUrl.replace(/\/$/, '')}/auth/login`;

    await transport.sendMail({
      from: process.env.EMAIL_FROM || 'CounterX <no-reply@counterx.io>',
      to: email,
      subject: 'Welcome to CounterX!',
      text: `Hello${name ? ` ${name}` : ''}!\n\nWelcome to CounterX! Your account has been created successfully.\n\nYou can now log in and start using the platform: ${loginUrl}\n\nBest regards,\nCounterX Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6c5ce7; margin-bottom: 20px;">Welcome to CounterX!</h1>
          <p>Hello${name ? ` <strong>${name}</strong>` : ''}!</p>
          <p>Your account has been created successfully. You can now log in and start using the platform.</p>
          <p style="margin: 30px 0;">
            <a href="${loginUrl}" style="display:inline-block;padding:12px 24px;border-radius:8px;background:#6c5ce7;color:#ffffff;text-decoration:none;font-weight:bold;">Log In</a>
          </p>
          <p>Or access: <a href="${loginUrl}">${loginUrl}</a></p>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:30px 0;" />
          <p style="color:#666;font-size:12px;">Best regards,<br />CounterX Team</p>
        </div>
      `
    });

    return true;
  } catch (error) {
    console.error('[email] Error sending welcome email:', error);
    return false;
  }
}

/**
 * Sends password recovery email
 * 
 * @param {string} email - User email
 * @param {string} token - Password reset token
 * @param {string} [name] - User name (optional)
 * @returns {Promise<boolean>} True if email was sent successfully
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
      subject: 'Reset your password - CounterX',
      text: `Hello${name ? ` ${name}` : ''}!\n\nYou requested a password reset. Click the link below to create a new password:\n\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you did not request this reset, please ignore this email.\n\nBest regards,\nCounterX Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6c5ce7; margin-bottom: 20px;">Reset password</h1>
          <p>Hello${name ? ` <strong>${name}</strong>` : ''}!</p>
          <p>You requested a password reset. Click the button below to create a new password:</p>
          <p style="margin: 30px 0;">
            <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;border-radius:8px;background:#6c5ce7;color:#ffffff;text-decoration:none;font-weight:bold;">Reset password</a>
          </p>
          <p>Or copy and paste this link into your browser:<br /><a href="${resetUrl}">${resetUrl}</a></p>
          <p style="color:#666;font-size:14px;margin-top:30px;">This link expires in <strong>1 hour</strong>.</p>
          <p style="color:#999;font-size:12px;margin-top:20px;">If you did not request this reset, please ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:30px 0;" />
          <p style="color:#666;font-size:12px;">Best regards,<br />CounterX Team</p>
        </div>
      `
    });

    return true;
  } catch (error) {
    console.error('[email] Error sending password reset email:', error);
    return false;
  }
}
