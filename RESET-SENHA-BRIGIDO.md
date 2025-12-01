# 🔐 Redefinir Senha para brigido254@gmail.com

## Método Rápido: Via Supabase SQL Editor

### Passo 1: Acesse o Supabase
1. Vá em: https://app.supabase.com
2. Selecione seu projeto
3. Clique em **SQL Editor** (no menu lateral)

### Passo 2: Execute este SQL para buscar token existente

```sql
SELECT 
  identifier as email,
  token,
  expires,
  CASE 
    WHEN expires > NOW() THEN 'VÁLIDO'
    ELSE 'EXPIRADO'
  END as status
FROM "VerificationToken"
WHERE identifier = 'brigido254@gmail.com'
ORDER BY expires DESC
LIMIT 1;
```

**Se encontrar um token válido:**
- Copie o valor da coluna `token`
- Acesse: `https://counterx.io/auth/reset-password?token=<TOKEN_COPIADO>`
- Digite a nova senha

**Se não encontrar token ou estiver expirado:**
- Veja o Passo 3 abaixo

---

### Passo 3: Criar Novo Token de Reset

Execute este SQL no Supabase:

```sql
-- Remover tokens antigos
DELETE FROM "VerificationToken" WHERE identifier = 'brigido254@gmail.com';

-- Criar novo token (válido por 1 hora)
INSERT INTO "VerificationToken" (identifier, token, expires)
VALUES (
  'brigido254@gmail.com',
  encode(gen_random_bytes(32), 'hex'),
  NOW() + INTERVAL '1 hour'
)
RETURNING token, expires;
```

**Depois:**
- Copie o `token` retornado
- Acesse: `https://counterx.io/auth/reset-password?token=<TOKEN>`
- Digite a nova senha

---

## Método Alternativo: Redefinir Diretamente no Banco

⚠️ **Requer gerar hash bcrypt da senha**

### Passo 1: Encontrar o usuário

```sql
SELECT id, email, name FROM "User" WHERE email = 'brigido254@gmail.com';
```

### Passo 2: Gerar hash bcrypt da nova senha

Acesse: https://bcrypt-generator.com/

- Digite sua nova senha
- Clique em "Generate"
- Copie o hash gerado (começa com `$2a$10$...`)

### Passo 3: Atualizar a senha

```sql
UPDATE "User" 
SET password = '$2a$10$SEU_HASH_BCRYPT_AQUI' 
WHERE email = 'brigido254@gmail.com';
```

**Substitua `$2a$10$SEU_HASH_BCRYPT_AQUI` pelo hash gerado no Passo 2.**

---

## Método via Interface Web

1. Inicie o servidor: `npm run dev`
2. Acesse: `http://localhost:3000/auth/forgot-password`
3. Digite: `brigido254@gmail.com`
4. Clique em "Enviar"
5. Se o SMTP estiver configurado, você receberá um email
6. Se não, use o Passo 2 do Método Rápido acima para buscar o token

---

## ✅ Checklist

- [ ] Executei o SQL para buscar token existente
- [ ] Se não encontrei token, criei um novo
- [ ] Copiei o token
- [ ] Acessei o link de reset com o token
- [ ] Redefini a senha com sucesso
- [ ] Testei login com a nova senha

---

## 🆘 Precisa de Ajuda?

Se nenhum método funcionar:
1. Verifique se o usuário existe: `SELECT * FROM "User" WHERE email = 'brigido254@gmail.com';`
2. Verifique se o banco está acessível
3. Tente criar um novo usuário para testar


