# 🚀 Guia de Deploy - SaaS Market Cap

Este guia explica como fazer deploy do SMC na Vercel com todas as atualizações recentes.

## 📋 Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Repositório Git (GitHub, GitLab ou Bitbucket)
3. Google Cloud Console configurado para OAuth
4. (Opcional) Banco de dados PostgreSQL na Vercel

---

## 🔧 Passo 1: Preparar o Repositório

### 1.1 Verificar arquivos importantes

Certifique-se de que estes arquivos estão commitados:
- ✅ `vercel.json` - Configuração de deploy
- ✅ `.env.example` - Template de variáveis
- ✅ `package.json` - Dependências atualizadas
- ✅ `next.config.mjs` - Configuração do Next.js
- ✅ `tailwind.config.js` - Configuração do Tailwind
- ✅ Todos os componentes refatorados

### 1.2 Commitar mudanças

```bash
git add .
git commit -m "feat: refatoração completa de componentes e preparação para deploy"
git push origin main
```

---

## 🌐 Passo 2: Configurar Projeto na Vercel

### 2.1 Criar novo projeto

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Conecte seu repositório Git
3. Selecione o repositório `saas-market-cap`
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (raiz)
   - **Build Command:** `npm run build` (automático)
   - **Output Directory:** `.next` (automático)
   - **Install Command:** `npm install` (automático)

### 2.2 Configurar Variáveis de Ambiente

Na seção **Environment Variables**, adicione:

#### Obrigatórias:
```
NEXTAUTH_SECRET=<gerar-com-openssl-rand-base64-32>
NEXTAUTH_URL=https://seu-projeto.vercel.app
GOOGLE_CLIENT_ID=<seu-client-id>
GOOGLE_CLIENT_SECRET=<seu-client-secret>
DATABASE_URL=<sua-url-postgres-ou-sqlite>
NEXT_PUBLIC_SITE_URL=https://seu-projeto.vercel.app
```

#### Opcionais (para funcionalidades avançadas):
```
OPENAI_API_KEY=<sua-chave-openai>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<seu-email>
SMTP_PASS=<sua-senha-app>
GENERATOR_CRON=30 6 * * 1-5
GENERATOR_TZ=America/Sao_Paulo
```

**⚠️ IMPORTANTE:** 
- Configure as mesmas variáveis para **Production**, **Preview** e **Development**
- Use valores diferentes para cada ambiente se necessário

---

## 🗄️ Passo 3: Configurar Banco de Dados

### Opção A: Vercel Postgres (Recomendado para Produção)

1. No dashboard da Vercel, vá em **Storage**
2. Clique em **Create Database** → **Postgres**
3. Escolha um nome e região (preferencialmente `São Paulo - gru1`)
4. Copie a `DATABASE_URL` gerada
5. Adicione como variável de ambiente `DATABASE_URL`

### Opção B: SQLite (Apenas para desenvolvimento)

⚠️ **Não recomendado para produção** - Use apenas para testes locais.

---

## 🔐 Passo 4: Configurar Google OAuth

### 4.1 Criar credenciais OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione existente
3. Vá em **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure:
   - **Application type:** Web application
   - **Name:** SaaS Market Cap
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (dev)
     - `https://seu-projeto.vercel.app` (prod)
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/callback/google` (dev)
     - `https://seu-projeto.vercel.app/api/auth/callback/google` (prod)

### 4.2 Adicionar credenciais na Vercel

Copie o **Client ID** e **Client Secret** para as variáveis de ambiente:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

---

## 🚀 Passo 5: Fazer Deploy

### 5.1 Deploy automático

1. Após configurar tudo, clique em **Deploy**
2. A Vercel fará:
   - ✅ Instalar dependências (`npm install`)
   - ✅ Gerar Prisma Client (`prisma generate`)
   - ✅ Rodar migrations (se houver)
   - ✅ Build do Next.js (`npm run build`)
   - ✅ Deploy da aplicação

### 5.2 Verificar build

Monitore o log de build. Deve aparecer:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

---

## ✅ Passo 6: Verificar Deploy

### 6.1 Testes básicos

Após o deploy, teste:

1. **Homepage:** `https://seu-projeto.vercel.app`
   - ✅ Deve carregar sem erros
   - ✅ Navbar deve aparecer corretamente
   - ✅ Menu mobile deve funcionar

