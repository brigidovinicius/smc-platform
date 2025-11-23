# 🔄 Como Aplicar Migrations Manualmente

## ⚠️ Situação Atual

As migrations não podem ser aplicadas automaticamente durante o build do Vercel porque o `DATABASE_URL` não está disponível no ambiente de build.

---

## ✅ Solução: Aplicar Migrations Manualmente

### Opção 1: Via Supabase SQL Editor (Recomendado)

1. Acesse: https://supabase.com/dashboard/project/eqkgcpbhsxjlzqozienv
2. Vá em: **SQL Editor**
3. Execute as migrations manualmente copiando o conteúdo dos arquivos SQL

### Opção 2: Via Prisma CLI Localmente

```bash
# 1. Configurar DATABASE_URL localmente
export DATABASE_URL="postgresql://postgres:[SENHA]@db.eqkgcpbhsxjlzqozienv.supabase.co:5432/postgres?sslmode=require"

# 2. Aplicar migrations
npx prisma migrate deploy

# 3. Verificar
npx prisma studio
```

### Opção 3: Via Script Node.js

Crie um script que aplica as migrations:

```javascript
// scripts/apply-migrations.js
const { execSync } = require('child_process');

try {
  console.log('Aplicando migrations...');
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL || process.env.POSTGRES_URL
    }
  });
  console.log('✅ Migrations aplicadas com sucesso!');
} catch (error) {
  console.error('❌ Erro ao aplicar migrations:', error.message);
  process.exit(1);
}
```

Execute:
```bash
DATABASE_URL="sua-url" node scripts/apply-migrations.js
```

---

## 📋 Migrations que Precisam ser Aplicadas

1. **20251119234108_add_domain_models**
   - Cria todas as tabelas principais (User, Account, Session, Profile, etc.)

2. **20251121153222_fix_money_types**
   - Corrige tipos de dados monetários

---

## 🔍 Verificar se Migrations Foram Aplicadas

### No Supabase Dashboard

1. Acesse: https://supabase.com/dashboard/project/eqkgcpbhsxjlzqozienv
2. Vá em: **Database** → **Migrations**
3. Verifique se as migrations aparecem como aplicadas

### Via SQL

```sql
SELECT * FROM _prisma_migrations;
```

Você deve ver as migrations listadas.

---

## 💡 Recomendação

**Aplique as migrations manualmente uma vez** usando uma das opções acima. Depois disso, as migrations futuras podem ser aplicadas da mesma forma quando necessário.

---

**Última atualização:** 23/01/2025

