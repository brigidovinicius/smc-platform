# ✅ Checklist de Deploy para Produção

## 📋 Verificações Pré-Deploy

### 1. Build Local
```bash
npm run build
```
- ✅ Deve compilar sem erros
- ✅ Sem warnings críticos

### 2. Variáveis de Ambiente (Vercel)

Acesse: Vercel Dashboard → Settings → Environment Variables

Verifique se estas variáveis estão configuradas:

- **NEXTAUTH_SECRET** - Secret aleatório (use `openssl rand -base64 32`)
- **NEXTAUTH_URL** - URL completa da aplicação (ex: `https://sua-app.vercel.app`)
- **DATABASE_URL** - URL completa do PostgreSQL de produção
- **GOOGLE_CLIENT_ID** - Se usar Google OAuth
- **GOOGLE_CLIENT_SECRET** - Se usar Google OAuth

### 3. Banco de Dados de Produção

⚠️ **IMPORTANTE:** Se o banco de produção for diferente do local:

#### Criar Usuário Admin no Banco de Produção:

```bash
# 1. Obtenha a DATABASE_URL de produção (Vercel → Settings → Environment Variables)

# 2. Execute o script com a URL de produção:
DATABASE_URL="postgresql://user:pass@host:port/db" node scripts/create-admin-user.js \
  "Admin User" \
  "brigido254@gmail.com" \
  "admin123456"
```

#### Verificar Admin Existe:

```bash
DATABASE_URL="sua_url_producao" node scripts/check-users.js
```

#### Resetar Senha (se necessário):

```bash
DATABASE_URL="sua_url_producao" node scripts/reset-admin-password.js "admin123456"
```

## 🚀 Processo de Deploy

### Deploy Automático (Recomendado)

1. **Push para main:**
   ```bash
   git push origin main
   ```

2. **Vercel faz deploy automático:**
   - Acesse: https://vercel.com/brigidovinicius-projects/smc-platform
   - Aguarde o deploy terminar (status: "Ready")

3. **Verificar deploy:**
   - Acesse a URL de produção
   - Teste login com credenciais de admin

### Deploy Manual (se necessário)

```bash
# No Vercel Dashboard → Deployments → Redeploy
```

## ✅ Pós-Deploy

### 1. Testar Login em Produção

- URL: `https://sua-app.vercel.app/auth/login`
- Email: `brigido254@gmail.com`
- Senha: `admin123456`

### 2. Verificar Funcionalidades

- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Área admin acessível (`/admin/assets`, `/admin/leads`)
- [ ] Perfil acessível (`/profile`)
- [ ] Criação de assets funciona

### 3. Verificar Logs

No Vercel Dashboard → Deployments → [último deploy] → Logs

Procure por:
- Erros de autenticação
- Erros de banco de dados
- Erros de build

## 🔧 Troubleshooting

### Problema: Login não funciona em produção

**Solução:**
1. Verificar se o admin existe no banco de produção:
   ```bash
   DATABASE_URL="url_prod" node scripts/check-users.js
   ```

2. Se não existir, criar:
   ```bash
   DATABASE_URL="url_prod" node scripts/create-admin-user.js \
     "Admin" "brigido254@gmail.com" "admin123456"
   ```

3. Verificar NEXTAUTH_URL está correto:
   - Deve ser `https://sua-app.vercel.app` (sem barra no final)

### Problema: Erro de banco de dados

**Solução:**
1. Verificar DATABASE_URL no Vercel
2. Verificar se o banco está acessível
3. Verificar se as migrations foram aplicadas:
   ```bash
   DATABASE_URL="url_prod" npx prisma migrate deploy
   ```

### Problema: Build falha

**Solução:**
1. Testar build local: `npm run build`
2. Verificar erros de TypeScript: `npm run type-check` (se disponível)
3. Verificar erros de lint: `npm run lint`

## 📝 Credenciais de Admin

### Credenciais Padrão:
- **Email:** `brigido254@gmail.com`
- **Senha:** `admin123456`

⚠️ **IMPORTANTE:** Altere a senha após o primeiro login em produção!

1. Faça login
2. Acesse `/profile`
3. Use o formulário "Alterar Senha"

## 🔗 Links Úteis

- **Vercel Dashboard:** https://vercel.com
- **Documentação:** `/docs/ADMIN-SETUP.md`
- **Reset de Senha:** `/docs/RESET-SENHA-PRODUCAO.md`


