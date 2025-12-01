-- ============================================
-- Script SQL para Redefinir Senha de Usuário
-- Execute no Supabase SQL Editor
-- ============================================

-- OPÇÃO 1: Buscar Token de Reset Existente
-- Use este SQL para encontrar o token mais recente gerado:
SELECT 
  identifier as email,
  token,
  expires,
  CASE 
    WHEN expires > NOW() THEN 'VÁLIDO'
    ELSE 'EXPIRADO'
  END as status,
  EXTRACT(EPOCH FROM (expires - NOW())) / 60 as minutos_restantes
FROM "VerificationToken"
WHERE identifier = 'brigido254@gmail.com'
ORDER BY expires DESC
LIMIT 1;

-- Se encontrar um token válido, use este link:
-- http://localhost:3000/auth/reset-password?token=<TOKEN_AQUI>
-- ou em produção:
-- https://counterx.io/auth/reset-password?token=<TOKEN_AQUI>


-- ============================================
-- OPÇÃO 2: Redefinir Senha Diretamente
-- ⚠️ ATENÇÃO: Requer gerar o hash bcrypt da senha
-- ============================================

-- 1. Primeiro, encontre o ID do usuário:
SELECT id, email, name FROM "User" WHERE email = 'brigido254@gmail.com';

-- 2. Gere o hash bcrypt da nova senha em:
--    https://bcrypt-generator.com/
--    ou use: https://www.bcrypt.fr/
--
--    Exemplo para senha "MinhaNovaSenha123":
--    $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- 3. Atualize a senha (SUBSTITUA USER_ID e HASH_BCRYPT):
-- UPDATE "User" 
-- SET password = '$2a$10$SEU_HASH_BCRYPT_AQUI' 
-- WHERE id = 'USER_ID_DO_PASSO_1';

-- Exemplo completo (SUBSTITUA OS VALORES):
-- UPDATE "User" 
-- SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' 
-- WHERE email = 'brigido254@gmail.com';


-- ============================================
-- OPÇÃO 3: Criar Novo Token de Reset
-- ============================================

-- 1. Remover tokens antigos
DELETE FROM "VerificationToken" WHERE identifier = 'brigido254@gmail.com';

-- 2. Criar novo token (válido por 1 hora)
-- Gere um token aleatório de 64 caracteres hexadecimais
-- Você pode usar: openssl rand -hex 32
-- Ou usar este SQL (gera um token aleatório):
INSERT INTO "VerificationToken" (identifier, token, expires)
VALUES (
  'brigido254@gmail.com',
  encode(gen_random_bytes(32), 'hex'),
  NOW() + INTERVAL '1 hour'
)
RETURNING token, expires;

-- Depois use o token retornado no link:
-- http://localhost:3000/auth/reset-password?token=<TOKEN_RETORNADO>


