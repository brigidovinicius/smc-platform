/**
 * Validadores para APIs
 * Validação de dados de entrada com TypeScript
 */

/**
 * Validação de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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

  if (!isValidEmail(email)) {
    return { valid: false, error: 'E-mail inválido' };
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
      password
    }
  };
}

