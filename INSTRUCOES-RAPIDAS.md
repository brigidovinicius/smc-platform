# 🚀 Instruções Rápidas - Configurar Supabase

## ✅ Status Atual

- ✅ NEXTAUTH_SECRET configurado
- ✅ NEXTAUTH_URL configurado  
- ⚠️ DATABASE_URL precisa ser configurada

---

## 📝 Passo a Passo Rápido

### 1. Encontrar a Senha do Banco

Acesse: https://supabase.com/dashboard/project/eqkgcpbhsxjlzqozienv/settings/database

Procure por **"Database password"** ou **"Reset database password"**

### 2. Executar o Script

```bash
./scripts/config-supabase-auto.sh
```

O script vai:
- Pedir apenas a senha
- Usar Connection Pooling automaticamente
- Usar região `us-east-1` como padrão
- Configurar para Production, Preview e Development

### 3. Verificar

```bash
vercel env ls
```

Você deve ver `DATABASE_URL` listada.

### 4. Deploy

```bash
vercel --prod
```

---

## 🔍 Se Não Souber a Região

Use `us-east-1` (é a região mais comum do Supabase). O script automático já usa essa como padrão.

---

## 📋 Formato da URL (para referência)

**Connection Pooling (usado pelo script automático):**
```
postgresql://postgres.eqkgcpbhsxjlzqozienv:[SENHA]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
```

---

**Última atualização:** 23/01/2025

