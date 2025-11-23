# 🔄 Configuração de Migrations do Prisma

## ✅ Configuração Automática

As migrations do Prisma agora serão aplicadas automaticamente em cada deploy no Vercel.

---

## 📋 O que foi configurado

### Script `vercel-build` adicionado ao `package.json`

```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

**O que este script faz:**
1. `prisma generate` - Gera o Prisma Client
2. `prisma migrate deploy` - Aplica migrations pendentes no banco
3. `next build` - Faz o build da aplicação

---

## 🚀 Como Funciona

Quando você fizer um deploy (`vercel --prod`), o Vercel vai:
1. Executar `npm install`
2. Executar `vercel-build` (que aplica migrations)
3. Deployar a aplicação

**As migrations serão aplicadas automaticamente!**

---

## 📋 Migrations Pendentes

Atualmente há 2 migrations que serão aplicadas no próximo deploy:

1. `20251119234108_add_domain_models`
   - Adiciona modelos de domínio (User, Account, Session, etc.)

2. `20251121153222_fix_money_types`
   - Corrige tipos de dados monetários

---

## 🔍 Verificar Status das Migrations

### No Supabase Dashboard

1. Acesse: https://supabase.com/dashboard/project/eqkgcpbhsxjlzqozienv
2. Vá em: **Database** → **Migrations**
3. Verifique se as migrations foram aplicadas

### Via Prisma Studio (local)

```bash
# Configurar DATABASE_URL localmente
export DATABASE_URL="sua-url-do-supabase"

# Abrir Prisma Studio
npx prisma studio
```

---

## ⚠️ Importante

- ✅ As migrations serão aplicadas automaticamente no próximo deploy
- ✅ Não é necessário fazer nada manualmente
- ✅ O banco de dados será atualizado automaticamente

---

## 🧪 Testar Localmente

Se quiser testar as migrations localmente antes do deploy:

```bash
# 1. Configurar DATABASE_URL
export DATABASE_URL="postgresql://postgres:[SENHA]@db.eqkgcpbhsxjlzqozienv.supabase.co:5432/postgres?sslmode=require"

# 2. Aplicar migrations
npx prisma migrate deploy

# 3. Verificar
npx prisma studio
```

---

## 📚 Referências

- [Prisma Migrate Deploy](https://www.prisma.io/docs/concepts/components/prisma-migrate/migrate-development-production#production-and-testing-environments)
- [Vercel Build Scripts](https://vercel.com/docs/concepts/build-step)

---

**Última atualização:** 23/01/2025

