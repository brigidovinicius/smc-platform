# 🚀 Configurar POSTGRES_URL_NON_POOLING no Vercel - AGORA

## Opção 1: Via Script Automático (Recomendado)

### Pré-requisitos:
- Vercel CLI instalado: `npm install -g vercel`
- Logado no Vercel: `vercel login`

### Executar:

**Bash (Mac/Linux):**
```bash
./scripts/setup-vercel-postgres-non-pooling.sh
```

**Node.js (qualquer sistema):**
```bash
node scripts/setup-vercel-postgres-non-pooling.js
```

O script irá:
1. ✅ Verificar se Vercel CLI está instalado
2. ✅ Verificar se você está logado
3. 📝 Solicitar a connection string do Supabase
4. 🔧 Adicionar `POSTGRES_URL_NON_POOLING` para todos os ambientes
5. ✅ Confirmar a configuração

---

## Opção 2: Via Dashboard do Vercel (Manual)

### Passo 1: Obter Connection String do Supabase

1. Acesse: **https://app.supabase.com**
2. Selecione seu projeto
3. **Settings** → **Database**
4. Role até **Connection string**
5. Selecione **URI** (⚠️ NÃO Transaction Pooler)
6. Copie a string completa

**Formato esperado:**
```
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require
```

### Passo 2: Adicionar no Vercel

1. Acesse: **https://vercel.com/dashboard**
2. Selecione o projeto (pode estar como "smc-platform" ou "SMC")
3. **Settings** → **Environment Variables**
4. Clique em **Add New**
5. Configure:
   - **Key:** `POSTGRES_URL_NON_POOLING` (exato, case-sensitive)
   - **Value:** Cole a connection string copiada
   - **Environment:** Marque todas:
     - ☑ Production
     - ☑ Preview
     - ☑ Development
6. Clique em **Save**

### Passo 3: Redeploy

1. Vá em **Deployments**
2. Clique nos **3 pontos** do último deploy
3. Selecione **Redeploy**
4. Aguarde o build completar

---

## Opção 3: Via Vercel CLI (Manual)

### 1. Instalar Vercel CLI (se não tiver)
```bash
npm install -g vercel
```

### 2. Fazer login
```bash
vercel login
```

### 3. Adicionar variável

**Para Production:**
```bash
echo "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require" | \
  vercel env add POSTGRES_URL_NON_POOLING production
```

**Para Preview:**
```bash
echo "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require" | \
  vercel env add POSTGRES_URL_NON_POOLING preview
```

**Para Development:**
```bash
echo "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require" | \
  vercel env add POSTGRES_URL_NON_POOLING development
```

**Substitua** `[PASSWORD]` e `[HOST]` pela sua connection string real do Supabase.

---

## Verificação

### Verificar variáveis configuradas:
```bash
vercel env ls
```

### Verificar no Dashboard:
1. Vercel Dashboard → Settings → Environment Variables
2. Procure por `POSTGRES_URL_NON_POOLING`
3. Deve aparecer para todos os ambientes

### Verificar nos logs do build:

Após o deploy, nos logs deve aparecer:
```
✅ Using POSTGRES_URL_NON_POOLING (recomendado para Supabase) for Prisma Client generation
✅ Prisma Client generated successfully
```

---

## Teste Final

1. Acesse: `https://counterx.io/auth/register`
2. Tente criar uma conta
3. Se funcionar → ✅ Configuração correta!

---

## Troubleshooting

### "Vercel CLI não encontrado"
```bash
npm install -g vercel
```

### "Não estou logado"
```bash
vercel login
```

### "Variável já existe"
- Isso é normal se você já configurou antes
- O script vai pular e continuar

### "Erro ao adicionar variável"
- Verifique se a connection string está correta
- Certifique-se de usar **URI** (não Transaction Pooler)
- Tente adicionar manualmente no Dashboard

---

## Próximos Passos

Após configurar:

1. ✅ Faça um Redeploy
2. ✅ Verifique os logs
3. ✅ Teste cadastro/login
4. ✅ Pronto! 🎉

