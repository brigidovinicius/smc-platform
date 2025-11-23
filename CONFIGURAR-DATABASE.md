# 🔧 Configurar DATABASE_URL no Vercel

## ✅ Variáveis já configuradas:

- ✅ **NEXTAUTH_SECRET** - Configurada automaticamente
- ✅ **NEXTAUTH_URL** - Configurada: `https://smc-platform.vercel.app`

## ⚠️ FALTA CONFIGURAR:

### DATABASE_URL

Você precisa configurar a URL do seu banco de dados PostgreSQL.

**Execute este comando (substitua pela sua URL real):**

```bash
echo 'postgresql://usuario:senha@host:porta/database?sslmode=require' | vercel env add DATABASE_URL production preview development
```

### Exemplo de URL PostgreSQL:

```
postgresql://postgres:senha123@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

ou

```
postgresql://usuario:senha@host.railway.app:5432/railway?sslmode=require
```

---

## 📋 Verificar após configurar:

```bash
vercel env ls
```

Você deve ver 3 variáveis:
- ✅ DATABASE_URL
- ✅ NEXTAUTH_SECRET  
- ✅ NEXTAUTH_URL

---

## 🚀 Depois de configurar tudo:

```bash
vercel --prod
```

---

**Nota:** Se você ainda não tem um banco PostgreSQL configurado, você pode:
1. Usar Vercel Postgres (integrado)
2. Usar Supabase (gratuito)
3. Usar Railway (gratuito)
4. Usar Neon (gratuito)

