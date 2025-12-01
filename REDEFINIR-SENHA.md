# 🔐 Como Redefinir Senha de Usuário

## Opção 1: Via Interface Web (Recomendado)

1. Acesse: `https://counterx.io/auth/forgot-password` (ou `http://localhost:3000/auth/forgot-password` localmente)
2. Digite o email do usuário
3. Clique em "Enviar"
4. **Se o SMTP estiver configurado**: Você receberá um email com o link de reset
5. **Se o SMTP NÃO estiver configurado**: Veja a Opção 2 abaixo

---

## Opção 2: Buscar Token Manualmente no Banco

Se o SMTP não estiver configurado, o token é gerado mas não enviado por email. Você pode buscá-lo diretamente no banco:

### Via Supabase Dashboard:

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Table Editor** → **verification_tokens**
4. Busque pelo email do usuário na coluna `identifier`
5. Copie o `token` (coluna `token`)
6. Acesse: `https://counterx.io/auth/reset-password?token=<TOKEN_COPIADO>`
7. Digite a nova senha e confirme

### Via Script (se conseguir conectar):

```bash
# Primeiro, solicite o token via API
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@exemplo.com"}'

# Depois, busque o token no banco (veja Opção 3)
```

---

## Opção 3: Redefinir Diretamente no Banco (Avançado)

**⚠️ Requer acesso direto ao banco de dados**

### Via Supabase SQL Editor:

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Execute o SQL abaixo (substitua os valores):

```sql
-- 1. Primeiro, encontre o ID do usuário
SELECT id, email, name FROM "User" WHERE email = 'usuario@exemplo.com';

-- 2. Gere o hash da nova senha (use um gerador online de bcrypt)
-- Exemplo: https://bcrypt-generator.com/
-- Senha "MinhaSenha123" = $2a$10$...

-- 3. Atualize a senha (substitua USER_ID e HASH)
UPDATE "User" 
SET password = '$2a$10$SEU_HASH_AQUI' 
WHERE id = 'USER_ID_AQUI';
```

### Via Script Node.js (quando a connection string estiver correta):

```bash
node scripts/reset-user-password.js usuario@exemplo.com MinhaNovaSenha123
```

**Nota**: O script pode falhar se a connection string tiver caracteres especiais não codificados. Nesse caso, use a Opção 1 ou 2.

---

## Opção 4: Criar Novo Usuário (se não conseguir resetar)

Se não conseguir redefinir a senha, você pode criar um novo usuário:

1. Acesse: `https://counterx.io/auth/register`
2. Preencha o formulário com um email diferente
3. Faça login com a nova conta

---

## 🔍 Troubleshooting

### Erro: "Token inválido ou expirado"
- O token expira em 1 hora
- Solicite um novo token em `/auth/forgot-password`

### Erro: "Usuário não encontrado"
- Verifique se o email está correto
- Verifique se o usuário existe no banco de dados

### Erro: "Esta conta não possui senha"
- O usuário foi criado apenas com OAuth (Google)
- Use o login com Google em vez de senha

### Connection String com Caracteres Especiais

Se a senha do banco tiver caracteres especiais (como `@`, `#`, `&`, etc.), eles precisam ser URL-encoded na connection string:

- `@` → `%40`
- `#` → `%23`
- `&` → `%26`
- `%` → `%25`
- Espaço → `%20`

Exemplo:
```
# Antes (errado):
postgresql://user:senha@123@host:5432/db

# Depois (correto):
postgresql://user:senha%40123@host:5432/db
```

---

## ✅ Checklist

- [ ] Tentou via interface web (`/auth/forgot-password`)
- [ ] Verificou se o SMTP está configurado
- [ ] Buscou o token no Supabase (se SMTP não configurado)
- [ ] Testou o link de reset com o token
- [ ] Conseguiu fazer login com a nova senha

---

## 📞 Precisa de Ajuda?

Se nenhuma das opções funcionar:
1. Verifique os logs do servidor
2. Verifique se o banco de dados está acessível
3. Verifique se as migrations foram executadas
4. Tente criar um novo usuário para testar


