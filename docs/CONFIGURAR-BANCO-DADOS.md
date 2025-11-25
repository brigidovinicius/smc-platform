# 🔧 Configuração do Banco de Dados

Este guia explica como configurar o banco de dados PostgreSQL para o projeto SMC Platform.

## 📋 Pré-requisitos

- Node.js instalado
- PostgreSQL instalado OU conta no Supabase (recomendado para desenvolvimento)

## 🚀 Opção 1: Supabase (Recomendado - Gratuito)

### Passo 1: Criar projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Aguarde a criação do banco (pode levar alguns minutos)

### Passo 2: Obter Connection String

1. No painel do Supabase, vá em **Settings** → **Database**
2. Role até a seção **Connection string**
3. Selecione **URI** e copie a string
4. A string terá o formato:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Passo 3: Configurar no projeto

1. Crie um arquivo `.env.local` na raiz do projeto (se não existir)
2. Adicione a variável `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
   ```
   **Importante:** Substitua `[YOUR-PASSWORD]` pela senha do seu projeto e `[PROJECT-REF]` pela referência do seu projeto.

### Passo 4: Executar migrations

```bash
npx prisma migrate dev
```

Ou se preferir usar o deploy:

```bash
npx prisma migrate deploy
```

## 🖥️ Opção 2: PostgreSQL Local

### Passo 1: Instalar PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
- Baixe o instalador em [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
- Siga o assistente de instalação

### Passo 2: Criar banco de dados

```bash
# Conectar ao PostgreSQL
psql postgres

# Criar banco de dados
CREATE DATABASE smc_platform;

# Criar usuário (opcional)
CREATE USER smc_user WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE smc_platform TO smc_user;

# Sair
\q
```

### Passo 3: Configurar no projeto

1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione a variável `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://smc_user:sua_senha_segura@localhost:5432/smc_platform"
   ```

### Passo 4: Executar migrations

```bash
npx prisma migrate dev
```

## 🐳 Opção 3: Docker (Rápido para desenvolvimento)

### Passo 1: Executar PostgreSQL no Docker

```bash
docker run --name smc-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=smc_platform \
  -p 5432:5432 \
  -d postgres:14
```

### Passo 2: Configurar no projeto

1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione a variável `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smc_platform"
   ```

### Passo 3: Executar migrations

```bash
npx prisma migrate dev
```

## ✅ Verificar Configuração

Após configurar, teste a conexão:

```bash
# Gerar Prisma Client
npx prisma generate

# Testar conexão
npx prisma db pull
```

Se tudo estiver correto, você verá as tabelas do schema.

## 🔍 Troubleshooting

### Erro: "can't reach database server at postgres 5432"

**Causas possíveis:**
1. PostgreSQL não está rodando
2. `DATABASE_URL` não está configurada
3. Credenciais incorretas
4. Firewall bloqueando porta 5432

**Soluções:**
- Verifique se o PostgreSQL está rodando: `psql -U postgres` ou `docker ps` (se usar Docker)
- Verifique se o arquivo `.env.local` existe e tem a variável `DATABASE_URL`
- Teste a conexão manualmente: `psql $DATABASE_URL`
- Verifique se a porta 5432 está acessível

### Erro: "P1001: Can't reach database server"

**Soluções:**
- Verifique se o servidor está acessível
- Para Supabase, verifique se o projeto está ativo
- Para local, verifique se o serviço está rodando: `brew services list` (macOS) ou `sudo systemctl status postgresql` (Linux)

### Erro: "P1000: Authentication failed"

**Soluções:**
- Verifique se as credenciais estão corretas
- Para Supabase, redefina a senha se necessário
- Para local, verifique o usuário e senha no `pg_hba.conf`

## 📝 Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` na raiz do projeto com:

```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="seu-client-id"
GOOGLE_CLIENT_SECRET="seu-client-secret"

# Email (opcional - para verificação de email)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="seu-email@gmail.com"
EMAIL_SERVER_PASSWORD="sua-senha-app"
EMAIL_FROM="SaaS Market Cap <no-reply@smc-platform.com>"
```

## 🎯 Próximos Passos

Após configurar o banco:

1. Execute as migrations: `npx prisma migrate dev`
2. Gere o Prisma Client: `npx prisma generate`
3. Inicie o servidor: `npm run dev`
4. Teste o cadastro e login

## 📚 Recursos Adicionais

- [Documentação do Prisma](https://www.prisma.io/docs)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do PostgreSQL](https://www.postgresql.org/docs/)



