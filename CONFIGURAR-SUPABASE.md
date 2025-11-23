# 🔗 Configurar Supabase no Vercel

## 📋 Informações do Projeto

- **Project Ref:** `eqkgcpbhsxjlzqozienv`
- **Dashboard:** https://supabase.com/dashboard/project/eqkgcpbhsxjlzqozienv

---

## 🔍 Passo 1: Encontrar a Senha do Banco

1. Acesse: https://supabase.com/dashboard/project/eqkgcpbhsxjlzqozienv/settings/database
2. Role até a seção **"Connection string"**
3. Procure por **"Database password"** ou **"Reset database password"**
4. Se não souber a senha, você pode resetá-la

---

## 🔍 Passo 2: Escolher Tipo de Conexão

### Opção 1: Direct Connection (Recomendado para desenvolvimento)
```
postgresql://postgres:[PASSWORD]@db.eqkgcpbhsxjlzqozienv.supabase.co:5432/postgres?sslmode=require
```

### Opção 2: Connection Pooling (Recomendado para produção)
```
postgresql://postgres.eqkgcpbhsxjlzqozienv:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

**Regiões comuns:**
- `us-east-1` (Estados Unidos - Leste)
- `us-west-1` (Estados Unidos - Oeste)
- `eu-west-1` (Europa - Oeste)
- `ap-southeast-1` (Ásia - Sudeste)

---

## 🚀 Passo 3: Configurar no Vercel

### Opção A: Script Automático (Recomendado)

```bash
./scripts/config-supabase.sh
```

O script vai:
- Pedir a senha do banco
- Perguntar qual tipo de conexão usar
- Configurar automaticamente para todos os ambientes

### Opção B: Manual

Substitua `[PASSWORD]` pela senha real e execute:

```bash
# Direct Connection
echo "postgresql://postgres:[PASSWORD]@db.eqkgcpbhsxjlzqozienv.supabase.co:5432/postgres?sslmode=require" | vercel env add DATABASE_URL production
echo "postgresql://postgres:[PASSWORD]@db.eqkgcpbhsxjlzqozienv.supabase.co:5432/postgres?sslmode=require" | vercel env add DATABASE_URL preview
echo "postgresql://postgres:[PASSWORD]@db.eqkgcpbhsxjlzqozienv.supabase.co:5432/postgres?sslmode=require" | vercel env add DATABASE_URL development
```

---

## ✅ Verificar

```bash
vercel env ls
```

Você deve ver `DATABASE_URL` listada para Production, Preview e Development.

---

## 🚀 Deploy

```bash
vercel --prod
```

---

## 📚 Links Úteis

- **Dashboard Supabase:** https://supabase.com/dashboard/project/eqkgcpbhsxjlzqozienv
- **Database Settings:** https://supabase.com/dashboard/project/eqkgcpbhsxjlzqozienv/settings/database
- **Connection Pooling:** https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler

---

**Nota:** A senha do banco é sensível. Nunca a compartilhe publicamente ou commite em repositórios.

