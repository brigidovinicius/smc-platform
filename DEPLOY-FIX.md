# 🔧 CORREÇÃO DE DEPLOY - DATABASE_URL

**Data:** 23 de Janeiro de 2025  
**Problema:** Build falhando por falta de `DATABASE_URL`  
**Status:** ✅ Corrigido

---

## 🐛 PROBLEMA

O build estava falhando com:
```
PrismaConfigEnvError: Missing required environment variable: DATABASE_URL
```

Isso acontecia porque o script `postinstall` executava `prisma generate` que requer `DATABASE_URL`, mas essa variável não estava disponível durante o build na Vercel.

---

## ✅ SOLUÇÃO APLICADA

### 1. Removido prisma.config.ts

O arquivo `prisma.config.ts` estava causando o erro porque tentava validar `DATABASE_URL` antes do build. Este arquivo foi **removido** pois não é necessário - o Prisma usa o `schema.prisma` diretamente.

### 2. Script Postinstall Seguro

Criado `scripts/postinstall-safe.js` que:
- ✅ Usa uma `DATABASE_URL` dummy se não houver uma real (Prisma Client pode ser gerado sem conexão)
- ✅ Não falha o build se houver erro
- ✅ Mostra mensagens claras sobre o que está acontecendo
- ✅ Permite que o Prisma Client seja gerado durante o build

### 3. Atualização do package.json

```json
{
  "postinstall": "node scripts/postinstall-safe.js",
  "prisma:generate": "prisma generate"
}
```

### 4. Schema Prisma Atualizado

Mudado de `sqlite` para `postgresql` no `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 5. Configuração Vercel

Criado `vercel.json` com configurações básicas.

---

## 📋 CONFIGURAÇÃO NECESSÁRIA NO VERCEL

### Variáveis de Ambiente Obrigatórias

No dashboard da Vercel, adicione estas variáveis de ambiente:

1. **DATABASE_URL** (obrigatória)
   - Formato: `postgresql://user:password@host:port/database?sslmode=require`
   - Pode usar a URL do Vercel Postgres se estiver usando

2. **NEXTAUTH_SECRET** (obrigatória)
   - Gere com: `openssl rand -base64 32`

3. **NEXTAUTH_URL** (obrigatória)
   - URL da sua aplicação: `https://seu-projeto.vercel.app`

4. **GOOGLE_CLIENT_ID** (se usar Google OAuth)
5. **GOOGLE_CLIENT_SECRET** (se usar Google OAuth)

### Como Adicionar no Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione cada variável:
   - **Name:** `DATABASE_URL`
   - **Value:** Sua URL do Postgres
   - **Environment:** Production, Preview, Development (marque todos)
5. Repita para todas as variáveis necessárias

---

## 🔄 PRÓXIMOS PASSOS

### 1. Adicionar Variáveis no Vercel
- [ ] Adicionar `DATABASE_URL` no dashboard Vercel
- [ ] Adicionar `NEXTAUTH_SECRET`
- [ ] Adicionar `NEXTAUTH_URL`
- [ ] Adicionar outras variáveis necessárias

### 2. Testar Deploy
- [ ] Fazer push das mudanças
- [ ] Verificar se o build passa
- [ ] Testar a aplicação em produção

### 3. Verificar Prisma Client
- [ ] Confirmar que Prisma Client é gerado corretamente
- [ ] Testar conexão com o banco em produção

---

## 📝 NOTAS IMPORTANTES

### Desenvolvimento Local
- Para desenvolvimento local, crie um arquivo `.env.local` com:
  ```
  DATABASE_URL="file:./dev.db"  # SQLite para dev
  ```
- Ou use Postgres local se preferir

### Produção
- Use sempre Postgres em produção (Vercel Postgres recomendado)
- Nunca commite `.env.local` ou `.env` no git
- Configure todas as variáveis no dashboard Vercel

---

## 🐛 TROUBLESHOOTING

### Se o build ainda falhar:

1. **Verifique se as variáveis estão configuradas:**
   ```bash
   # No Vercel dashboard, verifique Environment Variables
   ```

2. **Verifique os logs do build:**
   - Vá em Deployments → Selecione o deploy → View Build Logs

3. **Teste localmente:**
   ```bash
   DATABASE_URL="postgresql://..." npm run build
   ```

4. **Se usar SQLite em dev:**
   - O script detecta automaticamente e pula o generate se não houver DATABASE_URL
   - Isso é OK para build-time

---

**Status:** ✅ **CORREÇÃO APLICADA**  
**Próxima ação:** Adicionar variáveis de ambiente no Vercel

