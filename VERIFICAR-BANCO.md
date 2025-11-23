# 🔍 Como Verificar se o Banco de Dados Está Vinculado

## Status Atual

❌ **Não encontrei** nenhuma variável de banco de dados configurada via CLI:
- DATABASE_URL
- POSTGRES_URL  
- POSTGRES_URL_NON_POOLING

---

## 🔍 Verificar na Interface Web do Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto: **saas-market-cap**
3. Vá em: **Settings** → **Environment Variables**
4. Procure por:
   - `DATABASE_URL`
   - `POSTGRES_URL`
   - `POSTGRES_URL_NON_POOLING`

---

## 💡 Se Você Vinculou um Vercel Postgres

O Vercel Postgres cria automaticamente a variável `POSTGRES_URL`. Pode levar alguns minutos para aparecer.

**Verificar integrações:**
1. Vercel Dashboard → Projeto → **Storage**
2. Veja se há um banco PostgreSQL listado

---

## 📋 Se Não Encontrou, Configure Agora

### Opção 1: Script Interativo
```bash
./scripts/config-database-url.sh
```

### Opção 2: Manual
```bash
# Substitua pela sua URL real
echo "postgresql://usuario:senha@host:porta/database?sslmode=require" | vercel env add DATABASE_URL production
echo "postgresql://usuario:senha@host:porta/database?sslmode=require" | vercel env add DATABASE_URL preview
echo "postgresql://usuario:senha@host:porta/database?sslmode=require" | vercel env add DATABASE_URL development
```

---

## ✅ Verificar Após Configurar

```bash
vercel env ls
```

Você deve ver `DATABASE_URL` ou `POSTGRES_URL` listada.

---

## 🚀 Depois de Configurar

```bash
vercel --prod
```

---

**Nota:** Se você vinculou via interface web, pode ser que precise aguardar alguns minutos ou fazer um refresh. A CLI pode não mostrar imediatamente variáveis configuradas pela interface web.

