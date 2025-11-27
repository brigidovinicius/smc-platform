# 🔐 Verificação Rápida da Senha do Banco

## Passo 1: Verificar no Supabase

1. Acesse: https://supabase.com
2. Seu projeto → Settings → Database
3. Database password → Verifique/Reset se necessário

## Passo 2: Construir Connection String

```
postgresql://postgres:SUASENHA@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

## Passo 3: Atualizar no Vercel

1. Vercel Dashboard → smc-platform → Settings → Environment Variables
2. Editar POSTGRES_URL_NON_POOLING
3. Colar connection string completa
4. Salvar para Production, Preview e Development

## Passo 4: Redeploy

```bash
npx vercel --prod
```

## Passo 5: Testar

Acesse: https://counterx.io/auth/register
