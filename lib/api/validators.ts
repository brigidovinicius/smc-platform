/**
 * Validadores para APIs
 * Validação de dados de entrada com TypeScript
 */

/**
 * Lista de domínios de email temporários/descartáveis conhecidos
 * Fonte: https://github.com/disposable-email-domains/disposable-email-domains
 */
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  // Serviços temporários populares
  '10minutemail.com',
  '10minutemail.de',
  '10minutemail.net',
  '20minutemail.com',
  '33mail.com',
  'guerrillamail.com',
  'guerrillamailblock.com',
  'guerrillamail.de',
  'guerrillamail.info',
  'guerrillamail.net',
  'guerrillamail.org',
  'mailinator.com',
  'tempmail.com',
  'tempmail.de',
  'tempmail.org',
  'throwaway.email',
  'trashmail.com',
  'yopmail.com',
  'getnada.com',
  'mohmal.com',
  'maildrop.cc',
  'sharklasers.com',
  'grr.la',
  'guerrillamail.biz',
  'pokemail.net',
  'spam4.me',
  'bccto.me',
  'chacuo.net',
  'dispostable.com',
  'emailondeck.com',
  'fakeinbox.com',
  'fakemailgenerator.com',
  'mailcatch.com',
  'mailmoat.com',
  'meltmail.com',
  'mintemail.com',
  'mytrashmail.com',
  'nada.email',
  'nospam.ze.tc',
  'nowmymail.com',
  'quickinbox.com',
  'rcpt.at',
  'recode.me',
  'safetymail.info',
  'selfdestructingmail.com',
  'sendspamhere.com',
  'spamgourmet.com',
  'spamhole.com',
  'spamtraps.com',
  'tempail.com',
  'tempinbox.co.uk',
  'tempmail.eu',
  'tempmail.it',
  'tempmailaddress.com',
  'temp-mail.org',
  'temp-mail.ru',
  'tmail.ws',
  'trash-amil.com',
  'trashmail.at',
  'trashmail.me',
  'trashmailer.com',
  'tyldd.com',
  'wh4f.org',
  'willselfdestruct.com',
  'zippymail.info'
  // Nota: example.com e example.org foram removidos para permitir testes
  // Em produção, considere adicionar validações adicionais
]);

/**
 * Validação de email robusta
 * Verifica formato, estrutura e bloqueia domínios temporários
 */
export interface EmailValidation {
  valid: boolean;
  error?: string;
}

export function isValidEmail(email: string): boolean {
  // Regex mais rigoroso para validação de formato
  // RFC 5322 compliant (simplificado)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!email || typeof email !== 'string') {
    return false;
  }

  const trimmedEmail = email.trim().toLowerCase();
  
  // Validação básica de formato
  if (!emailRegex.test(trimmedEmail)) {
    return false;
  }

  // Validação de comprimento
  if (trimmedEmail.length > 254) { // RFC 5321
    return false;
  }

  // Validação de estrutura
  const parts = trimmedEmail.split('@');
  if (parts.length !== 2) {
    return false;
  }

  const [localPart, domain] = parts;

  // Local part não pode ser vazio ou muito longo
  if (!localPart || localPart.length > 64) {
    return false;
  }

  // Domain não pode ser vazio
  if (!domain || domain.length === 0) {
    return false;
  }

  // Domain deve ter pelo menos um ponto (TLD)
  if (!domain.includes('.')) {
    return false;
  }

  // Domain não pode começar ou terminar com ponto ou hífen
  if (domain.startsWith('.') || domain.endsWith('.') || 
      domain.startsWith('-') || domain.endsWith('-')) {
    return false;
  }

  // Verificar se é domínio temporário/descartável
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return false;
  }

  return true;
}

/**
 * Validação de email com mensagens de erro detalhadas
 */