2. **Autenticação:** `https://seu-projeto.vercel.app/auth/login`
   - ✅ Botão "Entrar" deve funcionar
   - ✅ Google OAuth deve redirecionar corretamente
   - ✅ Após login, deve redirecionar para `/dashboard`

3. **Rotas protegidas:** `https://seu-projeto.vercel.app/dashboard`
   - ✅ Deve redirecionar para login se não autenticado
   - ✅ Deve mostrar conteúdo se autenticado

4. **Blog:** `https://seu-projeto.vercel.app/blog`
   - ✅ Deve carregar lista de posts
   - ✅ Deve ser acessível sem autenticação

### 6.2 Verificar logs

1. No dashboard da Vercel, vá em **Deployments**
2. Clique no deployment mais recente
3. Vá em **Functions** para ver logs de API routes
4. Verifique se há erros nos logs

---

## 🔧 Passo 7: Configurações Adicionais

### 7.1 Domínio customizado (Opcional)

1. No dashboard da Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio
3. Configure DNS conforme instruções
4. Atualize `NEXTAUTH_URL` e `NEXT_PUBLIC_SITE_URL` com o novo domínio

### 7.2 Analytics (Opcional)

O projeto já inclui `@vercel/speed-insights`. Para ativar:
1. No dashboard da Vercel, vá em **Analytics**
2. Ative **Web Analytics** e **Speed Insights**

### 7.3 Prisma Migrations

Se precisar rodar migrations manualmente:

```bash
# Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
```

Ou configure no `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate && prisma migrate deploy"
  }
}
```

---

## 🐛 Troubleshooting

### Erro: "Module not found"

**Solução:** Verifique se todos os arquivos foram commitados e o build está usando as dependências corretas.

### Erro: "NEXTAUTH_SECRET is not set"

**Solução:** Adicione a variável de ambiente `NEXTAUTH_SECRET` na Vercel.

### Erro: "Database connection failed"

**Solução:** 
- Verifique se `DATABASE_URL` está configurada corretamente
- Para Vercel Postgres, certifique-se de que o banco está criado
- Verifique se o Prisma Client foi gerado (`prisma generate`)

### Erro: "Google OAuth redirect_uri_mismatch"

**Solução:** 
- Verifique se a URL de redirect na Google Console corresponde exatamente à URL do deploy
- Inclua `http://` ou `https://` conforme necessário
- Não inclua trailing slash

### Build falha com erro de Tailwind

**Solução:** 
- Verifique se `tailwind.config.js` está correto
- Certifique-se de que `@tailwindcss/postcss` está instalado
- Verifique se `postcss.config.js` existe e está configurado

### Navbar não aparece corretamente

**Solução:**
- Verifique se `components/Navbar.jsx` foi atualizado
- Certifique-se de que o Tailwind está processando corretamente
- Verifique o console do navegador para erros

---

## 📊 Monitoramento

### Vercel Analytics

1. Acesse **Analytics** no dashboard
2. Monitore:
   - Page views
   - Performance (LCP, FID, CLS)
   - Erros de JavaScript

### Logs em Tempo Real

1. No dashboard, vá em **Deployments** → Seu deployment → **Functions**
2. Veja logs de API routes em tempo real

---

## 🔄 Atualizações Futuras

### Deploy automático

Após configurado, cada push para `main` gera um novo deploy automaticamente.

### Preview Deploys

Pull requests geram preview deployments automaticamente para testar antes de merge.

### Rollback

Se algo der errado:
1. Vá em **Deployments**
2. Clique nos três pontos do deployment anterior
3. Selecione **Promote to Production**

---

## 📝 Checklist Final

Antes de considerar o deploy completo:

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Google OAuth funcionando
- [ ] Banco de dados conectado
- [ ] Build passando sem erros
- [ ] Homepage carregando corretamente
- [ ] Autenticação funcionando
- [ ] Rotas protegidas funcionando
- [ ] Blog acessível publicamente
- [ ] Navbar responsivo funcionando
- [ ] Mobile menu funcionando
- [ ] Sem erros no console do navegador
- [ ] Performance aceitável (Lighthouse)

---

## 🎉 Pronto!

Seu SMC está no ar! 🚀

Para suporte adicional:
- [Documentação Vercel](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [NextAuth.js Deployment](https://next-auth.js.org/configuration/providers/oauth)

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0

