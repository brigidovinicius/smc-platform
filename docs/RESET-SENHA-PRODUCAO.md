# 🔐 Como Resetar Senha do Admin em Produção

## Problema

Se você não conseguir fazer login na aplicação em produção, pode ser que o banco de dados de produção seja diferente do local.

## Soluções

### Opção 1: Resetar via Script Local (se usar mesmo banco)

Se o `DATABASE_URL` no Vercel aponta para o mesmo banco que você usa localmente:

```bash
node scripts/reset-admin-password.js "suasenha123"
```

### Opção 2: Criar Novo Admin em Produção

Se o banco de produção for diferente, você precisa criar o admin diretamente no banco de produção:

#### Via Prisma Studio (Recomendado)

1. Acesse o banco de produção (Supabase, Railway, etc.)
2. Abra o Prisma Studio apontando para o banco de produção:
   ```bash
   DATABASE_URL="sua_url_de_producao" npx prisma studio
   ```
3. Na tabela `User`, encontre ou crie o usuário com email `brigido254@gmail.com`
4. Na tabela `Profile`, certifique-se de que existe um perfil com `role: ADMIN` vinculado ao usuário

#### Via Script com DATABASE_URL de Produção

```bash
# Defina a variável de ambiente do banco de produção
export DATABASE_URL="sua_url_de_producao_postgresql"

# Execute o script de criação
node scripts/create-admin-user.js "Seu Nome" "brigido254@gmail.com" "suasenha123"
```

### Opção 3: Resetar via API (se disponível)

Você também pode usar a API de recuperação de senha:

1. Acesse `/auth/forgot-password`
2. Digite seu email: `brigido254@gmail.com`
3. Verifique o email para o link de reset

### Opção 4: Acesso Direto ao Banco

Se tiver acesso direto ao PostgreSQL de produção:

```sql
-- 1. Encontrar o ID do usuário admin
SELECT id, email FROM "User" WHERE email = 'brigido254@gmail.com';

-- 2. Hash da nova senha (execute no Node.js)
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('suasenha123', 10);
-- console.log(hash);

-- 3. Atualizar a senha (substitua 'HASH_AQUI' pelo hash gerado)
UPDATE "User" 
SET password = 'HASH_AQUI' 
WHERE email = 'brigido254@gmail.com';

-- 4. Verificar o Profile
SELECT u.email, p.role 
FROM "User" u 
LEFT JOIN "Profile" p ON p."userId" = u.id 
WHERE u.email = 'brigido254@gmail.com';

-- 5. Garantir que o Profile tem role ADMIN
UPDATE "Profile" 
SET role = 'ADMIN' 
WHERE "userId" = (SELECT id FROM "User" WHERE email = 'brigido254@gmail.com');
```

## Credenciais Atuais

- **Email:** `brigido254@gmail.com`
- **Senha:** `admin123456` (padrão configurado localmente)

## Verificação Rápida

Execute localmente para verificar se o usuário existe:

```bash
node scripts/check-users.js
```

Se aparecer o usuário, mas a senha não funcionar em produção, significa que os bancos são diferentes.

## Próximos Passos

Após resetar a senha, faça login e **IMEDIATAMENTE** altere a senha em `/profile` para uma senha mais segura.