export function validateEmail(email: string): EmailValidation {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'E-mail é obrigatório' };
  }

  const trimmedEmail = email.trim().toLowerCase();

  // Validação básica de formato
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Formato de e-mail inválido' };
  }

  // Validação de comprimento
  if (trimmedEmail.length > 254) {
    return { valid: false, error: 'E-mail muito longo (máximo 254 caracteres)' };
  }

  // Validação de estrutura
  const parts = trimmedEmail.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'Formato de e-mail inválido' };
  }

  const [localPart, domain] = parts;

  if (!localPart || localPart.length === 0) {
    return { valid: false, error: 'E-mail deve ter uma parte local (antes do @)' };
  }

  if (localPart.length > 64) {
    return { valid: false, error: 'Parte local do e-mail muito longa (máximo 64 caracteres)' };
  }

  if (!domain || domain.length === 0) {
    return { valid: false, error: 'E-mail deve ter um domínio (depois do @)' };
  }

  if (!domain.includes('.')) {
    return { valid: false, error: 'Domínio do e-mail inválido' };
  }

  if (domain.startsWith('.') || domain.endsWith('.') || 
      domain.startsWith('-') || domain.endsWith('-')) {
    return { valid: false, error: 'Domínio do e-mail inválido' };
  }

  // Verificar se é domínio temporário/descartável
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { 
      valid: false, 
      error: 'E-mails temporários ou descartáveis não são permitidos. Use um e-mail pessoal ou corporativo.' 
    };
  }

  return { valid: true };
}

/**
 * Validação de senha
 */
export interface PasswordValidation {
  valid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (!password) {
    errors.push('Senha é obrigatória');
    return { valid: false, errors };
  }

  if (password.length < 8) {
    errors.push('A senha deve ter pelo menos 8 caracteres');
  }

  if (password.length > 128) {
    errors.push('A senha deve ter no máximo 128 caracteres');
  }

  // Opcional: adicionar mais validações
  // if (!/[A-Z]/.test(password)) {
  //   errors.push('A senha deve conter pelo menos uma letra maiúscula');
  // }
  // if (!/[a-z]/.test(password)) {
  //   errors.push('A senha deve conter pelo menos uma letra minúscula');
  // }
  // if (!/[0-9]/.test(password)) {
  //   errors.push('A senha deve conter pelo menos um número');
  // }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validação de nome
 */
export function validateName(name: string | undefined): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Nome é obrigatório' };
  }

  if (name.trim().length < 2) {
    return { valid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
  }

  if (name.length > 100) {
    return { valid: false, error: 'Nome deve ter no máximo 100 caracteres' };
  }

  return { valid: true };
}

/**
 * Validação de token
 */
export function validateToken(token: string | string[] | undefined): { valid: boolean; token?: string; error?: string } {
  if (!token) {
    return { valid: false, error: 'Token é obrigatório' };
  }

  if (Array.isArray(token)) {
    return { valid: false, error: 'Token inválido' };
  }

  if (typeof token !== 'string' || token.trim().length === 0) {
    return { valid: false, error: 'Token inválido' };
  }

  // Token deve ter pelo menos 32 caracteres (hex)
  if (token.length < 32) {
    return { valid: false, error: 'Token inválido' };
  }

  return { valid: true, token };
}

/**
 * Validação de ID (cuid, uuid, etc)
 */
export function validateId(id: string | string[] | undefined, fieldName: string = 'ID'): { valid: boolean; id?: string; error?: string } {
  if (!id) {
    return { valid: false, error: `${fieldName} é obrigatório` };
  }

  if (Array.isArray(id)) {
    return { valid: false, error: `${fieldName} inválido` };
  }

  if (typeof id !== 'string' || id.trim().length === 0) {
    return { valid: false, error: `${fieldName} inválido` };
  }

  return { valid: true, id };
}

/**
 * Validação de body de registro
 */
export interface RegisterBody {
  name?: string;
  email: string;
  password: string;
}

export function validateRegisterBody(body: any): { valid: true; data: RegisterBody } | { valid: false; error: string } {
  if (!body) {
    return { valid: false, error: 'Body é obrigatório' };
  }

  const { email, password, name } = body;

  // Validar email
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'E-mail é obrigatório' };
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return { valid: false, error: emailValidation.error || 'E-mail inválido' };
  }

  // Validar senha
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Senha é obrigatória' };
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return { valid: false, error: passwordValidation.errors[0] };
  }

  // Validar nome (opcional)
  if (name !== undefined) {
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return { valid: false, error: nameValidation.error! };
    }
  }

  return {
    valid: true,
    data: {
      name: name?.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim()
    }
  };
}


