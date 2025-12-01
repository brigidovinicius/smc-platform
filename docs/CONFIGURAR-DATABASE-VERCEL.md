# 🔧 Como Configurar DATABASE_URL no Vercel

## ⚠️ Problema

A variável `DATABASE_URL` está vazia no Vercel. Isso é necessário para a aplicação se conectar ao banco de dados.

## 📋 Opções de Solução

### Opção 1: Você JÁ tem um Banco de Dados

Se você já tem um banco PostgreSQL configurado (Supabase, Railway, Neon, etc.):

#### 1.1. Obter a Connection String

**Supabase:**
1. Acesse: https://supabase.com
2. Vá em: Project Settings → Database
3. Procure por "Connection String" ou "Connection Pooling"
4. Copie a URI (formato: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`)

**Railway:**
1. Acesse: https://railway.app
2. Selecione seu projeto
3. Vá em: Variables
4. Procure por `DATABASE_URL` ou `POSTGRES_URL`
5. Copie o valor

**Neon:**
1. Acesse: https://neon.tech
2. Selecione seu projeto
3. Vá em: Connection Details
4. Copie a Connection String

#### 1.2. Adicionar no Vercel

1. No Vercel, na tela de Environment Variables:
   - Clique em "Add Another"
   - **Key:** `DATABASE_URL`
   - **Value:** Cole a URL que você copiou
   - **Environments:** Selecione Production, Preview e Development
   - Clique em "Save"

### Opção 2: Criar um Banco Gratuito (Recomendado)

#### 2.1. Supabase (Gratuito)

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub
4. Crie um novo projeto:
   - Escolha um nome
   - Escolha uma senha (ANOTE ESSA SENHA!)
   - Escolha uma região próxima
5. Aguarde o projeto ser criado (~2 minutos)
6. Vá em: Project Settings → Database
7. Copie a Connection String
8. Adicione no Vercel (veja Opção 1.2 acima)

#### 2.2. Railway (Gratuito com créditos)

1. Acesse: https://railway.app
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione "Provision PostgreSQL"
5. Aguarde o banco ser criado
6. Vá em: Variables → DATABASE_URL
7. Copie o valor
8. Adicione no Vercel

### Opção 3: Usar o Mesmo Banco Local (Para Testes)

⚠️ **AVISO:** Isso só funciona se seu banco local estiver acessível publicamente. **Não recomendado para produção!**

Se você está usando Docker localmente:

1. Obtenha seu IP público
2. Configure o PostgreSQL para aceitar conexões externas
3. Use: `postgresql://user:pass@seu-ip-publico:5432/banco`

**Não recomendado!** Melhor usar Supabase ou Railway.

## ✅ Após Configurar

Depois de adicionar a `DATABASE_URL` no Vercel:

1. **Aplicar Migrations:**
   ```bash
   DATABASE_URL="sua_url" npx prisma migrate deploy
   ```

2. **Criar Admin:**
   ```bash
   DATABASE_URL="sua_url" node scripts/create-admin-user.js \
     "Admin User" \
     "brigido254@gmail.com" \
     "admin123456"
   ```

3. **Verificar:**
   ```bash
   DATABASE_URL="sua_url" node scripts/check-users.js
   ```

4. **Testar Login:**
   - Acesse sua URL de produção
   - Email: `brigido254@gmail.com`
   - Senha: `admin123456`

## 🔒 Segurança

- ✅ NUNCA compartilhe a `DATABASE_URL` publicamente
- ✅ Use "Sensitive" no Vercel para ocultar o valor
- ✅ Mantenha as credenciais seguras
- ✅ Use senhas fortes para o banco

## 📝 Formato da DATABASE_URL

Geralmente tem este formato:

```
postgresql://[user]:[password]@[host]:[port]/[database]
```

Exemplo:
```
postgresql://postgres:minhasenha@db.xyz.supabase.co:5432/postgres
```

## 🆘 Precisa de Ajuda?

- **Supabase Docs:** https://supabase.com/docs/guides/database
- **Railway Docs:** https://docs.railway.app/databases/postgresql
- **Neon Docs:** https://neon.tech/docs



