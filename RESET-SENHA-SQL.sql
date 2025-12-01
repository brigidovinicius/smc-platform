-- ============================================
-- SQL para Redefinir Senha
-- Email: brigido254@gmail.com
-- Nova Senha: Teste1234
-- ============================================

UPDATE "User" 
SET password = '$2b$10$hftS1P5l/UltVL6ASmmTl.yI11HQSqelFJkHYXm1SWD1iJy35V7GW' 
WHERE email = 'brigido254@gmail.com';

-- ============================================
-- Depois de executar, você pode fazer login com:
-- Email: brigido254@gmail.com
-- Senha: Teste1234
-- ============================================


