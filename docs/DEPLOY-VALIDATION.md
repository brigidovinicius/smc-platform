# ✅ Checklist de Validação Pós-Deploy

## Status Atual

- ✅ Código commitado e enviado para `main`
- ✅ Servidor local funcionando
- ✅ Todas as rotas corrigidas

## Passo 1: Verificar Build na Vercel

1. Acesse o dashboard da Vercel: https://vercel.com/dashboard
2. Abra o projeto `smc-platform`
3. Verifique o último deploy:
   - ✅ Build deve passar sem erros
   - ✅ Prisma Client deve ser gerado
   - ⚠️ Migrations podem falhar se `DATABASE_URL` não estiver configurado (isso é OK por enquanto)

## Passo 2: Configurar Variáveis de Ambiente

Acesse: **Settings → Environment Variables**

### Variáveis Obrigatórias:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão do Supabase | `postgresql://postgres:senha@host:5432/postgres` |
| `NEXTAUTH_SECRET` | Secret para JWT (gerar com `openssl rand -base64 32`) | `zu8tl9U4GF6h8rRhmmLrrMYcxAQPUeIipPM2IOA0+iM=` |
| `NEXTAUTH_URL` | URL de produção | `https://seu-dominio.vercel.app` |
| `GOOGLE_CLIENT_ID` | Client ID do Google OAuth | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Client Secret do Google OAuth | `xxx` |

### Variáveis Opcionais (Email):

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`

## Passo 3: Testar Rotas em Produção

Após o deploy, testar cada rota:

### Rotas Públicas:
- [ ] `/` - Homepage
- [ ] `/blog` - Lista de posts
- [ ] `/auth/login` - Página de login

### Rotas Protegidas (após login):
- [ ] `/dashboard` - Dashboard principal
- [ ] `/dashboard/assets/new` - Criar novo ativo
- [ ] `/admin` - Painel admin (deve redirecionar para `/admin/assets`)
- [ ] `/admin/assets` - Lista de assets
- [ ] `/admin/leads` - Lista de leads
- [ ] `/profile` - Perfil do usuário

## Passo 4: Testar Login

1. Acesse `/auth/login`
2. Faça login com:
   - **Email:** `brigido254@gmail.com`
   - **Senha:** `admin123456`
3. Verifique:
   - ✅ Login bem-sucedido
   - ✅ Redirecionamento para `/dashboard`
   - ✅ Sessão persistida
   - ✅ Navegação funciona

## Passo 5: Criar Admin em Produção

Se o admin não existir no banco de produção:

1. Execute o script de setup:
   ```bash
   ./scripts/setup-producao-final.sh "sua_senha_do_supabase"
   ```

2. Ou manualmente:
   ```bash
   # Conectar ao banco e criar admin
   node scripts/create-admin-user.js \
     "Admin User" \
     "brigido254@gmail.com" \
     "admin123456"
   ```

## Troubleshooting

### Build Falha
- Verificar logs no dashboard da Vercel
- Confirmar que `package.json` está correto
- Verificar se todas as dependências estão instaladas

### Erro 500 ao Acessar Rotas
- Verificar variáveis de ambiente
- Confirmar que `DATABASE_URL` está correto
- Verificar logs de runtime na Vercel

### Login não funciona
- Verificar `NEXTAUTH_SECRET` e `NEXTAUTH_URL`
- Confirmar que admin existe no banco
- Verificar logs da API `/api/auth/session`

### Rotas retornam 404
- Verificar se o build foi bem-sucedido
- Confirmar que todas as rotas estão nos diretórios corretos
- Verificar `next.config.mjs` para redirecionamentos

## Links Úteis

- Dashboard Vercel: https://vercel.com/dashboard
- Logs do Deploy: Disponível no dashboard da Vercel
- Logs de Runtime: Disponível no dashboard da Vercel (Functions)

