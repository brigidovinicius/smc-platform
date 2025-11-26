# ⚡ Configurar POSTGRES_URL_NON_POOLING - AGORA

## ✅ Vercel CLI Detectado

O Vercel CLI está disponível via `npx vercel`.

## 🚀 Executar Configuração

### Opção 1: Script Automático (Recomendado)

Execute o script que criamos:

```bash
node scripts/setup-vercel-postgres-non-pooling-npx.js
```

O script irá:
1. ✅ Verificar se você está logado
2. 📝 Solicitar a connection string do Supabase
3. 🔧 Adicionar `POSTGRES_URL_NON_POOLING` automaticamente

---

### Opção 2: Manual via CLI

Se preferir fazer manualmente:

#### 1. Obter Connection String do Supabase

1. Acesse: **https://app.supabase.com**
2. Selecione seu projeto
3. **Settings** → **Database**
4. **Connection string** → Selecione **URI** (⚠️ NÃO Transaction Pooler)
5. Copie a string completa

#### 2. Adicionar no Vercel

Execute estes comandos (substitua `[SUA_CONNECTION_STRING]` pela string copiada):

```bash
# Production
echo "[SUA_CONNECTION_STRING]" | npx vercel env add POSTGRES_URL_NON_POOLING production

# Preview
echo "[SUA_CONNECTION_STRING]" | npx vercel env add POSTGRES_URL_NON_POOLING preview

# Development
echo "[SUA_CONNECTION_STRING]" | npx vercel env add POSTGRES_URL_NON_POOLING development
```

**Exemplo:**
```bash
echo "postgresql://postgres:senha123@db.abc123.supabase.co:5432/postgres?sslmode=require" | npx vercel env add POSTGRES_URL_NON_POOLING production
```

---

### Opção 3: Dashboard do Vercel (Mais Simples)

1. **Obter Connection String:**
   - https://app.supabase.com → Settings → Database → URI

2. **Adicionar no Vercel:**
   - https://vercel.com/dashboard
   - Selecione projeto "smc-platform"
   - Settings → Environment Variables
   - Add New:
     - Key: `POSTGRES_URL_NON_POOLING`
     - Value: Cole a connection string
     - Environment: ☑ Production ☑ Preview ☑ Development
   - Save

3. **Redeploy:**
   - Deployments → 3 pontos → Redeploy

---

## ✅ Verificação

### Verificar se foi configurado:

```bash
npx vercel env ls
```

Deve aparecer `POSTGRES_URL_NON_POOLING` para todos os ambientes.

### Verificar nos logs do build:

Após o deploy, nos logs deve aparecer:
```
✅ Using POSTGRES_URL_NON_POOLING (recomendado para Supabase) for Prisma Client generation
```

---

## 🎯 Próximo Passo

**Escolha uma das opções acima e execute!**

A mais rápida é a **Opção 3 (Dashboard)** se você não quiser usar comandos.

Após configurar, faça um **Redeploy** e teste o cadastro/login! 🚀

