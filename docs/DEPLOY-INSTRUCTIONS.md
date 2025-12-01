# Instruções de Deploy

## Antes do Deploy

### 1. Atualizar Email do Admin

Execute o script para atualizar o email do administrador:

```bash
node scripts/update-admin-email.js "seu@email.com"
```

### 2. Verificar Variáveis de Ambiente

Certifique-se de que todas as variáveis de ambiente estão configuradas:

- `DATABASE_URL` - URL de conexão do PostgreSQL
- `NEXTAUTH_SECRET` - Chave secreta para NextAuth
- `NEXTAUTH_URL` - URL da aplicação (ex: https://seu-dominio.com)
- `GOOGLE_CLIENT_ID` - OAuth Google (opcional)
- `GOOGLE_CLIENT_SECRET` - OAuth Google (opcional)

### 3. Executar Migrations

```bash
# Verificar status das migrations
npx prisma migrate status

# Aplicar migrations pendentes
npx prisma migrate deploy

# Gerar Prisma Client
npx prisma generate
```

## Deploy na Vercel

### Passo 1: Push para o Repositório

```bash
git push origin feat/lead-flow
# ou para main após merge
git push origin main
```

### Passo 2: Configurar no Vercel

1. Acesse o dashboard da Vercel
2. Importe o projeto (se ainda não importou)
3. Configure as variáveis de ambiente
4. Configure o Build Command:
   ```bash
   npm run vercel-build
   ```
   (Já configurado no package.json)

### Passo 3: Deploy

A Vercel fará o deploy automaticamente após o push.

## Após o Deploy

### 1. Verificar Aplicação

- Acesse a URL da aplicação
- Verifique se o login funciona
- Teste o acesso admin

### 2. Primeiro Login Admin

1. Acesse `/auth/login`
2. Use as credenciais do admin
3. Altere a senha em `/profile`
4. Verifique acesso a `/admin/assets` e `/admin/leads`

### 3. Configurar Email (Opcional)

Se quiser habilitar emails de recuperação de senha, configure as variáveis SMTP:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

## Troubleshooting

### Erro de Conexão com Banco

Verifique se o `DATABASE_URL` está correto e o banco está acessível.

### Erro de Autenticação

Verifique se `NEXTAUTH_SECRET` está configurado e é único.

### Admin não consegue acessar

1. Verifique o role do usuário: `node scripts/check-users.js`
2. Verifique se o usuário tem role ADMIN no Profile

### Assets não aparecem

1. Verifique se há assets no banco
2. Verifique se o status é PUBLISHED
3. Verifique os logs do servidor



